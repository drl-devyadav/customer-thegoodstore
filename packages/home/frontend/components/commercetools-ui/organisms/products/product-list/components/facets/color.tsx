import React from 'react';
import { useRefinementList } from 'react-instantsearch-hooks-web';
import stringToColor from 'string-to-color';
import { FacetProps } from './types';

const ColorFacet: React.FC<FacetProps> = ({ attribute }) => {
  const { items, refine } = useRefinementList({ attribute });

  return (
    <div className="grid grid-cols-3 items-center justify-start gap-x-54 gap-y-36">
      {items.map(({ label, value, isRefined, count }) => (
        <div
          key={value}
          className="flex cursor-pointer flex-col items-center text-center"
          onClick={() => refine(value)}
        >
          <div
            className={`h-40 w-40 rounded-full outline outline-1 outline-offset-1 ${
              isRefined ? 'outline-gray-500' : 'outline-transparent'
            }`}
            style={{ backgroundColor: stringToColor(value) }}
          />
          <span className="mt-4 block max-w-full truncate text-14" title={label}>
            {label}
          </span>
          <span className="mt-2 block">{count}</span>
        </div>
      ))}
    </div>
  );
};

export default ColorFacet;