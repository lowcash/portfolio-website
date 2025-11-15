import { useEffect } from 'react';

// Meta tags for SEO - sets document metadata
export function MetaTags() {
  useEffect(() => {
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
      { property: 'og:image', content: 'https://lowcash.dev/og-image.png' },
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
      { property: 'twitter:image', content: 'https://lowcash.dev/og-image.png' },
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
  }, []);

  return null;
}