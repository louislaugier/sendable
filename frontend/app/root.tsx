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

        <noscript>
          <style>
            {`.no-js { display: block; } .js { display: none; }`}
          </style>
          <div className="no-js">
            <p>JavaScript is required to use this application. Please enable JavaScript in your browser settings.</p>
          </div>
        </noscript>
        <script dangerouslySetInnerHTML={{
          __html: `
          (function() {
            try {
              localStorage.setItem('test', 'test');
              localStorage.removeItem('test');
            } catch (e) {
              document.body.innerHTML = '<p>"localStorage" is required to use this application. Please enable it in your browser settings.</p>';
            }
          })();
        `}} />

        {/* Brevo Conversations {literal} */}
        <script dangerouslySetInnerHTML={{
          __html: `(function(d, w, c) {
            w.BrevoConversationsID = '67475253fa2d4fbaf909695f';
            w[c] = w[c] || function() {
                (w[c].q = w[c].q || []).push(arguments);
            };
            var s = d.createElement('script');
            s.async = true;
            s.src = 'https://conversations-widget.brevo.com/brevo-conversations.js';
            if (d.head) d.head.appendChild(s);
          })(document, window, 'BrevoConversations');`
        }} />

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
