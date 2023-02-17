import React, { FC } from 'react';
import Link from 'components/commercetools-ui/atoms/link';
import Typography from 'components/commercetools-ui/atoms/typography';
import { Tile } from 'components/commercetools-ui/organisms/header/types';
import useClassNames from 'helpers/hooks/useClassNames';
import { Category } from 'types/category';
import HeaderDropdownTile from './header-menu-tile';

export interface Props {
  show: boolean;
  links: Category[];
  tileContent?: Tile;
  onClick?: () => void;
}

const MenuDropdown: FC<Props> = ({ show, links, tileContent, onClick }) => {
  const wrapperClassNames = useClassNames([
    'transition absolute flex justify-between bottom-0 left-0 duration-500 ease-in-out min-h-[300px] w-[100%] translate-y-full',
    show ? 'opacity-1 z-20 delay-500' : 'opacity-0 z-[-999] pointer-events-none',
    'border-b-[1.5px] border-t-[1.5px] border-b-secondary-grey border-t-neutral-400 bg-white pl-52 pr-48 py-32',
  ]);

  const linksClassNames = useClassNames(['grid grid-cols-4 gap-x-116 gap-y-28', tileContent ? 'pr-116' : '']);

  return (
    <div className={wrapperClassNames}>
      <div className={linksClassNames}>
        {links?.map((link) => (
          <div key={link.categoryId}>
            {link.depth === 1 ? (
              <>
                <div className="w-min pb-8">
                  <Link link={link.slug ?? link.path} variant="menu-header" className="whitespace-nowrap">
                    <Typography fontSize={14}>{link.name}</Typography>
                  </Link>
                </div>
                {link.subCategories.map((field) => (
                  <div key={field.categoryId} onClick={onClick} className="w-min pb-8">
                    <Link link={field.slug ?? field.path} variant="menu-item" className="whitespace-nowrap">
                      <Typography fontSize={14}>{field.name}</Typography>
                    </Link>
                  </div>
                ))}
              </>
            ) : (
              <Link key={link.categoryId} link={link.slug ?? link.path} variant="menu-header">
                <Typography fontSize={14}>{link.name}</Typography>
              </Link>
            )}
          </div>
        ))}
      </div>
      {tileContent && <HeaderDropdownTile tileContent={tileContent} />}
    </div>
  );
};

export default MenuDropdown;
