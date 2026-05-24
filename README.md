# ✨ Arwen's Blessing Generator

> *"She was called Undómiel, for she was the Evenstar of her people."*  
> — The Return of the King

A Middle-earth themed web application that bestows Elvish blessings from Arwen Undómiel upon visitors. Built with Node.js, Express, and hand-crafted vanilla HTML/CSS/JS.

---

## Features

- 🌟 **12 authentic Sindarin blessings** with English translations and lore context
- 🎵 **Elvish chime** synthesized via the Web Audio API — no external audio files
- ✨ **Animated starfield** background (Elbereth's stars) drawn on a canvas element
- 🌿 **Rivendell aesthetic** — deep forest greens, twilight purples, elven golds
- 📱 **Fully responsive** — mobile-first design
- 🔢 **Live blessing counter** — tracks blessings bestowed since server start
- 🚀 **CI/CD ready** — version badge confirms live deployments

---

## Tech Stack

| Layer    | Technology                              |
|----------|-----------------------------------------|
| Backend  | Node.js + Express 4.x                  |
| Frontend | Vanilla HTML5, CSS3, JavaScript (ES6+) |
| Process  | PM2 (cluster mode)                     |
| Fonts    | Cinzel Decorative, Cinzel, Lora (Google Fonts) |

---

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm 8+
- (Optional) PM2 for production: `npm install -g pm2`

### Development

```bash
# 1. Clone / navigate to project
cd arwen-blessing

# 2. Install dependencies
npm install

# 3. Start development server
npm start
# → http://localhost:3000
```

### Production with PM2

```bash
# Install PM2 globally
npm install -g pm2

# Create log directory
mkdir -p logs

# Start the app
pm2 start ecosystem.config.js

# Save process list (auto-restart on reboot)
pm2 save
pm2 startup

# View logs
pm2 logs arwen-blessing

# Zero-downtime reload after deployment
pm2 reload arwen-blessing
```

---

## API Endpoints

| Method | Endpoint       | Description                                                       |
|--------|----------------|-------------------------------------------------------------------|
| GET    | `/api/blessing` | Returns a random blessing + increments counter                   |
| GET    | `/api/counter`  | Returns current total blessing count (no increment)              |
| GET    | `/api/version`  | Returns app version from `package.json` (CI/CD verification)     |

### Example responses

**GET /api/blessing**
```json
{
  "success": true,
  "blessing": {
    "sindarin": "Nai elen siluva lyenna",
    "english": "May a star shine upon you",
    "context": "A common Elvish blessing, invoking Elbereth Gilthoniel..."
  },
  "totalBlessings": 42
}
```

**GET /api/version**
```json
{
  "success": true,
  "version": "1.0.0",
  "name": "arwen-blessing",
  "environment": "production"
}
```

---

## Configuration

Environment variables:

| Variable   | Default        | Description           |
|------------|----------------|-----------------------|
| `PORT`     | `3000`         | Server listen port    |
| `NODE_ENV` | `development`  | Environment mode      |

---

## Nginx Reverse Proxy (Optional)

To run behind Nginx on port 80:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass         http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

---

## CI/CD Deployment Notes

To visually confirm a new deployment is live:

1. Update `version` in `package.json` (e.g. `1.0.0` → `1.1.0`)
2. Optionally change `--version-accent` CSS variable in `style.css` to a new color
3. Deploy: `git pull && npm install && pm2 reload arwen-blessing`
4. Visit the site — the version badge in the footer confirms the new version

---

## Project Structure

```
arwen-blessing/
├── app.js                  # Express server
├── package.json            # Dependencies & version
├── ecosystem.config.js     # PM2 process config
├── README.md               # This file
└── public/
    ├── index.html          # Main page
    ├── style.css           # All styling
    └── script.js           # Frontend logic
```

---

## Acknowledgements

*"May the grace of the Valar go with you."*

Built with starlight and elven craft. The Sindarin phrases are drawn from Tolkien's linguistic works and the wider Elvish language community.
