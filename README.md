# QistBook — Digital Khata & Udhaar Manager

QistBook is a production-ready digital credit ledger for retail shopkeepers built with **Next.js (App Router)**, **Tailwind CSS**, and **MongoDB Atlas**.

---

## Deploying to Vercel

This app is 100% compatible with Vercel and can be deployed with zero extra build configuration:

### Step 1: Import Project to Vercel
1. Push this project to your GitHub, GitLab, or Bitbucket repository.
2. In your [Vercel Dashboard](https://vercel.com/dashboard), click **"Add New..."** → **"Project"**.
3. Select your repository. Vercel will automatically detect **Next.js** as the framework.

### Step 2: Set Environment Variables in Vercel
In the Vercel deployment screen under **Environment Variables**, add the following:

| Variable | Value | Description |
| :--- | :--- | :--- |
| `MONGODB_URI` | `mongodb+srv://ACT_project:ACT_project321@cluster0.w0plwcy.mongodb.net/qistbook?retryWrites=true&w=majority&appName=Cluster0` | Your MongoDB Atlas connection URI |
| `JWT_SECRET` | `qistbook_jwt_act_project_secret_key_2026` (or any random string) | Secret key to sign user auth tokens |
| `GEMINI_API_KEY` | *(Optional)* | Google Gemini API key for the AI Munshi advisor feature |

### Step 3: MongoDB Atlas Network Access
Because Vercel serverless functions use dynamic IP addresses:
1. Open [MongoDB Atlas](https://cloud.mongodb.com/).
2. Go to **Security** → **Network Access**.
3. Ensure IP address `0.0.0.0/0` (Allow Access from Anywhere) is added to your IP Access List.

### Step 4: Click Deploy
Click **Deploy**. Vercel will build and deploy the app to your custom `*.vercel.app` domain.
