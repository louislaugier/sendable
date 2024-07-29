import { SubscriptionType } from "~/types/subscription";
import { siteName } from "./app";
import { limits } from "./limits";

export const pricingPlans = [
    {
        name: SubscriptionType.Free,
        description: "Dive into email validation effortlessly with our free plan. Enjoy essential features at no cost.",
        monthlyPrice: 0,
        yearlyPrice: 0,
        features: [
            {
                content: `${limits.free.app.toLocaleString()} free monthly validations`,
                tooltip: `You can validate up to ${limits.free.app.toLocaleString()} email addresses every month for free using ${siteName}'s web interface.`
            },
            {
                content: "Bulk email validation",
            },
            {
                content: "Connect CRM platforms",
            },
            {
                content: `${limits.free.api.toLocaleString()} free API single validations`,
                tooltip: `You can validate up to ${limits.free.api.toLocaleString()} email addresses programmatically every month for free using ${siteName}'s API (${limits.free.apiConcurrency.toLocaleString()} email address at a time).`
            },
            {
                content: "Deferred Support"
            }
        ]
    },
    {
        name: SubscriptionType.Premium,
        description: "Elevate your email validation with our premium offering, access advanced features tailored to your needs.",
        monthlyPrice: 99,
        stripeMonthlyPriceId: "price_1PheiwRsG6IPgooN6JeXSJfe",
        yearlyPrice: 999,
        stripeYearlyPriceId: "price_1PhemMRsG6IPgooNOE5BAJ5P",
        features: [
            {
                content: `${limits.premium.app.toLocaleString()} monthly validations`,
                tooltip: `You can validate up to ${limits.premium.app.toLocaleString()} email addresses every month using ${siteName}'s web interface.`
            },
            {
                content: "Bulk email validation",
            },
            {
                content: "Connect CRM platforms",
            },
            {
                content: `${limits.premium.api.toLocaleString()} API single validations`,
                tooltip: `You can validate up to ${limits.premium.api.toLocaleString()} email addresses programmatically every month using ${siteName}'s API (max ${limits.premium.apiConcurrency.toLocaleString()} parallel validations, 1 email address per validation).`
            },
            {
                content: "Deferred Support"
            }
        ]
    },
    {
        name: SubscriptionType.Enterprise,
        description: "Scale your email validation seamlessly with our top-tier solution for high-volume requirements.",
        monthlyPrice: 749,
        stripeMonthlyPriceId: "price_1Phet7RsG6IPgooNrQAMFfgh",
        yearlyPrice: 7499,
        stripeYearlyPriceId: "price_1PhetbRsG6IPgooNXV49khZU",
        features: [
            {
                content: "Unlimited validations",
            },
            {
                content: "Bulk email validation",
            },
            {
                content: "Connect CRM platforms",
            },
            {
                content: "Unlimited API single validations",
            },
            {
                content: "Unlimited API bulk validations",
                tooltip: `You can validate as many email address batches as you want programmatically every month using ${siteName}'s API.\n Parallel validation batches are limited to ${limits.enterprise.apiBulkConcurrency} with no email address limit. You can validate a batch by requesting the API with a file (TXT, CSV, XLS or XLSX) or raw JSON data.`
            },
            {
                content: "24 / 7 Support"
            }
        ]

    }
];