import React, { FC } from 'react';
import { Reference, ReferenceLink } from 'helpers/reference';
import Image, { NextFrontasticImage } from 'frontastic/lib/image';
import { Market } from '../../interfaces';

export interface Props {
  title: string;
  image: NextFrontasticImage;
  buttonLabel: string;
  buttonLink: Reference;
  currentMarket: Market;
}

const HeaderMenuTileDesktop: FC<Props> = ({ title, image, buttonLabel, buttonLink, currentMarket }) => {
  const locale = currentMarket?.locale;

  return (
    <div className="relative mt-2 h-[265px] w-[506px] xl:pl-25">
      <Image media={image.media} layout="fill" objectFit="contain" alt={image.title[locale]} />
      <h3 className="absolute top-83 left-1/2 h-35 w-full -translate-x-1/2 -translate-y-1/2 text-center text-28 font-bold text-white">
        {title}
      </h3>
      <ReferenceLink
        target={buttonLink}
        className="absolute top-144 left-1/2 -translate-x-1/2 -translate-y-1/2 border-b-2 text-24 text-white"
      >
        {buttonLabel}
      </ReferenceLink>
    </div>
  );
};

export default HeaderMenuTileDesktop;
