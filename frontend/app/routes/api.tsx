import { Button, Snippet, Tab, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tabs } from "@nextui-org/react";
import type { MetaFunction } from "@remix-run/node";
import { useContext, useState } from "react";
import { siteName } from "~/constants/app";
import AuthModalContext from "~/contexts/AuthModalContext";
import { AuthModalType } from "~/types/modal";
import { CodeBlock, dracula } from "react-code-blocks";
import { apiBaseUrl } from "~/constants/api";
import CopyIcon from "~/icons/CopyIcon";
import CheckIcon from "~/icons/CheckIcon";

export const meta: MetaFunction = () => {
  return [
    { title: `${siteName} - API` },
    { name: "description", content: "Welcome to Remix! - API" },
  ];
};

const tsCode = `import axios, { AxiosResponse } from 'axios';

async function getToken(): Promise<string | null> {
    try {
        const response: AxiosResponse = await axios.get('${apiBaseUrl}/v1/token', {
            headers: {
                'X-API-Key': 'YourApiKeyHere',
                'Content-Type': 'application/json'
            }
        });

        return response.data.token;

    } catch (err) {
        console.error(err);
        return null;
    }
}`

const goCode = `import (
    "net/http"
    "io"
)

type TokenResponse struct {
    Token string \`json:"token"\`
}

func GetToken() (*string, error) {
    req, err := http.NewRequest("GET", "${apiBaseUrl}/v1/token", nil)
    if err != nil {
        return nil, err
    }
    req.Header.Set("X-API-Key", "YourApiKeyHere")
    req.Header.Set("Content-Type", "application/json")

    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()

    data := TokenResponse{}
    err = json.NewDecoder(resp.Body).Decode(&data)
    if err != nil {
        return nil, err
    }

    return &data.Token, nil
}`



export default function Api() {
  const { authModal, setModalType } = useContext(AuthModalContext);

  const [isTsCodeCopied, setTsCodeCopied] = useState(false);
  const [isGoCodeCopied, setGoCodeCopied] = useState(false);

  return (
    <>
      <div className="py-8 px-6">

        <div className="flex flex-col items-center mb-12">
          <h2 className="text-2xl">API</h2>
        </div>

        <h3 className="text-lg mb-4">API reference</h3>
        <p className="mb-6">Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia,
          molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum
          numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium
          optio, eaque rerum! Provident similique accusantium nemo autem. Veritatis
          obcaecati tenetur iure eius earum ut molestias architecto voluptate aliquam
          nihil, eveniet aliquid culpa officia aut!
        </p>
        <Button onClick={() => {
        }} color="primary" variant="shadow" className="mb-16">
          Open API docs
        </Button>

        <h3 className="text-lg mb-4">Generating a bearer token from an API key</h3>
        <style>
          {
            `
              code {
                font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace !important;
              }

              .iconButtonCopy:hover {
                background: transparent !important;
              }
            `
          }
        </style>
        <Tabs aria-label="Get bearer token" className="justify-center">
          <Tab className="flex gap-8" key="terminal" title="Terminal">
            <Snippet>
              <span>curl -X GET \</span>
              <span>-H "X-API-Key: YourApiKeyHere" \</span>
              <span>-H "Content-Type: application/json" \</span>
              <span>{apiBaseUrl}/v1/token</span>
            </Snippet>
          </Tab>

          <Tab className="flex gap-8" key="node" title="Node.js (Typescript)">
            <div className="relative">
              <Button onClick={() => {
                setTsCodeCopied(true);
                navigator.clipboard.writeText(tsCode);
                setTimeout(() => setTsCodeCopied(false), 3500);
              }} variant="ghost" className="absolute iconButtonCopy" style={{ right: '7.5px', top: '2.5px', border: "none" }} isIconOnly aria-label="Copy">
                {isTsCodeCopied ? <CheckIcon isWhite /> : <CopyIcon isWhite />}
              </Button>
              <CodeBlock
                language="typescript"
                text={tsCode}
                theme={dracula}
                showLineNumbers={true}
              />
            </div>

          </Tab>

          <Tab className="flex gap-8" key="go" title="Golang">
            <div className="relative">
              <Button onClick={() => {
                setGoCodeCopied(true);
                navigator.clipboard.writeText(goCode);
                setTimeout(() => setGoCodeCopied(false), 3500);
              }} variant="ghost" className="absolute iconButtonCopy" style={{ right: '7.5px', top: '2.5px', border: "none" }} isIconOnly aria-label="Copy">
                {isGoCodeCopied ? <CheckIcon isWhite /> : <CopyIcon isWhite />}
              </Button>
              <CodeBlock
                language="go"
                text={goCode}
                theme={dracula}
                showLineNumbers={true}
              />
            </div>
          </Tab>
        </Tabs>
        <Button onClick={() => {
          setModalType(AuthModalType.Signup);
          authModal.onOpen();
        }} color="primary" variant="shadow" style={{ display: "block" }} className="mt-4 mb-16">
          Get an API key
        </Button>

        <h3 className="text-lg mb-4">Limits</h3>
        <Table removeWrapper aria-label="Example static collection table" className="mb-16">
          <TableHeader>
            <TableColumn>PLAN</TableColumn>
            <TableColumn>MONTHLY WEB APP LIMIT</TableColumn>
            <TableColumn>MONTHLY API LIMIT (SINGLE)</TableColumn>
            <TableColumn>MONTHLY API LIMIT (BULK)</TableColumn>
          </TableHeader>
          <TableBody>
            <TableRow key="1">
              <TableCell>Free</TableCell>
              <TableCell>500</TableCell>
              <TableCell>30</TableCell>
              <TableCell>Unavailable</TableCell>
            </TableRow>
            <TableRow key="2">
              <TableCell>Premium</TableCell>
              <TableCell>300,000</TableCell>
              <TableCell>10,000</TableCell>
              <TableCell>Unavailable</TableCell>
            </TableRow>
            <TableRow key="3">
              <TableCell>Enterprise</TableCell>
              <TableCell>Unlimited</TableCell>
              <TableCell>Unlimited</TableCell>
              <TableCell>Unlimited</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </>
  );
}