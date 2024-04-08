import { Card, CardHeader, Divider, CardBody, Image } from "@nextui-org/react";
import { Feature } from "~/types/feature";

export const FeatureCard: React.FC<Feature> = ({ title, icon, description }) => {
    return (
        <Card className="my-10 max-w-[400px]">
            <CardHeader className="flex gap-3">
                {icon}
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
