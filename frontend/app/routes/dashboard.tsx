import { Button, Link, Tab, Tabs, useDisclosure } from "@nextui-org/react";
import type { MetaFunction } from "@remix-run/node";
import { useSearchParams } from "@remix-run/react";
import { useCallback, useContext, useEffect, useState } from "react";
import EmailAddressConfirmedModal from "~/components/modals/EmailAddressConfirmedModal";
import EmailValidatorTab from "~/components/page_sections/dashboard/EmailValidatorTab";
import ValidationHistoryTable from "~/components/tables/ValidationHistoryTable";
import { siteName } from "~/constants/app";
import UserContext from "~/contexts/UserContext";
import getValidationHistory from "~/services/api/validation_history";
import { SubscriptionType } from "~/types/subscription";
import { Validation } from "~/types/validation";
import { getApiValidationLimit, getAppValidationLimit, getRemainingApiValidations, getRemainingAppValidations } from "~/utils/limit";
import { capitalize } from "~/utils/string";
import { navigateToUrl } from "~/utils/url";

export const meta: MetaFunction = () => {
  return [
    { title: `${siteName} - Dashboard` },
    { name: "description", content: "Welcome to Remix! - Dashboard" },
  ];
};

export default function Dashboard() {
  const { user } = useContext(UserContext);

  const [searchParams, setSearchParams] = useSearchParams();

  const isEmailAddressConfirmedCall = !!searchParams.get("email_confirmed")

  if (!user) {
    if (isEmailAddressConfirmedCall) navigateToUrl('/?email_confirmed=true')
    else navigateToUrl('/')
  }

  const [selectedTab, setSelectedTab] = useState<any>(searchParams.get("tab") ?? "validation");

  const emailAddressConfirmedModal = useDisclosure()

  useEffect(() => {
    let newSearchParams = new URLSearchParams();
    if (selectedTab) newSearchParams.set("tab", selectedTab);
    setSearchParams(newSearchParams);
  }, [selectedTab, setSearchParams]);

  const [isEmailAddressConfirmedModalAck, setEmailAddressConfirmedModalAck] = useState(false)
  useEffect(() => {
    if (isEmailAddressConfirmedCall && !emailAddressConfirmedModal.isOpen && !isEmailAddressConfirmedModalAck) emailAddressConfirmedModal.onOpen()
  }, [searchParams, emailAddressConfirmedModal, isEmailAddressConfirmedModalAck])

  const [validations, setValidations] = useState<Array<Validation | null>>([]);
  const [validationsCount, setValidationsCount] = useState<number>(0);

  const loadHistory = useCallback(async (limit: number | undefined = undefined, offset: number | undefined = undefined) => {
    try {
      const res = await getValidationHistory(limit, offset)
      if (res) {
        setValidations(prevValidations => [...prevValidations, ...res.validations.filter((newItem: Validation) => !prevValidations.some(prevItem => prevItem?.id === newItem.id))]);
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

  const goToPricing = async (e: any) => {
    e.preventDefault()
    navigateToUrl(`/pricing`)
  }

  const planType = capitalize(user?.currentPlan.type!)

  const appValidationLimit = getAppValidationLimit(user!)
  const apiValidationLimit = getApiValidationLimit(user!)
  const remainingAppValidations = getRemainingAppValidations(user!)
  const remainingApiValidations = getRemainingApiValidations(user!)

  const isPremiumOrEnterprise = user?.currentPlan.type === SubscriptionType.Premium || user?.currentPlan.type === SubscriptionType.Enterprise

  return (
    <>
      <div className="py-8 px-6">
        <div className="flex flex-col items-center mb-4">
          <h2 className="text-2xl">Dashboard</h2>
          {!!user && <>
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
      <EmailAddressConfirmedModal isOpen={emailAddressConfirmedModal.isOpen} onOpenChange={emailAddressConfirmedModal.onOpenChange} onClose={() => {
        setEmailAddressConfirmedModalAck(true)
        emailAddressConfirmedModal.onClose()
      }} />
    </>
  );
}