import React from 'react';
import { GetServerSideProps, Redirect } from 'next';
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { renderToString } from 'react-dom/server';
import { getServerState } from 'react-instantsearch-hooks-server';
import { useFormat } from 'helpers/hooks/useFormat';
import { SDK } from 'sdk';
import { createClient, PageDataResponse, ResponseError } from 'frontastic';
import { FrontasticRenderer } from 'frontastic/lib/renderer';
import { tastics } from 'frontastic/tastics';
import ProductList from 'frontastic/tastics/products/product-list';
import { Log } from '../helpers/errorLogger';
import styles from './slug.module.css';

type SlugProps = {
  // This needs an overhaul. Can be too many things in my opinion (*Marcel)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  // data: RedirectResponse | PageDataResponse | ResponseError | { ok: string; message: string } | string;
  locale: string;
};

export default function Slug({ data }: SlugProps) {
  const { formatMessage } = useFormat({ name: 'common' });

  if (!data || typeof data === 'string') {
    return (
      <>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900">Internal Error</h1>
        <p className="mt-2 text-lg">{data}</p>
        <p className="mt-2 text-lg">Check the logs of your Frontastic CLI for more details.</p>
      </>
    );
  }

  if (!data?.ok && data?.message) {
    return (
      <>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900">Internal Error</h1>
        <p className="mt-2 text-lg">{data.message}</p>
        <p className="mt-2 text-lg">Check the logs of your Frontastic CLI for more details.</p>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{formatMessage({ id: 'meta.title', defaultMessage: 'The Good Store' })}</title>
        <meta
          name="description"
          content={formatMessage({ id: 'meta.desc', defaultMessage: 'Find largest home collections here!' })}
        />
      </Head>
      <FrontasticRenderer data={data} tastics={tastics} wrapperClassName={styles.gridWrapper} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps | Redirect = async ({ params, locale, query, req, res }) => {
  SDK.configure(locale);

  const extensions = SDK.getExtensions();

  const frontastic = createClient();
  const [data, categories] = await Promise.all([
    frontastic.getRouteData(params, locale, query, req, res),
    extensions.product.queryCategories({ query: { limit: 99 } }).then((res) => (res as any).data),
  ]);

  if (data) {
    if (data instanceof ResponseError && data.getStatus() == 404) {
      return {
        notFound: true,
      };
    } else if (typeof data === 'object' && 'target' in data) {
      return {
        redirect: {
          destination: data.target,
          statusCode: data.statusCode,
        } as Redirect,
      };
    }
  }

  if (data instanceof Error) {
    // @TODO: Render nicer error page in debug mode, which shows the error to
    // the developer and also outlines how to debug this (take a look at
    // frontastic-CLI).
    Log.error('Error retrieving data: ', data);
    return {
      notFound: true,
    };
  }

  if (typeof data === 'string') {
    return {
      props: {
        data: { error: data },
        error: data,
      },
    };
  }

  const protocol = req.headers.referer?.split('://')[0] || 'https';
  const serverUrl = `${protocol}://${req.headers.host}${req.url}`;

  const serverState = await getServerState(
    <ProductList
      serverUrl={serverUrl}
      categories={[]}
      data={{
        facetsConfiguration: (data as PageDataResponse).page?.sections?.main?.layoutElements
          .find((layoutElement) =>
            layoutElement.tastics.find((tastic) => tastic.tasticType === 'commercetools/ui/products/product-list'),
          )
          ?.tastics.find((tastic) => tastic.tasticType === 'commercetools/ui/products/product-list')?.configuration
          .facetsConfiguration,
      }}
    />,
    { renderToString },
  );

  return {
    props: {
      data: { ...data, categories, serverState, serverUrl } || null,
      locale: locale,
      ...(await serverSideTranslations(locale, [
        'common',
        'cart',
        'product',
        'checkout',
        'account',
        'error',
        'success',
        'wishlist',
        'newsletter',
      ])),
    },
  };
};
