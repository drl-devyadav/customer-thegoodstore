import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Button from 'components/commercetools-ui/atoms/button';
import { useFormat } from 'helpers/hooks/useFormat';
import { useCheckout } from '../../provider';
import CreateAddressModal from '../create-address-modal';
import Step from '../step';
import AddressesPreview from './previews/addresses';
import PaymentPreview from './previews/payment';
import ShippingPreview from './previews/shipping';
import Addresses from './sections/addresses';
import Payment from './sections/payment';
import Shipping from './sections/shipping';

interface Props {
  onPurchase: () => void;
  onFinalStepChange: (isFinalStep: boolean) => void;
}

const Steps: React.FC<Props> = ({ onPurchase, onFinalStepChange }) => {
  const { formatMessage: formatCartMessage } = useFormat({ name: 'cart' });
  const { formatMessage: formatCheckoutMessage } = useFormat({ name: 'checkout' });

  const router = useRouter();

  const { processing } = useCheckout();

  const [active, setActive] = useState<number>(0);

  const goToNextStep = useCallback(() => {
    setActive(active + 1);
    router.push({ pathname: router.asPath.split('?').shift(), query: { step: active + 1 } }, undefined, {
      shallow: true,
    });
  }, [active, router]);

  useEffect(() => {
    if (router.query.step) setActive(+router.query.step);
    else setActive(0);
  }, [router.query.step]);

  const onEdit = useCallback((index: number) => setActive(index), []);

  const steps = useMemo(() => {
    return [
      {
        label: formatCartMessage({ id: 'addresses', defaultMessage: 'Addresses' }),
        Component: <Addresses goToNextStep={goToNextStep} />,
        Preview: <AddressesPreview />,
        CTA: <CreateAddressModal />,
      },
      {
        label: formatCartMessage({ id: 'shipping', defaultMessage: 'Shipping' }),
        Component: <Shipping goToNextStep={goToNextStep} />,
        Preview: <ShippingPreview />,
      },
      {
        label: formatCartMessage({ id: 'payment', defaultMessage: 'Payment' }),
        Component: <Payment goToNextStep={goToNextStep} />,
        Preview: <PaymentPreview />,
      },
    ];
  }, [formatCartMessage, goToNextStep]);

  const isFinalStep = useMemo(() => active === steps.length, [active, steps.length]);

  useEffect(() => {
    onFinalStepChange(isFinalStep);
  }, [isFinalStep, onFinalStepChange]);

  return (
    <div className="px-16 md:px-24 lg:grow lg:px-0">
      <div className="flex flex-col gap-24 lg:bg-neutral-200">
        {steps.map(({ Component, Preview, label, CTA }, index) => (
          <Step
            key={index}
            label={label}
            number={index + 1}
            isExpanded={index === active}
            isCompleted={index < active}
            onEdit={() => onEdit(index)}
            Component={Component}
            Preview={Preview}
            CTA={CTA}
          />
        ))}
      </div>
      {isFinalStep && (
        <div className="mt-24 lg:hidden">
          <Button variant="primary" className="w-full" type="submit" onClick={onPurchase} loading={processing}>
            {formatCheckoutMessage({ id: 'complete.purchase', defaultMessage: 'Complete purchase' })}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Steps;
