import { Button } from "@nextui-org/react";
import { useState } from "react";

export default function MicrosoftAuthButton(props: any) {
  const { customText } = props;
  const [isLoading, setLoading] = useState(false);
  return (
    <div>
      <Button className='w-full' isDisabled style={{ justifyContent: 'flex-start' }} isLoading={isLoading} onClick={() => { }} variant="bordered" color="primary"
      // startContent={!customText && <ZohoIcon />}
      >
        {isLoading ? 'Loading...' : customText ?? 'Log in with Microsoft'}
      </Button>
    </div>
  )
}
