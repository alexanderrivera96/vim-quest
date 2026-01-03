# VimQuest 🎮⚡

Master Vim Through Interactive Challenges

## About

VimQuest is an interactive game that teaches Vim commands through progressive challenges. Players learn essential Vim motions, operators, and text objects while competing for the best efficiency scores.

## Features

- 12 progressive levels teaching Vim fundamentals
- Real-time keystroke tracking and efficiency scoring
- Visual feedback with cursor highlighting
- Quick reference guide for commands
- Efficiency warnings to encourage optimal Vim usage

## Local Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment to Cloudflare Pages

### Method 1: Git Integration (Recommended)

1. Push your code to GitHub/GitLab
2. Go to [Cloudflare Pages Dashboard](https://dash.cloudflare.com/)
3. Click "Create a project" → "Connect to Git"
4. Select your repository
5. Configure build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node version:** 18 or higher
6. Click "Save and Deploy"

### Method 2: Direct Upload

```bash
# Build the project
npm run build

# Upload the dist folder to Cloudflare Pages via dashboard
```

## Adding Google AdSense

### Step 1: Apply for AdSense
1. Go to [Google AdSense](https://www.google.com/adsense/)
2. Apply with your domain
3. Wait for approval (usually 1-2 weeks)

### Step 2: Add AdSense Code

Once approved:

1. **Update `index.html`:**
   - Uncomment the AdSense script tag
   - Replace `ca-pub-XXXXXXXXXX` with your publisher ID

2. **Update `src/App.jsx`:**
   - Uncomment the ad unit code
   - Replace `data-ad-client` and `data-ad-slot` with your values
   - Add this script after ads load:
   ```javascript
   (adsbygoogle = window.adsbygoogle || []).push({});
   ```

### Recommended Ad Placements
- **Top Banner:** 728x90 (Leaderboard) - Already included
- **Sidebar:** 300x250 (Medium Rectangle) - Optional
- **Footer:** 468x60 (Banner) - Already included
- **Between Levels:** 320x50 (Mobile Banner) - For mobile users

## Project Structure

```
vimquest-app/
├── public/              # Static assets
├── src/
│   ├── App.jsx         # Main app with ad placements
│   ├── VimQuest.jsx    # Game component
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── index.html          # HTML template
├── package.json        # Dependencies
├── vite.config.js      # Vite configuration
└── tailwind.config.js  # Tailwind CSS config
```

## Environment Variables (Optional)

Create a `.env` file for environment-specific settings:

```env
VITE_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXX
```

## Performance Tips

- Cloudflare Pages automatically provides CDN caching
- Vite optimizes bundle sizes automatically
- Consider lazy loading ads to improve initial page load

## License

MIT License - Feel free to use and modify

## Contributing

Contributions welcome! Please open an issue or PR.

## Support

If you enjoy VimQuest, consider:
- Starring the repo ⭐
- Sharing with fellow developers
- Contributing new levels or features

---

Made with ❤️ for Vim enthusiasts
