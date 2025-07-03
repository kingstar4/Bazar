# Bazar App - Complete Application Flow

```mermaid
flowchart TD
    A[App Launch] --> B[Splash Screen]
    B --> C[Initialize App Store]
    C --> D[Load AsyncStorage Data]
    D --> E{First Time User?}
    
    E -->|Yes| F[Onboarding Flow]
    F --> G[Slide 1: Welcome]
    G --> H[Slide 2: Features]
    H --> I[Slide 3: Get Started]
    I --> J[Complete Onboarding]
    J --> K[Set Onboarded Flag]
    K --> L{Is Authenticated?}
    
    E -->|No| L{Is Authenticated?}
    
    L -->|No| M[Public Routes]
    M --> N[Login Screen]
    N --> O[User Authentication]
    O --> P{Auth Success?}
    P -->|No| Q[Show Error]
    Q --> N
    P -->|Yes| R[Firebase Auth Listener]
    R --> S[Fetch User Profile]
    S --> T[Update App State]
    T --> U[Protected Routes]
    
    L -->|Yes| V{Biometric Enabled?}
    V -->|Yes| W[Biometric Check]
    W --> X{Biometric Success?}
    X -->|Yes| U
    X -->|No| Y[Biometric Failed]
    Y --> M
    V -->|No| U
    
    U --> Z[Bottom Tab Navigator]
    Z --> AA[Home Tab]
    Z --> BB[Library Tab]
    Z --> CC[Profile Tab]
    
    AA --> DD[Home Screen]
    DD --> EE[Search Books]
    DD --> FF[View Trending Books]
    DD --> GG[Browse Categories]
    DD --> HH[View Recommendations]
    DD --> II[Select Book]
    II --> JJ[Book Details Modal]
    JJ --> KK[Add to Favorites]
    JJ --> LL[View Book Info]
    
    BB --> MM[Library Screen]
    MM --> NN[Search Books]
    MM --> OO[Filter by Category]
    MM --> PP[View All Books]
    PP --> QQ[Select Book]
    QQ --> JJ
    
    CC --> RR[Profile Screen]
    RR --> SS[View Profile Info]
    RR --> TT[Edit Profile]
    RR --> UU[Account Settings]
    UU --> VV[Biometric Toggle]
    UU --> WW[Change Avatar]
    UU --> XX[Logout]
    
    XX --> YY[Clear Storage]
    YY --> ZZ[Reset App State]
    ZZ --> M
    
    EE --> AAA[Search Results]
    AAA --> BBB[Filter Results]
    BBB --> CCC[Select Book]
    CCC --> JJ
    
    NN --> AAA
    
    KK --> DDD[Update Favorites]
    DDD --> EEE[Save to AsyncStorage]
    
    TT --> FFF[Avatar Picker Modal]
    FFF --> GGG[Select New Avatar]
    GGG --> HHH[Update Profile]
    HHH --> III[Save to Firestore]
    
    VV --> JJJ{Enable Biometric?}
    JJJ -->|Yes| KKK[Check Biometric Support]
    KKK --> LLL{Supported?}
    LLL -->|Yes| MMM[Enable Biometric]
    LLL -->|No| NNN[Show Not Supported]
    JJJ -->|No| OOO[Disable Biometric]
    
    MMM --> PPP[Save Biometric Setting]
    OOO --> PPP
    PPP --> QQQ[Update AsyncStorage]
    
    RRR[Notification Screen] --> SSS[View Notifications]
    DD --> TTT[Notification Icon]
    TTT --> RRR
    
    UUU[Pull to Refresh] --> VVV[Refetch Data]
    VVV --> WWW[Update UI]
    DD --> UUU
    MM --> UUU
    
    XXX[Network Error] --> YYY[Show Error Message]
    YYY --> ZZZ[Retry Action]
    
    style A fill:#e1f5fe
    style F fill:#fff3e0
    style N fill:#fce4ec
    style U fill:#e8f5e8
    style DD fill:#f0f4c3
    style MM fill:#e0f2f1
    style RR fill:#fce4ec
    style JJ fill:#fff9c4
```

## Application Architecture:

### **Navigation Structure:**
- **Root Navigator**: Manages app-level routing
- **Public Routes**: Login, Register screens
- **Protected Routes**: Bottom tab navigation
- **Onboarding**: First-time user experience

### **Main Features:**

#### **Home Screen:**
- Search functionality
- Trending books carousel
- Top books of the week
- Vendor recommendations
- Book recommendations
- Pull-to-refresh capability

#### **Library Screen:**
- Book search and filtering
- Category browsing
- Complete book catalog
- Advanced search options

#### **Profile Screen:**
- User profile management
- Avatar customization
- Account settings
- Biometric authentication toggle
- Logout functionality

#### **Book Interaction:**
- Book details modal
- Favorites management
- Book information display
- Add/remove from favorites

### **Data Management:**
- **Zustand Store**: Global state management
- **AsyncStorage**: Local data persistence
- **Firebase Firestore**: User profiles and data
- **React Query**: API data fetching and caching

### **Key User Flows:**

1. **First-time User**: Onboarding → Registration → Home
2. **Returning User**: Splash → Authentication → Home
3. **Book Discovery**: Search → Filter → Select → Details → Favorite
4. **Profile Management**: Profile → Settings → Update → Save
5. **Authentication**: Login → Biometric (optional) → Protected Routes

### **Error Handling:**
- Network error recovery
- Authentication error handling
- Biometric fallback options
- User-friendly error messages