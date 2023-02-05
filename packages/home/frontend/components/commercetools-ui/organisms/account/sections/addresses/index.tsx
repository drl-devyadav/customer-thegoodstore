import React from 'react';
import Link from 'components/commercetools-ui/atoms/link';
import Typography from 'components/commercetools-ui/atoms/typography';
import { useFormat } from 'helpers/hooks/useFormat';
import { useAccount } from 'frontastic';
import Address from './address';

const Addresses = () => {
  const { formatMessage: formatAccountMessage } = useFormat({ name: 'account' });

  const { account } = useAccount();
  const addresses = account?.addresses;

  return (
    <div>
      <div className="hidden pb-12 md:block md:pb-20 2xl:pb-36">
        <Typography as="h2" fontFamily="libre" className="text-22 text-primary-black lg:text-24">
          {formatAccountMessage({
            id: 'addresses',
            defaultMessage: 'Addresses',
          })}
        </Typography>
      </div>
      <div>
        <Typography
          fontSize={14}
          lineHeight="loose"
          className="mb-28 text-secondary-black md:mb-24 md:text-14 2xl:mb-36 2xl:text-16"
        >
          {formatAccountMessage({
            id: 'address.desc',
            defaultMessage: 'Manage or add addresses for your account.',
          })}
        </Typography>
        <Link
          link="#edit-address"
          className="block w-full rounded-md bg-gray-700 py-8 px-16 text-center text-14 font-medium leading-[114%] text-neutral-150 hover:cursor-pointer md:w-fit 2xl:p-12"
        >
          {formatAccountMessage({ id: 'address.add', defaultMessage: 'Add an address' })}
        </Link>
      </div>

      <div className="mt-24 grid gap-20 md:mt-28 2xl:mt-32">
        {addresses?.map((address) => (
          <Address key={address.addressId} address={address} />
        ))}
      </div>
    </div>
  );
};

export default Addresses;