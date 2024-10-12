import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { stripePublicKey } from '~/constants/stripe';
import { Button } from '@nextui-org/react';
import { useState } from 'react';
import generateStripeCheckout from '~/services/api/generate_stripe_checkout';

const stripePromise = loadStripe(stripePublicKey);

const Checkout = (props: any) => {
  const { priceId, disabled, value } = props
  const [isLoading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)

    try {
      const res = await generateStripeCheckout({ priceId })
      const stripe = await stripePromise;

      await stripe?.redirectToCheckout({ sessionId: res.id });
    } catch { }

    setLoading(false)
  };

  return (
    <Button isDisabled={disabled} isLoading={isLoading} className="mt-7 mb-12" onClick={handleCheckout} color="primary" variant="shadow">
      {value || 'Upgrade'}
    </Button>
  );
};

const Cta = (props: any) => {
  const { priceId, value, disabled } = props
  return (
    <Elements stripe={stripePromise}>
      <Checkout priceId={priceId} value={value} disabled={disabled} />
    </Elements>
  )
};

export default Cta;
