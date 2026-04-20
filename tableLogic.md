# Table Logic and Redirection Flow Analysis

This document outlines the data flow, rendering logic, and redirection mechanisms for the main match tables used in the Betting PWA, specifically focusing on the `HomePage` and `OddsTable` component.

## 1. Data Flow & Management

### A. Data Fetching
- **Source**: `src/app/page.tsx`
- **Initial Load**: `marketController.getGameList('Cricket,Football,Tennis')` fetches the base match data.
- **Live Updates**: A polling mechanism calls `marketController.getLiveRates(marketIds)` every **200ms**.
- **State**: Matches are stored in the `matches` state, while real-time odds are stored in the `odds` Record, keyed by `marketId`.

### B. Data Transformation (`mapMatchData`)
Raw API data is normalized into a standard format for the `OddsTable`:
- **Team Names**: Handles "Team1 vs Team2" strings and special cases like "TOURNAMENT_WINNER".
- **Odds Extraction**: Extracts the best `back` and `lay` prices from nested runner objects (handles both array and dictionary formats from the API).
- **Time Parsing**: Normalizes various date strings into a standard `Date` object for sorting and display.

---

## 2. Table Rendering Logic (`OddsTable.tsx`)

### A. Component Structure
- **Columns**: 
    - **Time**: Formatted via `formatUpcomingTime` (e.g., "Mon, 21/04 10:30 PM").
    - **Match Info**: Displays team names; supports two-line display for "vs" matches.
    - **Odds**: Six boxes per row (3 Back, 3 Lay) on desktop; 3 Back on mobile.
- **Badges**:
    - `showLiveBadge`: Displays a green "access-point" icon for active in-play matches.
    - `showInPlayBadge`: Displays a green play icon for matches starting soon.

### B. Odds Buttons (`RateButton`)
- **Blinking**: Uses `useEffect` and `useRef` to detect price changes and trigger the `animate-rate-change` CSS animation.
- **States**: 
    - **Empty**: Greyed out with `-`.
    - **Suspended**: Row turns grey, buttons become `opacity-40` and non-clickable.
    - **Upcoming**: Buttons are non-clickable with an overlay.

---

## 3. Redirection Flow

### A. Clicking Team/Match Name
- **Trigger**: `onClick` on the match name `<td>`.
- **Action**: Direct navigation to the match detail page.
- **Route**: `/sportsbook/{sport}/{competitionId}/{matchId}`
- **Defaulting**: If `sport` or `competitionId` are missing, they default to `cricket` and `league` respectively.

### B. Clicking Odds Buttons (Back/Lay)
- **Trigger**: `onClick` on any `RateButton`.
- **Logic**:
    1. **Authentication Check**: If the user is not logged in (`!isAuthenticated`), they are redirected to `/auth/login`.
    2. **Authenticated Flow**: Instead of adding the bet to the slip immediately (on the home page), the user is redirected to the match detail page: `/sportsbook/{sport}/{competitionId}/{matchId}`.
    - *Rationale*: This ensures users see the full market context (market messages, multiple runners, etc.) before placing a bet.

---

## 4. Key Components Involved
- **`src/app/page.tsx`**: Orchestrates data fetching and filtering (Live/Today/Upcoming).
- **`src/components/sportsbook/OddsTable.tsx`**: The main presentation component for match lists.
- **`src/store/betSlipStore.ts`**: (Imported but primarily used on the detail page for adding selections).
- **`src/store/authStore.ts`**: Used for the login-gate check during redirection.
