// Google Analytics component
// Replace 'G-XXXXXXXXXX' with your actual Measurement ID from Google Analytics

export function GoogleAnalytics() {
  const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // TODO: Replace with your GA4 Measurement ID

  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `,
        }}
      />
    </>
  );
}

// Usage: Import in App.tsx and add <GoogleAnalytics /> at the top
