import { useMemo, useState } from 'react';
import { XMarkIcon as CloseIcon } from '@heroicons/react/24/outline';
import { AdjustmentsHorizontalIcon as FiltersIcon } from '@heroicons/react/24/solid';
import { useHits } from 'react-instantsearch-hooks-web';
import Accordion from 'components/commercetools-ui/atoms/accordion';
import Drawer from 'components/commercetools-ui/atoms/drawer';
import { productsIndex } from 'helpers/constants/algolia';
import { useFormat } from 'helpers/hooks/useFormat';
import { useProductList } from '../../context';
import useDynamicFacets from '../../hooks/useDynamicFacets';
import { FacetConfiguration } from '../../types';
import SortFacet from '../facets/sort';

interface Props {
  facetsConfiguration: Record<string, FacetConfiguration>;
}

const MobileFacets: React.FC<Props> = ({ facetsConfiguration }) => {
  const { formatMessage: formatProductMessage } = useFormat({ name: 'product' });

  const { removeAllRefinements } = useProductList();

  const {
    results: { nbHits, renderingContent },
  } = useHits();

  const [isOpen, setIsOpen] = useState(false);

  const accordionClassNames = useMemo(
    () => ({
      root: 'py-20 px-16',
      icon: 'stroke-secondary-black w-20 stroke-2',
      border: 'border-b border-neutral-400',
      button: 'text-14',
    }),
    [],
  );

  const facets = useDynamicFacets({
    configuration: facetsConfiguration,
    ordering: renderingContent?.facetOrdering?.facets?.order,
    render: ({ attribute, Component }) => (
      <Accordion
        key={attribute}
        className={`${accordionClassNames.root} ${accordionClassNames.border}`}
        buttonClassName={accordionClassNames.button}
        closedSectionTitle={facetsConfiguration[attribute].label}
        variant="arrow"
        iconColor={accordionClassNames.icon}
      >
        <div className="py-28 px-16">{Component}</div>
      </Accordion>
    ),
  });

  const sortFacet = useMemo(
    () => (
      <Accordion
        className={accordionClassNames.root}
        buttonClassName={accordionClassNames.button}
        closedSectionTitle={formatProductMessage({ id: 'sortBy', defaultMessage: 'Sory by' })}
        variant="arrow"
        iconColor={accordionClassNames.icon}
      >
        <div className="py-28 px-16">
          <SortFacet
            items={[
              {
                label: formatProductMessage({ id: 'relevance', defaultMessage: 'Relevance' }),
                value: productsIndex,
              },
            ]}
          />
        </div>
      </Accordion>
    ),
    [formatProductMessage, accordionClassNames],
  );

  return (
    <>
      <div className="flex items-center justify-between border-b border-neutral-400 pb-16 pt-56">
        <div>
          <button
            className="flex min-w-[80px] cursor-pointer items-center gap-8 rounded-md border border-transparent bg-white px-12 py-6 text-14 leading-[20px] transition hover:border-gray-500"
            onClick={() => setIsOpen(true)}
          >
            <span className="text-14">
              {formatProductMessage({ id: 'sortAndFilter', defaultMessage: 'Filter & Sort' })}
            </span>
            <FiltersIcon className="mt-2 w-16 stroke-secondary-black" />
          </button>
        </div>
        <div className="flex items-center gap-16">
          <span>
            {nbHits} {formatProductMessage({ id: 'items', defaultMessage: 'Items' })}
          </span>
        </div>
      </div>
      <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)} direction="left" className="w-[90%] max-w-[400px]">
        <div className="flex items-center justify-between border-b border-neutral-400 px-12 py-16">
          <h3 className="text-18">{formatProductMessage({ id: 'sortAndFilter', defaultMessage: 'Filter & Sort' })}</h3>
          <CloseIcon className="w-24 stroke-secondary-black" onClick={() => setIsOpen(false)} />
        </div>
        <div>
          {facets}
          {sortFacet}
        </div>
        <div className="absolute bottom-0 flex w-full flex-col items-center gap-18 px-14 py-18">
          <button
            className="w-full rounded-md bg-primary-black py-8 text-14 font-medium text-white transition hover:bg-gray-500"
            onClick={() => setIsOpen(false)}
          >
            {formatProductMessage({ id: 'done', defaultMessage: 'Done' })}
          </button>
          <div className="w-full overflow-hidden rounded-md border border-transparent transition hover:border-primary-black">
            <button
              onClick={removeAllRefinements}
              className="w-full cursor-pointer border border-primary-black py-6 text-14 font-medium"
            >
              {formatProductMessage({ id: 'clear.all', defaultMessage: 'Clear All' })}
            </button>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default MobileFacets;