import { Card, CardHeader, Divider, CardBody, Image } from "@nextui-org/react";

const FeaturesSection: React.FC = () => {
    return (
        <>
            <div className="pt-20">
                <h2 className="text-3xl font-extrabold text-center text-gray-900">
                    Clean your email lists and reach your customers
                </h2>
                <div className="flex py-12" style={{ flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    <FeatureCard
                        title="99% accuracy Guaranteed"
                        imageSrc="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
                        description="Email verification makes a difference only when it’s accurate, and our system guarantees you 99% accurate results. Take us for a test drive and see for yourself."
                    />
                    <FeatureCard
                        title="Validation from files"
                        imageSrc="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
                        description="You can upload CSV, XLS, XLSX and TXT files containing up to 1,000,000 email addresses at a time. This makes it easy to validate emails in bulk. It takes our email verifier 45 minutes on average to scrub an email list of 100,000 contacts."
                    />

                    <FeatureCard
                        title="Spam Trap Detection"
                        imageSrc="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
                        description="Our email validator app identifies many spam traps that may be lurking in your list. Removing spam traps is essential to your email hygiene and inbox placement."
                    />
                    <FeatureCard
                        title="Disposable Email Check"
                        imageSrc="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
                        description="These temporary email accounts self-destruct and end up bouncing. We run a thorough email list cleaning to weed them out for you."
                    />
                    <FeatureCard
                        title="Catch-All Email Check"
                        imageSrc="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
                        description="ZeroBounce identifies catch-all domains so you can isolate them from your list. All these domains will return a “valid” result and you can later score them."
                    />
                    <FeatureCard
                        title="MX Record and SMTP Server Check"
                        imageSrc="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
                        description="Our API will tell you if an MX Record was found for the domain we check, which would let us test the recipient by questioning the SMTP server. This way, you’ll know if a certain email address is genuine or fake."
                    />
                    <FeatureCard
                        title="Full Inbox / Disabled Account Check"
                        imageSrc="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
                        description="Our email verification system checks if an email inbox is full and verifies the account status to ensure it's active. Keeping your email list free from inactive or full accounts enhances your email deliverability and engagement rates."
                    />
                    <FeatureCard
                        title="Role Account Check"
                        imageSrc="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
                        description="Detect role-based email addresses to ensure your messages are reaching real individuals and not just functional inboxes. Identifying role accounts improves your email marketing effectiveness and helps maintain a clean contact list."
                    />
                </div>
            </div>
        </>
    );
};

export default FeaturesSection;

interface Feature {
    title: string;
    imageSrc: string;
    description: string;
}

const FeatureCard: React.FC<Feature> = ({ title, imageSrc, description }) => {
    return (
        <Card className="my-10 max-w-[400px]">
            <CardHeader className="flex gap-3">
                <Image
                    alt="nextui logo"
                    height={40}
                    radius="sm"
                    src={imageSrc}
                    width={40}
                />
                <div className="flex flex-col">
                    <p className="text-md">{title}</p>
                </div>
            </CardHeader>
            <Divider />
            <CardBody>
                <p>{description}</p>
            </CardBody>
        </Card>
    );
};
