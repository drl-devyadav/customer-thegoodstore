import React, { useCallback, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { Product } from '@commercetools/frontend-domain-types/product/Product';
import { Variant } from '@commercetools/frontend-domain-types/product/Variant';
import { Transition } from '@headlessui/react';
import { XMarkIcon as CloseIcon } from '@heroicons/react/24/solid';
import Link from 'components/commercetools-ui/atoms/link';
import Overlay from 'components/commercetools-ui/atoms/overlay';
import ProductSlider from 'components/commercetools-ui/organisms/products/slider';
import { CurrencyHelpers } from 'helpers/currencyHelpers';
import { useFormat } from 'helpers/hooks/useFormat';
import useTouchDevice from 'helpers/hooks/useTouchDevice';
import { mediumDesktop, tablet } from 'helpers/utils/screensizes';
import { useProduct } from 'frontastic';
import Image from 'frontastic/lib/image';
import { AddToCartOverlayContextShape, StateProduct } from './types';

const AddToCartOverlayContext = React.createContext<AddToCartOverlayContextShape>({
  show() {},
  hide() {},
  fetchRelatedProducts() {
    return new Promise((res) => res());
  },
});

const AddToCartOverlayProvider: React.FC = ({ children }) => {
  const router = useRouter();

  const { isTouchDevice } = useTouchDevice();

  const { formatMessage: formatProductMessage } = useFormat({ name: 'product' });
  const { formatMessage: formatCartMessage } = useFormat({ name: 'cart' });

  const { query } = useProduct();

  const [product, setProduct] = useState<StateProduct>();

  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  const fetchRelatedProducts = useCallback(
    async (product: Product) => {
      const category = product?.categories?.[0]?.categoryId;

      if (!category) return;

      const response = await query({ category, limit: 15 });

      if (response.isError) return;

      setRelatedProducts(response.data.items as Product[]);
    },
    [query],
  );

  const show = useCallback((product: Product, variant: Variant, count: number) => {
    setProduct({ ...product, ...variant, count });
  }, []);

  const hide = useCallback(() => {
    setProduct(undefined);
  }, []);

  return (
    <>
      {product && <Overlay onClick={hide} />}
      <Transition
        show={!!product}
        className="fixed bottom-0 z-[9999] w-full rounded-[20px_20px_0_0] bg-white md:left-1/2 md:bottom-[unset] md:top-1/2 md:w-[90%] md:max-w-[800px] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-lg"
        enter="transition md:transition-opacity duration-75"
        enterFrom="opacity-0 translate-y-full"
        enterTo="opacity-100 translate-y-0"
        leave="transition md:transition-opacity duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-full"
      >
        <div className="bg-white p-16 md:py-24 md:px-48">
          <h4 className="text-18 leading-[27px] lg:text-22">
            {formatProductMessage({ id: 'cart.added', defaultMessage: 'Added to cart' })}
          </h4>

          <CloseIcon
            className="absolute right-[18px] top-[16px] h-28 w-28 cursor-pointer fill-secondary-black stroke-0 md:top-[16px]"
            onClick={hide}
          />

          <div className="mt-22 md:mt-35 lg:mt-30">
            <div className="flex items-center gap-24">
              <div className="shrink-0">
                <Image
                  width={135}
                  height={150}
                  src={product?.images?.[0] ?? '#'}
                  layout="intrinsic"
                  objectFit="contain"
                />
              </div>
              <div className="flex grow items-start justify-between overflow-hidden">
                <div className="max-w-full overflow-hidden">
                  <span className="block max-w-full truncate text-12 md:text-14">{product?.name}</span>
                  <span className="mt-8 block text-12 font-medium md:hidden">
                    {CurrencyHelpers.formatForCurrency(product?.discountedPrice ?? product?.price ?? {}, router.locale)}
                  </span>
                  <span className="mt-12 block text-14 text-secondary-black">x {product?.count}</span>
                </div>
                <span className="hidden text-14 font-medium md:block">
                  {CurrencyHelpers.formatForCurrency(product?.discountedPrice ?? product?.price ?? {}, router.locale)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-18 flex w-full flex-col gap-16 md:mt-36 md:flex-row-reverse">
            <Link link="/cart" onClick={hide} className="md:flex-1">
              <button className="w-full rounded-sm bg-primary-black p-12 text-14 font-medium text-white">
                {formatCartMessage({ id: 'cart.go', defaultMessage: 'Go to cart' })}
              </button>
            </Link>
            <Link link="/" onClick={hide} className="md:flex-1">
              <button className="w-full rounded-sm border border-primary-black p-12 text-14 font-medium text-primary-black transition hover:border-secondary-black hover:text-secondary-black">
                {formatCartMessage({ id: 'continue.shopping', defaultMessage: 'Continue shopping' })}
              </button>
            </Link>
          </div>
        </div>
        <div className={`mt-36 hidden bg-neutral-200 py-24 md:block ${isTouchDevice ? 'px-48' : 'px-96'}`}>
          <ProductSlider
            wrapperVariant="none"
            clearDefaultWrapperStyles
            products={relatedProducts}
            title={formatProductMessage({ id: 'bought.together', defaultMessage: 'Frequently bought together' })}
            titleVariant="sm"
            breakpoints={{
              [tablet]: {
                slidesPerView: 3.4,
              },
              [mediumDesktop]: {
                slidesPerView: 3,
              },
            }}
          />
        </div>
      </Transition>
      <AddToCartOverlayContext.Provider value={{ show, hide, fetchRelatedProducts }}>
        {children}
      </AddToCartOverlayContext.Provider>
    </>
  );
};

export default AddToCartOverlayProvider;

export const useAddToCartOverlay = () => useContext(AddToCartOverlayContext);