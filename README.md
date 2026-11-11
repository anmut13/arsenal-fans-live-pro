# ARSENAL FANS LIVE — Professional Live Football Broadcast Platform

A broadcast graphics platform built for live football streaming (YouTube / Twitch) via OBS Studio, featuring an animated 4K tactical pitch, live match intelligence, momentum engine, scorebug, real-time clock, player profile cards, and director control center.

---

## 1. Technical Architecture & Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Web Audio API synthesizer.
- **Pitch Engine**: SVG pitch surface with FIFA-standard proportions, turf striping, interactive dragging, normalized coordinates ($0 - 100\%$), passing routes, and heatmaps.
- **Real-Time Synchronization**: `BroadcastChannel` (`arsenal_fans_live_channel`) + `localStorage` event listener for sub-millisecond multi-window synchronization between the Admin Console and OBS Studio.
- **Firebase Ready**: Pre-configured Firestore schemas and `firestore.rules` separating public overlays from protected admin records.
- **OBS Studio Output**: Dedicated clean URLs with transparent alpha channel support at 1920x1080 and 1280x720 resolutions.

---

## 2. Dedicated Interfaces & URL Routes

| Route | Interface | Description |
| :--- | :--- | :--- |
| `/` or `/admin` | **Admin Control Center** | Master dashboard with clock control, one-click event triggers, graphics switcher, squad management, and tactical engine. Protected with PIN (Default: `1886`). |
| `/broadcast` | **Live Broadcast Screen** | Clean graphics-only overlay designed for OBS Browser Source. Transparent background, scorebug, active popups, and ticker. |
| `/tactical` | **Tactical Pitch Studio** | Dedicated full-screen tactical analysis pitch with player headshots, colored rating badges, formations, and ball movement. |
| `/preview` | **Match Preview / Vision Mixer** | Dual-bus Program / Preview mixer (PST / PGM) with `TAKE / CUT` and `AUTO DISSOLVE`. |
| `/settings` | **Data & API Settings** | Provider-independent football data settings, polling frequency, connection status, and Firebase rules. |
| `/scoreboard` | **Isolated Scorebug** | Clean standalone scorebug overlay. |
| `/statistics` | **Isolated Statistics** | Full-screen or panel match stats comparison. |
| `/momentum` | **Isolated Momentum** | 90-minute attack momentum and territory control curve. |

---

## 3. Tactical Pitch & Visual Reference Match

The tactical pitch is modelled directly after professional football television analysis software:
- **Player Nodes**: Circular headshots with team borders, shirt numbers, and **prominent colored rating badges** (Gold for $\ge 8.5$, Emerald for $\ge 7.5$, Teal for $\ge 6.5$, Yellow for $\ge 6.0$, Rose for $< 6.0$).
- **Formations**: 4-3-3, 4-2-3-1, 4-4-2, 3-4-3, 3-5-2, and 4-1-4-1.
- **Interactive Dragging**: Administrators can drag any player or the football anywhere across the pitch in real-time.
- **Drawing Engine**: Click-to-draw passing lines (dashed yellow) and attacking runs (solid red).
- **Movement Simulation**: Play/Pause coordinated attacking runs with speed controls ($0.5\times$, $1\times$, $2\times$).

---

## 4. OBS Studio Setup Guide

1. Open **OBS Studio**.
2. Under **Sources**, click **+** and select **Browser**.
3. Set the Name to `Arsenal Live Overlay`.
4. Enter the URL:
   - For all-in-one broadcast overlay: `http://localhost:3000/#/broadcast` (or your deployed URL).
   - For tactical studio: `http://localhost:3000/#/tactical`.
5. Set:
   - **Width**: `1920`
   - **Height**: `1080`
   - **FPS**: `60`
6. Check **"Shutdown source when not visible"** and **"Refresh browser when scene becomes active"**.
7. In the Custom CSS field, ensure background transparency:
   ```css
   body { background-color: rgba(0, 0, 0, 0); margin: 0px auto; overflow: hidden; }
   ```
8. The overlay will render transparently on top of your camera or gameplay feed!

---

## 5. Football API Providers & Data Integrity

### Provider Options
1. **Manual Mode (Default)**: Complete director control. Instant response, zero API costs, resilient during internet fluctuations.
2. **API-Football (RapidAPI / API-Sports v3)**: Fixtures, live goals, cards, and lineups.
3. **SportScore / Football-Data.org**: Standard match events.

### Critical Data Integrity Principle
Standard commercial football livescore APIs do **not** supply continuous sub-second optical player pitch tracking coordinates. In *Arsenal Fans Live*, player coordinates are managed via the **Tactical Movement Engine** or manually calibrated by the analyst. Any calculated movement or simulated flow is clearly labelled as **Estimated / Tactical Simulation** to preserve journalistic broadcast integrity.

---

---

## 6. How to Host on GitHub Step-by-Step

### Method 1: Automated Deployment with GitHub Actions (Recommended)

The project includes `.github/workflows/deploy.yml` configured to build and deploy automatically on every push.

#### Step 1: Create a New GitHub Repository
1. Log in to [GitHub.com](https://github.com/).
2. In the top right corner, click the **+** icon and select **New repository**.
3. Name your repository (for example: `arsenal-fans-live`).
4. Set visibility to **Public** (required for free GitHub Pages).
5. Leave "Add a README file" **unchecked** (we already have a complete codebase).
6. Click **Create repository**.

#### Step 2: Initialize Git and Push Your Code
Open your terminal inside the project root and run:
```bash
# 1. Initialize local git repository (if not already initialized)
git init

# 2. Stage all files
git add .

# 3. Create your initial commit
git commit -m "feat: initial release of Arsenal Fans Live broadcast platform"

# 4. Set the default branch to main
git branch -M main

# 5. Link your GitHub remote (replace YOUR-USERNAME and YOUR-REPO)
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git

# 6. Push to GitHub
git push -u origin main
```

#### Step 3: Enable GitHub Pages in Repository Settings
1. Navigate to your repository on GitHub.
2. Click **Settings** (top tab with gear icon).
3. In the left sidebar, click **Pages** (under the "Code and automation" section).
4. Under **Build and deployment > Source**, click the dropdown and select **GitHub Actions**.
5. That's it! GitHub will automatically trigger the included workflow (`Deploy to GitHub Pages`).
6. Click the **Actions** tab at the top of your repository to watch the build complete (~45 seconds).

#### Step 4: Access Your Live Web App & OBS Overlays
Once deployed, your application will be live at:
```text
https://YOUR-USERNAME.github.io/YOUR-REPO/#/admin
```

And your OBS Browser Source URLs will be:
- **Live Broadcast Overlay**: `https://YOUR-USERNAME.github.io/YOUR-REPO/#/broadcast`
- **Tactical Pitch Studio**: `https://YOUR-USERNAME.github.io/YOUR-REPO/#/tactical`
- **Scoreboard Bug**: `https://YOUR-USERNAME.github.io/YOUR-REPO/#/scoreboard`
- **Match Statistics**: `https://YOUR-USERNAME.github.io/YOUR-REPO/#/statistics`
- **Attack Momentum**: `https://YOUR-USERNAME.github.io/YOUR-REPO/#/momentum`
- **Vision Mixer Preview**: `https://YOUR-USERNAME.github.io/YOUR-REPO/#/preview`

---

### Method 2: Manual Push via `gh-pages` Branch
If you prefer building locally and pushing the static `dist/` directory:
```bash
npm run build
npx gh-pages -d dist
```
Then under **Settings > Pages**, choose **Deploy from a branch** and select `gh-pages` branch.

---

---

## 7. How to Host & Deploy with Firebase Step-by-Step (No Steps Skipped)

The project includes pre-configured `firebase.json` (with SPA single-page rewrites and CORS headers for OBS) and `firestore.rules` (with public read access for overlays and protected write access for directors).

### Step 1: Install the Firebase CLI Tool
Open your terminal and install the official Firebase CLI globally:
```bash
npm install -g firebase-tools
```
Verify the installation by running `firebase --version`.

### Step 2: Authenticate with Your Google Account
Log in to your Firebase account via your browser:
```bash
firebase login
```
This will open your web browser. Click **Allow** to give the Firebase CLI permission to deploy on your behalf.

### Step 3: Create Your Firebase Project
1. Open [https://console.firebase.google.com/](https://console.firebase.google.com/) in your browser.
2. Click **Add project** (or **Create a project**).
3. Enter a project name (for example: `arsenal-fans-live-stream`).
4. Note your unique **Project ID** (e.g., `arsenal-fans-live-stream-1a2b3`).
5. Choose whether to enable Google Analytics (optional, can be disabled), then click **Create project**.

### Step 4: Enable Firestore Database & Hosting in the Console
1. In the Firebase console left menu under **Build**, click **Firestore Database**.
2. Click **Create database**.
3. Select your cloud location (e.g., `eur3 (europe-west)` or `nam5 (us-central)`).
4. Select **Start in test mode** or **Start in production mode** (our `firestore.rules` will automatically configure the correct broadcast permissions).
5. Next, under **Build**, click **Hosting** and click **Get started** to initialize hosting for your project.

### Step 5: Link Your Local Repository to Your Firebase Project
In your project directory terminal, link the Firebase project you just created:
```bash
firebase use --add
```
Select your Firebase project from the list (or provide its Project ID), and give it an alias such as `default`.

### Step 6: Build the Production Frontend
Compile the production-optimized Vite build to the `dist/` directory:
```bash
npm run build
```

### Step 7: Deploy Hosting and Security Rules in One Command
Run the deploy command:
```bash
firebase deploy
```
This command automatically:
- Uploads the built static frontend in `dist/` to Google Cloud global CDN hosting.
- Sets up Single Page Application (SPA) URL rewrites so all routes (`/#/broadcast`, `/#/admin`, `/#/tactical`) resolve cleanly.
- Deploys `firestore.rules` so public overlays have read access while admin functions require authenticated tokens.

### Step 8: Access Your Live Firebase URLs in OBS Studio
Upon deployment, Firebase will output your live URL:
```text
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/YOUR_PROJECT_ID/overview
Hosting URL: https://YOUR_PROJECT_ID.web.app
```

Your live OBS Studio Browser Source URLs are:
- **Live Broadcast Overlay**: `https://YOUR_PROJECT_ID.web.app/#/broadcast`
- **Admin Control Center**: `https://YOUR_PROJECT_ID.web.app/#/admin`
- **Tactical Pitch Studio**: `https://YOUR_PROJECT_ID.web.app/#/tactical`
- **Scoreboard Bug**: `https://YOUR_PROJECT_ID.web.app/#/scoreboard`
- **Match Statistics**: `https://YOUR_PROJECT_ID.web.app/#/statistics`
- **Attack Momentum**: `https://YOUR_PROJECT_ID.web.app/#/momentum`
- **Data & API Settings**: `https://YOUR_PROJECT_ID.web.app/#/settings`

### Step 9: Configure in OBS Studio
1. In OBS, click **+** under **Sources** → **Browser**.
2. Paste `https://YOUR_PROJECT_ID.web.app/#/broadcast`.
3. Set **Width**: `1920`, **Height**: `1080`, **FPS**: `60`.
4. Check **"Shutdown source when not visible"**.
5. The overlay will render transparently with zero lag over your live stream!

---

## 8. Testing Checklist

- [x] Match Clock starts, pauses, resets, and displays added stoppage time accurately.
- [x] Goal event triggers goal fanfare, increments scoreboard, updates momentum, and pushes celebratory broadcast graphic.
- [x] Yellow and Red cards trigger referee card alert lower thirds.
- [x] Players on tactical pitch can be dragged and repositioned with real-time coordinate updates.
- [x] Formations (4-3-3, 4-2-3-1, 4-4-2, 3-4-3) dynamically reposition squad.
- [x] Sound effects (goal fanfare, whistle, chimes) play through the Web Audio synthesizer without external asset dependencies.
- [x] Dual-window test: Open `/admin` in one tab and `/broadcast` in another; edits synchronize instantly.
