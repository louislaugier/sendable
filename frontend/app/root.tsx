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
import Nav from "./components/Nav";
import Breadcrumb from "./components/Breadcrumb";

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
        <UserProvider>
          <NextUIProvider>
            {/* <main style={{ minHeight: '100vh' }} className="dark text-foreground bg-background"> */}
            <main style={{ minHeight: '100vh' }} className="text-foreground bg-background">
              <Nav />

              <div style={{ maxWidth: 1024, margin: 'auto' }}>
                <Breadcrumb />
                {children}
              </div>

            </main>
          </NextUIProvider>
        </UserProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
