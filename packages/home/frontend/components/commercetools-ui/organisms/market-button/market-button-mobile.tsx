import { Fragment, useCallback, useContext } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import Button from 'components/commercetools-ui/atoms/button';
import Typography from 'components/commercetools-ui/atoms/typography';
import FlagIcons from 'components/icons/flags';
import useClassNames from 'helpers/hooks/useClassNames';
import { MarketContext } from 'frontastic/provider/marketProvider';
import { Market } from '../header/types';

const MarketButtonMobile = () => {
  const { market: selectedMarket, markets, handleMarket } = useContext(MarketContext);

  const marketButtonClassNames = useCallback((open?: boolean) => {
    return `flex h-40 w-full items-center justify-between border ${
      open
        ? 'rounded-t-sm border-x-neutral-500 border-t-neutral-500 border-b-neutral-400'
        : 'rounded-sm border-neutral-500'
    } bg-white px-16 focus:border-gray-500`;
  }, []);

  const marketMenuWrapperClassNames = useClassNames([
    markets.length > 6 ? 'bottom-45' : 'top-40',
    'absolute left-0 w-full px-16',
  ]);

  const marketMenuClassNames = useCallback((open?: boolean) => {
    return `max-h-300 overflow-scroll rounded-b-sm border ${
      open ? 'border-x-neutral-500 border-b-neutral-500' : 'border-neutral-400'
    } bg-white shadow-sm`;
  }, []);

  const handleMarketClick = (market: Market) => {
    handleMarket(market);
  };

  const marketButtonLabel = `${selectedMarket?.region} | ${selectedMarket?.currency}`;

  return (
    <Menu as="div" className="relative px-16">
      {({ open }) => (
        <>
          <Menu.Button className={marketButtonClassNames(open)}>
            <div className="flex w-fit items-center justify-start">
              <FlagIcons flagName={selectedMarket?.flag} className="my-auto mr-8" />
              <Typography fontSize={14} className="text-primary-black">
                {marketButtonLabel}
              </Typography>
              <span
                dangerouslySetInnerHTML={{ __html: selectedMarket?.currencyCode }}
                className="ml-5 text-14 text-primary-black"
              />
            </div>
            <div className="flex justify-end">
              <ChevronDownIcon strokeWidth={2} className="w-16 text-primary-black" />
            </div>
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
            <Menu.Items className={marketMenuWrapperClassNames}>
              <div className={marketMenuClassNames(open)}>
                {markets.map((market, index) => (
                  <Menu.Item key={index}>
                    <div className="overflow-y-scroll">
                      <Button
                        variant="ghost"
                        size="full"
                        onClick={() => handleMarketClick(market)}
                        className="flex w-full items-center justify-start py-12 px-16"
                      >
                        <FlagIcons flagName={market.flag} className="mr-8" />
                        <Typography fontSize={14} className="mb-1 text-primary-black">
                          {market.region}
                        </Typography>
                      </Button>
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

export default MarketButtonMobile;
