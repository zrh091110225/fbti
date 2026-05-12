export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

export const initGA = () => {
  if (typeof window !== 'undefined' && GA_MEASUREMENT_ID) {
    const scriptSrc = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    const existingScript = document.querySelector(`script[src="${scriptSrc}"]`);

    if (!existingScript) {
      const script = document.createElement('script');
      script.async = true;
      script.src = scriptSrc;
      document.head.appendChild(script);
    }

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, {
      send_page_view: false // We handle page views manually to match React state
    });
  }
};

export const trackPageView = (pageName: string) => {
  if (typeof window !== 'undefined' && window.gtag && GA_MEASUREMENT_ID) {
    window.gtag('event', 'page_view', {
      page_title: pageName,
      page_location: window.location.href,
      page_path: `/${pageName}`,
    });
  }
};

export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag && GA_MEASUREMENT_ID) {
    window.gtag('event', eventName, params);
  }
};
