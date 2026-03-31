import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/proxy/bioid", async (req, res) => {
  try {
    const host = req.query.host || "192.168.1.28";
    const port = req.query.port || "8080";
    const requestId = req.query.requestId || "REQ-2001";
    const key = req.query.key || "test-key";
    const encKey = req.query.encKey || "client-encryption-key-123";

    const url =
      `http://${host}:${port}/MyBioIDAPI/getVerifyCardInfoExt` +
      `?strRequestID=${encodeURIComponent(requestId)}` +
      `&strKey=${encodeURIComponent(key)}` +
      `&strEncKey=${encodeURIComponent(encKey)}`;

    const response = await fetch(url);
    const text = await response.text();

    res.send(text);
  } catch (err) {
    res.status(500).send("Proxy error: " + err.message);
  }
});

app.listen(3000, () => {
  console.log("Proxy running on http://localhost:3000");
});