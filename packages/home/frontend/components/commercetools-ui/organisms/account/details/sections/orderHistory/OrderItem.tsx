import React, { FC } from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import Button from 'components/commercetools-ui/atoms/button';
import Typography from 'components/commercetools-ui/atoms/typography';
import { useFormat } from 'helpers/hooks/useFormat';

export interface OrderItem {
  id: string;
  date: string;
  total: string;
  status: string;
}

interface Props {
  order: OrderItem;
}

const OrderItem: FC<Props> = ({ order }) => {
  const { formatMessage: formatOrdersMessage } = useFormat({ name: 'orders' });
  return (
    <div className="mb-24 h-170 w-full rounded-md border-[1.5px] border-neutral-300">
      <div className="flex h-110 items-center justify-between rounded-t-md bg-neutral-150 px-24">
        <div className="flex-col">
          <div className="flex pb-15">
            <Typography fontSize={16} medium className="text-primary-black">
              {formatOrdersMessage({ id: 'order.id', defaultMessage: 'Order ID: ' })}
            </Typography>
            <Typography fontSize={16} className="pl-5 text-primary-black">
              {order.id}
            </Typography>
          </div>

          <div className="flex">
            <Typography fontSize={16} medium className="flex text-primary-black md:hidden">
              {formatOrdersMessage({ id: 'order.date', defaultMessage: 'Date:' })}
            </Typography>
            <Typography fontSize={14} className="pl-5 pt-2 text-secondary-black md:pl-0">
              {order.date}
            </Typography>
          </div>
        </div>

        <div className="hidden md:flex md:flex-col">
          <Typography fontSize={16} medium className="pb-15 text-primary-black">
            {formatOrdersMessage({ id: 'total', defaultMessage: 'Total' })}
          </Typography>
          <Typography fontSize={14} className="text-secondary-black">
            {order.total}
          </Typography>
        </div>

        <div className="hidden md:flex md:flex-col">
          <Typography fontSize={16} medium className="pb-15 text-primary-black">
            {formatOrdersMessage({ id: 'status', defaultMessage: 'Status' })}
          </Typography>
          <Typography fontSize={14} className="text-secondary-black">
            {formatOrdersMessage({ id: order.status, defaultMessage: 'All orders' })}
          </Typography>
        </div>
        <div className="hidden lg:flex">
          <Button variant="primary" size="s" className="text-14 font-medium">
            {formatOrdersMessage({ id: 'create.return', defaultMessage: 'Create return' })}
          </Button>
        </div>
      </div>
      <div className="flex h-60 w-full cursor-pointer items-center justify-between px-24">
        <div className="flex">
          <Typography fontSize={14} className="text-primary-black">
            4
          </Typography>
          <Typography fontSize={14} className="pl-7 text-primary-black">
            {formatOrdersMessage({ id: 'articles', defaultMessage: 'articles' })}
          </Typography>
        </div>

        <ChevronRightIcon strokeWidth={2} className="w-15 pt-3 text-secondary-black" />
      </div>
    </div>
  );
};

export default OrderItem;