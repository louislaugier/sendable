import { Accordion, AccordionItem, Card, CardBody } from "@nextui-org/react";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import { useEffect, useState } from "react";
import { getApiBaseUrl } from "~/constants/api";
import { siteName } from "~/constants/app";

export default function ApiReference() {
    const [apiSpec, setApiSpec] = useState<string | null>(null);

    useEffect(() => {
        const fetchApiSpec = async () => {
            const response = await fetch('/api-spec.yaml');
            let spec = await response.text();
            const apiBaseUrl = await getApiBaseUrl();

            // Replace placeholders in the spec
            spec = spec.replace(/{apiBaseUrl}/g, apiBaseUrl);
            spec = spec.replace(/{siteName}/g, siteName);

            setApiSpec(spec);
        };

        fetchApiSpec();
    }, []);

    return (
        <>
            <style>
                {`
                    #docs-toggle>div>h2>button>div {
                        flex: unset;
                        width: 235px;
                    }
                    .swagger-ui .info {
                        margin: 20px 0;
                    }
                    .swagger-ui .scheme-container {
                        padding: 15px 0;
                    }
                `}
            </style>

            <Accordion id='docs-toggle' className="mb-4">
                <AccordionItem key="1" aria-label="Toggle API documentation" subtitle="Press to expand documentation" title="API reference">
                    <Card className="mb-16">
                        <CardBody>
                            {apiSpec && <SwaggerUI spec={apiSpec} />}
                        </CardBody>
                    </Card>
                </AccordionItem>
            </Accordion>
        </>
    )
}
