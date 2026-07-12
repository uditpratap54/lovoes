# LoveOS — Operation Sheetal ❤️

> A futuristic AI OS-themed surprise interactive experience for Sheetal.

## Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

### Required Environment Variables

| Variable | Description | Where to Get It |
|---|---|---|
| `VITE_FIREBASE_API_KEY` | Firebase API key | Firebase Console → Project Settings |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | Firebase Console → Project Settings |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID | Firebase Console → Project Settings |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | Firebase Console → Project Settings |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID | Firebase Console → Project Settings |
| `VITE_FIREBASE_APP_ID` | Firebase app ID | Firebase Console → Project Settings |
| `VITE_TELEGRAM_BOT_TOKEN` | Telegram bot token | [@BotFather](https://t.me/BotFather) on Telegram |
| `VITE_TELEGRAM_CHAT_ID` | Your Telegram chat ID | [@userinfobot](https://t.me/userinfobot) on Telegram |
| `VITE_EMAILJS_SERVICE_ID` | EmailJS service ID | [EmailJS Dashboard](https://www.emailjs.com) |
| `VITE_EMAILJS_TEMPLATE_ID` | EmailJS template ID | [EmailJS Dashboard](https://www.emailjs.com) |
| `VITE_EMAILJS_PUBLIC_KEY` | EmailJS public key | [EmailJS Dashboard](https://www.emailjs.com) |
| `VITE_EMAILJS_TO_EMAIL` | Your email to receive notifications | Your email address |

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project named "operation-sheetal"
3. Enable Firestore Database (Start in test mode)
4. Go to Project Settings → Your Apps → Web App
5. Copy the config values to your `.env` file

### 3. Telegram Bot Setup
1. Message [@BotFather](https://t.me/BotFather) on Telegram
2. Send `/newbot` and follow the instructions
3. Copy the bot token to `VITE_TELEGRAM_BOT_TOKEN`
4. Message [@userinfobot](https://t.me/userinfobot) to get your chat ID
5. Copy to `VITE_TELEGRAM_CHAT_ID`
6. Start a conversation with your new bot first!

### 4. EmailJS Setup
1. Sign up at [emailjs.com](https://www.emailjs.com)
2. Add an Email Service (Gmail recommended)
3. Create an Email Template with variables: `{{response}}`, `{{timestamp}}`
4. Copy Service ID, Template ID, and Public Key to `.env`

### 5. Run Locally
```bash
npm run dev
```

### 6. Deploy to Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# Set public dir to: dist
# Configure as SPA: Yes
npm run build
firebase deploy
```

## Secret Features 🤫
- Type `LOVE` anywhere → floating hearts
- Type `SHEETAL` anywhere → fireworks
- Type `NURSE` anywhere → heartbeat animation
- Double tap the logo → surprise message

## Password
The login password is: **SHEETAL**
