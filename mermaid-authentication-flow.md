# Bazar App - Authentication Flow

```mermaid
flowchart TD
    A[App Launch] --> B[Initialize App Store]
    B --> C{Check AsyncStorage}
    C --> D[Load Saved State]
    D --> E{Has Onboarded?}
    
    E -->|No| F[Show Onboarding]
    F --> G[User Completes Onboarding]
    G --> H[Set Onboarded Flag]
    H --> I{Is Authenticated?}
    
    E -->|Yes| I{Is Authenticated?}
    
    I -->|No| J[Show Public Routes]
    J --> K[Login Screen]
    K --> L[User Enters Credentials]
    L --> M[Firebase Auth]
    
    M --> N{Auth Success?}
    N -->|No| O[Show Error Toast]
    O --> K
    
    N -->|Yes| P[Get Firebase Token & UID]
    P --> Q[Fetch User from Firestore]
    Q --> R{Firestore Success?}
    
    R -->|No| S[Show Profile Error]
    S --> T[Logout User]
    T --> J
    
    R -->|Yes| U[Save Token & User to AsyncStorage]
    U --> V[Update App Store State]
    V --> W[Firebase Auth Listener Triggered]
    W --> X[Show Protected Routes]
    
    I -->|Yes| Y{Biometric Enabled?}
    Y -->|Yes| Z[Check Biometric Availability]
    Z --> AA{Biometric Available?}
    AA -->|Yes| BB[Prompt Biometric Auth]
    BB --> CC{Biometric Success?}
    CC -->|Yes| X
    CC -->|No| DD[Show Biometric Error]
    DD --> J
    AA -->|No| X
    Y -->|No| X
    
    X --> EE[Bottom Tab Navigation]
    EE --> FF[Home Screen]
    EE --> GG[Library Screen]
    EE --> HH[Profile Screen]
    
    II[User Logs Out] --> JJ[Clear AsyncStorage]
    JJ --> KK[Reset App Store]
    KK --> J
    
    style A fill:#e1f5fe
    style F fill:#fff3e0
    style K fill:#fce4ec
    style X fill:#e8f5e8
    style M fill:#fff9c4
    style Q fill:#f3e5f5
```

## Key Authentication Components:

1. **App Store (Zustand)**: Manages global authentication state
2. **Firebase Auth**: Handles user authentication
3. **Firestore**: Stores user profile data
4. **AsyncStorage**: Persists authentication state locally
5. **Biometric Auth**: Optional biometric authentication
6. **Auth Listener**: Monitors Firebase auth state changes

## Authentication States:

- **Loading**: App is initializing
- **Onboarding**: First-time user experience
- **Unauthenticated**: User needs to login
- **Authenticated**: User is logged in and can access protected routes

## Security Features:

- Token-based authentication with Firebase
- Biometric authentication support
- Automatic token refresh via Firebase listener
- Secure storage of user credentials