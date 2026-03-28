# 🧾 Betting Platform Master API Documentation

This document serves as the high-fidelity specification for the Betting Platform API, including exact endpoints, request payloads, and response structures as per the PDF `EXTSYS_23_03_26_new.pdf`.

## 📌 Standard Infrastructure

**Base URL:** `https://ambikaexch.in/extsys`

**Common Headers:**
```json
{
  "Hash": "hash signature",
  "Content-Type": "application/json"
}
```

**Global Response Convention:**
- `error: "0"` → Success
- `error: "1"` → Error/Validation Failure

---

## 🔐 1. AUTH MODULE

### 1. Check Username ✅
**POST** `/namecheck`
- **Request:** `{"username":"testuser"}`
- **Success:** `{"error":"0","msg":"Username available","username":"testuser"}`
- **Error:** `{"error":"1","msg":"Username already exists"}`

### 2. Send OTP ✅
**POST** `/sendotp`
- **Request:** `{"mobile":"1234567890"}`
- **Success:** `{"error":"0","msg":" OTP Send in Your Mobile"}`
- **Error:** `{"error":"1","msg":" Please Enter Only Numbers in Mobile."}`

### 3. Create User ✅
**POST** `/createuser`
- **Request:**
  ```json
  {
    "username":"testuser",
    "password":"Test@123",
    " mobile":"1234567890",
    "otp":"7485"
  }
  ```
- **⚠️ Note:** Some documentation versions show a leading space in `" mobile"`.
- **Success:** `{"error":"0","msg":"User create successfully.","username":"testuser","apitoken":"..."}`

### 4. Login User ✅
**POST** `/login`
- **Request:**
  ```json
  {
    "username":"testuser",
    "password":"Test@123",
    "ip":"192.168.0.1"
  }
  ```
- **Success:** `{"error":"0","msg":"Login Success","username":"testuser","LoginToken":"..."}`

### 11. Change Password ✅
**POST** `/changepass`
- **Request:**
  ```json
  {
    "LoginToken":"...",
    "oldpassword":"...",
    "newpassword":"..."
  }
  ```
- **Success:** `{"error":"0","msg":"Password Change Successfully.","username":"..."}`

### 42. Forgot Password ✅
**POST** `/forgotpass`
- **Request:** `{"Mobile":"9412121212"}`
- **Success:** `{"error":"0","msg":" Password has been sent to your mobile. "}`

---

## 👤 2. USER MODULE

### 10. Balance API ✅
**POST** `/balance`
- **Request:** `{"LoginToken":"..."}`
- **Response:**
  ```json
  {
    "error":"0",
    "balance":"9405.38",
    "exposure":0,
    "available_balance":"9405.38",
    "username":"abc8055"
  }
  ```

### 15. Stake Setting (Edit Stake) ✅
**POST** `/editstake`
- **Request:**
  ```json
  {
    "LoginToken":"...",
    "Label1":"100", "Stake1":"100",
    "Label2":"500", "Stake2":"500",
    "Label3":"1K", "Stake3":"1000",
    "Label4":"5K", "Stake4":"5000",
    "Label5":"10K", "Stake5":"10000",
    "Label6":"10K", "Stake6":"10000"
  }
  ```

### 21. User Stake Button ✅
**POST** `/stakebutton`
- **Request:** `{"LoginToken":"..."}`
- **Response:**
  ```json
  {
    "1":{"Btnname":"100","Btnval":"100"},
    "2":{"Btnname":"500","Btnval":"500"},
    ...
  }
  ```

### 43. News ✅
**POST** `/news`
- **Request:** `{"LoginToken":"..."}`
- **Response:** `{"error":"0","msg":"WELCOME TO OUR EXCHANGE"}`

### 47. Popup Image ✅
**POST** `/popupimg`
- **Request:** `{"LoginToken":"..."}`
- **Response:** `[{"image":"<img src=\"data:image/png;base64,...\" />"}]`

### 50. Favourite ✅
**POST** `/favourite`
- **Request:** `{"LoginToken":"...","Eid":"2073866"}`
- **Response:** `{"error":"0","msg":"Event Added in Favourite"}` (or Remove)

---

## 🎮 3. MARKET / GAME MODULE

### 4. Competition List ✅
**POST** `/competition`
- **Request:** `{"type":"Cricket"}`
  - *Description:* `type` can be `Cricket`, `Football`, `Tennis`, `Election`, `Table Tennis`, `Basketball`, `American Football`, `Volleyball`, `Snooker`, `Kabbadi`.
- **Response:**
  ```json
  [
    {
      "CompetitionCode": "101480",
      "Competition": "Indian Premier League"
    },
    {
      "CompetitionCode": "12788830",
      "Competition": "Pakistan National T20 Cup"
    },
    {
      "CompetitionCode": "10693181",
      "Competition": "Pakistan Super League"
    },
    {
      "CompetitionCode": "12649673",
      "Competition": "ICC Cricket World Cup League 2"
    },
    {
      "CompetitionCode": "9886504",
      "Competition": "Womens One Day Internationals"
    }
  ]
  ```

### 53. Competition Wise Games ✅
**POST** `/competitiongames`
- **Request:** `{"code":"101480"}`
  - *Description:* `code` is a String representing `CompetitionCode` (API no 53).
- **Response:**
  ```json
  {
    "28127348": {
      "DateTime": "31-03-2025 13:00:00",
      "Competition": "Indian Premier League",
      "Game_name": "Indian Premier League",
      "Team1": "Indian Premier League",
      "Team2": "TOURNAMENT_WINNER",
      "MarketId": "1.245690241",
      "Type": "Cricket",
      "Event_Id": "28127348",
      "gid": "16194",
      "Game_Type": "Winner",
      "TV": "Y",
      "BM": "N",
      "Fancy": "N",
      "Goal": "N"
    },
    "35364409": {
      "DateTime": "28-03-2026 19:30:00",
      "Competition": "Indian Premier League",
      "Game_name": "RC Bengaluru Vs Sunrisers Hyderabad",
      "Team1": "RC Bengaluru",
      "Team2": "Sunrisers Hyderabad",
      "MarketId": "1.255200877",
      "Type": "Cricket",
      "Event_Id": "35364409",
      "gid": "15797",
      "Game_Type": "Game",
      "TV": "Y",
      "BM": "Y",
      "Fancy": "Y",
      "Goal": "N"
    }
  }
  ```

### 5. Market Game List ✅
**POST** `/gamelist`
- **Request:** `{"type":"Cricket,Football,Tennis"}`
- **Response:**
  ```json
  {
    "34459191": {
      "DateTime": "02-07-2025 21:30:00",
      "Competition": "UEFA Women's Euro 2025",
      "Game_name": " Iceland (W) Vs Finland (W)",
      "Team1": "Iceland (W)",
      "Team2": "Finland (W)",
      "MarketId": "1.245128909",
      "Type": "Football",
      "Event_Id": "34459191",
      "gid": "34",
      "Game_Type": "Game",
      "TV": "Y", "BM": "Y", "Fancy": "Y", "Goal": "N"
    }
  }
  ```

### 6. Market Rate (Live Rate) ✅
**POST** `/liverate`
- **Request:** `{"MarketId":"1.253852370,1.253802473"}`
- **Response:** Complex nested object keyed by `MarketId` containing status, runners, and odds (availableToBack, availableToLay).

### 8/28. Game Event List ✅
**POST** `/gamedata` (Public) OR **POST** `/gamedatalogin` (Auth)
- **Request:** `{"gid":"12727"}` OR `{"LoginToken":"...", "gid":"6036"}`
- **Response:** Details about match events (ODDS, BOOKMAKER, FANCY categories).

### 9. Game Rate ✅
**POST** `/gamerate`
- **Request:** `{"gid":"12727","MarketId":"1.253843756","eventid":"35247021"}`

### 45. Popular Events ✅
**POST** `/populareve`
- **Request:** `{"LoginToken":"..."}`
- **Response:** List of games with `game_code`, `game_id`, `name`, `image`, `provider`.

### 46. Market Analysis ✅
**POST** `/marketanay`
- **Request:** `{"LoginToken":"..."}`
- **Response:** `[{"Type":"Cricket", "Eventname":"...", "Expose":1000}]`

### 49. Search ✅
**POST** `/search`
- **Request:** `{"LoginToken":"...", "Keyword":"Mumbai"}`
- **Response:** Array of games matching the keyword.

### 51. Multi Market List ✅
**POST** `/multimarket`
- **Request:** `{"LoginToken":"..."}`

### 52. Multi Market Rate ✅
**POST** `/multimarketrate`
- **Request:** `{"MarketId":"ID1,ID2", "Ids":[{"gkey":"...","ekey":"..."}]}`

---

## 💰 4. WALLET & BANK MODULE

### 27. Deposit List ✅
**POST** `/depositlist`
- **Request:** `{"LoginToken":"..."}`
- **Response:**
  ```json
  {
    "0": { "Bank_Id": "7", "Type": "BANK", "Name": "test", "BankACnme": "test", "AcNo": "748596", "Isfc": "SBIN007", "Min": "100", "Max": "1000" },
    "3": { "Bank_Id": 0, "Type": "Crypto", "Name": "1xbetfair", "Id": "ewrwenaam,d@ussdt.com1", "BuyPrice": "92.00" }
  }
  ```

### 30. Deposit Request ✅
**POST** `/deposit`
- **Request:**
  ```json
  {
    "LoginToken":"...",
    "Amount":"500",
    "Utr":"748587123741",
    "BankId":"7",
    "Mime_type":"image/png",
    "Screenshot":"base64_string"
  }
  ```

### 31. Deposit Req List ✅
**POST** `/depositreq`
- **Request:** `{"LoginToken":"..."}`
- **Response:** `{"0": {"Amount":"500.00", "Status":"Cancel", "Utr":"...", "Method":"", "Date":"...", "Remarks":""}, ...}`

### 32. Bank A/C Save ✅
**POST** `/bankac`
- **Request:** `{"LoginToken":"...", "ACname":"...", "Bank":"...", "ACholdername":"...", "ACno":"...", "Isfc":"..."}`

### 33. User Bank A/C List ✅
**POST** `/useraclist`
- **Request:** `{"LoginToken":"..."}`

### 34. Delete Bank A/C ✅
**POST** `/delbankac`
- **Request:** `{"LoginToken":"...", "Id":"19"}`

### 35. User Withdraw ✅
**POST** `/withdraw`
- **Request:** `{"LoginToken":"...", "Id":"18", "Amount":"500", "IP":"..."}`

### 36. User Withdraw Request List ✅
**POST** `/withdrawlist`
- **Request:** `{"LoginToken":"...", "Id":"19"}`

### 12. Account Statement ✅
**POST** `/statement`
- **Request:** `{"LoginToken":"...", "sdate":"01-02-2026", "edate":"13-02-2026"}`
- **Response:** `{"0": {"0": "Date", "1": 9345.38, "2": "O", "3": "Opening Balance"}, "1": {"0": "Date", "1": 36, "2": "DR", "3": "...", "4": "12456"}, ...}`

### 29. Account Statement Bet List ✅
**POST** `/statementbet`
- **Request:** `{" Eid ":"12456"}` (⚠️ Note space in property name ` Eid `)

---

## 🎯 5. BETTING MODULE

### 13. My Bets ✅
**POST** `/mybets`
- **Request:** `{"LoginToken":"..."}`
- **Response:** `{"0": {"Game":"...", "Selection":"...", "Type":"Match", "Rate":"18.50", "Stake":"100", "Date":"...", "Side":"back"}}`

### 16. ODD Bet Place (2 Team) ✅
**POST** `/livedealodd2`
- **Request:** `{"LoginToken":"...", "Eid":"2073866", "Amount":"10000", "Rate":"1.62", "Team":"B", "Type":"B", "IP":"103.70.198.20"}`

### 17. ODD Bet Place (3 Team) ✅
**POST** `/livedealodd3`
- **Request:** `{"LoginToken":"...", "Eid":"1", "Amount":"200", "Rate":"1.95", "Team":"C", "Type":"L", "IP":"..."}`

### 19. Side Bet List (For Games) ✅
**POST** `/sidebetlist`
- **Request:** `{"LoginToken":"...", "gid":"1"}`

### 20. BOOKMAKER Bet Place ✅
**POST** `/bookdealbodd`
- **Request:** `{"LoginToken":"...", "Eid":"2078823", "Amount":"200", "Rate":"70", "Team":"A", "Type":"B", "IP":"..."}`

### 22. Fancy Bet Place ✅
**POST** `/dealfancy`
- **Request:** `{"LoginToken":"...", "Eid":"2074101", "Amount":"200", "Rate":"20", "No":"100", "Yes":"100", "Type":"B", "IP":"..."}`

### 23. Fancy Chart ✅
**POST** `/fancychart`
- **Request:** `{"LoginToken":"...", "Eid":"2074101"}`

### 24. Line Bet Place ✅
**POST** `/dealline`
- **Request:** `{"LoginToken":"...", "Eid":"2074101", "Amount":"200", "Rate":"20", "Type":"B", "IP":"..."}`

### 25. Extra Bet Place ✅
**POST** `/dealextra`
- **Request:** `{"LoginToken":"...", "Eid":"2073871", "Amount":"200", "Rate":"1.02", "Team":"B", "Type":"B", "IP":"..."}`

### 26. Goal Bet Place ✅
**POST** `/dealextra` (⚠️ Reuses Extra Bet URL)
- **Request Body identical to Extra Bet.**

### 41. Winner / Racing Bet ✅
**POST** `/dealwinner`
- **Request:** `{"LoginToken":"...", "Eid":"2078641", "Amount":"200", "Rate":"8", "SelectionId":"2954281", "Type":"B", "IP":"..."}`

### 48. Cashout ✅
**POST** `/cashout`
- **Request:** `{"LoginToken":"...", "Eid":"2073866"}`
- **Success:** `[{"Amount":1076, "Rate":1.68, "Team":"B", "Type":"L", "Chart1":-31.44, "Chart2":-32}]`

---

## 🎰 6. CASINO & SPORTSBOOK

### 7. Casino Game List ✅
**POST** `/casinolist`
- **Request:** `{"provider":"Spribe"}`
- **Response:** `[{"game_code":"spribe_keno", "game_id":"860007", "name":"KENO", "image":"...", "provider":"Spribe", "partner":"..."}]`

### 40. Casino Open ✅
**POST** `/csopen`
- **Request:** `{"LoginToken":"...", "Game_id":"900001", "Game_code":"RG-7UD01"}`
- **Response:** `{"error":"0", "url":"https://game.royaladmin.live?token=..."}`

### 44. Sportsbook Open ✅
**POST** `/sportsbook` (⚠️ Note: index 44 in PDF)
- **Request:** `{"LoginToken":"..."}`
- **Response:** `{"error":"0", "url":"https://sports-v3.mysportsfeed.io/auth?token=..."}`

---

## 🎁 7. OFFERS APIs

### 37. User Offers ✅
**POST** `/offers`
- **Request:** `{"LoginToken":"..."}`
- **Response:** `{"0": {"OfferId ":"1", "Category":"Welcome", "Title":"...", "Banner":"base64"}, ...}`

### 38. User Offers Detail ✅
**POST** `/offersdetail`
- **Request:** `{"LoginToken":"...", "OfferId":"1"}`
- **Response:** Detailed JSON including `eligible`, `Banner`, and `detail` (HTML content).

### 39. User Offers Claim ✅
**POST** `/offersdetail` (⚠️ Reuses Offer Detail URL)
- **Request Body identical to Detail.**
- **Success:** `{"error":"0", "msg":"Offers get Successfully."}`

---

## 🧠 Developer Key Notes

1. **Hash Signatures:** Required for every `POST`.
2. **Standard Payload:** Almost all private actions require `LoginToken`.
3. **Endpoint Reuse:**
   - `/dealextra` is used for both **Extra** and **Goal** bets.
   - `/offersdetail` is used for both **Offer Detail** and **Offer Claim**.
4. **Parameter Quirks:**
   - `/statementbet` expects `{" Eid ":"..."}` (note the spaces in the key name in PDF).
   - `/createuser` may expect `" mobile"` (with a leading space) in some implementations.
   - Some bet types use `SelectionId` instead of `Team`.
5. **Base64 Assets:** `Screenshot`, `Banner`, and `popupimg` are returned as Base64 strings or HTML snippets.
