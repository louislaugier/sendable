import { Button, Link, Tab, Tabs } from "@nextui-org/react";
import type { MetaFunction } from "@remix-run/node";
import { useSearchParams } from "@remix-run/react";
import { useCallback, useContext, useEffect, useState } from "react";
import EmailValidatorTab from "~/components/single_components/EmailValidatorTab";
import ValidationHistoryTable from "~/components/tables/ValidationHistoryTable";
import { siteName } from "~/constants/app";
import UserContext from "~/contexts/UserContext";
import getValidationHistory from "~/services/api/validation_history";
import { SubscriptionType } from "~/types/subscription";
import { Validation } from "~/types/validation";
import { getApiValidationLimit, getAppValidationLimit, getRemainingApiValidations, getRemainingAppValidations } from "~/utils/limit";
import { navigateToUrl } from "~/utils/url";

export const meta: MetaFunction = () => {
  return [
    { title: `${siteName} - Dashboard` },
    { name: "description", content: "Welcome to Remix! - Dashboard" },
  ];
};

export default function Dashboard() {
  const { user } = useContext(UserContext);
  if (!user) navigateToUrl('/')

  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedTab, setSelectedTab] = useState<any>(searchParams.get("tab") ?? "validation");

  useEffect(() => {
    if (selectedTab) {
      setSearchParams({ tab: selectedTab });
      // if (selectedTab === "history") resetHistory()
    }
  }, [selectedTab, setSearchParams]);

  const [validations, setValidations] = useState<Array<Validation | null>>([]);
  const [validationsCount, setValidationsCount] = useState<number>(0);

  const [isHistoryFetched, setHistoryFetched] = useState(false);
  const loadHistory = useCallback(async (limit: number | undefined = undefined, offset: number | undefined = undefined) => {
    try {
      const res = await getValidationHistory(limit, offset)
      if (res) {
        setValidations(prevValidations => [...prevValidations, ...res.validations])
        setValidationsCount(res.count)
      }
    } catch (err) {
      console.error(err)
    }
  }, [validationsCount, validations]);

  const resetHistory = useCallback(async () => {
    setValidations([])
    setValidationsCount(0)

    await loadHistory()
  }, [validations, validationsCount])

  useEffect(() => {
    if (user && !isHistoryFetched) {
      loadHistory()
      setHistoryFetched(true)
    }
  }, [validations, user, isHistoryFetched]);

  const goToPricing = async (e: any) => {
    e.preventDefault()
    navigateToUrl(`/pricing`)
  }

  const planType = user?.currentPlan.type.charAt(0).toUpperCase()! + user?.currentPlan.type.slice(1)!

  const appValidationLimit = getAppValidationLimit(user!)
  const apiValidationLimit = getApiValidationLimit(user!)
  const remainingAppValidations = getRemainingAppValidations(user!)
  const remainingApiValidations = getRemainingApiValidations(user!)

  const isPremiumOrEnterprise = user?.currentPlan.type === SubscriptionType.Premium || user?.currentPlan.type === SubscriptionType.Enterprise

  return (
    <div className="py-8 px-6">
      <div className="flex flex-col items-center mb-4">
        <h2 className="text-2xl">Dashboard</h2>
        {user && <>
          <h3 className="text-lg mt-4 mb-2">Current plan: <b>{planType}{isPremiumOrEnterprise && ` (billed ${user?.currentPlan?.billingFrequency})`}</b></h3>
          {user.currentPlan.type !== SubscriptionType.Enterprise && <>
            <p>Remaining validations (this month): <b>{remainingAppValidations.toLocaleString()} / {appValidationLimit.toLocaleString()}</b> email addresses</p>
            <p>Remaining API validations (this month): <b>{remainingApiValidations.toLocaleString()} / {apiValidationLimit.toLocaleString()}</b> email addresses</p>
            <Button className="mt-4" as={Link} href={`/pricing`} onClick={goToPricing} color='primary' variant="shadow">
              Upgrade
            </Button>
          </>}
        </>}
      </div>
      <div className="flex w-full flex-col">
        <Tabs
          aria-label="Options"
          color="primary"
          variant="bordered"
          selectedKey={selectedTab}
          onSelectionChange={setSelectedTab}
        >
          <Tab
            key="validation"
            title={
              <div className="flex items-center space-x-2">
                <span>Validate new</span>
              </div>
            }
          >
            <EmailValidatorTab remainingAppValidations={remainingAppValidations} resetHistory={resetHistory} />
          </Tab>
          <Tab
            key="history"
            title={
              <div className="flex items-center space-x-2">
                <span>History</span>
              </div>
            }
          >
            <h2 className="text-xl mt-8">Email validation history</h2>
            <div className="py-8">
              <ValidationHistoryTable validations={validations} totalCount={validationsCount} loadHistory={loadHistory} />
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>

  );
}