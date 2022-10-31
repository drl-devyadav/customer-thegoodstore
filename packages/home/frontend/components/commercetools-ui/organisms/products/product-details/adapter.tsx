import { useState, useEffect, FC } from 'react';
import { useRouter } from 'next/router';
import { Product } from '@Types/product/Product';
import { Variant } from '@Types/product/Variant';
import { UIProduct } from 'components/commercetools-ui/organisms/products/product-details/types';
import usePreloadImages from 'helpers/hooks/usePreloadImages';
import { toUIColor } from 'helpers/mappers/toUIColor';
import { toUIProduct } from 'helpers/mappers/toUIProduct';
import { toUISize } from 'helpers/mappers/toUIsize';
import { useWishlist } from 'frontastic';
import ProductDetails, { ProductDetailsProps } from '.';

type ProductDetailsAdapterProps = {
  product: Product;
  inModalVersion?: ProductDetailsProps['inModalVersion'];
  setIsOpen?: (value: boolean) => void;
};

const ProductDetailsAdapter: FC<ProductDetailsAdapterProps> = ({ product, inModalVersion, setIsOpen }) => {
  const router = useRouter();
  const wishlist = useWishlist();

  const [variant, setVariant] = useState<Variant>();
  const [mappedProduct, setMappedProduct] = useState<UIProduct>();

  usePreloadImages(product.variants.map((variant) => variant.images).flat());

  useEffect(() => {
    if (product && variant) {
      const colors = toUIColor(product);
      const sizes = toUISize(product);
      const productToUse = toUIProduct(product, variant, colors, sizes);
      setMappedProduct({ ...productToUse, images: [productToUse.images[0]] });
    }
  }, [product, variant]);

  useEffect(() => {
    if (!product) return;

    if (inModalVersion) {
      setVariant(product?.variants[0]);
    } else {
      const currentVariantPath = router.asPath.split('/');
      const currentVariantSKU = currentVariantPath[3];
      const currentVariantIndex = product?.variants.findIndex(({ sku }) => sku == currentVariantSKU);
      setVariant(product.variants[currentVariantIndex]);
    }
  }, [inModalVersion, product, router.asPath]);

  useEffect(() => {
    router.beforePopState(({ as }) => {
      router.replace(as);
      return false;
    });
  }, []);

  const handleAddToWishList = () => {
    wishlist.addToWishlist(variant.sku, 1);
  };

  const handleRemoveFromWishlist = () => {
    const item = wishlist.data.lineItems.find(({ variant: { sku } }) => sku === variant.sku);
    wishlist.removeLineItem(item?.lineItemId);
  };

  const handleChangeVariant = (sku: string) => {
    const variantsToUse = product.variants.find((variant) => variant.sku === sku);
    setVariant(variantsToUse);
  };

  if (!product || !variant) return <></>;

  return (
    <>
      <ProductDetails
        product={mappedProduct}
        variant={variant}
        url={product._url}
        onAddToWishlist={handleAddToWishList}
        onRemoveFromWishlist={handleRemoveFromWishlist}
        inModalVersion={inModalVersion}
        onChangeVariant={handleChangeVariant}
        setIsOpen={setIsOpen}
      />
    </>
  );
};

export default ProductDetailsAdapter;