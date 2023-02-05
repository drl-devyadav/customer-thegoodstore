import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Button from 'components/commercetools-ui/atoms/button';
import Radio from 'components/commercetools-ui/atoms/radio';
import { CurrencyHelpers } from 'helpers/currencyHelpers';
import { useFormat } from 'helpers/hooks/useFormat';
import { useCart } from 'frontastic';

export interface Props {
  goToNextStep: () => void;
}

const Shipping: React.FC<Props> = ({ goToNextStep }) => {
  const { formatMessage: formatCheckoutMessage } = useFormat({ name: 'checkout' });
  const { formatMessage: formatCartMessage } = useFormat({ name: 'cart' });

  const { locale } = useRouter();

  const { data, setShippingMethod } = useCart();

  const [selectedId, setSelectedId] = useState('');

  const shippingMethods = useMemo(() => data?.availableShippingMethods ?? [], [data?.availableShippingMethods]);

  useEffect(() => {
    if (shippingMethods?.[0]) setSelectedId(shippingMethods[0].shippingMethodId);
  }, [shippingMethods]);

  const getEstimatedDate = useCallback((days: number) => {
    if (isNaN(days)) return '';

    const date = new Date(Date.now());

    date.setDate(date.getDate() + days);

    return date.toLocaleDateString().replace(/\//g, '-');
  }, []);

  const submit = useCallback(async () => {
    if (!selectedId) return;

    await setShippingMethod(selectedId);
    goToNextStep();
  }, [goToNextStep, setShippingMethod, selectedId]);

  return (
    <div className="lg:px-36 lg:pt-0 lg:pb-36">
      <div className="mt-24 border-x border-t border-neutral-400 border-neutral-400 bg-white">
        {shippingMethods.map((shippingMethod) => (
          <div
            key={shippingMethod.shippingMethodId}
            className="flex items-center justify-between border-b border-neutral-400 p-16"
          >
            <div className="flex items-center gap-16">
              <Radio
                name="checkout-shipping-method"
                checked={shippingMethod.shippingMethodId === selectedId}
                onChecked={() => setSelectedId(shippingMethod.shippingMethodId)}
              />
              <div>
                <p className="text-14 font-medium">{shippingMethod.name}</p>
                <p className="mt-4 text-14 text-secondary-black">
                  Est: {getEstimatedDate(+(shippingMethod.description ?? 0))}
                </p>
              </div>
            </div>

            <span className="text-14 font-medium">
              {CurrencyHelpers.formatForCurrency(shippingMethod.rates?.[0]?.price ?? {}, locale)}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-24">
        <Button variant="primary" className="w-full min-w-[200px] lg:w-fit lg:px-36" type="submit" onClick={submit}>
          {formatCheckoutMessage({ id: 'continue.to', defaultMessage: 'Continue to' })}{' '}
          {formatCartMessage({ id: 'payment', defaultMessage: 'Payment' })}
        </Button>
      </div>
    </div>
  );
};

export default Shipping;