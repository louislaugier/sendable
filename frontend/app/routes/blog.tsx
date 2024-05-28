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
    title: "Why use an email validator?",
    imageUrl: "/laptop.jpeg",
    subtitle: "Lead generation / marketing",
    date: "Mon Apr 22",
    readTime: "4 mins",
  },
  {
    uri: "/how_to_boost_your_email_servers_reputation",
    title: "How to boost your email server's reputation",
    imageUrl: "/lights.jpeg",
    subtitle: "DNS / Networking",
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
          <h2 className="text-2xl">Blog</h2>
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
