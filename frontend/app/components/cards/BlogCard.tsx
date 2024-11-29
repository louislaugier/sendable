import { Card, CardHeader, CardFooter, Button, Image, Link } from "@nextui-org/react"
import { navigateToUrl } from "~/utils/url"

export default function BlogCard(props: any) {
    const { title, subtitle, date, readTime, imageUrl, uri } = props
    return (
        <>
            <Card className="col-span-12 sm:col-span-4 h-[300px] w-[400px] mb-8">
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
                    <Button as={Link} href={`/blog${uri}`} className="text-tiny" color="primary" radius="full" size="sm">
                        Read more
                    </Button>
                </CardFooter>
            </Card>
        </>
    )
}