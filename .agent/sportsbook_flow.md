# 🏟️ Sportsbook Flow Analysis

## 📌 Overview
The Sportsbook is a multi-level navigation system that allows users to browse sports, filter by category, view specific event details, and place bets.

---

## 🗺️ Routing Structure

| Path | Description | Key Component |
|---|---|---|
| `/sportsbook` | **Sportsbook Home**: Featured/Live matches. | `SportsbookPage` |
| `/sportsbook/[sport]` | **Sport Home**: Filtered by sport category. | `SportDetailPage` |
| `/sportsbook/[sport]/[seriesId]` | **League Page**: Tournament wide markets (e.g. Winner). | `LeagueDetailPage` |
| `/sportsbook/[sport]/[seriesId]/[eventId]` | **Deepest View**: Specific match markets & Inline Betting. | `DeepestMatchDetailPage` |

---

## 🧩 Key Components

### 1. `MarketSection`
- **Location**: `src/components/sportsbook/MarketSection.tsx`
- **Function**: Standardized market headers (Orange/Dark) and odds grid.
- **Interactivity**: Spawns an `InlineBetContainer` when odds are clicked.

### 2. `InlineBetContainer`
- **Function**: Mobile-optimized betting slip that appears directly below the runner.
- **Workflow**: Enter Stake -> Validate -> Place Bet -> Reset.

### 3. `OddsBox`
- **Function**: The primary betting trigger.
- **States**:
  - `Back`: Blue shades (Intensity: High, Medium, Low).
  - `Lay`: Pink/Red shades (Intensity: High, Medium, Low).
- **Responsive Behavior**: 
  - **Desktop**: Shows up to 6 columns (3 Back, 3 Lay).
  - **Mobile**: Simplified view with 2 columns (1 Back, 1 Lay).

### 3. `BetContainer`
- **Location**: `src/components/sportsbook/BetContainer`
- **Visibility**: Sticky/Columnar on Desktop; triggered by store on Mobile.
- **Integration**: Connected to `useBetSlipStore` for managing selections, stakes, and placement.

---

## 🔄 Data & State Management

### Current Implementation (UI-First)
- **Hardcoded Data**: Matches, Sports, and Odds are currently defined as constants within the page files.
- **URL-Driven State**: Navigation and filtering depend on `useParams` and `usePathname`.
- **Global State**: `useBetSlipStore` manages the selections in real-time across all sportsbook routes.

### Future API Integration Flow
Based on the [API Integration Guide](file:///c:/Users/ASUS/Documents/GitHub/betting-pwa/.agent/api_documentation.md):
1. **Home/Sport List**: Call `POST /market/list` with `{ type }`.
2. **Event List**: Call `POST /market/events` or `POST /market/popular`.
3. **Live Odds Updates**: Replace hardcoded `matches.odds` with data from `POST /market/rates` (requires polling or WebSocket).
4. **Bet Placement**: Clicking an `OddsBox` will `addSelection` to the store, and the Store will eventually call `POST /bet/place/*` endpoints.

---

## 📱 User Experience (UX) Flow
1. **Discover**: User lands on `/sportsbook`, sees Live Cricket matches.
2. **Filter**: User taps "Soccer" in the mobile navigation bar -> route changes to `/sportsbook/Soccer`.
3. **Deep Dive**: User clicks a match name -> navigates to `/sportsbook/Soccer/123` to see special market types.
4. **Interact**: User clicks a blue `OddsBox` (Back) -> The `BetSlip` opens/updates.
5. **Finalize**: User enters stake in `BetContainer` and clicks "Place Bet".
