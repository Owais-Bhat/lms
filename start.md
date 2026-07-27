# Quick Start Guide

This guide outlines the quick commands and steps required to initialize and execute the Mini LMS Mobile Application.

---

## ⚡ Quick Run Checklist

### 1. Install Dependencies
Ensure you have [Node.js](https://nodejs.org/) installed, clone the repository, and install the package dependencies:
```bash
npm install
```

### 2. Start the Metro Bundler
Launch the Expo developer server with a cleared cache to ensure it loads the clean codebase:
```bash
npx expo start -c
```

### 3. Running the App
* **Physical Device (Recommended)**: Download the **Expo Go** app, and scan the QR code displayed in the terminal.
* **Android Emulator**: Press `a` in your terminal (requires Android Studio to be configured with an emulator).
* **iOS Simulator**: Press `i` in your terminal (requires macOS and Xcode).

---

## 🛠️ App Features Overview
* **Authentication**: Login and Register screens. Fallback auto-logs you into an **Offline Mock Mode** if `api.freeapi.app` is rate-limited or offline.
* **Course Catalog**: Built utilizing **LegendList** for performance optimization. Search, pull-to-refresh, and bookmarking are fully supported.
* **WebView Integration**: Custom bidirectional bridge in the Course Details view allowing the Web page to signal lesson completions to the native app, which updates your native course progress bar.
* **Native Features**: Registers local push notifications, triggers a bookmark milestone alert (5+ bookmarks), and sets up a 24-hour idle reminder.
