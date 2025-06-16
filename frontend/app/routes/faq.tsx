import type { MetaFunction } from "@remix-run/node";
import { Accordion, AccordionItem } from "@nextui-org/react";
import { contactEmail, siteName } from "~/constants/app";

export const meta: MetaFunction = () => {
  return [
    { title: `${siteName} - FAQ` },
    { name: "description", content: "Frequently asked questions about email validation services" },
  ];
};

export default function Faq() {
  const faqItems = [
    {
      category: "General Questions",
      items: [
        {
          question: "What is Sendable?",
          answer: "Sendable is an email validation service that helps businesses verify email addresses to improve their email marketing effectiveness and deliverability rates. Our platform offers 99% accurate results without sending test emails to the addresses being validated."
        },
        {
          question: "How does email validation help my business?",
          answer: `Email validation helps by:
          • Reducing bounce rates and protecting your sender reputation
          • Identifying invalid, disposable, and risky email addresses
          • Improving email deliverability and engagement rates
          • Saving costs by maintaining a clean email list
          • Preventing spam traps and ensuring compliance`
        }
      ]
    },
    {
      category: "Features & Functionality",
      items: [
        {
          question: "What types of validation does Sendable perform?",
          answer: `We perform multiple validation checks including:
          • Syntax validation
          • MX record and SMTP server verification
          • Disposable email detection
          • Spam trap identification
          • Catch-all email detection
          • Full inbox / disabled account verification
          • Role account detection (e.g., support@, info@)`
        },
        {
          question: "How can I validate email addresses?",
          answer: `There are three ways to validate emails:
          1. Through our web interface
          2. Via our API
          3. By uploading files (CSV, XLS, XLSX, or TXT)`
        },
        {
          question: "What file formats are supported for bulk validation?",
          answer: "We support CSV, XLS, XLSX, and TXT files. Files can contain up to 1,000,000 email addresses per batch."
        }
      ]
    },
    {
      category: "Plans & Pricing",
      items: [
        {
          question: "What plans do you offer?",
          answer: `We offer three plans:
          • Free: Limited monthly validations for testing
          • Premium: Higher validation limits for growing businesses
          • Enterprise: Unlimited validations for large-scale operations`
        },
        {
          question: "Do you offer yearly billing?",
          answer: "Yes, we offer both monthly and yearly billing options. Yearly billing comes with a discount compared to monthly billing."
        }
      ]
    },
    {
      category: "Technical & API",
      items: [
        {
          question: "Do you provide an API?",
          answer: "Yes, we offer a REST API that allows you to integrate email validation directly into your applications. API documentation is available in your dashboard."
        },
        {
          question: "Is the API rate-limited?",
          answer: "Yes, rate limits depend on your subscription plan. Free plans have lower limits while Enterprise plans offer unlimited API access."
        },
        {
          question: "How secure is the service?",
          answer: `We prioritize security by:
          • Using HTTPS encryption for all communications
          • Supporting two-factor authentication (2FA)
          • Never storing validated email addresses
          • Providing secure API authentication`
        }
      ]
    },
    {
      category: "Integration & Support",
      items: [
        {
          question: "Can I integrate Sendable with my CRM?",
          answer: "Yes, we support integration with popular CRM platforms including Salesforce, HubSpot, Zoho, and Mailchimp."
        },
        {
          question: "How do I get support?",
          answer: `• Free and Premium plans include deferred support
          • Enterprise plans include 24/7 support
          • You can contact us at ${contactEmail}`
        },
        {
          question: "Is there a trial period?",
          answer: "Yes, you can start with our free plan which includes a limited number of monthly validations to test our service. No credit card is required for the free plan."
        }
      ]
    }
  ];

  return (
    <div className="py-8 px-6">
      <div className="flex flex-col items-center mb-16">
        <h1 className="text-2xl">Frequently Asked Questions</h1>
      </div>

      <div className="max-w-4xl mx-auto">
        {faqItems.map((category, index) => (
          <div key={index} className="mb-8">
            <h2 className="text-xl font-semibold mb-4">{category.category}</h2>
            <Accordion variant="bordered">
              {category.items.map((item, itemIndex) => (
                <AccordionItem
                  key={itemIndex}
                  aria-label={item.question}
                  title={item.question}
                >
                  <div className="whitespace-pre-line pb-4">
                    {item.answer}
                  </div>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
      </div>
    </div>
  );
}