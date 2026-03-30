const express = require("express");
const axios = require("axios");
const os = require("os");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Detect local Wi-Fi / LAN IP
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  const candidates = [];

  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      if (net.family === "IPv4" && !net.internal) {
        candidates.push({ name, address: net.address });
      }
    }
  }

  const wifi = candidates.find((c) =>
    c.name.toLowerCase().includes("wi-fi") ||
    c.name.toLowerCase().includes("wifi") ||
    c.name.toLowerCase().includes("wlan")
  );
  if (wifi) return wifi.address;

  return candidates[0]?.address || null;
}

// Return local IP to frontend
app.get("/api/local-ip", (req, res) => {
  const ip = getLocalIP();
  res.json({ ip });
});

// Return client IP to frontend
app.get("/api/client-ip", (req, res) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  res.json({ ip: clientIP });
});

// Proxy BioID API call (avoids CORS)
app.post("/api/verify", async (req, res) => {
  const { host, port, requestId, key, encKey } = req.body;

  if (!host || !port) {
    return res.status(400).json({ error: "Host and port are required" });
  }

  const url =
    `http://${host}:${port}/MyBioIDAPI/getVerifyCardInfoExt` +
    `?strRequestID=${encodeURIComponent(requestId || "")}` +
    `&strKey=${encodeURIComponent(key || "")}` +
    `&strEncKey=${encodeURIComponent(encKey || "")}`;

  try {
    const response = await axios.get(url, { timeout: 10000 });
    res.json({ success: true, url, data: response.data, status: response.status });
  } catch (err) {
    res.json({
      success: false,
      url,
      error: err.message,
      status: err.response?.status || null,
      data: err.response?.data || null,
    });
  }
});

app.listen(PORT, () => {
  const ip = getLocalIP();
  console.log("═".repeat(50));
  console.log("  📱 BioID API Fetcher");
  console.log("═".repeat(50));
  console.log(`\n  Local:   http://localhost:${PORT}`);
  if (ip) console.log(`  Network: http://${ip}:${PORT}`);
  console.log("\n  Press Ctrl+C to stop\n");
});
