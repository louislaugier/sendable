import { Link } from "@nextui-org/react";
import type { MetaFunction } from "@remix-run/node";
import { siteName } from "~/constants/app";

export const meta: MetaFunction = () => {
  return [
    { title: `Email Validation API Integration Guide: Best Practices and Examples - ${siteName}` },
    { name: "description", content: "Learn how to integrate email validation into your applications with our comprehensive API guide, complete with code examples and best practices." },
  ];
};

export default function EmailValidationApiIntegrationGuide() {
  return (
    <div className="py-8 px-6">
      <div className="max-w-4xl mx-auto">
        <img
          src="/api_integration.jpeg"
          alt="API Integration"
          className="w-full h-64 object-cover rounded-lg mb-8"
        />

        <section className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Email Validation API Integration Guide: Best Practices and Examples</h1>
          <p className="text-gray-600 mb-4">
            Published on May 22, 2024 • 7 min read
          </p>
          
          <div className="prose max-w-none">
            <p className="mb-6">
              Integrating email validation into your application can significantly improve data quality and user experience. 
              This guide will walk you through the integration process with practical examples and best practices.
            </p>

            <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-medium mb-3">Authentication</h3>
              <p className="mb-4">
                First, you'll need to generate an API key from your dashboard. The API uses bearer token authentication.
              </p>

              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="font-semibold mb-2">Getting a Bearer Token:</p>
                <code className="text-sm block mb-4">
                  curl -X GET \<br />
                  -H "X-API-Key: your_api_key" \<br />
                  -H "Content-Type: application/json" \<br />
                  https://api.sendable.email/token
                </code>
                <p className="text-sm mt-2">
                  The response will include your bearer token for subsequent requests.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold mb-4">Single Email Validation</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-medium mb-3">REST Endpoint</h3>
              <p className="mb-4">
                Validate a single email address using a GET request:
              </p>

              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="font-semibold mb-2">Request:</p>
                <code className="text-sm block mb-4">
                  GET /v1/validate/john@example.com<br />
                  Authorization: Bearer your_token
                </code>

                <p className="font-semibold mb-2">Response:</p>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <code className="text-sm block">
                    {`{
  "email": "john@example.com",
  "reachable": true,
  "risky": false,
  "disposable": false,
  "role_account": false,
  "mx_record": true,
  "smtp_valid": true,
  "catch_all": false,
  "score": 0.95
}`}
                  </code>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-semibold mb-4">Code Examples</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-medium mb-3">Node.js / TypeScript</h3>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <code className="text-sm block">
                  {`import axios from 'axios';

async function validateEmail(email: string): Promise<ValidationResult> {
  try {
    const response = await axios.get(
      \`https://api.sendable.email/v1/validate/\${email}\`,
      {
        headers: {
          'Authorization': \`Bearer \${process.env.API_TOKEN}\`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Validation error:', error);
    throw error;
  }
}`}
                </code>
              </div>

              <h3 className="text-xl font-medium mb-3">Python</h3>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <code className="text-sm block">
                  {`import requests

def validate_email(email):
    headers = {
        'Authorization': f'Bearer {api_token}',
        'Content-Type': 'application/json'
    }
    
    response = requests.get(
        f'https://api.sendable.email/v1/validate/{email}',
        headers=headers
    )
    
    return response.json()`}
                </code>
              </div>
            </div>

            <h2 className="text-2xl font-semibold mb-4">Bulk Validation</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-medium mb-3">Processing Multiple Emails</h3>
              <p className="mb-4">
                For bulk validation, use our batch endpoint:
              </p>

              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <code className="text-sm block">
                  {`POST /v1/validate/batch
Content-Type: application/json
Authorization: Bearer your_token

{
  "emails": [
    "user1@example.com",
    "user2@example.com",
    "user3@example.com"
  ]
}`}
                </code>
              </div>
            </div>

            <h2 className="text-2xl font-semibold mb-4">Error Handling</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-medium mb-3">Common Error Codes</h3>
              <ul className="list-disc pl-6 mb-4">
                <li className="mb-2">400 - Invalid email format</li>
                <li className="mb-2">401 - Authentication error</li>
                <li className="mb-2">429 - Rate limit exceeded</li>
                <li className="mb-2">500 - Server error</li>
              </ul>

              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="font-semibold mb-2">Error Response Format:</p>
                <code className="text-sm block">
                  {`{
  "error": {
    "code": "rate_limit_exceeded",
    "message": "API rate limit exceeded",
    "details": {
      "reset_at": "2024-05-22T15:00:00Z"
    }
  }
}`}
                </code>
              </div>
            </div>

            <h2 className="text-2xl font-semibold mb-4">Best Practices</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-medium mb-3">Implementation Tips</h3>
              <ul className="list-disc pl-6 mb-4">
                <li className="mb-2">Implement retry logic with exponential backoff</li>
                <li className="mb-2">Cache validation results for frequently checked emails</li>
                <li className="mb-2">Use batch validation for large lists</li>
                <li className="mb-2">Monitor your API usage and rate limits</li>
                <li className="mb-2">Implement proper error handling</li>
              </ul>
            </div>

            <h2 className="text-2xl font-semibold mb-4">Rate Limiting</h2>
            <div className="mb-6">
              <p className="mb-4">
                Our API implements rate limiting based on your subscription plan:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li className="mb-2">Free: 100 requests/minute</li>
                <li className="mb-2">Premium: 1,000 requests/minute</li>
                <li className="mb-2">Enterprise: Custom limits</li>
              </ul>
            </div>

            <h2 className="text-2xl font-semibold mb-4">Webhooks</h2>
            <div className="mb-6">
              <p className="mb-4">
                For batch validations, set up webhooks to receive notifications when processing is complete:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <code className="text-sm block">
                  {`POST /v1/webhooks
{
  "url": "https://your-domain.com/webhook",
  "events": ["validation.complete", "validation.failed"]
}`}
                </code>
              </div>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="text-xl font-medium mb-3">Ready to Start?</h3>
              <ol className="list-decimal pl-6">
                <li className="mb-2">
                  <Link href="/dashboard" className="text-primary">
                    Generate your API key
                  </Link>
                </li>
                <li className="mb-2">
                  <Link href="/api" className="text-primary">
                    Review our full API documentation
                  </Link>
                </li>
                <li className="mb-2">Implement the integration</li>
                <li className="mb-2">Monitor your usage in the dashboard</li>
              </ol>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
