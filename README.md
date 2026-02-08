# 📝 AI-Powered Collaborative NoteTakingApp

![Project Banner](https://via.placeholder.com/1200x300?text=AI+NoteTaking+App+Banner)

> **A Next-Gen Collaborative Workspace** featuring real-time editing, group chats, live cursors, and powerful local AI integration for summarizing and rewriting notes. Built with the MERN stack and Socket.io.

## 🚀 Features

### 🧠 AI-Powered Tools (Local AI)
- **⚡ Smart Summarization**: Instantly generate concise summaries of your notes using **Ollama (Mistral Model)**.
- **✨ AI Rewriting**: Polish your content with one click. The AI rewrites your notes to be clearer, more professional, and better structured.

### 🤝 Real-Time Collaboration
- **Live Cursors & Typing**: See exactly where your team members are typing in real-time.
- **Collaborative Editing**: Work on the same note simultaneously with your group.
- **Instant Updates**: Changes are reflected instantly across all connected devices using **Socket.io**.

### 👥 Groups & Community
- **Group Management**: Create groups, invite members, and manage permissions.
- **Group Chat**: Integrated real-time chat for every group to discuss ideas alongside your notes.
- **Group Subjects**: Organize notes into specific subjects shared within the group.

### 🎨 Stunning UI/UX
- **Aesthetic Design**: sleek dark mode interface with **Vanta.js** backgrounds and **GSAP** animations.
- **Visual Feedback**: Toast notifications for every important action (Note creation, deletion, member updates).
- **Markdown Support**: Full rich-text editing experience with **React Markdown** and **@uiw/react-md-editor**.

### 🔐 Security & core
- **Secure Authentication**: Robust user signup and login using **JWT (JSON Web Tokens)** and **HttpOnly Cookies**.
- **Data Persistence**: All data safely stored in **MongoDB**.

---

## 🛠️ Tech Stack

### **Frontend**
- **React 19** (Vite) - Fast, modern UI library.
- **TailwindCSS** - Utility-first styling.
- **GSAP** - Professional-grade animations.
- **Socket.io-client** - Real-time bidirectional communication.
- **Axios** - HTTP client.
- **Lucide React** - Beautiful icons.
- **Vanta.js** - 3D animated backgrounds.

### **Backend**
- **Node.js & Express** - Scalable server architecture.
- **MongoDB & Mongoose** - Flexible NoSQL database.
- **Socket.io** - Real-time event server.
- **Ollama API** - Local AI model integration (Mistral).
- **JWT & Bcrypt** - Security and encryption.

---

## ⚙️ Prerequisites

Before running the application, ensure you have the following installed:
1.  **Node.js** (v16+)
2.  **MongoDB** (Running locally or a cloud URI)
3.  **Ollama** (Required for AI features)
    -   Install Ollama from [ollama.com](https://ollama.com)
    -   Pull the Mistral model: `ollama pull mistral`
    -   Ensure it's running on port `11434` (default).

---

## 📥 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/Ai-notetakerapp-sockets.git
cd Ai-notetakerapp-sockets
```

### 2. Backend Setup
Navigate to the backend folder and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
# Add Cloudinary keys if needed for file uploads
```

Start the backend server:
```bash
npm start
```
> The server will run on `http://localhost:5000`.

### 3. Frontend Setup
Open a new terminal, navigate to the frontend folder, and install dependencies:
```bash
cd frontend
npm install
```

Start the development server:
```bash
npm run dev
```
> The application will open at `http://localhost:5173`.

---

## 🔌 Usage

1.  **Sign Up/Login**: Create an account to access the workspace.
2.  **Create Notes**: Start writing personal notes in the dashboard.
3.  **Create a Group**: Go to the "Groups" tab, create a new group, and add members by searching their names.
4.  **Collaborate**:
    -   Open a group note.
    -   Share the link or have members join via the dashboard.
    -   Type together and see updates live!
5.  **Use AI**:
    -   Select a note.
    -   Click **"AI Summarize"** to get a bulleted summary.
    -   Click **"Rewrite with AI"** to improve the writing style.

---

## 🤝 Contributing

Contributions are welcome!
1.  Fork the project.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
