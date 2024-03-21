import { useEffect, useState } from "react";
import { hubspotOauthClientId, hubspotOauthRedirectUri } from "~/constants/oauth"
import hubspotAuth from "~/services/api/auth/hubspot";

export default function HubspotAuthButton() {
    const [isAuthed, setAuthed] = useState(false)

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const codeFromUrl = queryParams.get('code');

        const auth = async () => {
            try {
                await hubspotAuth({ code: codeFromUrl })
                setAuthed(true)
            } catch { }
        }

        // if (codeFromUrl && !code) setCode(codeFromUrl) 
        if (codeFromUrl && !isAuthed) auth()
    }, [])

    const hubspotLogin = () => {
        const scope = "crm.objects.contacts.read"

        window.location.href = `https://app-eu1.hubspot.com/oauth/authorize?client_id=${hubspotOauthClientId}&scope=${scope}&redirect_uri=${encodeURIComponent(hubspotOauthRedirectUri)}`
    }
    return (
        <>
            <button onClick={hubspotLogin}>Log in with Hubspot</button>
        </>
    )
}