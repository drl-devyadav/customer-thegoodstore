import useSWR, { mutate } from 'swr';
import { revalidateOptions } from 'frontastic';
import { SDK } from 'sdk';
import { sdk } from '@commercetools/frontend-sdk';
import { LineItem } from '@commercetools/frontend-domain-types/wishlist/LineItem';
import { Wishlist } from '@commercetools/frontend-domain-types/wishlist/Wishlist';

export const getWishlist = () => {
  const extensions = SDK.getExtensions();

  const result = useSWR('/action/wishlist/getWishlist', extensions.wishlist.getWishlist, revalidateOptions);

  return { ...result, data: (result as any).data?.data };
};

export const addToWishlist = async (wishlist: Wishlist, lineItem: LineItem, count = 1) => {
  const extensions = SDK.getExtensions();
  const newWishlist = { ...wishlist, lineItems: [...wishlist.lineItems, lineItem] };
  const res = extensions.wishlist.addItem({ variant: { sku: lineItem.variant.sku }, count });

  await mutate('/action/wishlist/getWishlist', res, {
    optimisticData: { data: newWishlist },
    rollbackOnError: true,
  });
};

export const removeLineItem = async (wishlist: Wishlist, lineItem: LineItem) => {
  const extensions = SDK.getExtensions();
  const newWishlist = {
    ...wishlist,
    lineItems: wishlist.lineItems.filter((item) => item.lineItemId !== lineItem.lineItemId),
  };

  const res = extensions.wishlist.removeItem({ lineItem: { id: lineItem.lineItemId } });
  await mutate('/action/wishlist/getWishlist', res, {
    optimisticData: { data: newWishlist },
    rollbackOnError: true,
  });
};

export const clearWishlist = async (wishlist: Wishlist) => {
  const res = sdk.callAction({ actionName: 'wishlist/clearWishlist' });
  const newWishlist = {
    ...wishlist,
    lineItems: [],
  };

  await mutate('/action/wishlist/getWishlist', (res as any).data, {
    optimisticData: { data: newWishlist },
    rollbackOnError: true,
  });
};

export const updateLineItem = async (wishlist: Wishlist, lineItem: LineItem, count = 1) => {
  const extensions = SDK.getExtensions();
  const newWishlist = {
    ...wishlist,
    lineItems: wishlist.lineItems.map((item) => {
      if (item.lineItemId === lineItem.lineItemId) {
        return { ...lineItem, count: ++count };
      }
    }),
  };

  const res = extensions.wishlist.updateItem({ lineItem: { id: lineItem.lineItemId }, count });
  await mutate('/action/wishlist/getWishlist', (res as any).data, {
    optimisticData: newWishlist,
    rollbackOnError: true,
  });
};
