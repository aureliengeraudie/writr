import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>WRITR — Corriger, Humaniser, Générer</title>
        <meta name="description" content="Outil d'écriture IA : corrige l'orthographe, humanise les textes IA, génère du contenu avec 3 styles différents." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>✍️</text></svg>" />
      </Head>
      <style jsx global>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        body { font-family: 'Georgia', serif; }
      `}</style>
      <Component {...pageProps} />
    </>
  );
}
