import { Button, Snippet, Tab, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tabs } from "@nextui-org/react";
import type { MetaFunction } from "@remix-run/node";
import { useContext } from "react";
import { siteName } from "~/constants/app";
import AuthModalContext from "~/contexts/AuthModalContext";
import { AuthModalType } from "~/types/modal";

export const meta: MetaFunction = () => {
  return [
    { title: `${siteName} - API` },
    { name: "description", content: "Welcome to Remix! - API" },
  ];
};

export default function Api() {
  const { authModal, setModalType } = useContext(AuthModalContext);

  return (
    <>
      <div className="py-8 px-6">

        <div className="flex flex-col items-center mb-12">
          <h2 className="text-2xl">API</h2>
        </div>

        <h3 className="text-lg mb-4">Limits</h3>

        <Table removeWrapper aria-label="Example static collection table" className="mb-12">
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

        <h3 className="text-lg mb-4">Generating a bearer token from an API key</h3>

        <Tabs aria-label="Get bearer token" className="justify-center">
          <Tab className="flex gap-8" key="terminal" title="Terminal">
            <Snippet>
              <span>curl -X GET \</span>
              <span>-H "X-API-Key: YourApiKeyHere" \</span>
              <span>-H "Content-Type: application/json" \</span>
              <span>https://api.email-validator.com/v1/token</span>
            </Snippet>
          </Tab>

          <Tab className="flex gap-8" key="node" title="Node.js (Typescript)">
            <Snippet>
              <span>import axios from 'axios';</span>
              <span></span>
              <span>async function getToken(): Promise&lt;string&gt; {'{'}</span>
              <span className="pl-4">try {'{'}</span>
              <span className="pl-8">const response = await axios.post('https://api.email-validator.com/v1/get_token', {'{'}</span>
              <span className="pl-12">headers: {'{'}</span>
              <span className="pl-16">'X-API-Key': 'YourApiKeyHere',</span>
              <span className="pl-16">'Content-Type': 'application/json'</span>
              <span className="pl-12">{'}'}</span>
              <span className="pl-8">{'}'});</span>
              <span></span>
              <span className="pl-8">return response.data.token;</span>
              <span className="pl-4">{'}'} catch (error) {'{'}</span>
              <span className="pl-12">console.error('Error fetching token:', error);</span>
              <span className="pl-12">throw error;</span>
              <span className="pl-4">{'}'}</span>
              <span>{'}'}</span>
            </Snippet>
          </Tab>

          <Tab className="flex gap-8" key="go" title="Golang">
            <Snippet>
              <span>package main</span>
              <span></span>
              <span>import (</span>
              <span className="pl-4">"fmt"</span>
              <span className="pl-4">"net/http"</span>
              <span className="pl-4">"io"</span>
              <span>)</span>
              <span></span>
              <span>func main() {'{'}</span>
              <span className="pl-4">req, _ := http.NewRequest("GET", "https://api.email-validator.com/v1/token", nil)</span>
              <span className="pl-4">req.Header.Add("X-API-Key", "YourApiKeyHere")</span>
              <span className="pl-4">req.Header.Add("Content-Type", "application/json")</span>
              <span className="pl-4"></span>
              <span className="pl-4">client := &http.Client{'{}'}</span>
              <span className="pl-4">resp, _ := client.Do(req)</span>
              <span></span>
              <span className="pl-4">defer resp.Body.Close()</span>
              <span className="pl-4">body, _ := io.ReadAll(resp.Body)</span>
              <span className="pl-4"></span>
              <span className="pl-4">fmt.Println(string(body))</span>
              <span>{'}'}</span>
            </Snippet>
          </Tab>
        </Tabs>


        <Button onClick={() => {
          setModalType(AuthModalType.Signup);
          authModal.onOpen();
        }} color="primary" variant="shadow" style={{ display: "block" }} className="mt-4 mb-16">
          Generate API key
        </Button>

        <h3 className="text-lg mb-4">API reference</h3>

        <p className="mb-8">Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia,
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
      </div>
    </>
  );
}