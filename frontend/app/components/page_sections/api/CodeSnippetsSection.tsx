import { Tabs, Tab, Button, Snippet } from "@nextui-org/react";
import { useState } from "react";
import { CodeBlock, dracula } from "react-code-blocks";
import { apiBaseUrl } from "~/constants/api"
import CheckIcon from "~/components/icons/CheckIcon";
import CopyIcon from "~/components/icons/CopyIcon";

const tsCode = `import axios, { AxiosResponse } from 'axios';

async function getToken(): Promise<string | null> {
    try {
        const response: AxiosResponse = await axios.get('${apiBaseUrl}/token', {
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
)

type TokenResponse struct {
    Token string \`json:"token"\`
}

func GetToken() (*string, error) {
    req, err := http.NewRequest("GET", "${apiBaseUrl}/token", nil)
    if err != nil {
        return nil, err
    }
    
    req.Header.Set("X-API-Key", "YourApiKeyHere")
    req.Header.Set("Content-Type", "application/json")

    resp, err := http.DefaultClient.Do(req)
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

export default function CodeSnippetsSection() {
    const [isTsCodeCopied, setTsCodeCopied] = useState(false);
    const [isGoCodeCopied, setGoCodeCopied] = useState(false);

    return (
        <>
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
                <Tab className="flex gap-8" key="terminal" title="Terminal (bash)">
                    <Snippet>
                        <span>curl -X GET \</span>
                        <span>-H "X-API-Key: YourApiKeyHere" \</span>
                        <span>-H "Content-Type: application/json" \</span>
                        <span>{apiBaseUrl}/token</span>
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
        </>
    )
}