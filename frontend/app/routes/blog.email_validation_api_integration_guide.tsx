import { Link } from "@nextui-org/react";
import type { MetaFunction } from "@remix-run/node";
import { useContext } from "react";
import CodeSnippetsSection from "~/components/page_sections/api/CodeSnippetsSection";
import { siteName } from "~/constants/app";
import AuthModalContext from "~/contexts/AuthModalContext";
import UserContext from "~/contexts/UserContext";
import { AuthModalType } from "~/types/modal";
import { navigateToUrl } from "~/utils/url";
import { blogPages } from "./blog";

const BLOG_URI = "/email_validation_api_integration_guide";
const blogData = blogPages.find(page => page.uri === BLOG_URI)!;

export const meta: MetaFunction = () => {
  return [
    { title: `Sendable - ${blogData.title}` },
    { name: "description", content: blogData.subtitle },
  ];
};

export default function EmailValidationApiIntegrationGuide() {
  const { user } = useContext(UserContext);
  const { authModal, setModalType } = useContext(AuthModalContext);

  return (
    <div className="py-8 px-6">
      <div className="max-w-4xl mx-auto">
        <img
          src="/api_integration.jpeg"
          alt="API Integration"
          className="w-full h-64 object-cover rounded-lg mb-8"
        />

        <section className="mb-8">
          <h1 className="text-3xl font-bold mb-4">{blogData.title}</h1>
          <p className="text-gray-600 mb-4">
            Published on {blogData.date} • {blogData.readTime}
          </p>

          <div className="prose max-w-none">
            <p className="mb-6">
              This guide provides practical examples and best practices for integrating our email validation API into your application workflows. Leveraging the API allows you to improve data quality and user experience by validating email addresses in real-time or in bulk. To understand the broader impact and benefits of email validation for your business, please refer to our article: <Link href="/blog/why_email_validation_is_critical_for_business_success" className="text-primary">Why Email Validation is Critical for Business Success</Link>.
            </p>

            <h2 className="text-2xl font-semibold mb-4">Authentication: Generating a JWT</h2>
            <p className="mb-4">
              To use the API, you must authenticate with a JWT token. Generate a JWT by sending a <strong>GET</strong> request to <code>/generate_jwt</code> with your API key in the <code>X-API-Key</code> header:
            </p>
            <pre className="bg-gray-100 p-4 rounded-lg mb-4"><code>{`GET /generate_jwt
X-API-Key: YOUR_API_KEY

Response:
{
  "jwt": "YOUR_JWT_TOKEN"
}`}</code></pre>

            <h2 className="text-2xl font-semibold mb-4">Single Email Validation</h2>
            <div className="mb-6">
              <p className="mb-4">
                Validate a single email address by sending a <strong>POST</strong> request to <code>/validate_email</code> with a JSON body. <br />
                <strong>Optional:</strong> You can add a <code>provider</code> query parameter (e.g., <code>?provider=mailchimp</code>) to specify the source of the contact.
              </p>
              <h3 className="text-xl font-medium mb-3">Endpoint Details</h3>
              <ul className="list-disc list-inside mb-4">
                <li><strong>Endpoint:</strong> <code>/validate_email</code></li>
                <li><strong>Method:</strong> POST</li>
                <li><strong>Authentication:</strong> Bearer JWT Token</li>
                <li><strong>Query Parameter (optional):</strong> <code>provider</code></li>
              </ul>
              <h3 className="text-xl font-medium mb-3">Request Example</h3>
              <pre className="bg-gray-100 p-4 rounded-lg mb-4"><code>{`POST /validate_email?provider=mailchimp
Headers:
  Authorization: Bearer YOUR_JWT_TOKEN
  Content-Type: application/json

Body:
{
  "email": "user@example.com"
}`}</code></pre>
              <h3 className="text-xl font-medium mb-3">Response Example</h3>
              <pre className="bg-gray-100 p-4 rounded-lg mb-4"><code>{`{
  "input": "user@example.com",
  "is_reachable": "safe",
  "misc": {
    "is_disposable": false,
    "is_role_account": false,
    "gravatar_url": "https://www.gravatar.com/avatar/...",
    "haveibeenpwned": false
  },
  "mx": {
    "accepts_mail": true,
    "records": ["mx1.example.com"]
  },
  "smtp": {
    "can_connect_smtp": true,
    "has_full_inbox": false,
    "is_catch_all": false,
    "is_deliverable": true,
    "is_disabled": false
  },
  "syntax": {
    "domain": "example.com",
    "is_valid_syntax": true,
    "username": "user",
    "suggestion": null
  }
}`}</code></pre>
            </div>

            <h2 className="text-2xl font-semibold mb-4">Bulk Email Validation</h2>
            <div className="mb-6">
              <p className="mb-4">
                For larger datasets, validate emails in bulk by sending a <strong>POST</strong> request to <code>/validate_emails</code>.<br />
                <strong>Optional:</strong> You can add a <code>provider</code> query parameter (e.g., <code>?provider=mailchimp</code>).
              </p>
              <h3 className="text-xl font-medium mb-3">Endpoint Details</h3>
              <ul className="list-disc list-inside mb-4">
                <li><strong>Endpoint:</strong> <code>/validate_emails</code></li>
                <li><strong>Method:</strong> POST</li>
                <li><strong>Authentication:</strong> Bearer JWT Token</li>
                <li><strong>Query Parameter (optional):</strong> <code>provider</code></li>
              </ul>
              <h3 className="text-xl font-medium mb-3">JSON Array Validation</h3>
              <pre className="bg-gray-100 p-4 rounded-lg mb-4"><code>{`POST /validate_emails
Headers:
  Authorization: Bearer YOUR_JWT_TOKEN
  Content-Type: application/json

Body:
{
  "emails": [
    "user1@example.com",
    "user2@example.com"
  ]
}`}</code></pre>
              <h3 className="text-xl font-medium mb-3">File Upload Validation</h3>
              <p className="mb-4">
                You can also upload files in CSV, XLSX, XLS, or TXT formats. Optionally, specify <code>columnsToScan</code> for CSV/XLSX/XLS files.
              </p>
              <pre className="bg-gray-100 p-4 rounded-lg mb-4"><code>{`POST /validate_emails
Headers:
  Authorization: Bearer YOUR_JWT_TOKEN
  Content-Type: multipart/form-data

Body:
  file: emails.csv
  columnsToScan: email,contact_email  // Optional`}</code></pre>
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
                <p className="text-yellow-700">
                  <strong>Note:</strong> The API will respond with <code>204 No Content</code> if the request is accepted. The results will be sent to your registered email address as a detailed CSV report.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold mb-4">Best Practices for API Integration</h2>
            <ul className="list-disc list-inside mb-6">
              <li>Implement real-time validation at data entry points (e.g., signup forms, profile updates) using the single validation endpoint.</li>
              <li>Utilize bulk validation for cleaning existing databases or large lists before campaigns.</li>
              <li>Handle API responses and validation results appropriately in your application logic.</li>
              <li>Implement error handling and retry mechanisms for API calls.</li>
              <li>Secure your API key and use JWT tokens for authentication.</li>
              <li>For general email list management best practices, including periodic cleaning, see our guide: <Link href="/blog/ultimate_guide_to_email_list_hygiene" className="text-primary">The Ultimate Guide to Email List Hygiene</Link>.</li>
            </ul>

            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
              <p className="text-green-700">
                <strong>Getting Started:</strong> Sign up for an API key in your dashboard or settings and start improving your email data quality today!
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
