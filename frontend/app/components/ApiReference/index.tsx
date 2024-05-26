import { Accordion, AccordionItem, Card, CardBody } from "@nextui-org/react";
import SwaggerUI from "swagger-ui-react";

export default function ApiReference() {

    return (
        <>
            <style>
                {
                    `
                        #docs-toggle button>div {
                            flex: unset;
                            width: 235px;
                        }
                    `
                }
            </style>
            
            <Accordion id='docs-toggle' className="mb-12">
                <AccordionItem key="1" aria-label="Toggle API documentation" subtitle="Press to expand documentation" title="API reference">
                    <Card className="mb-16">
                        <CardBody>
                            <SwaggerUI url="https://petstore.swagger.io/v2/swagger.json" />
                        </CardBody>
                    </Card>
                </AccordionItem>
            </Accordion>
        </>
    )
}