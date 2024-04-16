import { siteName } from "./app";

export const pricingPlans = [
    {
        name: "Free",
        description: "Dive into email validation effortlessly with our free plan. Enjoy essential features at no cost.",
        monthly_price: "$0",
        yearly_price: "$0",
        features: [
            {
                content: "500 free monthly validations",
                tooltip: `You can validate up to 500 email addresses every month for free using ${siteName}'s web interface.`
            },
            {
                content: "Bulk email validation",
            },
            {
                content: "Connect CRM platforms",
            },
            {
                content: "30 free API single validations",
                tooltip: `You can validate up to 30 email addresses programmatically every month for free using ${siteName}'s API (1 validation at a time).`
            }
        ]
    },
    {
        name: "Premium",
        description: "Elevate your email validation with our premium offering, access advanced features tailored to your needs.",
        monthly_price: "$29",
        yearly_price: "$229",
        features: [
            {
                content: "300,000 monthly validations",
                tooltip: `You can validate up to 300,000 email addresses every month for free using ${siteName}'s web interface.`
            },
            {
                content: "Bulk email validation",
            },
            {
                content: "Connect CRM platforms",
            },
            {
                content: "10,000 API single validations",
                tooltip: `You can validate up to 10,000 email addresses programmatically every month using ${siteName}'s API (max 3 concurrent validations).`
            },
            {
                content: "24 / 7 Support"
            }
        ]
    },
    {
        name: "Enterprise",
        description: "Scale your email validation seamlessly with our top-tier solution for high-volume requirements.",
        monthly_price: "$99",
        yearly_price: "$899",
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
                tooltip: `You can validate as many email address batches as you want programmatically every month using ${siteName}'s API.\n Bulk validation batches are limited to 1 million email addresses at a time, and only 1 batch at a time. You can validate a batch by posting a file (TXT,CSV,XLS,XLSX) or a JSON payload.`
            },
            {
                content: "24 / 7 Support"
            }
        ]

    }
];