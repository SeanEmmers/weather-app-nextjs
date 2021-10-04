import React from "react";
import Router from 'next/router';
import NProgress from 'nprogress';
import "../styles/main.scss";

function MyApp({ Component, pageProps }) {
  React.useEffect(() => {
    const start = () => NProgress.start();
    const end = () => NProgress.done();

    Router.events.on("routChangeStart", start);
    Router.events.on("routChangeComplete", end);
    Router.events.on("routChangeError", end);

    return () => {
      Router.events.off("routChangeStart", start);
      Router.events.off("routChangeComplete", end);
      Router.events.off("routChangeError", end);
    }

  }, [])

  return <Component {...pageProps} />
}

export default MyApp
