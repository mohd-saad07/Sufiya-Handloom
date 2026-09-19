# 🚀 Deployment Guide: Sufiya Handloom (Render + Vercel + Supabase)

Follow this simple, step-by-step guide to deploy your full-stack project to the cloud for free.

---

## 📌 Deployment Overview

| Component | Platform | Free Tier | Role |
| :--- | :--- | :--- | :--- |
| **Database & Images** | **Supabase** | ✅ Free | Already active & connected (`epjbkhncnzbcxuvhhqbm.supabase.co`) |
| **Backend API** | **Render** | ✅ Free | Runs Express API (`https://your-api.onrender.com`) |
| **Frontend Website** | **Vercel** | ✅ Free | Blazing-fast static CDN hosting for Vite React |

---

## Step 0: Push Code to GitHub

If you haven't pushed this project to your GitHub account yet:
1. Create a new repository on [github.com](https://github.com) (e.g. `sufiya-handloom`).
2. Open terminal in the project folder and run:
   ```bash
   git init
   git add .
   git commit -m "Complete Sufiya Handloom with Supabase and production deployment configs"
   git branch -M main
   git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO>.git
   git push -u origin main
   ```

---

## Step 1: Deploy Backend to Render (2 Minutes)

1. Go to **[dashboard.render.com](https://dashboard.render.com)** and sign in.
2. Click **"New +"** (top right) and select **"Web Service"**.
3. Choose **"Build and deploy from a Git repository"** and connect your GitHub repo.
4. Fill in these settings:
   - **Name:** `sufiya-handloom-backend` (or any name you like)
   - **Region:** Any region near your audience (e.g., `Singapore` or `Frankfurt` or `Oregon`)
   - **Root Directory:** `server` *(IMPORTANT: Must be `server`)*
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start` (or `node server.js`)
   - **Instance Type:** `Free`
5. Scroll down to **"Environment Variables"** and click **"Add Environment Variable"** for each of the following:

   | Key | Value (from your server/.env) |
   | :--- | :--- |
   | `PORT` | `10000` |
   | `NODE_ENV` | `production` |
   | `ADMIN_PASSWORD` | `Zaid9026` |
   | `JWT_SECRET` | `sufia_handloom_secret_key_2026_xyz` |
   | `RECEIVER_EMAIL` | `sufiyahandloom0@gmail.com` |
   | `SMTP_USER` | `sufiyahandloom0@gmail.com` |
   | `SMTP_PASS` | *Your 16-character Gmail App Password* |
   | `SUPABASE_URL` | `https://epjbkhncnzbcxuvhhqbm.supabase.co` |
   | `SUPABASE_KEY` | `sb_secret_xu0w5XRIFT3sUQZOaNQSZw_mTWgJhxz` |
   | `SUPABASE_BUCKET` | `product-images` |

6. Click **"Create Web Service"**.
7. Render will build and deploy your backend in ~1–2 minutes.
8. When deployment finishes, copy your **Render Web Service URL** at the top of the page:
   > Example: `https://sufiya-handloom-backend.onrender.com`

*(Test it by opening `https://sufiya-handloom-backend.onrender.com/api/health` in your browser. You should see `{"status":"ok"}`).*

---

## Step 2: Deploy Frontend to Vercel (2 Minutes)

1. Go to **[vercel.com](https://vercel.com)** and sign in with GitHub.
2. Click **"Add New..."** > **"Project"**.
3. Select your `sufiya-handloom` GitHub repository and click **"Import"**.
4. In the Project Configuration:
   - **Root Directory:** Click **Edit** and select `client` *(IMPORTANT)*.
   - **Framework Preset:** `Vite` (Vercel detects this automatically).
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Expand the **"Environment Variables"** section and add:
   - **Name:** `VITE_API_URL`
   - **Value:** Paste your Render Backend URL from Step 1 (e.g. `https://sufiya-handloom-backend.onrender.com`)
     *(Do NOT add a trailing slash `/`)*
6. Click **"Deploy"**.
7. In ~30 seconds, Vercel will give you your live production URL:
   > Example: `https://sufiya-handloom.vercel.app`

---

## Step 3: Verification & Test Checklist

1. **Visit Homepage**: Open your live Vercel link. Check that products loaded from Supabase.
2. **Admin Portal**: Go to `/admin` on your Vercel URL:
   - Enter password: `Zaid9026`
   - Try creating a test product with an uploaded picture (it will store directly into Supabase cloud bucket).
3. **Customer Checkout**:
   - Add a product to your cart and proceed to Checkout.
   - Place an order. Check that it shows order confirmation and saves to Supabase `orders` table.

🎉 **Congratulations! Your application is 100% deployed on world-class cloud infrastructure!**
