import { Link } from "@nextui-org/react";
import type { MetaFunction } from "@remix-run/node";
import { siteName } from "~/constants/app";
import { blogPages } from "./blog";

const BLOG_URI = "/email_authentication_spf_dkim_dmarc_explained";
const blogData = blogPages.find(page => page.uri === BLOG_URI)!;

export const meta: MetaFunction = () => {
  return [
    { title: `Sendable - ${blogData.title}` },
    { name: "description", content: blogData.subtitle },
  ];
};

export default function EmailAuthenticationDeepDive() {
  return (
    <div className="py-8 px-6">
      <div className="max-w-4xl mx-auto">
        <img
          src="/authentication.jpeg"
          alt="Email Authentication Protocols"
          className="w-full h-64 object-cover rounded-lg mb-8"
        />

        <section className="mb-8">
          <h1 className="text-3xl font-bold mb-4">{blogData.title}</h1>
          <p className="text-gray-600 mb-4">
            Published on {blogData.date} • {blogData.readTime}
          </p>
          
          <div className="prose max-w-none">
            <p className="mb-6">
              Email authentication protocols are crucial for email security and verifying your identity as a sender. This comprehensive guide will break down how SPF, DKIM, and DMARC work together to create a robust email authentication system. For more information on how authentication impacts email deliverability and sender reputation, see our related articles: <Link href="/blog/how_to_boost_your_email_sender_reputation" className="text-primary">How to Boost Your Email Sender Reputation</Link> and <Link href="/blog/why_email_validation_is_critical_for_business_success" className="text-primary">Why Email Validation is Critical for Business Success</Link>.
            </p>

            <h2 className="text-2xl font-semibold mb-4">SPF (Sender Policy Framework)</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-medium mb-3">What is SPF?</h3>
              <p className="mb-4">
                SPF is a DNS record that specifies which mail servers are authorized to send emails on behalf of your domain. 
                It helps prevent email spoofing by allowing receiving servers to verify if an email came from an authorized source.
              </p>

              <h3 className="text-xl font-medium mb-3">SPF Record Syntax</h3>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <code className="text-sm">
                  v=spf1 ip4:192.168.1.1 include:_spf.google.com include:sendgrid.net -all
                </code>
                <ul className="list-disc pl-6 mt-4">
                  <li className="mb-2">v=spf1: Version identifier</li>
                  <li className="mb-2">ip4: Authorized IP addresses</li>
                  <li className="mb-2">include: Third-party senders</li>
                  <li className="mb-2">-all: Strict policy (fail unauthorized)</li>
                </ul>
              </div>
            </div>

            <h2 className="text-2xl font-semibold mb-4">DKIM (DomainKeys Identified Mail)</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-medium mb-3">Understanding DKIM</h3>
              <p className="mb-4">
                DKIM adds a digital signature to your emails, allowing receiving servers to verify that the message content 
                hasn't been tampered with during transit and truly comes from your domain.
              </p>

              <h3 className="text-xl font-medium mb-3">DKIM Implementation Steps</h3>
              <ul className="list-disc pl-6 mb-4">
                <li className="mb-2">Generate public/private key pair</li>
                <li className="mb-2">Add public key to DNS record</li>
                <li className="mb-2">Configure email server to sign messages</li>
                <li className="mb-2">Test DKIM configuration</li>
              </ul>

              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="font-semibold mb-2">Example DKIM DNS Record:</p>
                <code className="text-sm">
                  selector._domainkey.example.com. IN TXT "v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4..."
                </code>
              </div>
            </div>

            <h2 className="text-2xl font-semibold mb-4">DMARC (Domain-based Message Authentication)</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-medium mb-3">DMARC's Role</h3>
              <p className="mb-4">
                DMARC builds upon SPF and DKIM by telling receiving servers what to do when emails fail authentication. 
                It also provides reporting capabilities to monitor email authentication results.
              </p>

              <h3 className="text-xl font-medium mb-3">DMARC Policies</h3>
              <ul className="list-disc pl-6 mb-4">
                <li className="mb-2">p=none (monitor only)</li>
                <li className="mb-2">p=quarantine (send to spam)</li>
                <li className="mb-2">p=reject (block delivery)</li>
              </ul>

              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="font-semibold mb-2">Example DMARC Record:</p>
                <code className="text-sm">
                  _dmarc.example.com. IN TXT "v=DMARC1; p=reject; rua=mailto:reports@example.com; pct=100"
                </code>
              </div>
            </div>

            <h2 className="text-2xl font-semibold mb-4">Implementation Best Practices</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-medium mb-3">Staged Rollout</h3>
              <ol className="list-decimal pl-6 mb-4">
                <li className="mb-2">Start with SPF implementation</li>
                <li className="mb-2">Add DKIM signing</li>
                <li className="mb-2">Implement DMARC in monitoring mode</li>
                <li className="mb-2">Gradually increase DMARC enforcement</li>
              </ol>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-medium mb-3">Common Pitfalls</h3>
              <ul className="list-disc pl-6 mb-4">
                <li className="mb-2">SPF record exceeding DNS lookup limit</li>
                <li className="mb-2">Incorrect DKIM key rotation</li>
                <li className="mb-2">Missing third-party senders in SPF</li>
                <li className="mb-2">Overly aggressive DMARC policies</li>
              </ul>
            </div>

            <h2 className="text-2xl font-semibold mb-4">Monitoring and Maintenance</h2>
            <div className="mb-6">
              <ul className="list-disc pl-6 mb-4">
                <li className="mb-2">Regular review of DMARC reports</li>
                <li className="mb-2">Monitoring authentication pass rates</li>
                <li className="mb-2">Updating records for new sending services</li>
                <li className="mb-2">Periodic key rotation for DKIM</li>
              </ul>
            </div>

            <h2 className="text-2xl font-semibold mb-4">Conclusion</h2>
            <p className="mb-6">
              Proper email authentication is essential for maintaining good deliverability and protecting your domain 
              reputation. By implementing SPF, DKIM, and DMARC correctly, you create a robust security framework that 
              helps ensure your emails reach their intended recipients.
            </p>

            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="text-xl font-medium mb-3">Next Steps</h3>
              <p className="mb-4">
                Ready to improve your email authentication setup?
              </p>
              <ol className="list-decimal pl-6">
                <li className="mb-2">Audit your current authentication records</li>
                <li className="mb-2">Implement missing protocols</li>
                <li className="mb-2">Monitor authentication results</li>
                <li className="mb-2">
                  <Link href="/dashboard" className="text-primary">
                    Validate your email list
                  </Link>
                  {" "}to ensure high deliverability
                </li>
              </ol>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}