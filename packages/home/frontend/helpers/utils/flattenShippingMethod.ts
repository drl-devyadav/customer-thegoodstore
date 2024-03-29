import { FlattenedShippingMethod } from '@commercetools/frontend-domain-types/cart/FlattenedShippingMethod';
import { ShippingMethod } from '@commercetools/frontend-domain-types/cart/ShippingMethod';
import { Money } from '@commercetools/frontend-domain-types/product/Money';

export const countryBasedShippingRateIndex = {
  SI: 0,
  SK: 0,
  CH: 0,
  AT: 0,
  PL: 0,
  CZ: 0,
  GB: 0,
  HU: 0,
  DE: 0,
  ES: 1,
  PT: 1,
  US: 2,
  CA: 2,
};

export const flattenShippingMethod = (method: ShippingMethod, country: string) => {
  const updatedMethod: FlattenedShippingMethod = {
    ...method,
    price: method?.rates?.[
      countryBasedShippingRateIndex[country as keyof typeof countryBasedShippingRateIndex] as number
    ]?.price as Money,
  };

  return updatedMethod;
};
