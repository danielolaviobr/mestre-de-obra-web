import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="pt-br">
        <Head />
        <body
          style={{
            backgroundColor: "rgba(229, 231, 235)",
            WebkitTapHighlightColor: "transparent",
            WebkitTouchCallout: "none",
            WebkitUserSelect: "none",
            MozUserSelect: "none",
            userSelect: "none",
          }}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
