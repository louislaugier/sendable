import { Card, CardHeader, Divider, CardBody, CardFooter, Link, Image, Button, image } from "@nextui-org/react";
import type { MetaFunction } from "@remix-run/node";
import { Outlet, useLocation } from "@remix-run/react";
import { siteName } from "~/constants/app";
import { isCurrentUrl, navigateToUrl } from "~/utils/url";

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

function BlogCard(props: any) {
  const { title, subtitle, date, readTime, imageUrl, uri } = props
  return (
    <>
      <Card className="col-span-12 sm:col-span-4 h-[300px] w-[400px]">
        <CardHeader className="absolute z-10 top-1 flex-col !items-start">
          <p className="text-tiny text-white/60 uppercase font-bold">{subtitle}</p>
          <h4 className="text-white font-medium text-large">{title}</h4>
        </CardHeader>
        <Image
          removeWrapper
          alt="Card background"
          className="z-0 w-full h-full object-cover"
          src={imageUrl}
        />
        <CardFooter className="absolute bg-white/30 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
          <div>
            <p className=" text-white/60 text-tiny">{date}</p>
            <p className=" text-white/60 text-tiny">{readTime} read</p>
          </div>
          <Button onClick={() => navigateToUrl(`/blog${uri}`)} className="text-tiny" color="primary" radius="full" size="sm">
            Read more
          </Button>
        </CardFooter>
      </Card>
    </>
  )
}