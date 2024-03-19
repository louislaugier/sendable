import type { MetaFunction } from "@remix-run/node";
import { useGoogleLogin, useGoogleOneTapLogin } from '@react-oauth/google';
import googleAuth from "~/services/api/auth/google";
import Auth from "~/components/Auth";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {

  return (
    <>
      <Auth />
    </>
  );
}