# Deployment Guide - Lukáš Machala Portfolio

## 🚀 Quick Deploy to Vercel

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio site"
   git remote add origin https://github.com/Lowcash/portfolio
   git push -u origin main
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect Next.js/React
   - Click "Deploy"
   - Done! You'll get a URL like `your-project.vercel.app`

## 🌐 Custom Domain Setup

1. **Buy Domain:**
   - Recommended: `lowcash.dev` or `lukasmachala.com`
   - Providers: Namecheap, GoDaddy, Google Domains

2. **Connect to Vercel:**
   - In Vercel project settings → Domains
   - Add your domain (e.g., `lowcash.dev`)
   - Vercel will give you DNS records

3. **Update DNS (at your domain registrar):**
   - **A Record:** `@` → `76.76.21.21` (Vercel IP)
   - **CNAME:** `www` → `cname.vercel-dns.com`
   - Wait 24-48 hours for DNS propagation

## 📊 Google Analytics Setup

1. **Create GA4 Property:**
   - Go to [analytics.google.com](https://analytics.google.com)
   - Create new property
   - Get Measurement ID (looks like `G-XXXXXXXXXX`)

2. **Add to your site:**
   - Create `/components/GoogleAnalytics.tsx` (already done below)
   - Add your Measurement ID
   - Import in App.tsx

## 🔍 SEO Checklist

✅ `robots.txt` - Already created in `/public/robots.txt`
✅ `sitemap.xml` - Already created in `/public/sitemap.xml`
✅ Meta tags - Need to add Open Graph tags (see below)
✅ Mobile responsive - Already done
✅ Fast loading - Optimized with Motion animations

## 📝 Before Going Live:

1. Update sitemap.xml with your actual domain
2. Update robots.txt with your actual domain
3. Add LinkedIn URL in Contact.tsx
4. Add Google Analytics ID
5. Optional: Add CV PDF to `/public/cv.pdf`

## 🎯 Post-Launch:

1. Submit sitemap to Google Search Console
2. Share on LinkedIn, Instagram (@__lowcash__)
3. Add link to GitHub profile
4. Monitor with Google Analytics

---

**Current status:** Ready for deployment! Just push to GitHub and connect to Vercel.
