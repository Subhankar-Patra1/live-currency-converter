# 💱 Currency Converter

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Build with Next.js](https://img.shields.io/badge/Next.js-powered-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.x-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38b2ac.svg)](https://tailwindcss.com/)
[![Status](https://img.shields.io/badge/status-active-brightgreen.svg)]()

Welcome to **Currency Converter** – a modern, AI-enhanced web application that delivers fast and accurate currency conversions. Built using **Next.js**, **TypeScript**, and **Tailwind CSS**, it leverages AI and cloud-native architecture to provide a seamless developer and user experience.

---

## ✨ Features

- ⚡ **Real-Time Currency Conversion**  
  Convert between multiple currencies using live exchange rates.

- 🤖 **AI-Powered Backend**  
  Smart suggestions and logic enhancements via integrated AI models.

- 🎨 **Modern UI & UX**  
  Fully responsive interface with dark mode support, built with Tailwind CSS.

- 🧱 **Scalable Codebase**  
  Modular architecture for easy extension and collaboration:
  ```
  src/
  ├── ai/         → AI logic and integrations
  ├── app/        → App routes (Next.js)
  ├── components/ → Reusable UI parts
  ├── hooks/      → Custom React hooks
  ├── lib/        → Utility logic and backend functions
  └── types/      → TypeScript types
  ```

- 📲 **Progressive Web App (PWA)**  
  Includes manifest, icons, and offline-ready capabilities.

---

## 🚀 Getting Started

### 🧰 Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### 📥 Installation

1. **Clone the repo:**

   ```bash
   git clone https://github.com/Subhankar-Patra1/live-currency-converter.git
   cd live-currency-converter
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Setup environment variables:**

   Copy the provided `.env.example` file and rename it to `.env`. Then, fill in your API keys:

   ```bash
   cp .env.example .env
   ```

   Example variables:
   ```env
   GOOGLE_API_KEY=your-google-api-key-here
   EXCHANGE_API_KEY=your-exchange-api-key-here
   ```

4. **Run the development server:**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

   Visit [http://localhost:3000](http://localhost:3000) to see the app.

---

## 🧾 Environment Variables

Your `.env` file should contain:

```env
GOOGLE_API_KEY=your-real-key
EXCHANGE_API_KEY=your-real-key
```

> Never commit real API keys. `.env` is ignored via `.gitignore`.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js + TypeScript + Tailwind CSS
- **AI:** Integrated AI logic under `src/ai`
- **Backend Utils:** Cloud-native logic in `src/lib`
- **PWA:** Configured for offline support and mobile installability

---

## 📦 Deployment

You can deploy this app to platforms like:

- [**Vercel**](https://vercel.com/)
- [**Netlify**](https://netlify.com/)
- [**Render**](https://render.com/)

### For production build:

```bash
npm run build
npm run start
```

> Don’t forget to set the same environment variables in your hosting dashboard.

---

## 🤝 Contributing

Pull requests and contributions are welcome!  
Feel free to open issues for bugs, enhancements, or discussions.

---

## 📄 License

Licensed under the [MIT License](LICENSE).

---

**🌍 Built with ❤️ by Subhankar Patra**  
_Transforming global currency access with speed, AI, and simplicity._
