# 🧾 Betting Platform API Documentation

## 📌 Introduction

This document contains a structured version of the Betting Platform API based on the latest specification document. It is organized into functional modules for cleaner implementation and better scalability.

### 🔁 Standard Infrastructure

**Base URL:** `https://ambikaexch.in/extsys`

**Headers (common to all endpoints):**
```http
Hash: <hash signature>
Content-Type: application/json
```

**Method:** `POST` (All requests are POST)

**Standard Error Response Format:**
`error code 0 means success and error code 1 means error.`
```json
{"error": "0", "msg": "Success message"}
// OR
{"error": "1", "msg": "Error message"}
```

---

## 🔐 1. AUTH MODULE

| Action | Endpoint | Req Body Parameters | Notes/Response |
|---|---|---|---|
| **1. Check Username** | `/namecheck` | `username` | Error 1 if exists. success: `{"error":"0","username":""}` |
| **2. OTP SEND** | `/sendotp` | `mobile` | |
| **3. Create User** | `/createuser` | `username, password, mobile, otp` | Returns `{..., "apitoken": "..."}` |
| **4. Login User** | `/login` | `username, password, ip` | Returns `{..., "LoginToken": "..."}` |
| **11. Change Password** | `/changepass` | `LoginToken, oldpassword, newpassword` | |
| **43. Forgot Password** | `/forgotpass` | `Mobile` | |

---

## 👤 2. USER MODULE

| Action | Endpoint | Req Body Parameters | Response Notes |
|---|---|---|---|
| **10. Balance Api** | `/balance` | `LoginToken` | Returns `balance, exposure, available_balance, username` |
| **15. Stake Setting** | `/editstake` | `LoginToken, Label1, Stake1 ... Label6, Stake6` | Update buttons 1-6 |
| **21. User Stake Button**| `/stakebutton`| `LoginToken` | Returns configured `Btnname` and `Btnval` list |
| **38. User Offers** | `/offers` | `LoginToken` | General Offers list |
| **39. Offers Detail** | `/offersdetail` | `LoginToken, OfferId` | Specific Offer info with Base64 banner |
| **40. Offers Claim** | `/offersdetail` | `LoginToken, OfferId` | *Note: URL identical to offersdetail in spec* |
| **44. News** | `/news` | `LoginToken` | |
| **48. Popup Image** | `/popupimg` | `LoginToken` | Returns `image` (base64) |
| **51. Favourite** | `/favourite` | `LoginToken, Eid` | Adds or Removes from favorites |

---

## 💰 3. WALLET MODULE

### Bank & Withdrawals
| Action | Endpoint | Req Body Parameters | Notes |
|---|---|---|---|
| **33. Bank A/C Save** | `/bankac` | `LoginToken, ACname, Bank, ACholdername, ACno, Isfc` | Saves Bank Details |
| **34. Bank A/C List** | `/useraclist`| `LoginToken` | Returns User's Saved Banks |
| **35. Delete Bank A/C**| `/delbankac` | `LoginToken, Id` | Deletes bank by Id |
| **36. User Withdraw** | `/withdraw` | `LoginToken, Id, Amount` | Request withdraw to Bank `Id` |
| **37. Withdraw Req List**| `/withdrawlist`| `LoginToken, Id` | Withdraw history |

### Deposits
| Action | Endpoint | Req Body Parameters | Notes |
|---|---|---|---|
| **28. Deposit List** | `/depositlist` | `LoginToken` | List of platform bank accounts / payment methods |
| **31. Deposit** | `/deposit` | `LoginToken, Amount, Utr, BankId, Mime_type, Screenshot` | Submits Deposit Request |
| **32. Deposit Req List** | `/depositreq` | `LoginToken` | User's deposit history |`

### Statements
| Action | Endpoint | Req Body Parameters | Notes |
|---|---|---|---|
| **12. Account Statement**| `/statement` | `LoginToken, sdate, edate` | Standard Txn Statement |
| **30. Statement Bet List**| `/statementbet`| `gid` | Bet statement for specific Game ID |

---

## 🎮 4. MARKET / GAME MODULE

| Action | Endpoint | Req Body Parameters | Focus / Returns |
|---|---|---|---|
| **5. Market Game List** | `/gamelist` | `type` (e.g., "Cricket,Football") | List of games by category |
| **6. Market Rate** | `/liverate` | `MarketId` (comma separated) | Live Match Odds Data |
| **8. Game Event List** | `/gamedata` | `gid` | Game details without login |
| **9. Game Rate** | `/gamerate` | `gid, MarketId, eventid` | |
| **29. Game Event List** | `/gamedatalogin`| `LoginToken, gid` | **(After Login)** Specific events in game |
| **46. Popular Events** | `/populareve` | `LoginToken` | |
| **47. Market Analysis** | `/marketanay` | `LoginToken` | |
| **50. Search** | `/search` | `LoginToken, Keyword` | |
| **52. Multi Market List**| `/multimarket` | `LoginToken` | |
| **53. Multi Market Rate**| `/multimarketrate`| `MarketId, Ids` (array of `{"gkey":"","ekey":""}`) | Multi-view rates |

---

## 🎯 5. BETTING MODULE

**Common Parameters:** `LoginToken, Eid, Amount, Rate, IP` and usually `Type`, `Team`.

| Action | Endpoint | Important Specific Req Body Parameters |
|---|---|---|
| **16. ODD Bet Place (2 Team)**| `/livedealodd2` | `Team` (A/B), `Type` (B/L) |
| **17. ODD Bet Place (3 Team)**| `/livedealodd3` | `Team` (A/B/C), `Type` (B/L) |
| **20. BOOKMAKER Bet Place** | `/bookdealbodd` | |
| **22. Fancy Bet Place** | `/dealfancy` | `No`, `Yes` |
| **23. Fancy Chart** | `/fancychart` | `LoginToken, Eid` |
| **24. Line Bet Place** | `/dealline` | `Team` and `Type` |
| **25. Extra Bet Place** | `/dealextra` | `Team` and `Type` |
| **26. Goal Bet Place** | `/dealextra` | *(Note: Using same URL as Extra)* |
| **42. Winner / Racing Bet** | `/dealwinner` | `SelectionId` rather than `Team` |
| **49. Cashout** | `/cashout` | `LoginToken, Eid` (Only Live & Bookmaker 2Team) |

---

## 📊 6. BET HISTORY MODULE

| Action | Endpoint | Req Body Parameters | Notes |
|---|---|---|---|
| **13. MY Bets** | `/mybets` | `LoginToken` | All User Bets |
| **19. BET LIST FOR GAMES** | `/sidebetlist` | `LoginToken, gid` | Bets placed for a particular game |

---

## 🎰 7. CASINO MODULE

| Action | Endpoint | Req Body Parameters | Returns |
|---|---|---|---|
| **7. Casino Game List** | `/casinolist` | `provider` (e.g., "Spribe") | Array of casino games |
| **41. Casino Open** | `/csopen` | `LoginToken, Game_id, Game_code` | Game URL with auth token |
| **45. Sportsbook Open** | `/csopen` | `LoginToken` | Sportsbook auth URL |

---

## 🧠 Developer Key Notes

1. **Authentication:** Virtually all private endpoints use the `LoginToken` passed in the `POST` body.
2. **Hash Header:** Every request requires a `Hash` header mapping to the `hash signature`.
3. **Response Standardization:** An `"error": "0"` indicates success while `"error": "1"` suggests a functional or validation error (e.g., "Username cannot be blank").
4. **Endpoint Duplications/Overlaps:** Wait, `Goal Bet Place` and `Extra Bet Place` share `/extsys/dealextra`. The `Offers Claim` shares the URL from `Offers Detail`. Ensure custom payload handling in these particular edge cases.
