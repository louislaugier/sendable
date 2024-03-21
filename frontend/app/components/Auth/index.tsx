import EmailAuthButton from "./Email";
import FacebookAuthButton from "./Facebook";
import GoogleAuthButton from "./Google";
import SalesforceAuthButton from "./Salesforce";

export default function Auth() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
            <SalesforceAuthButton />
            <GoogleAuthButton />
            <EmailAuthButton />
            {/* <FacebookAuthButton /> */}
            {/* <AppleAuthButton /> */}
        </div>
    );
}
