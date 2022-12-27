import React from 'react';
import {
  InstantSearch as ReactInstantSearch,
  InstantSearchProps as ReactInstantSearchProps,
} from 'react-instantsearch-hooks';
import { searchClient } from 'algolia/searchClient';

const InstantSearch: React.FC<Partial<ReactInstantSearchProps>> = ({ indexName, children, ...props }) => (
  <ReactInstantSearch searchClient={searchClient} indexName={indexName} {...props}>
    {children}
  </ReactInstantSearch>
);

export default InstantSearch;