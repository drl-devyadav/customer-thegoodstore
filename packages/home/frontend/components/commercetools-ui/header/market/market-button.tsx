import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/outline';
import CheckIcon from 'components/icons/check-2';
import CloseIcon from 'components/icons/close';
import FlagIcons from 'components/icons/flags';
import { useCart } from 'frontastic';
import { Market } from '../interfaces';
interface Props {
  currentMarket?: Market;
  markets?: Market[];
  setCurrentMarket: Dispatch<SetStateAction<Market>>;
}

const MarketButton: React.FC<Props> = ({ currentMarket, markets, setCurrentMarket }) => {
  const [showMarket, setShowMarket] = useState(false);

  return (
    <div className="ml-12 hidden justify-center md:w-109 lg:flex lg:w-300">
      {currentMarket && (
        <button onClick={() => setShowMarket(true)} className="flex items-center justify-center p-3">
          <FlagIcons flagName={currentMarket?.flag} className="mr-8 text-14" />
          {currentMarket?.region} | {currentMarket?.currency}
          <span dangerouslySetInnerHTML={{ __html: currentMarket?.currencyCode }} className="ml-5 mr-20" />
          <ChevronDownIcon className=" h-11 w-11"></ChevronDownIcon>
        </button>
      )}

      {showMarket && (
        <>
          <div
            onClick={() => setShowMarket(false)}
            className="fixed top-0 left-0 z-10 h-full w-full bg-black opacity-50"
          />
          <div onClick={() => setShowMarket(false)} className="fixed top-0 left-0 z-20 h-full  w-356 bg-white">
            <button onClick={() => setShowMarket(false)} className="flex w-full justify-end ">
              <CloseIcon className="m-16" />
            </button>
            <h5 className="px-26 pb-24 text-22 font-normal">Select your market</h5>
            <>
              {markets.map((market) => (
                <button
                  key={market.flag}
                  onClick={() => {
                    setCurrentMarket(market);
                    setShowMarket(false);
                  }}
                  className="flex h-24 items-center justify-center p-26"
                >
                  {currentMarket?.flag === market.flag && <CheckIcon className="mx-11" />}
                  <FlagIcons flagName={market.flag} className="mr-8 text-14" />
                  {market.region}
                </button>
              ))}
            </>
          </div>
        </>
      )}
    </div>
  );
};
export default MarketButton;