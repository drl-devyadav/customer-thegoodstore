import { useCallback, useEffect, useRef, useState } from 'react';
import { Cart } from '@commercetools/frontend-domain-types/cart/Cart';
import { ShippingMethod } from '@commercetools/frontend-domain-types/cart/ShippingMethod';
import toast from 'react-hot-toast';
import Address from 'components/commercetools-ui/organisms/checkout-adyen/panels/address';
import Checkout from 'components/commercetools-ui/organisms/checkout-adyen/panels/checkout';
import Overview from 'components/commercetools-ui/organisms/checkout-adyen/panels/overview';
import { useFormat } from 'helpers/hooks/useFormat';
import { countryBasedShippingRateIndex } from 'helpers/utils/flattenShippingMethod';
import { Reference } from 'types/reference';
import { useCart } from 'frontastic';
import { mapToCartStructure, mapToFormStructure } from './mapFormData';
import OrderSummary from './order-summary';
import { requiredDataIsValid } from './requiredDataIsValid';

export type FormData = {
  firstName: string;
  lastName: string;
  phone?: string;
  email: string;
  shippingStreetName: string;
  shippingCity: string;
  shippingPostalCode: string;
  shippingCountry: string;
  billingStreetName: string;
  billingCity: string;
  billingPostalCode: string;
  billingCountry: string;
};

export interface CheckoutAdyenProps {
  termsLink?: Reference;
  cancellationLink?: Reference;
  privacyLink?: Reference;
}

const CheckoutAdyen: React.FC<CheckoutAdyenProps> = ({ termsLink, cancellationLink, privacyLink }) => {
  const { data: cartList, updateCart, setShippingMethod } = useCart();
  const { formatMessage } = useFormat({ name: 'cart' });
  const { formatMessage: formatCheckoutMessage } = useFormat({ name: 'checkout' });
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [disableSubmitButton, setDisableSubmitButton] = useState<boolean>(true);
  const [billingIsSameAsShipping, setBillingIsSameAsShipping] = useState<boolean>(true);
  const [currentShippingMethod, setCurrentShippingMethod] = useState<ShippingMethod>();
  const [dataIsValid, setDataIsValid] = useState<boolean>(false);
  const [data, setData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    shippingStreetName: '',
    shippingCity: '',
    shippingPostalCode: '',
    shippingCountry: '',
    billingStreetName: '',
    billingCity: '',
    billingPostalCode: '',
    billingCountry: '',
  });

  const changeStep = (stepIndex: number) => {
    if (currentStepIndex > stepIndex) {
      setCurrentStepIndex(stepIndex);
    }
  };

  const toggleBillingAddressOption = () => {
    setBillingIsSameAsShipping(!billingIsSameAsShipping);
  };

  const generateStepTag = (index: number) => (
    <div
      className={`mx-auto flex h-10 w-10 items-center rounded-full text-lg  text-white ${
        index == currentStepIndex ? `bg-green-500` : 'border-2 border-gray-200 bg-white'
      }`}
    >
      <span className={`w-full text-center ${index == currentStepIndex ? `text-white` : 'text-gray-600'}`}>
        {index + 1}
      </span>
    </div>
  );

  const goToTopOfPage = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const gotToNextStep = () => {
    if (currentStepIndex == 0) {
      updateCartData();
    }

    setCurrentStepIndex(currentStepIndex + 1);
    goToTopOfPage();
  };

  const updateData = (data: FormData) => {
    setData(data);
  };

  const updateCartData = useCallback(() => {
    if (
      countryBasedShippingRateIndex[data.shippingCountry as keyof typeof countryBasedShippingRateIndex] == undefined
    ) {
      toast.error(
        formatCheckoutMessage({
          id: 'taxesNotSupported',
          defaultMessage: 'Taxes are not defined for this country in commercetools',
        }),
      );
      updateData({ ...data, shippingCountry: '' });
      return;
    }

    if (dataIsValid) {
      const updatedData = mapToCartStructure(data, billingIsSameAsShipping);
      updateCart(updatedData);
    }
  }, [billingIsSameAsShipping, data, dataIsValid, formatCheckoutMessage, updateCart]);

  const updatecurrentShippingMethod = (shippingMethod: ShippingMethod) => {
    if (shippingMethod?.shippingMethodId) {
      setCurrentShippingMethod(shippingMethod);
      setShippingMethod(shippingMethod.shippingMethodId);
    }
  };

  const submitButtonLabel = [
    formatMessage({ id: 'goToOverview', defaultMessage: 'Go to overview' }),
    formatMessage({ id: 'ContinueAndPay', defaultMessage: 'Continue and pay' }),
  ];

  const steps = [
    {
      name: formatMessage({ id: 'address', defaultMessage: 'Address' }),
      component: (
        <Address
          data={data}
          updateData={updateData}
          billingIsSameAsShipping={billingIsSameAsShipping}
          toggleBillingAddressOption={toggleBillingAddressOption}
        />
      ),
    },
    {
      name: formatMessage({ id: 'overview', defaultMessage: 'Overview' }),
      component: (
        <Overview
          shippingMethods={cartList?.availableShippingMethods ?? []}
          currentShippingMethod={currentShippingMethod as ShippingMethod}
          onSelectShippingMethod={updatecurrentShippingMethod}
        />
      ),
    },
    { name: formatMessage({ id: 'payment', defaultMessage: 'Payment' }), component: <Checkout /> },
  ];

  useEffect(() => {
    setDataIsValid(requiredDataIsValid(data, billingIsSameAsShipping));
  }, [data, billingIsSameAsShipping]);

  useEffect(() => {
    setDisableSubmitButton(!dataIsValid);
  }, [dataIsValid]);

  useEffect(() => {
    if (data.shippingCountry !== '') {
      updateCartData();
    }
  }, [data.shippingCountry, dataIsValid, updateCartData]);

  useEffect(() => {
    if (!cartList) return;

    const defaultData = mapToFormStructure(cartList);
    if (defaultData && requiredDataIsValid(defaultData, billingIsSameAsShipping)) {
      updateData(defaultData);
    }
  }, [billingIsSameAsShipping, cartList]);

  useEffect(() => {
    if (!currentShippingMethod && cartList?.availableShippingMethods) {
      if (cartList?.shippingInfo) {
        const currentShippingMethod = cartList.availableShippingMethods.find(
          ({ shippingMethodId }) => shippingMethodId == cartList.shippingInfo?.shippingMethodId,
        );
        setCurrentShippingMethod(currentShippingMethod);
      } else {
        setCurrentShippingMethod(cartList?.availableShippingMethods?.[0]);
      }
    }
  }, [cartList?.availableShippingMethods, cartList?.shippingInfo, currentShippingMethod]);

  return (
    <div className="mx-auto max-w-4xl md:mt-4">
      <div>
        <div className="mx-auto py-6">
          <div className="relative flex justify-between py-6 px-5 shadow-md md:px-12" id="ProgressStepper">
            <div className="absolute top-0 left-0 flex h-full w-full items-center justify-between py-6 px-12 ">
              <div className="top-2/4 h-2 w-full bg-green-100"></div>
            </div>
            {steps.map(({ name }, index) => (
              <button key={index} className="relative rounded bg-white p-2" onClick={() => changeStep(index)}>
                {generateStepTag(index)}
                <div className="text-center text-xs 2xl:text-base">{name}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16" ref={containerRef}>
        {steps[currentStepIndex].component}
        <OrderSummary
          cart={cartList as Cart}
          submitButtonLabel={submitButtonLabel[currentStepIndex]}
          disableSubmitButton={disableSubmitButton}
          showDiscountsForm={currentStepIndex < 2}
          showSubmitButton={currentStepIndex < 2}
          onSubmit={gotToNextStep}
          termsLink={termsLink}
          cancellationLink={cancellationLink}
          privacyLink={privacyLink}
        />
      </div>
    </div>
  );
};

export default CheckoutAdyen;