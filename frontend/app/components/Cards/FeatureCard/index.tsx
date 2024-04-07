import { Card, CardHeader, Divider, CardBody, Image } from "@nextui-org/react";
import { Feature } from "~/types/feature";

export const FeatureCard: React.FC<Feature> = ({ title, imageSrc, description }) => {
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
