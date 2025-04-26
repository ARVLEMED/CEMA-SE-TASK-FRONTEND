
# 📋 Project Overview

The **Health Information System Frontend** is a React-based web application that helps doctors manage client consultations and health programs. It features a client queue for ongoing consultations, detailed consultation forms, and a programs management section. Built with React,CSS, and React Router, it is lightweight, fast, and easy to extend.  
Ideal for clinics, health centers, or as a foundation for a larger healthcare project.

---

## 🛠 Tech Stack
- React.js
- Vite
- React Router
- Axios
- Custom CSS

---

## 📂 Project Structure
```bash
src/
├── components/        # Reusable UI components (Navbar, etc.)
├── pages/             # Main pages (ConsultationPage, ProgramsPage, etc.)
├── styles/            # Global and page-specific CSS
├── App.jsx            # Application routes
├── main.jsx           # Entry point
└── assets/            # Static assets (images, icons)
```

---

## 🚀 How to Run Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/health-info-system-frontend.git
   cd health-info-system-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in your browser**
   Navigate to `http://localhost:5173`

---

## 📋 Available Pages

- **Consultation Page**
  - View queued clients.
  - Conduct consultations: enter vitals, symptoms, diagnosis, treatment plans, etc.
  - Mark consultations as complete or add clients to a program.

- **Programs Page**
  - View health programs.
  - Add, edit, or delete programs.
  - Search for programs easily.
  - **clients Page**
  - View client list.
  - Add, edit, or delete clients.
  - Search for clients easily.

---

## 🔗 API Connection

> ℹ️ If connecting to a backend, update the `axios` base URL to match your server endpoint in a dedicated API service file.

Example:
```javascript
axios.defaults.baseURL = 'http://localhost:5000/api';
```

---

## 🎨 Styling

- Basic styles are handled using **CSS**.
- Custom page-level styling is added in `/styles/global.css` and `/styles/PageName.css`.

---

## 📦 Build for Production

When ready to deploy:

```bash
npm run build
```
The output will be in the `dist/` folder, ready to host.

---

## 🧹 Future Improvements
- Improve responsiveness for mobile devices.
- Add role-based access (e.g., Admin, Doctor).

---

## 📑 License
This project is open-source and free to use.

---