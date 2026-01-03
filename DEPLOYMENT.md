# Deploying VimQuest to Cloudflare Pages

## Quick Start (5 minutes)

### Option 1: Using Git (Recommended)

1. **Create a GitHub repository:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: VimQuest game"
   git branch -M main
   git remote add origin https://github.com/yourusername/vimquest.git
   git push -u origin main
   ```

2. **Connect to Cloudflare Pages:**
   - Go to https://dash.cloudflare.com/
   - Click "Workers & Pages" → "Create application" → "Pages" → "Connect to Git"
   - Authorize GitHub and select your repository
   
3. **Configure Build Settings:**
   - **Project name:** vimquest (or your choice)
   - **Production branch:** main
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** / (leave empty)
   
4. **Environment Variables (if needed):**
   - Click "Add variable"
   - Name: `NODE_VERSION`
   - Value: `18`

5. **Deploy:**
   - Click "Save and Deploy"
   - Your site will be live at: `vimquest.pages.dev`

### Option 2: Direct Upload (No Git Required)

1. **Build locally:**
   ```bash
   npm install
   npm run build
   ```

2. **Upload to Cloudflare:**
   - Go to https://dash.cloudflare.com/
   - Click "Workers & Pages" → "Create application" → "Pages" → "Upload assets"
   - Drag and drop the `dist` folder
   - Click "Deploy site"

## Custom Domain Setup

1. **In Cloudflare Pages:**
   - Go to your project
   - Click "Custom domains" tab
   - Click "Set up a custom domain"
   - Enter your domain (e.g., `vimquest.com`)

2. **DNS Configuration:**
   - Cloudflare will automatically configure DNS if domain is on Cloudflare
   - If not, add a CNAME record pointing to your Pages URL

## Continuous Deployment

Every push to your main branch automatically triggers a new deployment!

```bash
# Make changes
git add .
git commit -m "Add new level"
git push

# Cloudflare automatically builds and deploys!
```

## Build Settings Troubleshooting

If build fails, check:

1. **Node version:** Set `NODE_VERSION=18` in environment variables
2. **Build command:** Must be exactly `npm run build`
3. **Output directory:** Must be `dist`

## Preview Deployments

Every pull request gets its own preview URL automatically!

- **Production:** `vimquest.pages.dev`
- **PR Preview:** `abc123.vimquest.pages.dev`

## Environment Variables for AdSense

When ready to add AdSense:

1. Go to project settings → Environment variables
2. Add:
   - `VITE_ADSENSE_CLIENT_ID` = `ca-pub-XXXXXXXXXX`
3. Redeploy

## Performance Features (Included Free)

✅ Global CDN (200+ cities)
✅ Automatic HTTPS
✅ Unlimited bandwidth
✅ DDoS protection
✅ Web Analytics (optional)

## Monitoring

Enable Web Analytics:
1. Go to your project settings
2. Click "Analytics" tab
3. Enable "Web Analytics"
4. View traffic, page views, and more!

## Costs

- **Free tier:** 
  - 500 builds/month
  - Unlimited requests
  - Unlimited bandwidth
  - 1 concurrent build

Perfect for VimQuest! 🎉

## Next Steps

1. ✅ Deploy to Cloudflare Pages
2. ✅ Set up custom domain (optional)
3. ✅ Apply for Google AdSense
4. ✅ Share with the community!

## Support

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Cloudflare Community](https://community.cloudflare.com/)
