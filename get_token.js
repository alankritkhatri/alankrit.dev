import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, ".env");

// Simple .env parser
const envConfig = fs
  .readFileSync(envPath, "utf8")
  .split("\n")
  .reduce((acc, line) => {
    const [key, value] = line.split("=");
    if (key && value) acc[key.trim()] = value.trim();
    return acc;
  }, {});

const clientId = envConfig.VITE_SPOTIFY_CLIENT_ID;
const clientSecret = envConfig.VITE_SPOTIFY_CLIENT_SECRET;
const redirectUri = "https://open.spotify.com"; // Updated to match your screenshot

const code = process.argv[2];

if (!code) {
  console.error("Please provide the code as an argument.");
  console.log("Usage: node get_token.js <code_from_url>");
  process.exit(1);
}

if (!clientId || !clientSecret) {
  console.error("Missing Client ID or Secret in .env file");
  process.exit(1);
}

const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

console.log("Exchanging code for token...");

fetch("https://accounts.spotify.com/api/token", {
  method: "POST",
  headers: {
    Authorization: `Basic ${basicAuth}`,
    "Content-Type": "application/x-www-form-urlencoded",
  },
  body: new URLSearchParams({
    grant_type: "authorization_code",
    code: code,
    redirect_uri: redirectUri,
  }),
})
  .then((res) => res.json())
  .then((data) => {
    if (data.error) {
      console.error("Error:", data);
    } else {
      console.log("\nSUCCESS! Here is your Refresh Token:\n");
      console.log(data.refresh_token);
      console.log(
        "\nCopy the token above and paste it into your .env file as VITE_SPOTIFY_REFRESH_TOKEN"
      );
    }
  })
  .catch((err) => console.error("Request failed:", err));
