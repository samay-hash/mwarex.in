<div align="center">

  <img src="https://readme-typing-svg.herokuapp.com?font=Inter&weight=700&size=40&pause=1000&color=FF0000&center=true&vCenter=true&width=600&lines=MwareX;The+OS+for+Modern+Creators" alt="Typing SVG" />

  ### 🚀 The Ultimate Video Collaboration Platform for YouTube Creators & Editors

  <p align="center">
    <b>Secure Credential Sharing • Cloud-Based Workflow • Instant YouTube Uploads</b>
  </p>

  <p align="center">
    <a href="https://mwarex.in">
      <img src="https://img.shields.io/badge/LIVE_SITE-FF0000?style=for-the-badge&logo=youtube&logoColor=white&labelColor=000000" alt="Live Site" />
    </a>
    <a href="#-tech-stack">
      <img src="https://img.shields.io/badge/TECH_STACK-2196F3?style=for-the-badge&logo=react&logoColor=white&labelColor=000000" alt="Tech Stack" />
    </a>
    <a href="#-contributing">
      <img src="https://img.shields.io/badge/CONTRIBUTE-00C853?style=for-the-badge&logo=github&logoColor=white&labelColor=000000" alt="Contribute" />
    </a>
  </p>

</div>

---

## 💡 I Built Something That YouTubers Actually Need

Most YouTube creators don’t have a secure or efficient way to work with editors. This forces them to waste hours on uploads, downloads — and in some cases, even share their Google account passwords just to get videos published.

### 🔴 The Reality (The Vicious Cycle)
Here’s the reality I’ve seen after talking to multiple creators:
1.  **Editor finishes the video** 🎬
2.  Uploads it to Google Drive ☁️
3.  Creator waits for upload to finish ⏳
4.  Downloads 3–5 GB files locally ⬇️
5.  Re-uploads the same file to YouTube ⬆️
6.  **Hours wasted. Every. Single. Time.** 🛑

### ✅ The MwareX Solution
So I built **MwareX** — a platform that fixes this entire process. Think of it as the missing bridge between creators and editors.

With MwareX:
- **Editors upload videos directly to the cloud** ☁️
- **Creators connect their YouTube channel with one click** 🔗
- **Creators review & approve videos instantly** 👀
- **Approved videos go straight to the connected YouTube channel** 🚀
- **No Google passwords shared. Ever.** 🔒

---

## 🛠️ Tech Stack & Dependencies

We use a cutting-edge, type-safe stack designed for performance, security, and scalability.

### **Frontend** (The Face)
| Technology | Description |
| :--- | :--- |
| **Next.js 16** | The React Framework for the Web (App Router). |
| **TypeScript** | Strict syntactical superset of JavaScript. |
| **Tailwind CSS** | Utility-first CSS framework for rapid UI development. |
| **Framer Motion** | Production-ready motion library for animations. |
| **Lucide React** | Beautiful & consistent icon toolkit. |
| **Socket.io-client**| Real-time bidirectional communication. |

### **Backend** (The Brain)
| Technology | Description |
| :--- | :--- |
| **Node.js** | JavaScript runtime built on Chrome's V8 engine. |
| **Express.js** | Fast, unopinionated, minimalist web framework. |
| **MongoDB Atlas** | Fully managed cloud database service. |
| **Cloudinary** | Enterprise-grade video management service. |
| **Google OAuth 2.0** | Secure authentication & YouTube Data API integration. |
| **Nodemailer** | Secure email transport setup with SMTP. |

---

## 📂 Codebase Hierarchy

For developers interested in the architecture, here is the high-level structure of the project:

```bash
MwareX/
├── backend/                  # Node.js & Express Server
│   ├── index.js              # Entry point
│   ├── models/               # MongoDB Mongoose Models (User, Video, etc.)
│   ├── routes/               # API Routes (Auth, Video, Editor, etc.)
│   ├── services/             # Business Logic (Email, YouTube Uploads)
│   ├── middlewares/          # Auth & file handling middlewares
│   └── uploads/              # Temp storage for video processing
│
├── frontend/                 # Next.js 16 Client
│   ├── src/
│   │   ├── app/              # Next.js App Router Pages
│   │   ├── components/       # Reusable UI Components
│   │   ├── lib/              # Utilities (API, Auth)
│   │   └── hooks/            # Custom React Hooks
│   ├── public/               # Static Assets
│   └── tailwind.config.js    # Styling Configuration
│
└── README.md                 # Project Documentation
```

---

## 🤝 How to Contribute

We welcome contributions from the community! If you'd like to improve MwareX, follow these steps:

1.  **Fork the Repository**: Click the "Fork" button at the top right of this page.
2.  **Clone Your Fork**:
    ```bash
    git clone https://github.com/your-username/MwareX.git
    cd MwareX
    ```
3.  **Create a Branch**:
    ```bash
    git checkout -b feature/amazing-feature
    ```
4.  **Make Changes**: Implement your feature or fix a bug.
5.  **Commit Changes**:
    ```bash
    git commit -m "feat: Add amazing feature"
    ```
6.  **Push to Branch**:
    ```bash
    git push origin feature/amazing-feature
    ```
7.  **Open a Pull Request**: Submit your PR on the main repository!

---

## 💻 Installation & Setup

### 1. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in `backend/` with the following keys:
```env
PORT=8000
MONGO_URI=your_mongodb_uri
FRONTEND_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT=http://localhost:8000/oauth2callback
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```
Run the server:
```bash
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
```
Create a `.env.local` file in `frontend/`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```
Run the client:
```bash
npm run dev
```

---

<div align="center">

  <h3>Let's Collaborate!</h3>
  <p>Found a bug? Have a feature idea? Just want to say hi?</p>

  <a href="https://github.com/samay-hash">
    <img src="https://img.shields.io/github/followers/samay-hash?style=social&label=Follow%20@samay-hash" alt="GitHub" />
  </a>
  <a href="https://x.com/ChemistGamer1">
    <img src="https://img.shields.io/twitter/follow/ChemistGamer1?style=social&label=Follow%20@ChemistGamer1" alt="Twitter" />
  </a>

  <p>Made with ❤️ by <b>Samay</b></p>
</div>
