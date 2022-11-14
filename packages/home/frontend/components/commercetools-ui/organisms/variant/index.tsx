import { FC, useEffect, useState } from 'react';
import { Variant as VariantType } from '@commercetools/domain-types/product/Variant';
import { useFormat } from 'helpers/hooks/useFormat';
import { discardRepeatedValues } from 'helpers/utils/discardRepeatedValues';

type VariantProps = {
  className?: string;
  currentVariant: VariantType;
  variants: VariantType[];
  attribute: keyof VariantType['attributes'];
  onClick?: (sku: string) => void;
};

const Variant: FC<VariantProps> = ({ className, currentVariant, variants, attribute, onClick }) => {
  const { formatMessage } = useFormat({ name: 'product' });

  const [variantsToUse, setVariantsToUse] = useState<VariantType[]>();

  const attributeString = attribute.toString();

  useEffect(() => {
    const filteredVariants: VariantType[] = discardRepeatedValues(variants, attribute.toString());
    setVariantsToUse(filteredVariants);
  }, [variants, attribute]);

  return (
    <div className={className}>
      <div>
        <p className="font-body text-14 font-medium capitalize leading-loose">
          {formatMessage({ id: attributeString, defaultMessage: attributeString })}
        </p>
        <p className="font-body text-12 font-regular leading-loose">
          {currentVariant?.attributes?.[`${attribute}label`]}
        </p>
      </div>

      <div className="mt-15 flex gap-24">
        {variantsToUse?.map(({ attributes, id, sku }, index) => (
          <div
            key={index}
            className={`h-20 w-20 rounded-full ${
              id == currentVariant.id ? 'border-2 border-neutral-800' : 'border border-neutral-300'
            } border border-neutral-300 ${variantsToUse.length > 1 ? 'hover:cursor-pointer' : 'pointer-events-none'} `}
            style={{ backgroundColor: attributes[attribute] }}
            onClick={() => onClick?.(sku)}
          />
        ))}
      </div>
    </div>
  );
};

export default Variant;
