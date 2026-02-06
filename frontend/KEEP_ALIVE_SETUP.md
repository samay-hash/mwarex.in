# Keep-Alive Setup for Render Backend

## Problem
Render's free tier puts your backend to sleep after 15 minutes of inactivity. When a user tries to sign in with Google, they see Render's ugly "waking up" screen.

## Solution
We've implemented TWO solutions to keep your backend awake:

---

## 1. Vercel Cron Job (Primary - Automatic)

A cron job is configured in `vercel.json` that pings your backend every 14 minutes.

### How it works:
- Vercel calls `/api/keep-alive` every 14 minutes
- This endpoint pings your Render backend at `/api/v1/health`
- Backend stays awake, users never see cold start screens!

### Files:
- `vercel.json` - Cron configuration
- `src/app/api/keep-alive/route.ts` - Keep-alive API route

### To Enable:
1. Just deploy to Vercel - the cron will start automatically
2. Check Vercel Dashboard → Your Project → Settings → Crons to verify

### Vercel Cron Limits (Free Tier):
- 2 cron jobs
- Runs once per day to once per hour (But Vercel's "Hobby" plan allows */14 minute intervals)
- If you're on the free tier and 14-minute intervals don't work, use the external service below

---

## 2. External Cron Service (Backup - Free)

If Vercel's cron doesn't work on free tier, use one of these free services:

### Option A: cron-job.org (Recommended)
1. Go to https://cron-job.org
2. Create a free account
3. Create a new cron job:
   - **URL**: `https://mwarex-backend.onrender.com/api/v1/health`
   - **Schedule**: Every 14 minutes (Custom: `*/14 * * * *`)
   - **Request Method**: GET
4. Enable the job

### Option B: UptimeRobot (Also Free)
1. Go to https://uptimerobot.com
2. Create a free account
3. Add a new monitor:
   - **Monitor Type**: HTTP(s)
   - **URL**: `https://mwarex-backend.onrender.com/api/v1/health`
   - **Monitoring Interval**: 5 minutes (minimum on free tier)
4. This will ping your server every 5 minutes

### Option C: Freshping
1. Go to https://www.freshworks.com/website-monitoring/
2. Free plan includes 50 monitors
3. Set up similar to UptimeRobot

---

## 3. Frontend Loading Modal (Fallback)

Even if the server does go to sleep, users will see a beautiful branded loading screen instead of Render's ugly one.

### Files:
- `src/app/auth/signin/page.tsx` - Sign in page with loading modal
- `src/app/auth/signup/page.tsx` - Sign up page with loading modal
- `src/lib/api.ts` - `warmAndRedirectToGoogle()` function

---

## Testing

### Test if backend is awake:
```bash
curl https://mwarex-backend.onrender.com/api/v1/health
```

### Test keep-alive endpoint (after deployment):
```bash
curl https://www.mwarex.in/api/keep-alive
```

---

## Summary

| Method | Frequency | Free? | Auto? |
|--------|-----------|-------|-------|
| Vercel Cron | Every 14 min | Yes (Hobby) | Yes |
| cron-job.org | Every 14 min | Yes | Yes |
| UptimeRobot | Every 5 min | Yes | Yes |
| Loading Modal | N/A | N/A | Fallback |

With these in place, your users will **never** see the Render cold start screen! 🎉
