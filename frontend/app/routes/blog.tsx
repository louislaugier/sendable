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
    uri: "/why_use_an_email_validator",
    title: "Why Email Validation is Critical for Business Success",
    imageUrl: "/laptop.jpeg",
    subtitle: "Email Marketing / Deliverability",
    date: "Mon Apr 22",
    readTime: "4 mins",
  },
  {
    uri: "/how_to_boost_your_email_sender_reputation",
    title: "How to Boost Your Email Sender Reputation",
    imageUrl: "/lights.jpeg",
    subtitle: "Email Deliverability / Best Practices",
    date: "Mon Apr 15",
    readTime: "3 mins",
  },
]

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
