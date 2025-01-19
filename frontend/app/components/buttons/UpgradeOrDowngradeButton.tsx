import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { stripePublicKey } from '~/constants/stripe';
import { Button } from '@nextui-org/react';
import { useState } from 'react';
import generateStripeCheckout from '~/services/api/generate_stripe_checkout';

const stripePromise = loadStripe(stripePublicKey);

const UpgradeOrDowngradeButton = (props: any) => {
  const { priceId, isDisabled, value } = props
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
    <Elements stripe={stripePromise}>

      <Button isDisabled={isDisabled} isLoading={isLoading} className="mt-7 mb-12" onClick={handleCheckout} color="primary" variant="shadow">
        {value || 'Upgrade'}
      </Button>
    </Elements>
  );
};

export default UpgradeOrDowngradeButton;
