import React, { FC } from 'react';
import Link from 'components/commercetools-ui/atoms/link';
import Typography from 'components/commercetools-ui/atoms/typography';
import { Reference } from 'types/reference';
import Image, { NextFrontasticImage } from 'frontastic/lib/image';
import { Market } from '../../header-types';

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
      <Typography
        as="h3"
        fontSize={28}
        align="center"
        fontWeight="bold"
        className="absolute top-83 left-1/2 h-35 w-full -translate-x-1/2 -translate-y-1/2 text-white"
      >
        {title}
      </Typography>
      <Link
        link={buttonLink}
        className="absolute top-144 left-1/2 -translate-x-1/2 -translate-y-1/2 border-b-2 text-24 text-white"
      >
        {buttonLabel}
      </Link>
    </div>
  );
};

export default HeaderMenuTileDesktop;