import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { PrismaClient } from "@prisma/client";
import shopRouter from "./src/routes/espy.route.js";

export const prisma = new PrismaClient();

const app = express();
const port = 3001;
var corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

async function main() {
  app.use(express.json());
  app.use(cookieParser());
  app.use(cors(corsOptions))


  // Register API routes
  app.use("/api/", shopRouter);

  // Catch unregistered routes
  app.all("*", (req, res) => {
    res.status(404).json({ error: `Route ${req.originalUrl} not found` });
  });

  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}

main()
  .then(async () => {
    await prisma.$connect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });