// Google Analytics component
// Uses VITE_GA_TRACKING_ID from .env

export function GoogleAnalytics() {
  const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_TRACKING_ID;

  if (!GA_MEASUREMENT_ID) {
    console.warn('Google Analytics Measurement ID not found. Please set VITE_GA_TRACKING_ID in .env');
    return null;
  }

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
