import { Link } from "@nextui-org/react";
import type { MetaFunction } from "@remix-run/node";
import { siteName } from "~/constants/app";
import { blogPages } from "./blog";

const BLOG_URI = "/ultimate_guide_to_email_list_hygiene";
const blogData = blogPages.find(page => page.uri === BLOG_URI)!;

export const meta: MetaFunction = () => {
  return [
    { title: `Sendable - ${blogData.title}` },
    { name: "description", content: blogData.subtitle },
  ];
};

export default function UltimateGuideToEmailListHygiene() {
  return (
    <div className="py-8 px-6">
      <div className="max-w-4xl mx-auto">
        <img
          src="/hygiene.jpeg"
          alt="Email List Hygiene"
          className="w-full h-64 object-cover rounded-lg mb-8"
        />

        <section className="mb-8">
          <h1 className="text-3xl font-bold mb-4">{blogData.title}</h1>
          <p className="text-gray-600 mb-4">
            Published on {blogData.date} • {blogData.readTime}
          </p>
          
          <div className="prose max-w-none">
            <p className="mb-6">
              Maintaining a clean email list is crucial for email marketing success. This comprehensive guide will show you 
              how to implement effective list hygiene practices to improve deliverability, engagement, and ROI.
            </p>

            <h2 className="text-2xl font-semibold mb-4">Why Email List Hygiene Matters</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-medium mb-3">Key Benefits</h3>
              <ul className="list-disc pl-6 mb-4">
                <li className="mb-2"><strong>Boosts Deliverability:</strong> Removing invalid and disengaged contacts significantly reduces bounces and improves your chances of reaching the inbox.</li>
                <li className="mb-2"><strong>Enhances Sender Reputation:</strong> Consistent sending to a clean, engaged list signals positive behavior to ISPs.</li>
                <li className="mb-2"><strong>Increases Engagement:</strong> Targeting active and interested subscribers leads to higher open and click-through rates.</li>
                <li className="mb-2"><strong>Reduces Costs:</strong> Avoid paying your ESP for sending emails to addresses that will never engage.</li>
                <li className="mb-2"><strong>Provides Accurate Analytics:</strong> Clean data gives you a clearer picture of your campaign performance, enabling better strategy.</li>
              </ul>
            </div>

            <h2 className="text-2xl font-semibold mb-4">Types of Problematic Email Addresses</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-medium mb-3">1. Invalid Addresses</h3>
              <ul className="list-disc pl-6 mb-4">
                <li className="mb-2">Syntax errors</li>
                <li className="mb-2">Non-existent domains</li>
                <li className="mb-2">Deactivated accounts</li>
                <li className="mb-2">Typos and formatting issues</li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-medium mb-3">2. Risky Addresses</h3>
              <ul className="list-disc pl-6 mb-4">
                <li className="mb-2">Disposable email addresses</li>
                <li className="mb-2">Role-based accounts (e.g., info@, admin@)</li>
                <li className="mb-2">Catch-all domains</li>
                <li className="mb-2">Known spam traps</li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-medium mb-3">3. Disengaged Subscribers</h3>
              <ul className="list-disc pl-6 mb-4">
                <li className="mb-2">No opens in 6+ months</li>
                <li className="mb-2">No clicks in 12+ months</li>
                <li className="mb-2">Bounce history</li>
                <li className="mb-2">Spam complaints</li>
              </ul>
            </div>

            <h2 className="text-2xl font-semibold mb-4">List Hygiene Best Practices</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-medium mb-3">1. Prevention</h3>
              <ul className="list-disc pl-6 mb-4">
                <li className="mb-2">Real-time email validation at signup</li>
                <li className="mb-2">Double opt-in confirmation</li>
                <li className="mb-2">CAPTCHA for form submissions</li>
                <li className="mb-2">Clear subscription expectations</li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-medium mb-3">2. Regular Maintenance</h3>
              <ul className="list-disc pl-6 mb-4">
                <li className="mb-2">Monthly bounce removal</li>
                <li className="mb-2">Quarterly engagement analysis</li>
                <li className="mb-2">Bi-annual reconfirmation campaigns</li>
                <li className="mb-2">Annual deep clean</li>
              </ul>
            </div>

            <h2 className="text-2xl font-semibold mb-4">Cleaning Process</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-medium mb-3">Step-by-Step Guide</h3>
              <ol className="list-decimal pl-6 mb-4">
                <li className="mb-2">Export your current email list</li>
                <li className="mb-2">Remove obvious syntax errors</li>
                <li className="mb-2">Validate remaining addresses</li>
                <li className="mb-2">Segment based on validation results</li>
                <li className="mb-2">Review engagement history</li>
                <li className="mb-2">Create re-engagement campaigns</li>
                <li className="mb-2">Update your list</li>
              </ol>
            </div>

            <h2 className="text-2xl font-semibold mb-4">Re-engagement Strategies</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-medium mb-3">Campaign Ideas</h3>
              <ul className="list-disc pl-6 mb-4">
                <li className="mb-2">Special offers for inactive subscribers</li>
                <li className="mb-2">Preference center updates</li>
                <li className="mb-2">Feedback surveys</li>
                <li className="mb-2">Clear unsubscribe options</li>
              </ul>

              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="font-semibold mb-2">Example Re-engagement Email Subject Lines:</p>
                <ul className="list-disc pl-6">
                  <li className="mb-2">"We miss you! Here's 20% off your next purchase"</li>
                  <li className="mb-2">"Would you like to stay subscribed?"</li>
                  <li className="mb-2">"Update your preferences to get relevant content"</li>
                  <li className="mb-2">"Last chance to stay connected"</li>
                </ul>
              </div>
            </div>

            <h2 className="text-2xl font-semibold mb-4">Monitoring and Analytics</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-medium mb-3">Key Metrics to Track</h3>
              <ul className="list-disc pl-6 mb-4">
                <li className="mb-2">Bounce rate trends</li>
                <li className="mb-2">Spam complaint rates</li>
                <li className="mb-2">Engagement metrics</li>
                <li className="mb-2">List growth vs. churn</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
