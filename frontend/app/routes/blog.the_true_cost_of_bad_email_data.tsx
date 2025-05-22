import { Link } from "@nextui-org/react";
import type { MetaFunction } from "@remix-run/node";
import { siteName } from "~/constants/app";
import { blogPages } from "./blog";

const BLOG_URI = "/the_true_cost_of_bad_email_data";
const blogData = blogPages.find(page => page.uri === BLOG_URI)!;

export const meta: MetaFunction = () => {
  return [
    { title: `Sendable - ${blogData.title}` },
    { name: "description", content: blogData.subtitle },
  ];
};

export default function TheTrueCostOfBadEmailData() {
  return (
    <div className="py-8 px-6">
      <div className="max-w-4xl mx-auto">
        <img
          src="/cost.jpeg"
          alt="Business Cost Analysis"
          className="w-full h-64 object-cover rounded-lg mb-8"
        />

        <section className="mb-8">
          <h1 className="text-3xl font-bold mb-4">{blogData.title}</h1>
          <p className="text-gray-600 mb-4">
            Published on {blogData.date} • {blogData.readTime}
          </p>
          
          <div className="prose max-w-none">
            <p className="mb-6">
              While many businesses view email validation as an optional expense, the true cost of maintaining poor email 
              data quality can be substantial. In this analysis, we'll break down the direct and indirect costs of bad 
              email data and demonstrate why investing in email validation is crucial for your bottom line.
            </p>

            <h2 className="text-2xl font-semibold mb-4">Direct Financial Impact</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-medium mb-3">1. Email Service Provider (ESP) Costs</h3>
              <ul className="list-disc pl-6 mb-4">
                <li className="mb-2">Most ESPs charge based on list size or email volume</li>
                <li className="mb-2">Invalid emails waste 10-25% of typical ESP costs</li>
                <li className="mb-2">Average business wastes $180-450/month on invalid contacts</li>
                <li className="mb-2">Annual waste can exceed $5,400 for mid-sized lists</li>
              </ul>
              <p className="mb-4">
                By maintaining a clean email list, businesses can significantly reduce their ESP costs and allocate 
                those resources to other marketing initiatives.
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-medium mb-3">2. Marketing Team Productivity</h3>
              <ul className="list-disc pl-6 mb-4">
                <li className="mb-2">Average time spent managing bounced emails: 3-5 hours/month</li>
                <li className="mb-2">Cost of manual list cleaning: $150-250/month in labor</li>
                <li className="mb-2">Lost opportunity cost from diverted resources</li>
                <li className="mb-2">Reduced campaign effectiveness analysis accuracy</li>
              </ul>
            </div>

            <h2 className="text-2xl font-semibold mb-4">Indirect Business Costs</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-medium mb-3">1. Sender Reputation Damage & Lost Revenue</h3>
              <ul className="list-disc pl-6 mb-4">
                <li className="mb-2">Lost revenue from emails not reaching the inbox due to poor sender reputation.</li>
                <li className="mb-2">Increased recovery time and costs if blacklisted.</li>
                <li className="mb-2">Reduced effectiveness of email campaigns impacting overall ROI.</li>
                <li className="mb-2">Difficulty in reaching prospects and customers, hindering business growth.</li>
              </ul>
              <p className="mb-4">
                Poor sender reputation can lead to significant lost revenue opportunities and require substantial effort and cost to repair.
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-medium mb-3">2. Customer Experience Impact</h3>
              <ul className="list-disc pl-6 mb-4">
                <li className="mb-2">Failed password resets and account notifications</li>
                <li className="mb-2">Increased customer support inquiries</li>
                <li className="mb-2">Damaged brand reputation</li>
                <li className="mb-2">Lost customer loyalty and repeat business</li>
              </ul>
            </div>

            <h2 className="text-2xl font-semibold mb-4">ROI of Email Validation</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-medium mb-3">Cost Savings</h3>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="font-semibold mb-2">Example Calculation (50,000 email list):</p>
                <ul className="list-disc pl-6">
                  <li className="mb-2">Current invalid rate: 15% (7,500 emails)</li>
                  <li className="mb-2">ESP cost savings: $225/month</li>
                  <li className="mb-2">Labor savings: $200/month</li>
                  <li className="mb-2">Improved deliverability value: $500/month</li>
                  <li className="mb-2">Total monthly benefit: $925</li>
                  <li className="mb-2">Annual ROI: 300-400%</li>
                </ul>
              </div>
            </div>

            <h2 className="text-2xl font-semibold mb-4">Implementation Strategy</h2>
            <div className="mb-6">
              <h3 className="text-xl font-medium mb-3">Recommended Approach</h3>
              <ul className="list-disc pl-6 mb-4">
                <li className="mb-2">Initial bulk validation of existing list</li>
                <li className="mb-2">Real-time validation for new signups</li>
                <li className="mb-2">Quarterly list maintenance</li>
                <li className="mb-2">Regular monitoring and reporting</li>
              </ul>
            </div>

            <h2 className="text-2xl font-semibold mb-4">Conclusion</h2>
            <p className="mb-6">
              The cost of maintaining poor email data quality extends far beyond bounced emails. By investing in proper 
              email validation and maintenance, businesses can achieve significant cost savings while improving their 
              marketing effectiveness and customer relationships.
            </p>

            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="text-xl font-medium mb-3">Take Action</h3>
              <p className="mb-4">
                Ready to improve your email data quality and reduce costs?
              </p>
              <ol className="list-decimal pl-6">
                <li className="mb-2">Calculate your current costs using our formula above</li>
                <li className="mb-2">Analyze your bounce rates and invalid email percentage</li>
                <li className="mb-2">
                  <Link href="/pricing" className="text-primary">
                    Compare our validation plans
                  </Link>
                </li>
                <li className="mb-2">
                  <Link href="/dashboard" className="text-primary">
                    Start validating your email list
                  </Link>
                </li>
              </ol>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
