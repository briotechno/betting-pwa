const https = require("https");
const crypto = require("crypto");

// 🔑 Your secret key
const SECRET = "F41985E0-D500-4E68-AF71-3701EFC9637A";

// 🎯 Request body (MUST match exactly)
const body = JSON.stringify({
  username: "testuser"
});

// 🔐 Generate Hash (HMAC SHA256 → Base64)
const hash = crypto
  .createHmac("sha256", SECRET)
  .update(body)
  .digest("base64");

console.log("Generated Hash:", hash);

// 🌐 API Request options
const options = {
  hostname: "ambikaexch.in",
  path: "/extsys/namecheck",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Hash": hash,
    "Content-Length": Buffer.byteLength(body)
  }
};

// 📡 Make request
const req = https.request(options, (res) => {
  let data = "";

  res.on("data", (chunk) => {
    data += chunk;
  });

  res.on("end", () => {
    console.log("\n✅ API Response:");
    console.log(data);
  });
});

req.on("error", (error) => {
  console.error("\n❌ Error:", error.message);
});

// 📤 Send request
req.write(body);
req.end();