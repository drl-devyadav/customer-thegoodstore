import { Variant } from '@Types/product/Variant';

export const discardRepeatedValues = (variants: Variant[], attribute: string) => {
  const uniqueValues: { [key: string]: boolean } = {};

  const variantsToDisplay = variants?.filter((variant) => {
    const value = variant.attributes[attribute];

    if (uniqueValues[value]) return false;
    else {
      uniqueValues[value] = true;
      return true;
    }
  });

  return variantsToDisplay;
};