import Head from "next/head";
import { Provider } from "react-redux";
import store from "@/store";
import "@/styles/globals.css";
import "@/styles/eventpages.css";
import "@/styles/Home.module.css";
import "@/styles/admin.css";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { useEffect, useState } from "react";

let persistor = persistStore(store);

export default function MyApp({ Component, pageProps }) {
  const { openGraphData = [] } = pageProps;
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {openGraphData?.length ? (
          openGraphData.map((og) => <meta {...og} />)
        ) : (
          <>
            <title>
              {pageProps?.data?.title
                ? pageProps?.data?.title
                : "The Kindness Campaign News"}
            </title>
            <meta
              name="description"
              content={
                pageProps?.data?.news_title
                  ? pageProps?.data?.news_title
                  : "The Kindness Campaign News"
              }
            />
          </>
        )}
      </Head>

      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Component {...pageProps} />
        </PersistGate>
      </Provider>
    </>
  );
}
