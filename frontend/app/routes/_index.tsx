import type { MetaFunction } from "@remix-run/node";
import { GoogleOAuthProvider, useGoogleLogin, GoogleLogin, useGoogleOneTapLogin } from '@react-oauth/google';
import { googleClientId } from "~/constants";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  useGoogleOneTapLogin({
    onSuccess: credentialResponse => {
      console.log(credentialResponse);
    },
    onError: () => {
      console.log('Login Failed');
    },
  });

  const login = useGoogleLogin({
    onSuccess: tokenResponse => console.log(tokenResponse),
    onError: (e) => {
      console.log('Login Failed', e);
    },
  });

  return (
    <>
      <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
        <h1>Welcome to Remix</h1>
        <ul>
          <li>
            <a
              target="_blank"
              href="https://remix.run/tutorials/blog"
              rel="noreferrer"
            >
              15m Quickstart Blog Tutorial
            </a>
          </li>
          <li>
            <a
              target="_blank"
              href="https://remix.run/tutorials/jokes"
              rel="noreferrer"
            >
              Deep Dive Jokes App Tutorial
            </a>
          </li>
          <li>
            <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
              Remix Docs
            </a>
          </li>
        </ul>
      </div>
      <button onClick={() => login()}>Sign in with Google 🚀</button>
    </>
  );
}