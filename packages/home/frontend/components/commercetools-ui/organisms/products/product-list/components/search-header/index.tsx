import React from 'react';
import { useHits } from 'react-instantsearch-hooks';
import { useFormat } from 'helpers/hooks/useFormat';

interface Props {
  query: string;
}

const SearchHeader: React.FC<Props> = ({ query }) => {
  const { formatMessage: formatProductMessage } = useFormat({ name: 'product' });

  const {
    results: { nbHits },
  } = useHits();

  if (!query) return <></>;

  return (
    <div>
      <h1 className="text-26">
        {formatProductMessage({
          id: 'search.results.for',
          defaultMessage: 'Search results for “{query}”',
          values: { query },
        })}
      </h1>
      <h4 className="mt-24">
        {formatProductMessage({
          id: 'found.products',
          defaultMessage: 'We found {count} products',
          values: { count: nbHits },
        })}
      </h4>
    </div>
  );
};

export default SearchHeader;