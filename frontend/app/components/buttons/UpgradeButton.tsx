import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { stripePublicKey } from '~/constants/stripe';
import { Button } from '@nextui-org/react';
import { useState } from 'react';
import generateStripeCheckout from '~/services/api/generate_stripe_checkout';

const stripePromise = loadStripe(stripePublicKey);

const Checkout = ({ priceId }: any) => {
  const [isLoading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)

    const res = await generateStripeCheckout({ priceId })
    const stripe = await stripePromise;

    await stripe?.redirectToCheckout({ sessionId: res.id });

    setLoading(false)
  };

  return (
    <Button isLoading={isLoading} className="mt-7 mb-12" onClick={handleCheckout} color="primary" variant="shadow">
      Upgrade
    </Button>
  );
};

const UpgradeAccountButton = (props: any) => {
  const { priceId } = props
  return (
    <Elements stripe={stripePromise}>
      <Checkout priceId={priceId} />
    </Elements>
  )
};

export default UpgradeAccountButton;
