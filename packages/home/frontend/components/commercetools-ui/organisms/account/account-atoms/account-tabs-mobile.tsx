import React, { FC, Fragment, useCallback } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import Link from 'components/commercetools-ui/atoms/link';
import Typography from 'components/commercetools-ui/atoms/typography';
import { AccountTab } from '../details';

export interface Props {
  contentTitle: string;
  tabs: AccountTab[];
}

const AccountTabsMobile: FC<Props> = ({ contentTitle, tabs }) => {
  const accountTabsButtonClassNames = useCallback((open?: boolean) => {
    return `flex h-40 w-full items-center justify-between border ${
      open
        ? 'rounded-t-sm border-x-neutral-500 border-t-neutral-500 border-b-neutral-400'
        : 'rounded-sm border-neutral-500'
    } bg-white px-16 py-12 focus:border-gray-500`;
  }, []);

  const accountTabsMenuClassNames = useCallback((open?: boolean) => {
    return `max-h-300 overflow-scroll rounded-b-sm border ${
      open ? 'border-x-neutral-500 border-b-neutral-500' : 'border-neutral-400'
    } bg-white shadow-sm`;
  }, []);

  return (
    <Menu as="div" className="relative pt-8 pb-20 md:hidden">
      {({ open }) => (
        <>
          <Menu.Button className={accountTabsButtonClassNames(open)}>
            <Typography fontSize={14} className="text-primary-black">
              {contentTitle}
            </Typography>
            <ChevronDownIcon strokeWidth={2} className="w-16 text-primary-black" />
          </Menu.Button>

          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute top-46 left-0 z-30 w-full">
              <div className={accountTabsMenuClassNames(open)}>
                {tabs.map((tab, index) => (
                  <Menu.Item key={index}>
                    <div className="overflow-y-scroll py-12">
                      <Link link={tab.href} className="flex w-full items-center justify-start px-16">
                        <Typography fontSize={14} className="text-primary-black">
                          {tab.name}
                        </Typography>
                      </Link>
                    </div>
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};

export default AccountTabsMobile;
