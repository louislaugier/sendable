import { Card, CardHeader, Divider, CardBody, CardFooter, Link, Image, Button, image } from "@nextui-org/react";
import type { MetaFunction } from "@remix-run/node";
import { siteName } from "~/constants/app";

export const meta: MetaFunction = () => {
  return [
    { title: `${siteName} - Blog` },
    { name: "description", content: "Welcome to Remix! - Blog" },
  ];
};

export default function Blog() {

  const test = <Card className="max-w-[400px] mb-8">
    <CardHeader className="flex gap-3">
      <div className="flex flex-col">
        <p className="text-md">NextUI</p>
        <p className="text-small text-default-500">nextui.org</p>
      </div>
    </CardHeader>
    <Divider />
    <CardBody>
      <p>Make beautiful websites regardless of your design experience.</p>
    </CardBody>
    <Divider />
    <CardFooter>
      <Link
        isExternal
        showAnchorIcon
        href="https://github.com/nextui-org/nextui"
      >
        Visit source code on GitHub.
      </Link>
    </CardFooter>
  </Card>

  return (
    <div className="py-8 px-6">

      <div className="flex flex-col items-center mb-16">
        <h2 className="text-2xl">Blog</h2>
      </div>

      <div className="flex flex-wrap justify-between">
        <BlogCard imageUrl="/laptop.jpeg"  title="Why use an email validator?" subtitle='Lead generation / marketing' date='Mon Apr 22' readTime='4 mins' />
        <BlogCard imageUrl="/lights.jpeg" title="How to preserve your email domain and server's reputation?" subtitle='DNS / Networking' date='Mon Apr 15' readTime='3 mins' />
      </div>
    </div>
  );
}

function BlogCard(props: any) {
  const { title, subtitle, date, readTime, imageUrl } = props
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
            <p className="text-black text-tiny">{date}</p>
            <p className="text-black text-tiny">{readTime} read</p>
          </div>
          <Button className="text-tiny" color="primary" radius="full" size="sm">
            Read more
          </Button>
        </CardFooter>
      </Card>
    </>
  )
}