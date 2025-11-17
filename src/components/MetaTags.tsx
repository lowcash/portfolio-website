import { useEffect } from 'react';

// Meta tags for SEO - sets document metadata
export function MetaTags() {
  useEffect(() => {
    // OG Image URL - dynamically constructed from current origin
    // Works on localhost, staging, and production
    const ogImageUrl = `${window.location.origin}/og-image.png`;

    // Set document title
    document.title = "Lukáš Machala - Fullstack Developer & Software Architect";

    // Set meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Fullstack developer specializing in TypeScript, React, Next.js, and AI-assisted development. Building modern web applications with agentic workflows.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Fullstack developer specializing in TypeScript, React, Next.js, and AI-assisted development. Building modern web applications with agentic workflows.';
      document.head.appendChild(meta);
    }

    // Set meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', 'Fullstack Developer, TypeScript, React, Next.js, tRPC, AI Development, Software Architect, Lowcash, Lukáš Machala');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'keywords';
      meta.content = 'Fullstack Developer, TypeScript, React, Next.js, tRPC, AI Development, Software Architect, Lowcash, Lukáš Machala';
      document.head.appendChild(meta);
    }

    // Set meta author
    const metaAuthor = document.querySelector('meta[name="author"]');
    if (metaAuthor) {
      metaAuthor.setAttribute('content', 'Lukáš Machala');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'author';
      meta.content = 'Lukáš Machala';
      document.head.appendChild(meta);
    }

    // Set Open Graph tags
    const ogTags = [
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://lowcash.dev/' },
      { property: 'og:title', content: 'Lukáš Machala - Fullstack Developer & Software Architect' },
      { property: 'og:description', content: 'Fullstack developer specializing in TypeScript, React, Next.js, and AI-assisted development. Building modern web applications with agentic workflows.' },
      { property: 'og:image', content: ogImageUrl },
    ];

    ogTags.forEach(({ property, content }) => {
      const existing = document.querySelector(`meta[property="${property}"]`);
      if (existing) {
        existing.setAttribute('content', content);
      } else {
        const meta = document.createElement('meta');
        meta.setAttribute('property', property);
        meta.content = content;
        document.head.appendChild(meta);
      }
    });

    // Set Twitter tags
    const twitterTags = [
      { property: 'twitter:card', content: 'summary_large_image' },
      { property: 'twitter:url', content: 'https://lowcash.dev/' },
      { property: 'twitter:title', content: 'Lukáš Machala - Fullstack Developer & Software Architect' },
      { property: 'twitter:description', content: 'Fullstack developer specializing in TypeScript, React, Next.js, and AI-assisted development. Building modern web applications with agentic workflows.' },
      { property: 'twitter:image', content: ogImageUrl },
    ];

    twitterTags.forEach(({ property, content }) => {
      const existing = document.querySelector(`meta[property="${property}"]`);
      if (existing) {
        existing.setAttribute('content', content);
      } else {
        const meta = document.createElement('meta');
        meta.setAttribute('property', property);
        meta.content = content;
        document.head.appendChild(meta);
      }
    });

    // Set canonical URL - tells Google this is the main version
    const canonicalUrl = 'https://lowcash.dev/';
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonical) {
      canonical.href = canonicalUrl;
    } else {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      canonical.href = canonicalUrl;
      document.head.appendChild(canonical);
    }

    // Add JSON-LD structured data for rich search results
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Lukáš Machala",
      "alternateName": "Lowcash",
      "url": "https://lowcash.dev",
      "jobTitle": "Fullstack Developer & Software Architect",
      "description": "Fullstack developer specializing in TypeScript, React, Next.js, tRPC, Prisma, and AI-assisted development workflows.",
      "knowsAbout": [
        "TypeScript",
        "React",
        "Next.js",
        "tRPC",
        "Prisma",
        "PostgreSQL",
        "AI Development",
        "Software Architecture",
        "Augmented Reality",
        "VR Development",
        "Shader Programming"
      ],
      "sameAs": [
        // Add your social links here when available
        // "https://github.com/yourusername",
        // "https://linkedin.com/in/yourusername"
      ],
      "alumniOf": {
        "@type": "EducationalOrganization",
        "name": "CTU in Prague" // Add correct university name
      }
    };

    // Remove existing structured data if any
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);
  }, []);

  return null;
}