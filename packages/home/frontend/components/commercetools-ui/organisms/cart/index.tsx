import React, { FC, useMemo } from 'react';
import AccordionBtn from 'components/commercetools-ui/atoms/accordion';
import { CurrencyHelpers } from 'helpers/currencyHelpers';
import { useFormat } from 'helpers/hooks/useFormat';
import { useCart } from 'frontastic';
import { NextFrontasticImage } from 'frontastic/lib/image';
import DiscountForm from '../discount-form';
import { EmptyState } from '../empty-state';
import { Link } from '../header/types';
import CartItem from './item';

export interface Props {
  emptyStateImage: NextFrontasticImage;
  emptyStateTitle: string;
  emptyStateSubtitle: string;
  emptyStateCategories: Link[];
}

const Cart: FC<Props> = ({ emptyStateImage, emptyStateTitle, emptyStateSubtitle, emptyStateCategories }) => {
  //i18n messages
  const { formatMessage: formatCartMessage } = useFormat({ name: 'cart' });

  const { data } = useCart();

  const transaction = useMemo(() => {
    if (!data?.lineItems)
      return {
        subtotal: { centAmount: 0 },
        discount: { centAmount: 0 },
        tax: { centAmount: 0 },
        shipping: { centAmount: 0 },
        total: { centAmount: 0 },
      };

    const currencyCode = data.sum.currencyCode;
    const fractionDigits = data.sum.fractionDigits;

    const totalAmount = data.sum.centAmount;
    const subTotalAmount = data.lineItems.reduce((acc, curr) => acc + (curr.price?.centAmount || 0) * curr.count, 0);
    const discountedAmount = data.lineItems.reduce(
      (acc, curr) => acc + ((curr.price?.centAmount || 0) * curr.count - (curr.totalPrice?.centAmount || 0)),
      0,
    );

    const totalTax = data.taxed?.taxPortions?.reduce((acc, curr) => acc + curr.amount?.centAmount, 0) ?? 0;
    const totalShipping =
      data.sum.centAmount > 0 ? data.availableShippingMethods?.[0]?.rates?.[0]?.price.centAmount ?? 0 : 0;

    return {
      subtotal: {
        centAmount: subTotalAmount,
        currencyCode,
        fractionDigits,
      },
      discount: {
        centAmount: discountedAmount,
        currencyCode,
        fractionDigits,
      },
      shipping: {
        centAmount: totalShipping,
        currencyCode,
        fractionDigits,
      },
      tax: {
        centAmount: totalTax,
        currencyCode,
        fractionDigits,
      },
      total: {
        centAmount: totalAmount + totalTax + totalShipping,
        currencyCode,
        fractionDigits,
      },
    };
  }, [data]);

  return (
    <>
      {data.lineItems?.length === 0 ? (
        <EmptyState
          categories={emptyStateCategories}
          image={emptyStateImage}
          title={emptyStateTitle}
          subtitle={emptyStateSubtitle}
        />
      ) : (
        <div className="grow divide-y divide-neutral-400 overflow-auto px-12 md:px-22">
          {data.lineItems?.map((lineItem) => (
            <CartItem key={lineItem.lineItemId} item={lineItem} />
          ))}
        </div>
      )}
      <div className="border-t border-neutral-400 px-12 py-24 md:px-22">
        <AccordionBtn
          closedSectionTitle={formatCartMessage({ id: 'discount.apply', defaultMessage: 'Apply a discount' })}
          buttonClassName="font-medium text-14 text-secondary-black"
        >
          <DiscountForm />
        </AccordionBtn>
      </div>
      <div className="border-t border-neutral-400 bg-white px-12 pt-16 pb-18 md:px-22">
        <div className="flex items-center justify-between text-14">
          <span>{formatCartMessage({ id: 'subtotal', defaultMessage: 'Subtotal' })} </span>
          <span>{CurrencyHelpers.formatForCurrency(transaction.subtotal)}</span>
        </div>

        {transaction.discount.centAmount > 0 && (
          <div className="flex items-center justify-between text-14">
            <span>{formatCartMessage({ id: 'discount', defaultMessage: 'Discount' })} </span>
            <span>{CurrencyHelpers.formatForCurrency(transaction.discount)}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-14">
          <span>{formatCartMessage({ id: 'tax', defaultMessage: 'Tax' })} </span>
          <span>{CurrencyHelpers.formatForCurrency(transaction.tax)}</span>
        </div>

        {transaction.shipping.centAmount > 0 && (
          <div className="flex items-center justify-between text-14">
            <span>{formatCartMessage({ id: 'shipping.estimate', defaultMessage: 'Est. Shipping' })} </span>
            <span>{CurrencyHelpers.formatForCurrency(transaction.shipping)}</span>
          </div>
        )}

        <div className="mt-26 flex items-center justify-between font-medium">
          <span>{formatCartMessage({ id: 'total', defaultMessage: 'Total' })}: </span>
          <span>{CurrencyHelpers.formatForCurrency(transaction.total)}</span>
        </div>

        <div className="mt-16">
          <button className="w-full rounded-md bg-primary-black py-12 font-medium text-white">
            {formatCartMessage({ id: 'checkout.go', defaultMessage: 'Go to checkout' })}
          </button>
        </div>
      </div>
    </>
  );
};
export default Cart;
