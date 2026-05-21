# Aether LMS Mobile Application (React Native Expo)

A high-performance, premium Mini LMS Mobile Application developed using React Native Expo SDK 54, TypeScript, NativeWind (Tailwind CSS for React Native), and Zustand. 

---

## 🌟 Key Features

1. **Authentication & Session Persistence**:
   - Implements Register and Login pages against `https://api.freeapi.app/api/v1/users` endpoints.
   - Integrates **Expo SecureStore** for high-security storage of auth tokens (`accessToken`, `refreshToken`).
   - Implements **Auto-Login** session validation and restoration upon app restart.
   - Incorporates automated JWT refresh interceptors with retry logic.

2. **Dynamic Course Catalog**:
   - Integrates instructor lists (`/api/v1/public/randomusers`) and course cards (`/api/v1/public/randomproducts`) in a zipped data structure.
   - Optimized list scrolling using **LegendList** (`@legendapp/list/react-native`) with item recycling, key extraction, and React Memoization to prevent unnecessary re-renders.
   - Features pulls-to-refresh, loading state indicators, and inline query search filtering.

3. **WebView Syllabus Integration**:
   - Renders a custom interactive syllabus environment inside `<WebView>`.
   - Passes credentials and device parameters via custom WebView HTTP headers.
   - **Bidirectional Native-Web Bridge**:
     - *Web-to-Native*: WebView syllabus checkboxes transmit lesson completion status back to the native app, which dynamically updates a native progress tracker bar. A "Claim Certificate" action triggers a native Alert notification.
     - *Native-to-Web*: Injecting JavaScript tips dynamically into the WebView's DOM using a native control panel button.

4. **Native Device Features**:
   - **Local Notifications** (`expo-notifications`): Registers push permissions and schedules a recurring 24-hour idle reminder notification. Triggers a milestone push notification immediately when the user has bookmarked 5 or more courses.
   - **Offline Network Detection** (`@react-native-community/netinfo`): Renders a sticky warning banner when connection drops. Automatically falls back to localized storage caches (`AsyncStorage`) for course catalog data.
   - **Live Camera / Photo Upload** (`expo-image-picker`): Allows users to change their profile picture by taking/uploading a photo.

---

## 🏗️ Architecture & File Structure

```
lms/
├── src/
│   ├── app/                      # Expo Router File-based Navigation
│   │   ├── (auth)/               # Authorization flow group (login, register)
│   │   ├── (tabs)/               # Main core app tabs group
│   │   │   ├── index.tsx         # Course Catalog List
│   │   │   ├── bookmarks.tsx     # Bookmarked courses
│   │   │   └── profile.tsx       # Profile screen & statistics
│   │   ├── course/
│   │   │   ├── [id].tsx          # Course Details view & Enroll CTA
│   │   │   └── view.tsx          # WebView lesson syllabus viewer
│   │   ├── _layout.tsx           # Global routing navigation stack
│   │   └── index.tsx             # Auth controller & session initialization
│   ├── components/
│   │   └── CourseCard.tsx        # Memoized course card rendering component
│   ├── services/
│   │   ├── apiClient.ts          # Fetch wrapper with timeouts, retries, and token-refresh
│   │   └── notificationService.ts# Local push notification permission & scheduling helper
│   ├── store/
│   │   ├── useAuthStore.ts       # Zustand authorization store
│   │   └── useCourseStore.ts     # Zustand course data, bookmarks, and enrollment store
│   ├── hooks/
│   │   └── useNetwork.ts         # Custom offline status hook
│   ├── utils/
│   │   └── courseTemplate.ts     # WebView local syllabus HTML & JS bridge template
│   └── global.css                # Tailwind global imports
├── tailwind.config.js            # Tailwind compiler configuration
├── metro.config.js               # Metro bundler hook for NativeWind CSS
├── babel.config.js               # Babel compiler preset hook for NativeWind
└── package.json
```

---

## ⚙️ Setup & Installation Instructions

### Prerequisites
Make sure you have Node.js (v18+) and npm installed.

### 1. Install Dependencies
Clone the repository and install all packages:
```bash
npm install
```

### 2. Run the Development Server
Start the local Expo development server:
```bash
npx expo start
```

### 3. Open on Emulator / Device
In the terminal output, select one of the following:
- Press `a` to open in an **Android Emulator** (requires Android Studio).
- Press `i` to open in an **iOS Simulator** (requires macOS and Xcode).
- Scan the QR code using the **Expo Go** application on your physical iOS or Android device.

---

## ⚡ Key Architectural Decisions

- **Zustand over Redux**: Selected Zustand due to its lightweight nature, simple hook-based integration, and zero boilerplate, leading to much cleaner code structure.
- **Native Fetch Client**: Rather than importing Axios, we developed a highly robust custom `fetch` wrapper in `apiClient.ts` that includes automatic timeout handling, request interceptor token attachment, request retry logic on 5xx status codes, and recursive async token refresh handlers.
- **LegendList for Infinite Lists**: Traditional `FlatList` has memory performance problems with complex card layouts. We integrated `@legendapp/list` which recycles views offscreen, drastically reducing rendering delays and layout lag.
- **Dynamic HTML strings for WebView**: Loading local HTML files can fail on Android depending on resource bundling paths. Loading the HTML template as a dynamically formatted string is completely bulletproof, loads instantaneously, and lets us interpolate course variables before load.

---

## ⚠️ Known Limitations
- The API backend (`api.freeapi.app`) is a sandbox hub and may experience rate-limits or temporary offline status. We have implemented local cache overrides in the course and auth stores so that the application remains fully browsable and interactive in offline cache mode.
- Local push notifications scheduler on Android requires configuring native channel importance, which has been handled in `notificationService.ts`.
