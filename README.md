# Instaclone

A full-featured Instagram-inspired social media app built with React Native and Expo. Includes photo/video sharing, a dual-feed home screen, real-time global chat, follower system, threaded comments, and animated interactions — all backed by Appwrite.

> ⚠️ **Work in Progress.** APK / Expo Go link and demo video coming soon.

---

## Features

### Auth & Profiles
- Email/password sign up and sign in
- Edit profile picture and bio
- View any user's profile with follower/following counts
- Follow and unfollow users

### Feed & Posts
- **For You** tab — paginated feed of all posts
- **Following** tab — paginated feed from users you follow
- Upload photos and videos with a title and description
- Like posts with a spring-animated heart button
- Pull-to-refresh on all feeds
- Infinite scroll with cursor-based pagination

### Comments
- Threaded comment system (nested replies)
- Bottom sheet UI for browsing and adding comments

### Real-time Messaging
- Global live chat powered by Appwrite Realtime
- Message bubbles grouped by sender with timestamps
- Smart time formatting ("Yesterday 3:45 PM", gap markers between chains)
- Long-press to copy any message
- Tap a username or avatar to navigate to their profile
- Scroll-to-latest button when scrolled up in history

### UX & Polish
- Skeleton shimmer loaders for feed, profiles, and grids
- Toast notifications for async action feedback
- Error boundaries — one bad post won't crash the feed
- Animated tab switching between feeds and profile tabs

---

## Tech Stack

| | Technology | Version |
|---|---|---|
| Framework | React Native + Expo | SDK 54 |
| Routing | Expo Router | v6 |
| Styling | NativeWind (Tailwind CSS) | v4 |
| Animations | React Native Reanimated | v4 |
| Backend | Appwrite (auth, DB, storage, realtime) | Cloud |
| Video | expo-video + expo-video-thumbnails | — |
| Images | expo-image + expo-image-picker | — |

---

## Project Structure

```
app/
├── (auth)/          # Sign in & sign up screens
├── (tabs)/          # Home, Create, Messages, Profile (tab navigator)
│   └── profile/     # Own profile, Edit profile, Settings
├── post/            # Post detail view
└── user/            # Other user profiles and their posts

components/          # Reusable UI components
lib/appwrite.js      # All Appwrite API calls
hooks/               # Custom hooks (e.g. useHomeFeed)
context/             # UserContext, ToastContext
constants/colors.js  # Single source of truth for the color system
```

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org)
- [Expo Go](https://expo.dev/go) on your phone, or an Android/iOS simulator
- An [Appwrite](https://appwrite.io) project (Cloud or self-hosted)

### Setup

1. Clone the repo:
```bash
git clone https://github.com/your-username/instaclone.git
cd instaclone
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root and fill in your Appwrite credentials:
```env
EXPO_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
EXPO_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
EXPO_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
EXPO_PUBLIC_APPWRITE_STORAGE_ID=your_storage_id
EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID=your_users_collection_id
EXPO_PUBLIC_APPWRITE_POSTS_COLLECTION_ID=your_posts_collection_id
EXPO_PUBLIC_APPWRITE_MESSAGES_COLLECTION_ID=your_messages_collection_id
EXPO_PUBLIC_APPWRITE_FOLLOWS_COLLECTION_ID=your_follows_collection_id
EXPO_PUBLIC_APPWRITE_COMMENTS_COLLECTION_ID=your_comments_collection_id
EXPO_PUBLIC_APPWRITE_POST_LIKES_COLLECTION_ID=your_postlikes_collection_id
```

4. Start the development server:
```bash
npx expo start
```

5. Scan the QR code with Expo Go, or press `a` for Android / `i` for iOS simulator.
