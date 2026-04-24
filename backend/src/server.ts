import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { initDb } from "./config/db";

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  await initDb();
  console.log(`Server running on port ${PORT}`);
});