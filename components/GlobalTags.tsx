import { asset, Head } from "$fresh/runtime.ts";

function GlobalTags() {
  return (
    <Head>
      {/* Enable View Transitions API */}
      <meta name="view-transition" content="same-origin" />

      {/* Tailwind v3 CSS file */}
      <link href={asset("/tailwind.css")} rel="stylesheet" />

      {/* Web Manifest */}
      <link rel="manifest" href={asset("/site.webmanifest")} />

      {/* title */}
      <title>Made in Brazil</title>

      {/* Description */}
      <meta
        name="description"
        content="Discover the game-changers, innovators, and disruptors in our catalog of Brazilian tech companies. Explore the forefront oftechnological advancement in Brazil."
      />

      <style
        dangerouslySetInnerHTML={{
          __html: `
                body {
                    overflow-x: hidden;
                }
                @font-face {   font-family: 'Lexend';   font-style: normal;   font-weight: 100;   src: url(${
            asset("/fonts/Lexend-Thin.woff")
          }) format('woff'); }  
          @font-face {   font-family: 'Lexend';   font-style: normal;   font-weight: 200;   src: url(${
            asset("/fonts/Lexend-ExtraLight.woff2")
          }) format('woff2'); }  
          @font-face {   font-family: 'Lexend';   font-style: normal;   font-weight: 300;   src: url(${
            asset("/fonts/Lexend-Light.woff2")
          }) format('woff2'); }  
          @font-face {   font-family: 'Lexend';   font-style: normal;   font-weight: 400;   src: url(${
            asset("/fonts/Lexend-Regular.woff")
          }) format('woff'); }  
          @font-face {   font-family: 'Lexend';   font-style: normal;   font-weight: 500;   src: url(${
            asset("/fonts/Lexend-Medium.woff2")
          }) format('woff2'); }  
          @font-face {   font-family: 'Lexend';   font-style: normal;   font-weight: 500;   src: url(${
            asset("/fonts/Lexend-SemiBold.woff")
          }) format('woff'); }
          @font-face {   font-family: 'Lexend';   font-style: normal;   font-weight: 700;   src: url(${
            asset("/fonts/Lexend-Bold.woff2")
          }) format('woff2'); }  
          @font-face {   font-family: 'Lexend';   font-style: normal;   font-weight: 800;   src: url(${
            asset("/fonts/Lexend-ExtraBold.woff2")
          }) format('woff2'); }  
          @font-face {   font-family: 'Lexend';   font-style: normal;   font-weight: 900;   src: url(${
            asset("/fonts/Lexend-Black.woff2")
          }) format('woff2'); }
          @font-face {   font-family: 'Montserrat';   font-style: normal;   font-weight: 100;   src: url(${
            asset("/fonts/Montserrat-Thin.woff")
          }) format('woff'); }
          @font-face {   font-family: 'Montserrat';   font-style: normal;   font-weight: 200;   src: url(${
            asset("/fonts/Montserrat-ExtraLight.woff")
          }) format('woff'); }
          @font-face {   font-family: 'Montserrat';   font-style: normal;   font-weight: 300;   src: url(${
            asset("/fonts/Montserrat-Light.woff")
          }) format('woff'); }
          @font-face {   font-family: 'Montserrat';   font-style: normal;   font-weight: 400;   src: url(${
            asset("/fonts/Montserrat-Regular.woff")
          }) format('woff'); }
          @font-face {   font-family: 'Montserrat';   font-style: normal;   font-weight: 500;   src: url(${
            asset("/fonts/Montserrat-Medium.woff")
          }) format('woff'); }
          @font-face {   font-family: 'Montserrat';   font-style: normal;   font-weight: 600;   src: url(${
            asset("/fonts/Montserrat-SemiBold.woff")
          }) format('woff'); }
          @font-face {   font-family: 'Montserrat';   font-style: normal;   font-weight: 700;   src: url(${
            asset("/fonts/Montserrat-Bold.woff")
          }) format('woff'); }
          @font-face {   font-family: 'Montserrat';   font-style: normal;   font-weight: 800;   src: url(${
            asset("/fonts/Montserrat-ExtraBold.woff")
          }) format('woff'); }
          @font-face {   font-family: 'Montserrat';   font-style: normal;   font-weight: 900;   src: url(${
            asset("/fonts/Montserrat-Black.woff")
          }) format('woff'); }
                
            `,
        }}
      >
      </style>
    </Head>
  );
}

export default GlobalTags;
