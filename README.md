# Aether LMS Mobile Application

A high-performance, premium Mini LMS Mobile Application developed using React Native Expo SDK 54, TypeScript, NativeWind, LegendList, and Zustand. 

This project fulfills the requirements of the React Native Expo Developer Assignment.

---

## 🚀 Setup & Installation Instructions

### Prerequisites
* **Node.js** (v18 or higher)
* **npm** (comes packaged with Node.js)
* **Expo Go app** on your physical device (iOS/Android) or configured local simulators.

### Installation Steps
1. Clone the repository and navigate to the project directory:
   ```bash
   cd lms
   ```
2. Install the application dependencies:
   ```bash
   npm install
   ```
3. Run the development server with a cleared cache to compile the latest code:
   ```bash
   npx expo start -c
   ```
4. Scan the QR code using your phone's camera (iOS) or the Expo Go App (Android). Alternatively, press `a` for Android Emulator or `i` for iOS Simulator.

---

## 🔑 Environment Variables Needed
No external `.env` file is required for basic operations because:
* **API Base URL**: Hardcoded to `https://api.freeapi.app/api/v1` inside `src/services/apiClient.ts` as per the assignment specifications.
* **Expo EAS Project ID**: Stored in `app.json` (`f3a02a6c-32e5-4db8-9ac0-f282d4cfefc2`) and `eas.json` for cloud builds.

---

## 🏗️ Key Architectural Decisions

1. **Zustand for State Management**:
   We chose Zustand for global state management because it provides lightweight, boilerplate-free state containers, making it easier to separate business logic from the UI components.

2. **LegendList for Render Optimization**:
   Instead of `FlatList`, we integrated `@legendapp/list` (LegendList) for the course catalog list and bookmark views. It recycles components off-screen, drastically reducing rendering load and optimizing frame-rates for complex nested card structures.

3. **SecureStore & AsyncStorage Persistence**:
   - **Expo SecureStore** is used exclusively for sensitive user tokens (`accessToken`, `refreshToken`) to prevent access token leaks.
   - **AsyncStorage** is used for caching non-sensitive course items and user bookmarks to enable seamless offline capabilities.

4. **Bidirectional WebView Bridge**:
   Syllabus course details are loaded inside a custom `<WebView>` element. We inject custom parameters via headers and communicate state via `postMessage`.
   - **Web-to-Native**: User checkboxes on the web page send status events to update the native progress bar.
   - **Native-to-Web**: A control panel button on the native page injects JavaScript commands directly into the WebView DOM.

5. **API Client with Offline Fallback Mode**:
   Due to frequent rate limits and temporary downtime of the public Sandbox API (`api.freeapi.app`), the `apiClient.ts` custom wrapper handles timeouts and retries. If a network failure occurs, the Zustand stores automatically trigger **Offline Mock Mode**, allowing seamless registration, login, and course browsing using cached datasets.

---

## ⚠️ Known Issues / Limitations
1. **FreeAPI Availability**: The Sandbox API is subject to rate-limiting or server outages. When offline or timed out, the app automatically transitions to its offline mock state.
2. **Push Notifications in Emulators**: Android emulators or iOS simulators may not support remote notifications without correct Google Play Services configurations. We recommend using a physical device with Expo Go to verify permissions and local notification schedulers.

---

## 📦 APK Build Instructions
The project is configured for cloud builds using Expo Application Services (EAS). To trigger a preview/development APK build for testing:
1. Initialize/Login to EAS:
   ```bash
   npx eas login
   ```
2. Trigger the preview build:
   ```bash
   npx eas build --platform android --profile preview
   ```
This will output a downloadable `.apk` file that can be installed directly on Android devices.
