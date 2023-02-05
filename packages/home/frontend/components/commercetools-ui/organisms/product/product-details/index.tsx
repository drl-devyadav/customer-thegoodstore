import React, { FC, useEffect, useState } from 'react';
import { Variant } from '@commercetools/frontend-domain-types/product/Variant';
import Button from 'components/commercetools-ui/atoms/button';
import Dropdown from 'components/commercetools-ui/atoms/dropdown';
import Link from 'components/commercetools-ui/atoms/link';
import Gallery from 'components/commercetools-ui/organisms/gallery';
import { useAddToCartOverlay } from 'context/add-to-cart-overlay';
import useClassNames from 'helpers/hooks/useClassNames';
import { useFormat } from 'helpers/hooks/useFormat';
import { useCart } from 'frontastic';
import AdditionalInfo from './components/additional-info';
import ProductInformation from './components/product-information';
import ShippingSection from './components/shipping-section';
import useTrack from './hooks/useTrack';
import { UIProduct } from './types';

export interface ProductDetailsProps {
  product: UIProduct;
  variant: Variant;
  url?: string;
  onChangeVariant: (sku: string) => void;
  inModalVersion?: boolean;
  setIsOpen?: (value: boolean) => void;
}

const ProductDetails: FC<ProductDetailsProps> = ({
  product,
  variant,
  url,
  onChangeVariant,
  inModalVersion,
  setIsOpen,
}) => {
  const { addItem } = useCart();
  const { formatMessage } = useFormat({ name: 'cart' });

  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const { trackAddToCart } = useTrack({ product, inModalVersion });

  const { show, fetchRelatedProducts } = useAddToCartOverlay();

  const handleQuantityChange = (e: React.FormEvent) => {
    setQuantity(+(e.target as HTMLSelectElement).value);
  };

  const handleAddToCart = async () => {
    setLoading(true);
    addItem(variant, quantity).then(() => {
      setLoading(false);
      setAdded(true);

      setTimeout(() => {
        setAdded(false);
      }, 1000);
    });

    show(product, variant, quantity);

    trackAddToCart();
  };

  useEffect(() => {
    fetchRelatedProducts(product);
  }, [product, fetchRelatedProducts]);

  const wrapperClassName = inModalVersion
    ? 'md:grid grid-cols-12 pt-70 pb-35 px-20 md:pr-36'
    : 'max-w-[1280px] mx-auto pt-16 pb-32 md:grid md:grid-cols-12 md:items-start md:px-24 px-16';

  const galleryContainerClassName = useClassNames([
    inModalVersion ? 'col-span-6' : 'md:col-span-7 lg:col-span-8',
    'md:pr-26 lg:pr-60',
  ]);

  const informationContainerClassName = useClassNames([
    inModalVersion ? 'col-span-6' : 'md:col-span-5 lg:col-span-4',
    'mt-24 md:mt-0',
  ]);

  return (
    <div className={wrapperClassName}>
      <div className={galleryContainerClassName}>
        <Gallery images={variant?.images ?? []} inModalVersion={inModalVersion} />
      </div>

      <div className={informationContainerClassName}>
        <ProductInformation
          product={product}
          variant={variant}
          onChangeVariant={onChangeVariant}
          inModalVersion={inModalVersion}
        />

        <div className="flex gap-8 pt-25">
          <Dropdown
            className="h-full rounded-sm"
            defaultValue="1"
            items={Array(10)
              .fill(0)
              .map((_, index) => {
                const value = `${index + 1}`;
                return {
                  label: value,
                  value,
                };
              })}
            onChange={handleQuantityChange}
          />
          <Button
            className="w-full rounded-sm text-14 font-medium"
            variant="primary"
            onClick={handleAddToCart}
            loading={loading}
            added={added}
          >
            {formatMessage({ id: 'cart.add', defaultMessage: 'Add to cart' })}
          </Button>
        </div>

        {!inModalVersion && <ShippingSection />}

        {inModalVersion && (
          <Link
            link={url}
            className="mx-auto mt-28 block w-fit border-b border-transparent text-center text-14 leading-loose text-secondary-black hover:border-secondary-black"
            onClick={() => setIsOpen?.(false)}
          >
            <a>{formatMessage({ id: 'more.details', defaultMessage: 'More details' })}</a>
          </Link>
        )}
      </div>

      {!inModalVersion && (
        <div className="grid gap-y-34 md:col-span-7 md:mb-50 md:pr-20 lg:col-span-8 lg:pr-52">
          <AdditionalInfo productspec={variant?.attributes?.productspec} description={product?.description} />
        </div>
      )}
    </div>
  );
};

export default ProductDetails;