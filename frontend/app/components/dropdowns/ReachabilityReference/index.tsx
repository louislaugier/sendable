import { Accordion, AccordionItem, Card, CardBody } from "@nextui-org/react";
import { ReachableDescriptor, RiskyDescriptor, UnknownDescriptor, InvalidDescriptor } from "./ReachabilityDescriptor";

export default function ReachabilityReference() {
    return (
        <>
            {/* <style>
                {
                    `
                        #validation-docs-toggle button>div {
                            flex: unset;
                            width: 235px;
                        }
                    `
                }
            </style> */}
            <Accordion className="mb-4" variant="bordered">
                <AccordionItem as={'h3'} key="1" aria-label="Toggle reachability reference" subtitle="Click to expand" title="Reachability reference">
                    <Card className="mb-2">
                        <CardBody className="py-0">
                            <div className="flex flex-col my-4 gap-3 text-sm">
                                <ReachableDescriptor />
                                <RiskyDescriptor />
                                <UnknownDescriptor />
                                <InvalidDescriptor />
                            </div>
                        </CardBody>
                    </Card>
                </AccordionItem>
            </Accordion>
        </>
    )
}