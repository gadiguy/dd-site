# Technical Due Diligence Website

A production-ready static website for a solo consultant selling Technical Due Diligence services to VC funds, PE firms, and institutional investors.

## Quick Start

### Local Preview

1. **Simple method** - Open `index.html` directly in your browser

2. **Local server method** (recommended for testing forms):
   ```bash
   # Using Python 3
   python -m http.server 8000

   # Using Node.js (if you have npx)
   npx serve

   # Using PHP
   php -S localhost:8000
   ```
   Then open `http://localhost:8000` in your browser.

## Deployment on Netlify

### Method 1: Drag and Drop (Quickest)

1. Go to [app.netlify.com](https://app.netlify.com)
2. Sign up or log in
3. Drag the entire project folder onto the deploy area
4. Your site is live!

### Method 2: Git Integration (Recommended for ongoing updates)

1. Push this folder to a GitHub/GitLab/Bitbucket repository
2. Go to [app.netlify.com](https://app.netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect your repository
5. Deploy settings:
   - Build command: (leave empty)
   - Publish directory: `.` or `/`
6. Click "Deploy"

## Enabling Netlify Forms

Forms are pre-configured to work with Netlify automatically. After deploying:

1. Go to your site dashboard on Netlify
2. Navigate to **Forms** in the sidebar
3. You should see two forms listed:
   - `checklist-download` (lead magnet form)
   - `contact` (contact form)

### Setting Up Notifications

1. In Netlify dashboard, go to **Site settings** → **Forms** → **Form notifications**
2. Add an **Email notification** for each form
3. Configure the recipient email address

### Delivering the Checklist (Lead Magnet)

Option A: **Manual delivery**
- Check Netlify Forms submissions daily
- Send checklist PDF via email manually

Option B: **Automated delivery with Zapier**
1. Create a Zapier account
2. Set up a Zap: Netlify Form Submission → Send Email
3. Attach your checklist PDF to the automated email
4. Filter by form name = "checklist-download"

Option C: **Automated delivery with Make (Integromat)**
- Similar workflow to Zapier

## Customization Checklist

### Required Changes (Before Launch)

Edit `index.html` and update these placeholders:

| Placeholder | Location | What to add |
|-------------|----------|-------------|
| `TechDD` | Header logo | Your name or brand |
| `Your Name - Technical Due Diligence` | JSON-LD schema | Your actual name |
| `https://your-domain.com` | Meta tags, JSON-LD | Your domain |
| `https://linkedin.com/in/your-profile` | JSON-LD, footer | Your LinkedIn URL |
| `your@email.com` | Contact section, footer | Your email address |
| `#` (calendar link) | Hero CTA, contact section | Your Calendly/Cal.com link |
| `Your Name` | Footer | Your name |

### Search & Replace Commands

```bash
# In your text editor, use Find & Replace:
# - "your@email.com" → "actual@email.com"
# - "https://linkedin.com/in/your-profile" → "https://linkedin.com/in/actual"
# - "https://your-domain.com" → "https://youractualsite.com"
# - "Your Name" → "John Smith" (or your name)
```

### Adding Your Calendar Link

1. Create a scheduling link on [Calendly](https://calendly.com) or [Cal.com](https://cal.com)
2. Search for `calendar-link` in `index.html`
3. Replace `href="#"` with your actual booking URL

### Adding Price Ranges

In the Pricing section (`index.html`), update each package:

```html
<!-- Change this: -->
<span class="price-amount">Fixed</span>
<span class="price-note">Contact for quote</span>

<!-- To something like: -->
<span class="price-amount">$5,000 - $8,000</span>
<span class="price-note">Scope dependent</span>
```

### Customizing Case Studies

**Important guidelines to avoid confidentiality issues:**

1. **Never name clients** without explicit written permission
2. **Use generic descriptors**: "Series B SaaS" not "Acme Corp"
3. **Focus on findings and impact**, not identifying details
4. **Change specific numbers** if they could identify a deal
5. **Have legal review** any case study before publishing

Example safe format:
```html
<span class="case-study-tag">Series A Fintech</span>
<h3>Prevented $X Valuation Adjustment</h3>
<p>Assessment revealed [generic finding]. [Generic outcome].</p>
```

### Adding Sample Deliverables

1. Create redacted/sample PDFs of:
   - Executive memo template
   - Risk scoring matrix
   - Tech DD checklist (for lead magnet)

2. Upload to Netlify or a file hosting service
3. Update the proof section links in `index.html`

## File Structure

```
dd-site/
├── index.html      # Main HTML (all content and structure)
├── styles.css      # All styles (responsive, dark mode)
├── script.js       # JavaScript (nav, forms, FAQ accordion)
└── README.md       # This file
```

## Features

- **Mobile-first responsive design** - Works on all devices
- **Dark mode support** - Automatic via `prefers-color-scheme`
- **Accessible** - Proper heading structure, ARIA labels, keyboard navigation
- **SEO ready** - Meta tags, OpenGraph, JSON-LD structured data
- **Fast** - No frameworks, minimal dependencies, system fonts
- **Form ready** - Pre-configured for Netlify Forms

## Browser Support

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)

## Troubleshooting

### Forms not appearing in Netlify dashboard

- Make sure the site has been deployed at least once
- The forms are registered on first deploy
- Check that `data-netlify="true"` is present on form tags

### Styles not loading locally

- Make sure `styles.css` is in the same folder as `index.html`
- Check browser console for 404 errors
- Try using a local server instead of opening file directly

### Dark mode not working

- Ensure your OS/browser is set to dark mode
- Check that your browser supports `prefers-color-scheme`
- Safari and Firefox fully support this; older browsers may not

## License

This template is provided for your use. Customize freely for your business.

---

Built for Technical Due Diligence consultants serving the investment community.
