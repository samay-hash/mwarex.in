<div align="center">

  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=700&size=40&pause=1000&color=2196F3&center=true&vCenter=true&width=500&lines=MwareX" alt="Typing SVG" />

  ### 🚀 The Ultimate Video Collaboration Platform for YouTube Creators & Editors

  <p align="center">
    <b>Secure Credential Sharing • Cloud-Based Workflow • Instant YouTube Uploads</b>
  </p>

  <p align="center">
    <a href="https://mware-x.vercel.app">
      <img src="https://img.shields.io/badge/LIVE-DEMO-FF0000?style=for-the-badge&logo=vercel&logoColor=white&labelColor=000000" alt="Live Demo" />
    </a>
    <a href="#-tech-stack">
      <img src="https://img.shields.io/badge/TECH-STACK-2196F3?style=for-the-badge&logo=react&logoColor=white&labelColor=000000" alt="Tech Stack" />
    </a>
    <a href="#-contributing">
      <img src="https://img.shields.io/badge/CONTRIBUTE-00C853?style=for-the-badge&logo=github&logoColor=white&labelColor=000000" alt="Contribute" />
    </a>
  </p>

</div>

---

## 🌪️ The Problem

<div align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Roboto&weight=500&size=22&pause=1000&color=FF5252&center=true&vCenter=true&width=600&lines=Shared+Passwords+Are+a+Security+Nightmare.;40%25+of+YouTubers+Get+Hacked.;Hours+Wasted+Downloading+Render+Files." alt="Problem Statement" />
</div>

Traditional video workflow is **broken**:
- ❌ **Security Risk**: Creators share Google passwords with editors.
- ❌ **Slow Workflow**: Editors upload to Drive → Creator downloads (GBs) → Creator re-uploads to YouTube.
- ❌ **Inefficient**: Massive time loss in file transfers.

## ✨ The MwareX Solution

<div align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Roboto&weight=500&size=22&pause=1000&color=00E676&center=true&vCenter=true&width=600&lines=Zero+Credentials+Shared.;Direct+Cloud+Uploads.;One-Click+YouTube+Publishing." alt="Solution Statement" />
</div>

**MwareX** bridges the gap:
- ✅ **OAuth 2.0 Security**: Editors **NEVER** see your channel password.
- ✅ **Cloud Native**: Editors upload to MwareX → You review → One click push to YouTube.
- ✅ **AI Powered**: AI-generated descriptions and tags (coming soon).
- ✅ **Smart Notifications**: WhatsApp & Email updates on video status.

---

## 🛠️ Tech Stack & Dependencies

<div align="center">
  <br>
  <img src="https://skillicons.dev/icons?i=nextjs,react,ts,tailwind,nodejs,express,mongodb,cloudinary,firebase,git,github,vercel,postman,vscode" />
  <br><br>
</div>

We use a cutting-edge, type-safe stack to ensure performance and scalability.

### **Frontend** (The Face)
| Technology | Description |
| :--- | :--- |
| **Next.js 16** | The React Framework for the Web (App Router). |
| **TypeScript** | Strict syntactical superset of JavaScript. |
| **Tailwind CSS** | Utility-first CSS framework for rapid UI development. |
| **Framer Motion** | Production-ready motion library for React. |
| **Lucide React** | Beautiful & consistent icon toolkit. |
| **Sonner** | An opinionated toast component for React. |
| **Socket.io-client**| Real-time bidirectional event-based communication. |

### **Backend** (The Brain)
| Technology | Description |
| :--- | :--- |
| **Node.js** | JavaScript runtime built on Chrome's V8 engine. |
| **Express.js** | Fast, unopinionated, minimalist web framework. |
| **MongoDB Atlas** | Fully managed cloud database service. |
| **Cloudinary** | Cloud-based image and video management services. |
| **Google Gemini** | Generative AI SDK for advanced content features. |
| **Nodemailer** | Easy email sending for Node.js. |
| **Razorpay** | Payment gateway integration. |
| **Zod** | TypeScript-first schema declaration and validation. |

---

## 💻 Installation & Setup

Want to contribute? Great! Follow these steps to get the project running locally.

### 1. Clone the Repository
```bash
git clone https://github.com/samay-hash/MwareX.git
cd MwareX
```

### 2. Backend Setup
Navigate to the backend folder and install dependencies:
```bash
cd backend
npm install
```

**Create a `.env` file in the `backend` directory:**
```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET_USER=your_user_secret
JWT_SECRET_ADMIN=your_admin_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT=http://localhost:8000/oauth2callback
FRONTEND_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
GEMINI_API_KEY=your_gemini_key
```

**Run the Backend:**
```bash
npm start
# or for development with auto-reload
npm run dev
```

### 3. Frontend Setup
Navigate to the frontend folder and install dependencies:
```bash
cd ../frontend
npm install
```

**Create a `.env.local` file in the `frontend` directory:**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Run the Frontend:**
```bash
npm run dev
```

Visit `http://localhost:3000` to see the app in action!

---

## 🤝 Contributing

We love contributions! Here's how you can help:

1.  **Fork** the repo.
2.  **Create** a branch: `git checkout -b feature-name`.
3.  **Commit** your changes: `git commit -m 'Add some feature'`.
4.  **Push** to the branch: `git push origin feature-name`.
5.  **Submit** a pull request.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">

  **Made with 💙 by Samay**

  <a href="https://github.com/samay-hash">
    <img src="https://img.shields.io/github/followers/samay-hash?style=social" alt="GitHub Followers" />
  </a>
  <a href="https://x.com/ChemistGamer1">
    <img src="https://img.shields.io/twitter/follow/your_handle?style=social" alt="Twitter Follow" />
  </a>

</div>
