import React, { FC, ReactNode } from 'react';
import useTouchDevice from 'helpers/hooks/useTouchDevice';

export type WrapperVariant = 'none' | 'left-padding-only' | 'full-padding-small' | 'full-padding';
export type WrapperBackground = 'white' | 'neutral-200';

export type WrapperProps = {
  children: ReactNode;
  background?: WrapperBackground;
  variant?: WrapperVariant;
  className?: string;
  clearDefaultStyles?: boolean;
};

type variantClassNames = {
  [key in WrapperVariant]: string;
};

const Wrapper: FC<WrapperProps> = ({
  children,
  background = 'white',
  variant = 'none',
  className,
  clearDefaultStyles,
}) => {
  const { isTouchDevice } = useTouchDevice();

  const variantClassNames: variantClassNames = {
    none: '',
    'left-padding-only': !isTouchDevice
      ? 'pl-72 pr-72 md:pr-96 md:pl-96 xl:pl-0 xl:pr-0'
      : 'pl-8 lg:pr-96 lg:pl-96 xl:pl-0 xl:pr-0',
    'full-padding-small': 'px-8 md:px-12',
    'full-padding': 'px-16 md:px-96',
  };

  const wrapperClassName = clearDefaultStyles
    ? className
    : `mx-auto lg:max-w-[90%] ${variantClassNames[variant]} ${className ?? ''}`;

  return (
    <div className={`bg-${background}`}>
      <div className={wrapperClassName}>{children}</div>
    </div>
  );
};

export default Wrapper;
