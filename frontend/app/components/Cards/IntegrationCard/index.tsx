import { Card, CardHeader, Divider, CardBody, CardFooter, Button, Tooltip } from "@nextui-org/react";
import { useContext } from "react";
import UserContext from "~/contexts/UserContext";

export default function IntegrationCard(props: any) {
    const { title, url, description, signupBtn, logo } = props

    const { user } = useContext(UserContext);

    return (
        <Card className="w-[400px] mb-12">
            <CardHeader className="flex gap-3">
                {logo}
                <div className="flex flex-col">
                    <p className="text-md">{title}</p>
                    <p className="text-small text-default-500">{url}</p>
                </div>
            </CardHeader>
            <Divider />
            <CardBody>
                <p>{description}</p>
            </CardBody>
            <Divider />
            <CardFooter className="justify-end">
                {signupBtn}

                <style>
                    {
                        `
                            .notAllowed {
                                cursor: not-allowed !important;
                            }
                        `
                    }
                </style>
                {user ? <Button onClick={() => {
                    // TODO
                }} color="primary" variant="shadow">
                    Import contacts
                </Button> : <Tooltip showArrow={true} content={"You must be logged in to import contacts"}>
                    <Button onClick={() => { }} className={`notAllowed${signupBtn ? ' ml-2' : ''}`} color="primary" variant="shadow">
                        Import contacts
                    </Button>
                </Tooltip>}

            </CardFooter>
        </Card>

    );
}