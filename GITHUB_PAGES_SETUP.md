# GitHub Pages Setup Guide

This guide explains how to enable and configure GitHub Pages for the SafeMind project.

## Quick Setup

### Step 1: Enable GitHub Pages

1. Go to your repository on GitHub: https://github.com/AllisonMH/safemind-draft1
2. Click on **Settings** (in the repository menu)
3. Scroll down to **Pages** (in the left sidebar under "Code and automation")
4. Under "Build and deployment":
   - **Source**: Select "Deploy from a branch"
   - **Branch**: Select `main` (or your default branch)
   - **Folder**: Select `/docs`
5. Click **Save**

### Step 2: Wait for Deployment

- GitHub will automatically build and deploy your site
- This usually takes 1-2 minutes
- You'll see a green checkmark when it's ready
- Your site will be available at: **https://allisonmh.github.io/safemind-draft1**

### Step 3: Verify

1. Visit https://allisonmh.github.io/safemind-draft1
2. You should see the SafeMind landing page
3. If you see a 404, wait a few more minutes and refresh

## Site Structure

```
docs/
├── index.html      # Main landing page
├── styles.css      # All styling
├── script.js       # Interactive features
├── _config.yml     # Jekyll configuration
└── README.md       # Documentation
```

## Customization

### Update Site Content

Edit `docs/index.html` to change:
- Text content
- Features
- Links
- Sections

### Update Styling

Edit `docs/styles.css` to change:
- Colors
- Fonts
- Layout
- Animations

### Update Functionality

Edit `docs/script.js` to change:
- Interactive features
- Animations
- Event handlers

## Features Included

✅ **Responsive Design**
- Mobile-friendly
- Tablet optimized
- Desktop layouts

✅ **Interactive Elements**
- Smooth scrolling navigation
- Code copy buttons
- Fade-in animations
- Mobile menu

✅ **SEO Optimized**
- Meta tags
- Open Graph tags
- Semantic HTML
- Fast loading

✅ **Accessible**
- ARIA labels
- Keyboard navigation
- Color contrast
- Screen reader friendly

## Updating the Site

### Method 1: Direct Edit on GitHub

1. Navigate to `docs/` folder in your repository
2. Click on the file you want to edit
3. Click the pencil icon (Edit)
4. Make your changes
5. Commit directly to main branch
6. Site will auto-deploy in 1-2 minutes

### Method 2: Local Development

```bash
# 1. Make changes locally
cd docs
# Edit files as needed

# 2. Test locally (optional)
python3 -m http.server 8000
# Visit http://localhost:8000

# 3. Commit and push
git add docs/
git commit -m "Update GitHub Pages"
git push origin main

# 4. Wait for auto-deployment
```

## Custom Domain (Optional)

To use a custom domain like `safemind.org`:

1. Add a `CNAME` file to `docs/` folder with your domain
2. Configure DNS with your domain provider:
   - Add CNAME record pointing to `allisonmh.github.io`
3. In GitHub Pages settings, enter your custom domain
4. Enable "Enforce HTTPS"

## Troubleshooting

### Site Not Loading (404)

**Solutions:**
- Wait 2-5 minutes for initial deployment
- Check that Pages is enabled in Settings
- Verify `/docs` folder is selected
- Ensure `index.html` exists in `/docs`
- Check repository is public (or have GitHub Pro for private repos)

### Changes Not Appearing

**Solutions:**
- Wait 1-2 minutes for deployment
- Hard refresh browser (Ctrl+F5 or Cmd+Shift+R)
- Clear browser cache
- Check git commit was successful
- View deployment status in Actions tab

### Broken Links

**Solutions:**
- Check all links use absolute URLs or proper relative paths
- Verify GitHub repository name matches baseurl in `_config.yml`
- Test links locally before deploying

### Styling Issues

**Solutions:**
- Check CSS file is properly linked in HTML
- Verify file paths are correct
- Test in incognito/private browser
- Clear browser cache

## Deployment Status

You can check deployment status:

1. Go to **Actions** tab in repository
2. Look for "pages build and deployment" workflow
3. Green checkmark = successful deployment
4. Red X = deployment failed (check logs)

## Local Development

To develop locally:

```bash
# Method 1: Python HTTP Server
cd docs
python3 -m http.server 8000
# Visit http://localhost:8000

# Method 2: PHP Server
cd docs
php -S localhost:8000
# Visit http://localhost:8000

# Method 3: Node.js http-server
npm install -g http-server
cd docs
http-server -p 8000
# Visit http://localhost:8000
```

## Performance Optimization

The site is already optimized:
- ✅ Minimal CSS (no frameworks)
- ✅ Vanilla JavaScript (no libraries)
- ✅ No build process needed
- ✅ Fast loading (<1s)
- ✅ Google Fonts preconnect
- ✅ Efficient animations

## Analytics (Optional)

To add Google Analytics:

1. Get tracking ID from Google Analytics
2. Add to `docs/index.html` before `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## Support

If you need help:
- Check GitHub Pages documentation: https://docs.github.com/pages
- Review Jekyll docs: https://jekyllrb.com/docs/
- Open an issue in the repository

## Site URL

Once enabled, your site will be live at:

🌐 **https://allisonmh.github.io/safemind-draft1**

You can share this URL to showcase the SafeMind project!

---

**Note**: The site is deployed from the `/docs` folder on the main branch. Any changes pushed to this folder will automatically update the live site within 1-2 minutes.
