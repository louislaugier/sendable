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
import { hubspotAuthCodeKey, hubspotStateKey, hubspotUniqueStateValue, mailchimpAuthCodeKey, mailchimpStateKey, mailchimpUniqueStateValue, zohoAuthCodeKey, zohoStateKey, zohoUniqueStateValue, salesforceAuthCodeKey, salesforceStateKey, salesforceUniqueStateValue } from "~/constants/oauth/stateKeys";
import { AuthCodeEvent } from "~/types/oauth";
import { fetchSalesforcePKCE } from "~/services/utils/salesforce/pkce";
import NoContactsModal from "../modals/NoContactsModal";

export default function IntegrationCard(props: any) {
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
        setLoadingStates(prev => ({ ...prev, [provider]: isLoading }));
    }, []);

    const [isLoading, setIsLoading] = useState(false);

    const importContacts = useCallback(async (provider: string, code?: string, codeVerifier?: string) => {
        try {
            const providerType = getProviderType(provider);
            const res = await getProviderContacts(providerType, code, codeVerifier);
            
            if (res?.length) {
                setContacts(res);
                selectContactsModal.onOpen();
            } else {
                noContactsModal.onOpen();
            }
        } catch (err) {
            console.error(err);
            setIsLoading(false); // Reset loading state on error
        }
    }, [selectContactsModal, noContactsModal, setIsLoading]);

    useEffect(() => {
        const handle = (event: MessageEvent<AuthCodeEvent>) => {
            if (event.origin !== window.location.origin) {
                return;
            }

            if (event.data.type === hubspotAuthCodeKey || event.data.type === mailchimpAuthCodeKey || event.data.type === zohoAuthCodeKey || event.data.type === salesforceAuthCodeKey) {
                const { code, state } = event.data;
                const stateKey = event.data.type === hubspotAuthCodeKey ? hubspotStateKey :
                    event.data.type === mailchimpAuthCodeKey ? mailchimpStateKey :
                        event.data.type === zohoAuthCodeKey ? zohoStateKey :
                            salesforceStateKey;
                const storedState = sessionStorage.getItem(stateKey);

                if (code && state && storedState === state) {
                    sessionStorage.removeItem(stateKey);
                    const provider = event.data.type === hubspotAuthCodeKey ? 'HubSpot' :
                        event.data.type === mailchimpAuthCodeKey ? 'Mailchimp' :
                            event.data.type === zohoAuthCodeKey ? 'Zoho' :
                                'Salesforce';
                    importContacts(provider, code, event.data.type === salesforceAuthCodeKey ? salesforcePKCE?.codeVerifier : undefined);
                }
            }
        };

        window.addEventListener('message', handle);
        return () => window.removeEventListener('message', handle);
    }, [importContacts, salesforcePKCE]);

    useEffect(() => {
        // Reset loading state when component unmounts or tab changes
        return () => {
            Object.keys(loadingStates).forEach(provider => {
                setLoading(provider, false);
            });
        };
    }, []);

    const handleImportClick = async () => {
        if (shouldConnectApiKey) {
            navigateToUrl('/settings?tab=integrations');
            return;
        }

        setIsLoading(true);

        switch (title) {
            case 'Brevo':
            case 'SendGrid':
                await importContacts(title);
                break;
            case 'HubSpot':
                await login(setIsLoading, hubspotUniqueStateValue, hubspotStateKey, hubspotAuthCodeKey, hubspotOauthClientId, hubspotOauthRedirectUri, 'https://app-eu1.hubspot.com/oauth/authorize', undefined, 'crm.objects.contacts.read');
                break;
            case 'Mailchimp':
                await login(setIsLoading, mailchimpUniqueStateValue, mailchimpStateKey, mailchimpAuthCodeKey, mailchimpOauthClientId, mailchimpOauthRedirectUri, 'https://login.mailchimp.com/oauth2/authorize');
                break;
            case 'Zoho':
                await login(setIsLoading, zohoUniqueStateValue, zohoStateKey, zohoAuthCodeKey, zohoOauthClientId, zohoOauthRedirectUri, 'https://accounts.zoho.com/oauth/v2/auth', undefined, 'ZohoCRM.modules.contacts.READ,ZohoCRM.modules.leads.READ,ZohoCRM.modules.vendors.READ');
                break;
            case 'Salesforce':
                const pkce = await fetchSalesforcePKCE();
                setSalesforcePKCE(pkce);
                await login(setIsLoading, salesforceUniqueStateValue, salesforceStateKey, salesforceAuthCodeKey, salesforceOauthClientId, salesforceOauthRedirectUri, 'https://login.salesforce.com/services/oauth2/authorize', pkce.codeChallenge);
                break;
        }
    };

    const handleTryAgain = () => {
        handleImportClick();
    };

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
                            isLoading={isLoading}
                            onClick={handleImportClick}
                            color="primary"
                            variant="shadow"
                            className="ml-2"
                        >
                            {shouldConnectApiKey ? 'Add API key' : isLoading ? 'Importing...' : 'Import contacts'}
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

            {!!contacts.length && (
                <SelectContactsModal
                    resetHistory={resetHistory}
                    contacts={contacts}
                    isOpen={selectContactsModal.isOpen}
                    onOpen={selectContactsModal.onOpen}
                    onClose={() => {
                        selectContactsModal.onClose();
                        setContacts([]);
                        setIsLoading(false); // Reset loading state when modal is closed
                    }}
                    onOpenChange={() => {
                        selectContactsModal.onOpenChange();
                        setContacts([]);
                        setIsLoading(false); // Reset loading state when modal is closed
                    }}
                    setLoading={setIsLoading}
                    providerTitle={title}
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
