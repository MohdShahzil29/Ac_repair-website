import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");

dotenv.config({ path: path.join(rootDir, ".env") });
dotenv.config({ path: path.join(rootDir, ".env.local"), override: true });
const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "bookings.json");

// API_PORT for local dev (avoids shell PORT=3000). Render sets PORT in production.
const PORT = Number(process.env.API_PORT || process.env.PORT) || 3001;
const ADMIN_ID = process.env.ADMIN_ID ?? "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin123";

const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim()).filter(Boolean)
  : [];

const app = express();
app.use(
  cors({
    origin: (origin, callback) => {
      const allowed = !origin || corsOrigins.length === 0 || corsOrigins.includes(origin);
      callback(null, allowed);
    },
  }),
);
app.use(express.json());

const readBookings = async () => {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

const writeBookings = async (bookings) => {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(bookings, null, 2));
};

const isAdmin = (req) =>
  req.headers["x-admin-id"] === ADMIN_ID && req.headers["x-admin-password"] === ADMIN_PASSWORD;

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/bookings", async (req, res) => {
  const { name, email, phone, service, date, message } = req.body ?? {};

  if (!name?.trim() || !phone?.trim() || !service?.trim() || !date?.trim()) {
    res.status(400).json({ error: "Name, phone, service, and date are required." });
    return;
  }

  const booking = {
    id: crypto.randomUUID(),
    name: String(name).trim(),
    email: String(email ?? "").trim(),
    phone: String(phone).trim(),
    service: String(service).trim(),
    date: String(date).trim(),
    message: String(message ?? "").trim(),
    submittedAt: new Date().toISOString(),
  };

  const bookings = await readBookings();
  await writeBookings([booking, ...bookings]);
  res.status(201).json(booking);
});

app.get("/api/bookings", async (req, res) => {
  if (!isAdmin(req)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const bookings = await readBookings();
  res.json(bookings);
});

app.delete("/api/bookings", async (req, res) => {
  if (!isAdmin(req)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  await writeBookings([]);
  res.json({ ok: true });
});

const distPath = path.join(__dirname, "..", "dist");
try {
  await fs.access(distPath);
  app.use(express.static(distPath));
  app.get(/^\/(?!api).*/, (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
} catch {
  // dist not built yet — API-only mode in development
}

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`API server running on port ${PORT}`);
  if (corsOrigins.length > 0) {
    console.log(`CORS allowed origins: ${corsOrigins.join(", ")}`);
  }
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use. Stop the other process or set PORT in .env.local`);
    process.exit(1);
  }
  throw error;
});
