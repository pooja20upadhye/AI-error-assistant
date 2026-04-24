import express from "express";
import cors from "cors";
import routes from "./routes";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

app.use(cors({
  origin: ["http://localhost:5176", "http://localhost:5175", "http://localhost:5173"],
  credentials: true
}));

app.use(express.json());

app.use(routes);

app.use(errorHandler);

export default app;