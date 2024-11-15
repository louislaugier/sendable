import type { MetaFunction } from "@remix-run/node";
import { siteName } from "~/constants/app";
import IntegrationCardsGrid from "~/components/grids/IntegrationCardsGrid";

export const meta: MetaFunction = () => {
  return [
    { title: `${siteName} - Integrations` },
    { name: "description", content: "Welcome to Remix! - Integrations" },
  ];
};

export default function Integrations() {
  return (
    <div className="py-8 px-6">

      <div className="flex flex-col items-center mb-16">
        <h1 className="text-2xl">Integrations</h1>
      </div>

      <IntegrationCardsGrid resetHistory={() => { }} />
    </div>
  );
}
