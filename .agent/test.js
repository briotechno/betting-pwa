const https = require("https");

const data = JSON.stringify({
  username: "testuser"
});

const options = {
  hostname: "ambikaexch.in",
  path: "/extsys/namecheck",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Hash": "ce8070c53b96ab67700dc04e780a35fd524d59ad632ac959dfafa75614dd9bff",
    "Content-Length": data.length
  }
};

const req = https.request(options, (res) => {
  let body = "";
  res.on("data", chunk => body += chunk);
  res.on("end", () => console.log(body));
});

req.on("error", console.error);
req.write(data);
req.end();