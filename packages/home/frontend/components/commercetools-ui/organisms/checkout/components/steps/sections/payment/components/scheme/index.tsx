import React, { useCallback, useMemo } from 'react';
import Input from 'components/commercetools-ui/atoms/input';
import Select, { Option } from 'components/commercetools-ui/atoms/select';
import useResolveCCImage from 'components/commercetools-ui/organisms/checkout/hooks/useResolveCCImage';
import { useCheckout } from 'components/commercetools-ui/organisms/checkout/provider';
import { PaymentData, SchemeData } from 'components/commercetools-ui/organisms/checkout/provider/payment/types';
import { useFormat } from 'helpers/hooks/useFormat';

const Scheme = () => {
  const { formatMessage: formatCheckoutMessage } = useFormat({ name: 'checkout' });

  const { paymentData, setPaymentData } = useCheckout();

  const resolveCCImage = useResolveCCImage();

  const expiryDateOptions = useMemo(() => {
    const now = new Date();

    let month = now.getMonth() + 1;
    let year = now.getFullYear();

    const options = [] as Option[];

    while (year < now.getFullYear() + 10) {
      options.push({
        name: `${month} / ${year.toString().slice(2)}`,
        value: `${month}/${year}`,
      });

      if (month == 12) (month = 1), (year += 1);
      else month += 1;
    }

    return options;
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPaymentData({ ...paymentData, [e.target.name as keyof PaymentData]: e.target.value } as SchemeData);
    },
    [paymentData, setPaymentData],
  );

  const handleCardNumberChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.target.value = e.target.value.replace(/(\d{4})(?=\d+)/g, '$1 ').trim();

      setPaymentData({ ...paymentData, number: e.target.value.replace(/\s/g, '') } as SchemeData);
    },
    [paymentData, setPaymentData],
  );

  const handleExpiryDateChange = useCallback(
    (option: Option) => {
      const date = option.value.toString();

      const [expiryMonth, expiryYear] = date.split('/');

      setPaymentData({ ...paymentData, expiryMonth, expiryYear } as SchemeData);
    },
    [paymentData, setPaymentData],
  );

  const handleCVCChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.target.value = e.target.value.slice(0, 4);

      setPaymentData({ ...paymentData, cvc: e.target.value } as SchemeData);
    },
    [paymentData, setPaymentData],
  );

  if (paymentData.type !== 'scheme') return <></>;

  return (
    <div className="pt-24 md:max-w-[436px] md:pl-36">
      <Input
        name="holderName"
        className="mt-16 sm:px-8"
        labelPosition="inline"
        placeholder={formatCheckoutMessage({ id: 'card.holder', defaultMessage: 'Card holder' })}
        onChange={handleChange}
        defaultValue={paymentData.holderName}
      />
      <div className="relative mt-16">
        <Input
          className="sm:px-8"
          labelPosition="inline"
          placeholder={formatCheckoutMessage({ id: 'card.number', defaultMessage: 'Card number' })}
          onChange={handleCardNumberChange}
          isValid={!!(paymentData.number && paymentData.number.length >= 12 && paymentData.number.length <= 19)}
          defaultValue={paymentData.number}
        />
        {resolveCCImage(paymentData.number) && (
          // eslint-disable-next-line
          <img
            className="absolute top-1/2 right-8 w-[32px] -translate-y-1/2"
            src={resolveCCImage(paymentData.number)}
          />
        )}
      </div>
      <div className="mt-16 flex gap-8">
        <div className="grow md:flex-1">
          <Select
            options={expiryDateOptions}
            onChange={handleExpiryDateChange}
            defaultValue={
              paymentData.expiryMonth && paymentData.expiryYear
                ? {
                    name: `${paymentData.expiryMonth} / ${paymentData.expiryYear.slice(2)}`,
                    value: `${paymentData.expiryMonth}/${paymentData.expiryYear}`,
                  }
                : { name: 'MM / YY', value: 'MM/YY' }
            }
          />
        </div>
        <div className="relative grow md:flex-1">
          <Input
            className="sm:px-8"
            labelPosition="inline"
            type="number"
            placeholder={formatCheckoutMessage({ id: 'card.securityNumber', defaultMessage: 'Security number' })}
            onChange={handleCVCChange}
            defaultValue={paymentData.cvc}
          />
          {/* eslint-disable-next-line */}
          <img className="absolute top-1/2 right-8 w-[32px] -translate-y-1/2" src="/images/cvc.png" />
        </div>
      </div>
    </div>
  );
};

export default Scheme;
