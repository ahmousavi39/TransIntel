# Website Folder

This folder contains ready-to-deploy HTML files for your app's website.

## 📄 Files Included

- **index.html** - Landing page with app description and links
- **policy.html** - Privacy Policy (required for App Store submission)
- **terms.html** - Terms of Use (required for App Store submission)
- **icon.png** - Your app icon (add this file - 512x512px or 1024x1024px recommended)

## ✏️ Customization Checklist

Before deploying, update the following in all three HTML files:

### In All Files:
- [ ] Replace "Your App Name" with your actual app name
- [ ] Add your app icon as `icon.png` (512x512px or larger)
- [ ] Update App Store/Play Store links (currently commented out)

### In index.html:
- [ ] Update the app description
- [ ] Uncomment and add App Store badge link when available

### In policy.html:
- [ ] Update effective date
- [ ] Update pricing (currently €4.99)
- [ ] Add your contact information:
  - Email address
  - Physical address
  - Phone number
- [ ] Update copyright year and company name

### In terms.html:
- [ ] Update effective date
- [ ] Update pricing (currently €4.99)
- [ ] Add your contact information
- [ ] Update governing law jurisdiction
- [ ] Update copyright year and company name
- [ ] Customize sections based on your app's specific features

## 🌐 Deployment Options

### GitHub Pages
1. Push this folder to a GitHub repository
2. Go to Settings → Pages
3. Select branch and `/Website` folder
4. Your site will be at `https://username.github.io/repo-name/`

### Netlify
1. Connect your repository to Netlify
2. Set build command: (none needed for static HTML)
3. Set publish directory: `Website`
4. Deploy

### Vercel
1. Import your repository
2. Set framework preset to "Other"
3. Set output directory to `Website`
4. Deploy

### Custom Domain
After deploying to any platform above, you can:
1. Purchase a domain from a registrar
2. Add custom domain in hosting platform settings
3. Update DNS records as instructed

## 📱 App Store Requirements

Both Apple App Store and Google Play Store require:
- ✅ Privacy Policy URL
- ✅ Terms of Use URL (Apple requires this)
- ✅ Support URL (can be same as landing page)

Make sure to deploy these pages BEFORE submitting your app for review.

## 🎨 Design Notes

The website uses:
- Responsive design (mobile-friendly)
- System fonts for fast loading
- Clean, professional styling matching your app's theme
- Purple accent color (#3498db) - matches app primary color
- Shadow effects and rounded corners for modern look

## 📝 Legal Disclaimer

The provided legal templates are basic examples. Consider:
- Consulting with a lawyer for your specific jurisdiction
- Reviewing GDPR requirements if you have EU users
- Checking CCPA requirements if you have California users
- Updating based on your app's specific data collection practices

## 🔗 Example URLs

After deployment, your URLs will be:
- Landing page: `https://your-domain.com/`
- Privacy Policy: `https://your-domain.com/policy.html`
- Terms of Use: `https://your-domain.com/terms.html`

Use these URLs in your app's settings and store listings.
