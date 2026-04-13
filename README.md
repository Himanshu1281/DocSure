# DocSure

DocSure is a premium, location-aware doctor discovery mobile application built with React Native and Expo. It allows users to find trusted clinical curators nearby, view their transparent consultation fees, and manage medical appointments seamlessly.

## 📱 Screenshots

<p align="center">
  <img src="assets/screenshots/discover.jpg" width="200" />
  <img src="assets/screenshots/bookings.jpg" width="200" />
  <img src="assets/screenshots/medical_id.jpg" width="200" />
  <img src="assets/screenshots/profile.jpg" width="200" />
</p>

## 🚀 Key Features

- **📍 Live Discovery**: Automatically detects user location via GPS and plots nearby verified doctors on an interactive map.
- **🔍 Refine Search**: Premium animated bottom sheet for filtering doctors by specialty, language spoken, and availability.
- **👨‍⚕️ Detailed Profiles**: View doctor wait times, consultation fees, and verified status with a clean "Clinical Mint" aesthetic.
- **📅 Appointment Management**: Track upcoming and past bookings in a dedicated tab.
- **🪪 Medical ID**: Instant access to emergency medical information, current medications, and emergency contacts via a QR-enabled dossier.
- **📱 Responsive & Notch-Aware**: Fully optimized for iOS and Android with proper safe area handling for notches and gesture navigation.

## 🛠️ Tech Stack

- **Framework**: [Expo](https://expo.dev/) / [React Native](https://reactnative.dev/) (New Architecture Enabled)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Navigation**: [React Navigation 7](https://reactnavigation.org/) (Bottom Tabs & Native Stack)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Maps**: [React Native Maps](https://github.com/react-native-maps/react-native-maps)
- **Location**: [Expo Location](https://docs.expo.dev/versions/latest/sdk/location/)
- **Icons**: [Expo Vector Icons](https://docs.expo.dev/guides/icons/) (Material Design)

## 🎨 Design System: "Clinical Mint"

The app follows a custom design language focusing on clarity, trust, and professionalism:
- **Color Palette**: Harmonious Mint-based primary colors with deep charcoal text.
- **Typography**: Inter/Roboto hierarchy for maximum readability.
- **Aesthetics**: Modern card-based layouts, glassmorphism-inspired overlays, and smooth micro-animations.

## 🏁 Getting Started

### Prerequisites

- Node.js (Latest LTS)
- Expo Go app on your mobile device (or an emulator)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Himanshu1281/DocSure.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. Scan the QR code with your mobile device or press `i`/`a` to open in an iOS/Android emulator.

## 🏗️ Architecture

The project follows a **Feature-First / Clean Architecture** pattern:
- `src/core`: Global configurations (navigation, theme).
- `src/features`: Domain logic and UI components split by feature (Discovery, Bookings, Medical ID, Profile).
- `src/shared`: Reusable hooks and base components.

---

Built with ❤️ by Himanshu
