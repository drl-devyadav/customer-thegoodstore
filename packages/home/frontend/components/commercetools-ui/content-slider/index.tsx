import { FC, useMemo } from 'react';
import useMediaQuery from 'helpers/hooks/useMediaQuery';
import { Reference, ReferenceLink } from 'helpers/reference';
import * as screensizes from 'helpers/utils/screensizes';
import Image, { NextFrontasticImage } from 'frontastic/lib/image';
import Wrapper from '../content/wrapper';
import Slider from '../slider';
import Subtitle from '../subtitle';
import Title from '../title';

type ContentSliderSlide = {
  image: NextFrontasticImage;
  title: string;
  ctaLabel?: string;
  ctaReference?: Reference;
};

export type ContentSliderProps = {
  title?: string;
  subtitle?: string;
  slides: ContentSliderSlide[];
};

const ContentSlider: FC<ContentSliderProps> = ({ title, subtitle, slides }) => {
  const [isTablet] = useMediaQuery(screensizes.tablet);
  const [isDesktop] = useMediaQuery(screensizes.desktop);

  const slidesElement = useMemo(
    () =>
      slides.map(({ image, title, ctaReference, ctaLabel }, index) => (
        <div key={index} className="overflow-hidden lg:shrink-0 lg:grow lg:basis-0">
          <div className="relative h-[220px] md:h-[356px]">
            <Image {...image} className="mb-5 rounded" layout="fill" objectFit="cover" />
          </div>
          <h4 className="my-3.5 max-w-[90%] overflow-hidden text-ellipsis whitespace-pre text-18 font-normal">
            {title}
          </h4>
          <ReferenceLink target={ctaReference} className="flex gap-1.5">
            <p className="text-16 font-normal">{ctaLabel}</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-7.5 w-18"
            >
              <path d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
            </svg>
          </ReferenceLink>
        </div>
      )),
    [slides],
  );

  return (
    <Wrapper phonePadding="left-padding-only">
      {title && <Title className="mb-13" title={title} />}
      {subtitle && <Subtitle className="mb-24" subtitle={subtitle} />}
      {isDesktop ? (
        <div className="justify-stretch flex w-full gap-24">{slidesElement}</div>
      ) : (
        <Slider arrows={false} dots={false} slidesPerView={1.3} spaceBetween={isTablet ? 24 : 8}>
          {slidesElement}
        </Slider>
      )}
    </Wrapper>
  );
};
export default ContentSlider;
