/* eslint-disable @next/next/no-sync-scripts */
import Document, { Html, Head, Main, NextScript } from 'next/document';


class LinkDocument extends Document {
  render() {
    return (
      <Html>
        <Head/>
        <body>
          <Main />
          <NextScript />
          <script src="/jquery/jquery.min.js"></script>
          <script src="/jquery-easing/jquery.easing.min.js"></script>
          <script src="https://kit.fontawesome.com/66b58c16d1.js" crossOrigin="anonymous"></script>
        </body>
      </Html>
    )
  }
}

export default LinkDocument
