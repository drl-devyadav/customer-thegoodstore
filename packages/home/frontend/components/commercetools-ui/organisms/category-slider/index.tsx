import React, { useMemo } from 'react';
import useMediaQuery from 'helpers/hooks/useMediaQuery';
import { desktop, tablet } from 'helpers/utils/screensizes';
import Slider from '../../atoms/slider';
import Wrapper from '../content/wrapper';
import Tile, { Props as TileProps } from './tile';

export interface Props {
  tiles: Array<TileProps['tile']>;
}

const CategorySlider: React.FC<Props> = ({ tiles = [] }) => {
  const [isDesktopSize] = useMediaQuery(desktop);

  const fitsToScreenSize = useMemo(
    () => (isDesktopSize && tiles.length <= 4) || (!isDesktopSize && tiles.length <= 2),
    [isDesktopSize, tiles.length],
  );

  return (
    <Wrapper background="neutral-200">
      <Slider
        slidesPerView={2.3}
        dots={false}
        spaceBetween={4}
        arrows={isDesktopSize && !fitsToScreenSize}
        allowTouchMove={!fitsToScreenSize}
        breakpoints={{
          [tablet]: {
            spaceBetween: 8,
          },
          [desktop]: {
            spaceBetween: 16,
            slidesPerView: 4,
          },
        }}
      >
        {tiles.map((tile, index) => (
          <Tile key={index} tile={tile} />
        ))}
      </Slider>
    </Wrapper>
  );
};

export default CategorySlider;
