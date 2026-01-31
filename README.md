<div align="center">

  <!-- Dynamic Gradient Title -->
  <a href="https://mwarex.in">
    <img src="https://readme-typing-svg.herokuapp.com?font=Orbitron&weight=900&size=50&pause=1000&color=FFFFFF&background=00000000&center=true&vCenter=true&width=600&lines=MwareX;Enterprise+Video+OS;For+Creators" alt="MwareX" />
  </a>

  <p align="center">
    <img src="https://img.shields.io/badge/v1.0.0-Beta-blueviolet?style=for-the-badge&labelColor=black" />
    <img src="https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
    <img src="https://img.shields.io/badge/Status-Production-success?style=for-the-badge&labelColor=black" />
  </p>

  <h3 align="center">The Secure Operating System for Modern YouTube Teams</h3>

</div>

---

## ⚡ The Mission: Fixing the "Creator's Bottleneck"

> *"Most YouTube creators don’t have a secure or efficient way to work with editors. This forces them to waste hours on uploads, downloads — and in some cases, even share their Google account passwords just to get videos published."*

### ❌ The Old Way (Broken & Insecure)
We analyzed the workflow of top creators. Here is the painful reality:
1.  **Hours Wasted**: Editor uploads to Drive ➔ Creator Downloads (5GB+) ➔ Creator Re-uploads to YouTube.
2.  **Security Risks**: Sharing Google Password with editors just so they can upload? **Never again.**
3.  **Chaos**: "Final_v3_REAL_FINAL.mp4" lost in WhatsApp chats.

### ✅ The MwareX Way (Streamlined)
**MwareX** creates a secure bridge between your editing team and your YouTube channel.
- **Editors** upload directly to your secure MwareX cloud. ☁️
- **You (The Creator)** get a push notification to review the video. �
- **One Click Approval**: The video is instantly pushed to YouTube via secure OAuth. 🚀
- **Zero Privacy Compromise**: Editors never see your YouTube credentials. �️

---

## 🛠️ The Tech Ecosystem

We leveraged a high-performance stack to ensure speed, security, and scalability.

<div align="center">

| **Frontend Core** | **Backend Engine** | **Cloud & AI** |
|:---:|:---:|:---:|
| <img height="50" src="https://skillicons.dev/icons?i=nextjs,ts,tailwind,framer" /> | <img height="50" src="https://skillicons.dev/icons?i=nodejs,express,mongodb,postman" /> | <img height="50" src="https://skillicons.dev/icons?i=gcp,cloudinary,vercel,git" /> |
| **Next.js 16 • TypeScript • Framer Motion** | **Node.js • Express • MongoDB Atlas** | **Google OAuth • Cloudinary • Vercel** |

</div>

### 🏗️ Architecture Highlights
- **Real-time Engine**: Built with `Socket.io` for live status updates on video processing.
- **Secure Auth**: Implemented secure `HTTP-Only` cookies with `JWT` and Google OAuth 2.0.
- **Cloud Native**: Zero local storage dependency; all assets are processed in the cloud (Cloudinary/S3).
- **Type Safety**: End-to-end type safety using `TypeScript` and `Zod` schemas.

---

## 📂 Codebase Navigation

A quick guide for developers exploring the source code:

```bash
MwareX/
├── 📱 frontend/              # Next.js 16 (App Router)
│   ├── src/app/              # Pages & Layouts
│   ├── src/components/       # Reusable UI (Radix + Lucide)
│   ├── src/lib/              # API Clients & Auth Utilities
│   └── public/               # Static Assets
│
├── ⚙️ backend/               # Node.js Microservice
│   ├── models/               # MongoDB Schemas (Mongoose)
│   ├── routes/               # REST API Endpoints
│   ├── services/             # Core Logic (YouTube Uploads, Email)
│   └── middlewares/          # Security Layers (CORS, Auth)
│
└── 📄 README.md             # You are here
```

---

## 🚀 Getting Started

Ready to deploy your own instance?

### 1. Clone & Setup
```bash
git clone https://github.com/samay-hash/MwareX.git
cd MwareX
```

### 2. Backend Configuration
Create a `.env` file in `/backend` with your credentials:
```env
PORT=8000
MONGO_URI=mongodb+srv://...
FRONTEND_URL=http://localhost:3000
# Google Cloud Console Credentials
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT=http://localhost:8000/oauth2callback
# Cloudinary & Email
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
EMAIL_USER=...
EMAIL_PASS=...
```
```bash
cd backend && npm install && npm run dev
```

### 3. Frontend Configuration
Create a `.env.local` file in `/frontend`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```
```bash
cd frontend && npm install && npm run dev
```

---

<div align="center">

  ### 🔗 Connect With Me
  <p>I build tools that solve real problems.</p>

  <a href="https://github.com/samay-hash">
    <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" />
  </a>
  <a href="https://x.com/ChemistGamer1">
    <img src="https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white" />
  </a>
  <a href="mailto:samay3076@gmail.com">
    <img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" />
  </a>

  <br><br>
  <p><i>Licensed under MIT. Made with 💙 by Samay Samrat.</i></p>

</div>
