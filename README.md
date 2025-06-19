# Currency Converter

Welcome to **Currency Converter** – a modern, AI-powered web application for converting currencies with ease and accuracy. Built using Next.js, TypeScript, and Tailwind CSS, this project leverages advanced AI and cloud-native technologies to deliver a seamless user experience.

---

## ✨ Features

- **Real-time Currency Conversion**  
  Instantly convert between multiple currencies with up-to-date exchange rates.

- **AI Integration**  
  Utilizes AI-powered backend logic for enhanced accuracy and smart suggestions.

- **Modern UI**  
  Responsive and accessible interface styled with Tailwind CSS.

- **Extensible Architecture**  
  Modular codebase with clear separation of concerns:  
  - `src/ai` – AI logic and integrations  
  - `src/app` – Next.js app routes and pages  
  - `src/components` – Reusable UI components  
  - `src/hooks` – Custom React hooks  
  - `src/lib` – Utility libraries and backend logic  
  - `src/types` – TypeScript type definitions

- **Progressive Web App**  
  Manifest and icons included for installable, offline-capable experience.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/your-username/currency-converter.git
   cd currency-converter
   ```

2. **Install dependencies:**

   ```sh
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables:**

   Copy `.env.example` to `.env` and fill in any required API keys or settings.

   ```sh
   cp .env.example .env
   ```

4. **Run the development server:**

   ```sh
   npm run dev
   # or
   yarn dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 🛠️ Project Structure

```
.
├── src/
│   ├── ai/           # AI logic and integrations
│   ├── app/          # Next.js app routes and pages
│   ├── components/   # Reusable UI components
│   ├── hooks/        # Custom React hooks
│   ├── lib/          # Utility libraries and backend logic
│   └── types/        # TypeScript type definitions
├── public/           # Static assets (icons, manifest)
├── .env              # Environment variables
├── tailwind.config.ts
├── next.config.ts
├── package.json
└── ...
```

---

## 📦 Deployment

You can build and start the app for production:

```sh
npm run build
npm run start
```

---

## 🤝 Contributing

Contributions are welcome! Please open issues or pull requests for improvements and bug fixes.

---

## 📄 License

This project is licensed under the MIT License.

---

**Enjoy using Currency Converter!**