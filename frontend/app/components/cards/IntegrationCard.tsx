import { Card, CardHeader, Divider, CardBody, CardFooter, Button, Tooltip, useDisclosure } from "@nextui-org/react";
import { useContext, useState, useEffect, useCallback, ReactElement } from "react";
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
import AuthModalContext from "~/contexts/AuthModalContext";

interface IntegrationCardProps {
    comingSoon?: boolean;
    resetHistory: () => void;
    signupBtn?: ReactElement;
    title: string;
    url: string;
    description: string;
    hasLoginFeature?: boolean;
    logo: ReactElement;
    isGuest: boolean;
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

    const { title, url, description, signupBtn, logo, resetHistory, isGuest } = props;

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
        setLoadingStates(prev => {
            const newState = { ...prev, [provider]: isLoading };
            return newState;
        });
    }, []);

    const importContacts = useCallback(async (provider: string, code?: string, codeVerifier?: string): Promise<boolean> => {
        try {
            setCurrentProvider(provider);
            const providerType = getProviderType(provider);
            const res = await getProviderContacts(providerType, code, codeVerifier);


            if (res?.length) {
                setContacts(res);
                selectContactsModal.onOpen();
                return true;
            } else {
                noContactsModal.onOpen();
                return false;
            }
        } catch (err) {
            console.error(`Error importing contacts for ${provider}:`, err);
            // Handle the error (e.g., show an error message to the user)
            return false;
        } finally {
            setLoading(provider, false);
        }
    }, [selectContactsModal, noContactsModal, setLoading]);

    useEffect(() => {
        const handle = (event: MessageEvent<AuthCodeEvent>) => {
            if (event.origin !== window.location.origin) {
                return;
            }


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
        if (shouldConnectApiKey) {
            navigateToUrl('/settings?tab=integrations');
            return;
        }

        setLoading(title, true);

        try {
            let result;
            switch (title) {
                case 'Brevo':
                case 'SendGrid':
                    await importContacts(title);
                    break;
                case 'HubSpot':
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
                        setLoading('HubSpot', true); // Ensure loading is set before importing
                        await importContacts('HubSpot', result.code);
                    } else {
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
                        await importContacts('Mailchimp', result.code);
                    } else {
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
                        await importContacts('Zoho', result.code);
                    } else {
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
                        await importContacts('Salesforce', result.code);
                    } else {
                    }
                    break;
            }
        } catch (error) {
            console.error("Error during import:", error);
            setLoading(title, false);
        } finally {
            stopLoading();
        }
    }, [title, shouldConnectApiKey, importContacts, setLoading, startLoading, stopLoading, salesforcePKCE]);

    const setSelectedContactsMemo = useCallback((contacts: string[] | ((prevContacts: string[]) => string[])) => {
        setSelectedContacts(contacts);
    }, []);

    const showSignupButton = isGuest && title !== 'SendGrid' && title !== 'Brevo';

    const { authModal } = useContext(AuthModalContext);

    return (
        <>
            <Card style={{ opacity: props.comingSoon ? 0.5 : 1, pointerEvents: props.comingSoon ? "none" : undefined }} className="w-[400px] mb-12">
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
                <CardFooter className="justify-end gap-2">
                    {showSignupButton && signupBtn}
                    {title === 'Salesforce' ?
                        <Tooltip showArrow={true} content="Salesforce SSO is temporarily disabled.">
                            <div>
                                <Button isDisabled color="primary" variant="shadow">
                                    Import contacts
                                </Button>
                            </div>
                        </Tooltip>
                        : isGuest ? (
                            <Tooltip showArrow={true} content="You must be logged in to import contacts">
                                <Button
                                    // style={{ cursor: 'not-allowed' }}
                                    onClick={() => {
                                        // open auth modal
                                        authModal.onOpen();
                                    }}
                                    className="notAllowed"
                                    color="primary"
                                    variant="shadow"
                                >
                                    Import contacts
                                </Button>
                            </Tooltip>
                        ) : (
                            <Button
                                isLoading={loadingStates[title]}
                                onClick={handleImportClick}
                                color="primary"
                                variant="shadow"
                            >
                                {shouldConnectApiKey ? 'Add API key' : loadingStates[title] ? 'Importing...' : 'Import contacts'}
                            </Button>
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
