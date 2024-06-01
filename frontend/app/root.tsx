import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import stylesheet from "~/tailwind.css?url";
import { NextUIProvider } from "@nextui-org/react";
import { UserProvider } from "./contexts/UserContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { googleOauthClientId } from "./constants/oauth/clientIds";
import { AuthModalProvider } from "./contexts/AuthModalContext";
import { ErrorOccurredModalProvider } from "./contexts/ErrorOccurredModalContext";
import "swagger-ui-react/swagger-ui.css"
import Breadcrumb from "./components/Breadcrumb";
import Footer from "./components/Footer";
import Nav from "./components/Nav";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <ErrorOccurredModalProvider>
          <UserProvider>
            <AuthModalProvider>

              <NextUIProvider>
                <main className="text-foreground bg-background">

                  <GoogleOAuthProvider clientId={googleOauthClientId}>

                    <Nav />

                    <div style={{ maxWidth: 1024, margin: 'auto', minHeight: 'calc(100vh - 177px)' }}>
                      <Breadcrumb />
                      {children}
                    </div>

                    <Footer />

                  </GoogleOAuthProvider>
                </main>
              </NextUIProvider>
            </AuthModalProvider>
          </UserProvider>
        </ErrorOccurredModalProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
