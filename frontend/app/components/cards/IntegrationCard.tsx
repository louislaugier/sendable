import { Card, CardHeader, Divider, CardBody, CardFooter, Button, Tooltip, useDisclosure } from "@nextui-org/react";
import { useContext, useState, useEffect, useCallback } from "react";
import UserContext from "~/contexts/UserContext";
import getProviderContacts from "~/services/api/provider_contacts";
import { ContactProviderType } from "~/types/contactProvider";
import { navigateToUrl } from "~/utils/url";
import SelectContactsModal from "../modals/SelectContactsModal";
import { login } from "~/services/oauth";
import { hubspotOauthClientId, mailchimpOauthClientId, zohoOauthClientId, salesforceOauthClientId } from "~/constants/oauth/clientIds";
import { hubspotOauthRedirectUri, mailchimpOauthRedirectUri, zohoOauthRedirectUri, salesforceOauthRedirectUri } from "~/constants/oauth/urls";
import { hubspotStateKey, mailchimpStateKey, zohoStateKey, salesforceStateKey, hubspotUniqueStateValue, mailchimpUniqueStateValue, salesforceUniqueStateValue, zohoUniqueStateValue, hubspotAuthCodeKey } from "~/constants/oauth/stateKeys";
import { AuthCodeEvent } from "~/types/oauth";
import { fetchSalesforcePKCE } from "~/services/utils/salesforce/pkce";
import NoContactsModal from "../modals/NoContactsModal";

interface IntegrationCardProps {
  title: string;
  url: string;
  description: string;
  signupBtn?: boolean;
  logo: React.ReactNode;
  resetHistory: () => void;
}

export default function IntegrationCard(props: IntegrationCardProps) {
    const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({
        Brevo: false,
        SendGrid: false,
        HubSpot: false,
        Mailchimp: false,
        Zoho: false,
        Salesforce: false,
    });

    const { title, url, description, signupBtn, logo, resetHistory } = props;

    const { user } = useContext(UserContext);

    let hasBrevoProvider = false;
    let hasSendgridProvider = false;
    if (user?.contactProviders) for (const provider of user?.contactProviders) {
        if (provider.type === ContactProviderType.Sendgrid) hasSendgridProvider = true;
        else if (provider.type === ContactProviderType.Brevo) hasBrevoProvider = true;
    }
    const shouldConnectApiKey = (title === 'Brevo' && !hasBrevoProvider) || (title === 'SendGrid' && !hasSendgridProvider);

    const [contacts, setContacts] = useState<Array<string | null>>([]);

    const selectContactsModal = useDisclosure();
    const noContactsModal = useDisclosure();

    const [salesforcePKCE, setSalesforcePKCE] = useState<{ codeVerifier: string, codeChallenge: string } | null>(null);

    const [currentProvider, setCurrentProvider] = useState<string | null>(null);

    const [selectedContacts, setSelectedContacts] = useState<string[]>([]);

    const getProviderType = (title: string): ContactProviderType => {
        switch (title) {
            case 'HubSpot':
                return ContactProviderType.Hubspot;
            case 'Mailchimp':
                return ContactProviderType.Mailchimp;
            case 'Zoho':
                return ContactProviderType.Zoho;
            case 'Salesforce':
                return ContactProviderType.Salesforce;
            case 'Brevo':
                return ContactProviderType.Brevo;
            case 'SendGrid':
                return ContactProviderType.Sendgrid;
            default:
                throw new Error(`Unknown provider: ${title}`);
        }
    };

    const setLoading = useCallback((provider: string, isLoading: boolean) => {
        console.log(`Setting loading state for ${provider} to ${isLoading}`);
        setLoadingStates(prev => {
            const newState = { ...prev, [provider]: isLoading };
            console.log("New loading states:", newState);
            return newState;
        });
    }, []);

    const importContacts = useCallback(async (provider: string, code?: string, codeVerifier?: string): Promise<boolean> => {
        console.log(`Importing contacts for ${provider}`);
        try {
            setCurrentProvider(provider);
            const providerType = getProviderType(provider);
            const res = await getProviderContacts(providerType, code, codeVerifier);
            
            console.log(`Received response for ${provider}:`, res);

            if (res?.length) {
                setContacts(res);
                console.log(`Opening select contacts modal for ${provider}`);
                selectContactsModal.onOpen();
                return true;
            } else {
                console.log(`No contacts found for ${provider}, opening no contacts modal`);
                noContactsModal.onOpen();
                return false;
            }
        } catch (err) {
            console.error(`Error importing contacts for ${provider}:`, err);
            // Handle the error (e.g., show an error message to the user)
            return false;
        } finally {
            console.log(`Setting loading state to false for ${provider}`);
            setLoading(provider, false);
        }
    }, [selectContactsModal, noContactsModal, setLoading]);

    useEffect(() => {
        const handle = (event: MessageEvent<AuthCodeEvent>) => {
            if (event.origin !== window.location.origin) {
                return;
            }

            console.log("Received message event:", event.data);

            if (event.data.type === hubspotStateKey || event.data.type === mailchimpStateKey || event.data.type === zohoStateKey || event.data.type === salesforceStateKey) {
                const { code, state } = event.data;
                const stateKey = event.data.type;
                const storedState = sessionStorage.getItem(stateKey);

                if (code && state && storedState === state) {
                    sessionStorage.removeItem(stateKey);
                    const provider = event.data.type === hubspotStateKey ? 'HubSpot' :
                        event.data.type === mailchimpStateKey ? 'Mailchimp' :
                            event.data.type === zohoStateKey ? 'Zoho' :
                                'Salesforce';
                    console.log(`Received OAuth callback for ${provider}. Importing contacts...`);
                    importContacts(provider, code, event.data.type === salesforceStateKey ? salesforcePKCE?.codeVerifier : undefined);
                } else {
                    console.error('OAuth state mismatch or missing code');
                    setLoading(title, false);
                }
            }
        };

        return () => window.removeEventListener('message', handle);
    }, [importContacts, salesforcePKCE, setLoading, title]);

    const { isOpen: isLoading, onOpen: startLoading, onClose: stopLoading } = useDisclosure();

    const handleImportClick = useCallback(async () => {
        console.log("handleImportClick called");
        if (shouldConnectApiKey) {
            navigateToUrl('/settings?tab=integrations');
            return;
        }

        setLoading(title, true);
        console.log(`Starting import for ${title}`);

        try {
            let result;
            switch (title) {
                case 'Brevo':
                case 'SendGrid':
                    await importContacts(title);
                    break;
                case 'HubSpot':
                    console.log("Initiating HubSpot OAuth flow");
                    result = await login(
                        (isLoading: boolean) => setLoading('HubSpot', isLoading),
                        hubspotUniqueStateValue,
                        hubspotStateKey,
                        hubspotAuthCodeKey,
                        hubspotOauthClientId,
                        hubspotOauthRedirectUri,
                        'https://app-eu1.hubspot.com/oauth/authorize',
                        undefined,
                        'crm.objects.contacts.read'
                    );
                    if (result && result.code) {
                        console.log("Received HubSpot OAuth code. Importing contacts...");
                        setLoading('HubSpot', true); // Ensure loading is set before importing
                        await importContacts('HubSpot', result.code);
                    } else {
                        console.log("HubSpot OAuth flow was cancelled or failed.");
                        setLoading('HubSpot', false);
                    }
                    break;
                case 'Mailchimp':
                    result = await login(
                        (isLoading: boolean) => setLoading('Mailchimp', isLoading),
                        mailchimpUniqueStateValue,
                        mailchimpStateKey,
                        mailchimpStateKey,
                        mailchimpOauthClientId,
                        mailchimpOauthRedirectUri,
                        'https://login.mailchimp.com/oauth2/authorize'
                    );
                    if (result && result.code) {
                        console.log("Received Mailchimp OAuth code. Importing contacts...");
                        await importContacts('Mailchimp', result.code);
                    } else {
                        console.log("Mailchimp OAuth flow was cancelled or failed.");
                    }
                    break;
                case 'Zoho':
                    result = await login(
                        (isLoading: boolean) => setLoading('Zoho', isLoading),
                        zohoUniqueStateValue,
                        zohoStateKey,
                        zohoStateKey,
                        zohoOauthClientId,
                        zohoOauthRedirectUri,
                        'https://accounts.zoho.com/oauth/v2/auth',
                        undefined,
                        'ZohoCRM.modules.contacts.READ,ZohoCRM.modules.leads.READ,ZohoCRM.modules.vendors.READ'
                    );
                    if (result && result.code) {
                        console.log("Received Zoho OAuth code. Importing contacts...");
                        await importContacts('Zoho', result.code);
                    } else {
                        console.log("Zoho OAuth flow was cancelled or failed.");
                    }
                    break;
                case 'Salesforce':
                    const pkce = await fetchSalesforcePKCE();
                    setSalesforcePKCE(pkce);
                    result = await login(
                        (isLoading: boolean) => setLoading('Salesforce', isLoading),
                        salesforceUniqueStateValue,
                        salesforceStateKey,
                        salesforceStateKey,
                        salesforceOauthClientId,
                        salesforceOauthRedirectUri,
                        'https://login.salesforce.com/services/oauth2/authorize',
                        pkce.codeChallenge
                    );
                    if (result && result.code) {
                        console.log("Received Salesforce OAuth code. Importing contacts...");
                        await importContacts('Salesforce', result.code);
                    } else {
                        console.log("Salesforce OAuth flow was cancelled or failed.");
                    }
                    break;
            }
        } catch (error) {
            console.error("Error during import:", error);
            setLoading(title, false);
        } finally {
            console.log(`Import process completed for ${title}`);
            stopLoading();
        }
    }, [title, shouldConnectApiKey, importContacts, setLoading, startLoading, stopLoading, salesforcePKCE]);

    const setSelectedContactsMemo = useCallback((contacts: string[] | ((prevContacts: string[]) => string[])) => {
        setSelectedContacts(contacts);
    }, []);

    return (
        <>
            <Card className="w-[400px] mb-12">
                <CardHeader className="flex gap-3">
                    {logo}
                    <div className="flex flex-col">
                        <p className="text-md">{title}</p>
                        <p className="text-small text-default-500">{url}</p>
                    </div>
                </CardHeader>
                <Divider />
                <CardBody>
                    <p>{description}</p>
                </CardBody>
                <Divider />
                <CardFooter className="justify-end">
                    <style>
                        {
                            `
                            .notAllowed {
                                cursor: not-allowed !important;
                            }
                        `
                        }
                    </style>
                    {user ? (
                        <Button
                            isLoading={loadingStates[title]}
                            onClick={() => {
                                console.log("Button clicked");
                                console.log("Current loading state:", loadingStates[title]);
                                handleImportClick();
                            }}
                            color="primary"
                            variant="shadow"
                            className="ml-2"
                        >
                            {shouldConnectApiKey ? 'Add API key' : loadingStates[title] ? 'Importing...' : 'Import contacts'}
                        </Button>
                    ) : (
                        <Tooltip showArrow={true} content={"You must be logged in to import contacts"}>
                            <Button onClick={() => { }} className={`notAllowed${signupBtn ? ' ml-2' : ''}`} color="primary" variant="shadow">
                                Import contacts
                            </Button>
                        </Tooltip>
                    )}
                </CardFooter>
            </Card>

            {contacts.length > 0 && (
                <SelectContactsModal
                    isOpen={selectContactsModal.isOpen}
                    onClose={() => {
                        selectContactsModal.onClose();
                        setCurrentProvider(null);
                        setSelectedContactsMemo([]);
                    }}
                    onOpenChange={selectContactsModal.onOpenChange}
                    contacts={contacts.filter((contact): contact is string => contact !== null)}
                    resetHistory={resetHistory}
                    providerTitle={currentProvider || title}
                    selectedContacts={selectedContacts}
                    setSelectedContacts={setSelectedContactsMemo}
                />
            )}

            <NoContactsModal
                isOpen={noContactsModal.isOpen}
                onOpenChange={noContactsModal.onOpenChange}
                onTryAgain={handleImportClick}
            />
        </>
    );
}
