# 💼 JobTracker

A powerful, entirely client-side job application tracking system built with **Next.js**, **React 19**, and **Tailwind CSS**. JobTracker is designed for high performance, maximum privacy, and complete data ownership.

Unlike traditional trackers, JobTracker uses **IndexedDB (Dexie.js)** to store all of your data locally in your browser. There are no databases, no servers, and absolutely zero tracking. Your data is 100% yours.

## ✨ Features

- **📊 Kanban Board:** Organize job applications effortlessly by dragging them across stages (e.g., Applied, Interviewing, Offered, Rejected).
- **📅 Interactive Calendar & Timeline:** Keep track of upcoming interviews, deadlines, and events in a powerful visual grid.
- **🤝 Network Management:** Maintain a contact list for referrals, recruiters, and coffee chats.
- **📚 Resources Library:** Store resume links, portfolio items, and interview preparation materials in one place.
- **🌗 Dark Mode:** Full theme support powered by Next-Themes and Shadcn UI.
- **💾 Local First & Portable:** 
  - All data is securely stored in your browser's IndexedDB.
  - No account or backend required.
  - Seamlessly export your entire database to a `.json` file and import it on any other device.

## 🛠️ Technology Stack

- **Framework:** [Next.js](https://nextjs.org) (App Router)
- **UI & Styling:** [Tailwind CSS v4](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Database:** [Dexie.js](https://dexie.org/) (IndexedDB Wrapper)
- **Icons:** [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

First, clone the repository and install the dependencies:

```bash
# Clone the repository
git clone https://github.com/zehan12/JobTracker.git
cd JobTracker

# Install dependencies
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The application will instantly initialize a local IndexedDB instance, and you can begin tracking applications immediately!

## 🔄 Migrating Data Across Devices

Because JobTracker is serverless, your data lives strictly on your local machine. If you want to use the app on another computer or browser:

1. Click the **Data Management (Export/Import)** button in the application header.
2. Select **Export Data** to download a `.json` backup of your database.
3. Open JobTracker on your new device/browser, click **Import Data**, and select your file.

Your Kanban boards, calendar events, and contacts will instantly appear.

## 📄 License

This project is open-source and available under the MIT License. Feel free to fork, modify, and customize it to land your dream job!
