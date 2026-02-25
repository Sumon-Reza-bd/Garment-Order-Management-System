import express from "express";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

let supabaseClient: any = null;

function getSupabase() {
  if (!supabaseClient) {
    const supabaseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "https://kokxibcrfbxtekoxyjpm.supabase.co").trim();
    const supabaseKey = (process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtva3hpYmNyZmJ4dGVrb3h5anBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwMDMzNDgsImV4cCI6MjA4NzU3OTM0OH0.8a4HWs0gnGRi9DIlafdtkoh63-j2oudkxKTUejC4rY8").trim();
    
    if (!supabaseUrl || !supabaseKey) {
      console.warn("Supabase credentials missing or empty. API routes will return 503.");
      return null;
    }

    try {
      supabaseClient = createClient(supabaseUrl, supabaseKey);
      console.log("Supabase client initialized successfully.");
    } catch (err) {
      console.error("Failed to initialize Supabase client:", err);
      return null;
    }
  }
  return supabaseClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.get("/api/buyers", async (req, res) => {
    const supabase = getSupabase();
    if (!supabase) return res.status(503).json({ error: "Supabase not configured" });
    const { data, error } = await supabase.from("buyers").select("*");
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  app.post("/api/buyers", async (req, res) => {
    const supabase = getSupabase();
    if (!supabase) return res.status(503).json({ error: "Supabase not configured" });
    const { name } = req.body;
    const { data, error } = await supabase.from("buyers").insert([{ name }]).select().single();
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  });

  app.delete("/api/buyers/:name", async (req, res) => {
    const supabase = getSupabase();
    if (!supabase) return res.status(503).json({ error: "Supabase not configured" });
    const { name } = req.params;
    const { error } = await supabase.from("buyers").delete().eq("name", name);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  });

  app.get("/api/orders", async (req, res) => {
    const supabase = getSupabase();
    if (!supabase) return res.status(503).json({ error: "Supabase not configured" });
    const { buyer } = req.query;
    let query = supabase.from("orders").select("*");

    if (buyer && buyer !== "Buyers") {
      query = query.eq("buyer", buyer);
    }

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  app.post("/api/orders", async (req, res) => {
    const supabase = getSupabase();
    if (!supabase) return res.status(503).json({ error: "Supabase not configured" });
    const { data, error } = await supabase.from("orders").insert([req.body]).select().single();
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  });

  app.delete("/api/orders/:id", async (req, res) => {
    const supabase = getSupabase();
    if (!supabase) return res.status(503).json({ error: "Supabase not configured" });
    const { id } = req.params;
    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  });

  app.put("/api/orders/:id", async (req, res) => {
    const supabase = getSupabase();
    if (!supabase) return res.status(503).json({ error: "Supabase not configured" });
    const { id } = req.params;
    const { error } = await supabase.from("orders").update(req.body).eq("id", id);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ success: true });
  });

  app.get("/api/wash-prices", async (req, res) => {
    const supabase = getSupabase();
    if (!supabase) return res.status(503).json({ error: "Supabase not configured" });
    const { data, error } = await supabase.from("wash_prices").select("*").order("id", { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  app.post("/api/wash-prices", async (req, res) => {
    const supabase = getSupabase();
    if (!supabase) return res.status(503).json({ error: "Supabase not configured" });
    const { data, error } = await supabase.from("wash_prices").insert([req.body]).select().single();
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  });

  app.delete("/api/wash-prices/:id", async (req, res) => {
    const supabase = getSupabase();
    if (!supabase) return res.status(503).json({ error: "Supabase not configured" });
    const { id } = req.params;
    const { error } = await supabase.from("wash_prices").delete().eq("id", id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  });

  app.put("/api/wash-prices/:id", async (req, res) => {
    const supabase = getSupabase();
    if (!supabase) return res.status(503).json({ error: "Supabase not configured" });
    const { id } = req.params;
    const { error } = await supabase.from("wash_prices").update(req.body).eq("id", id);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist/index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
