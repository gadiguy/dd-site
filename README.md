# Technical Due Diligence Website

A website for Gadi Guy's Technical Due Diligence consulting services for VC funds, PE firms, and institutional investors.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Email

Copy the example environment file and add your Gmail App Password:

```bash
cp .env.example .env
```

Edit `.env` and add your Gmail App Password:
- Go to https://myaccount.google.com/apppasswords
- Create an App Password for "Mail"
- Paste the 16-character password in `.env`

### 3. Run the Server

```bash
npm start
```

Open http://localhost:3000 in your browser.

## Email Setup (Gmail)

The contact form sends emails via Gmail. To set this up:

1. **Enable 2-Factor Authentication** on your Google account
2. **Create an App Password:**
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it "DD Site"
   - Copy the 16-character password
3. **Add to .env file:**
   ```
   EMAIL_USER=gadiguy@gmail.com
   EMAIL_PASS=xxxx-xxxx-xxxx-xxxx
   ```

## Deployment

### Option 1: Railway / Render / Fly.io (Recommended)

These platforms support Node.js apps with environment variables:

1. Push code to GitHub
2. Connect repository to Railway/Render/Fly.io
3. Set environment variables: `EMAIL_USER` and `EMAIL_PASS`
4. Deploy

### Option 2: VPS (DigitalOcean, Linode, etc.)

```bash
# On your server
git clone your-repo
cd dd-site
npm install
cp .env.example .env
# Edit .env with your credentials
npm start
```

Use PM2 for process management:
```bash
npm install -g pm2
pm2 start server.js --name dd-site
pm2 save
pm2 startup
```

### Option 3: Heroku

```bash
heroku create your-app-name
heroku config:set EMAIL_USER=gadiguy@gmail.com
heroku config:set EMAIL_PASS=your-app-password
git push heroku main
```

## File Structure

```
dd-site/
├── index.html      # Main HTML page
├── styles.css      # All styles
├── script.js       # Frontend JavaScript
├── server.js       # Express backend
├── package.json    # Node.js dependencies
├── .env.example    # Environment template
├── .env            # Your credentials (don't commit!)
├── .gitignore      # Git ignore rules
├── portrait.png    # Profile image
└── README.md       # This file
```

## Features

- **Contact form** sends emails directly to gadiguy@gmail.com
- **Checklist form** notifies you of new download requests
- Mobile-responsive design
- Dark mode support
- Accessible (keyboard navigation, screen readers)

## Customization

### Update Contact Email

In `server.js`, change the `to:` field in both `mailOptions` objects:
```javascript
to: 'your-new-email@example.com',
```

### Update Social Links

In `index.html`, find the `social-links` div in the header and update the URLs.

### Update Pricing

In `index.html`, search for `pricing-grid` and edit the prices.

## Troubleshooting

### "Email credentials not configured" warning

Create a `.env` file with your Gmail App Password. See "Email Setup" above.

### Form submissions not sending

1. Check the server console for errors
2. Verify your App Password is correct
3. Make sure 2FA is enabled on your Google account
4. Check if "Less secure app access" needs to be disabled (App Passwords are more secure)

### Server won't start

```bash
# Check for port conflicts
lsof -i :3000

# Try a different port
PORT=3001 npm start
```
