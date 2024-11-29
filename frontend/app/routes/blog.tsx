import type { MetaFunction } from "@remix-run/node";
import { Outlet, useLocation } from "@remix-run/react";
import BlogCard from "~/components/cards/BlogCard";
import { siteName } from "~/constants/app";
import { isCurrentUrl } from "~/utils/url";

export const meta: MetaFunction = () => {
  return [
    { title: `${siteName} - Blog` },
    { name: "description", content: "Welcome to Remix! - Blog" },
  ];
};

export const blogPages = [
  {
    uri: "/why_email_validation_is_critical_for_business_success",
    title: "Why Email Validation is Critical for Business Success",
    imageUrl: "/laptop.jpeg",
    subtitle: "Email Marketing / Deliverability",
    date: "Mon Apr 22",
    readTime: "6 mins",
  },
  {
    uri: "/how_to_boost_your_email_sender_reputation",
    title: "How to Boost Your Email Sender Reputation",
    imageUrl: "/lights.jpeg",
    subtitle: "Email Deliverability / Best Practices",
    date: "Mon Apr 15",
    readTime: "4 mins",
  },
  {
    uri: "/how_to_improve_email_deliverability_with_list_segmentation",
    title: "How to Improve Email Deliverability with List Segmentation",
    imageUrl: "/laptop.jpeg",
    subtitle: "Email Marketing / Strategy",
    date: "Mon May 1",
    readTime: "5 mins",
  },
  {
    uri: "/the_true_cost_of_bad_email_data",
    title: "The True Cost of Bad Email Data: A Business Impact Analysis",
    imageUrl: "/laptop.jpeg",
    subtitle: "Business / Analysis",
    date: "Mon May 8",
    readTime: "5 mins",
  },
  {
    uri: "/email_authentication_spf_dkim_dmarc_explained",
    title: "Email Authentication Deep Dive: SPF, DKIM, and DMARC Explained",
    imageUrl: "/laptop.jpeg",
    subtitle: "Technical / Security",
    date: "Mon May 15",
    readTime: "6 mins",
  },
  {
    uri: "/email_validation_api_integration_guide",
    title: "Email Validation API Integration Guide: Best Practices and Examples",
    imageUrl: "/laptop.jpeg",
    subtitle: "Technical / Integration",
    date: "Mon May 22",
    readTime: "6 mins",
  },
  {
    uri: "/ultimate_guide_to_email_list_hygiene",
    title: "The Ultimate Guide to Email List Hygiene",
    imageUrl: "/laptop.jpeg",
    subtitle: "Email Marketing / Best Practices",
    date: "Mon May 29",
    readTime: "7 mins",
  },
];

export default function Blog() {
  const location = useLocation();
  const isBlogRoot = isCurrentUrl(location, '/blog')

  return (
    <>
      {isBlogRoot ? <div className="py-8 px-6">

        <div className="flex flex-col items-center mb-16">
          <h1 className="text-2xl">Blog</h1>
        </div>


        <div className="flex flex-wrap justify-between">
          {blogPages.map(blogPage => <>
            <BlogCard uri={blogPage.uri} imageUrl={blogPage.imageUrl} title={blogPage.title} subtitle={blogPage.subtitle} date={blogPage.date} readTime={blogPage.readTime} />
          </>)}
        </div>
      </div> : <Outlet />}
    </>
  );
}
