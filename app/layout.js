import '../styles/globals.css';

export const metadata = {
  title: 'Ton Nguyen - Team Leader & Developer | Stockholm, Sweden',
  description: 'Experienced Team Leader at Litium with expertise in e-commerce platforms, .NET development, React, Angular, and mobile development. Based in Stockholm, Sweden.',
  keywords: 'Ton Nguyen, Team Leader, Developer, React Developer, Angular Developer, E-commerce, Litium, Stockholm, Sweden, Software Engineer',
  authors: [{ name: 'Ton Nguyen' }],
  creator: 'Ton Nguyen',
  publisher: 'Ton Nguyen',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://tonnguyen.github.io'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Ton Nguyen - Team Leader & Developer',
    description: 'Experienced Team Leader at Litium with expertise in e-commerce platforms, .NET development, React, Angular, and mobile development.',
    url: 'https://tonnguyen.github.io',
    siteName: 'Ton Nguyen - CV',
    images: [
      {
        url: '/Ton.webp',
        width: 200,
        height: 200,
        alt: 'Ton Nguyen - Team Leader & Developer',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ton Nguyen - Team Leader & Developer',
    description: 'Experienced Team Leader at Litium with expertise in e-commerce platforms, .NET development, React, Angular, and mobile development.',
    images: ['/Ton.webp'],
    creator: '@tonnguyen', // Replace with your actual Twitter handle
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Replace with your actual verification code
  },
};

export default function RootLayout({ children }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Ton Nguyen",
    "jobTitle": "Team Leader",
    "worksFor": {
      "@type": "Organization",
      "name": "Litium"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Stockholm",
      "addressCountry": "SE"
    },
    "alumniOf": {
      "@type": "EducationalOrganization",
      "name": "University of Greenwich"
    },
    "knowsAbout": [
      ".NET Development",
      "React",
      "Angular",
      "E-commerce Platforms",
      "Mobile Development",
      "Team Leadership"
    ],
    "url": "https://tonnguyen.github.io",
    "image": "https://tonnguyen.github.io/Ton.webp",
    "sameAs": [
      "https://www.linkedin.com/in/tonnguyen/",
      "https://github.com/tonnguyen",
      "https://www.facebook.com/ton.nguyen.hoang",
      "https://x.com/bobrowley"
    ]
  };

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/Ton.webp" as="image" type="image/webp" />
        
        {/* Optimized font loading */}
        <link 
          rel="preconnect" 
          href="https://fonts.googleapis.com" 
          crossOrigin="anonymous" 
        />
        <link 
          rel="preconnect" 
          href="https://fonts.gstatic.com" 
          crossOrigin="anonymous" 
        />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
        

        
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//cdnjs.cloudflare.com" />
        <link rel="dns-prefetch" href="//www.facebook.com" />
        <link rel="dns-prefetch" href="//x.com" />
        <link rel="dns-prefetch" href="//github.com" />
        <link rel="dns-prefetch" href="//www.linkedin.com" />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        
        {/* Performance monitoring */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Performance monitoring
              if ('performance' in window) {
                window.addEventListener('load', function() {
                  setTimeout(function() {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    const paintData = performance.getEntriesByType('paint');
                    
                    // Log Core Web Vitals
                    if (perfData) {
                      console.log('Performance Metrics:', {
                        'DOM Content Loaded': perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart + 'ms',
                        'Load Complete': perfData.loadEventEnd - perfData.loadEventStart + 'ms',
                        'Total Load Time': perfData.loadEventEnd - perfData.fetchStart + 'ms'
                      });
                    }
                    
                    // Log paint times
                    paintData.forEach(paint => {
                      console.log(paint.name + ':', paint.startTime + 'ms');
                    });
                  }, 0);
                });
              }
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
} 