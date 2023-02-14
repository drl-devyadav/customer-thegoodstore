import { KlarnaData, SchemeData } from 'components/commercetools-ui/organisms/checkout/provider/payment/types';

export type PaymentMethodType =
  | 'scheme'
  | 'klarna'
  | 'klarna_account'
  | 'klarna_paynow'
  | 'paysafecard'
  | 'swish'
  | 'trustly'
  | 'vipps'
  | 'multibanco'
  | 'ideal';

export interface PaymentMethod {
  name: string;
  type: PaymentMethodType;
  image: {
    src: string;
  };
}

export interface RedirectAction {
  type: 'redirect';
  method: string;
  data?: unknown;
  url: string;
  paymentMethodType: string;
}

export interface ThreeDS2Action {
  type: 'threeDS2';
  authorisationToken: string;
  paymentData: string;
  paymentMethodType: string;
  subtype: string;
  token: string;
  url: string;
}

export type PaymentAction = RedirectAction | ThreeDS2Action;

export type PaymentResponse = {
  additionalData: Record<string, string>;
  pspReference: string;
  resultCode:
    | 'Authorised'
    | 'Cancelled'
    | 'Error'
    | 'Refused'
    | 'RedirectShopper'
    | 'IdentifyShopper'
    | 'ChallengeShopper';
  merchantReference: string;
  action?: PaymentAction;
};

export interface SchemePaymentRequestPayload {
  amount: {
    currency: string;
    value: number;
  };
  reference: string;
  paymentMethod: SchemeData;
  returnUrl: string;
  channel: 'web';
  origin: string;
  countryCode: string;
  shopperLocale: string;
  browserInfo: {
    acceptHeader: string;
    colorDepth: number;
    javaEnabled: boolean;
    javaScriptEnabled?: boolean;
    language: string;
    screenHeight: number;
    screenWidth: number;
    timeZoneOffset: number;
    userAgent: string;
  };
  authenticationData: {
    threeDSRequestData: {
      nativeThreeDS: 'preferred';
    };
  };
}

export interface KlarnaLineItem {
  id: string;
  quantity: string;
  description: string;
  amountIncludingTax: number | string;
  productUrl?: string;
  imageUrl?: string;
}

export interface KlarnaPaymentRequestPayload {
  amount: {
    currency: string;
    value: number;
  };
  reference: string;
  paymentMethod: Pick<KlarnaData, 'type'>;
  returnUrl: string;
  countryCode: string;
  shopperLocale: string;
  shopperReference: string;
  shopperEmail: string;
  shopperName?: {
    firstName: string;
    lastName?: string;
  };
  lineItems: Array<KlarnaLineItem>;
}

export type PaymentRequestPayload = SchemePaymentRequestPayload | KlarnaPaymentRequestPayload;