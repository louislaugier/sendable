import FacebookAuthButton from "./Facebook";
import GoogleAuthButton from "./Google";

export default function Auth() {
    return (
        <>
            <GoogleAuthButton />
            <FacebookAuthButton />
        </>
    );
}
