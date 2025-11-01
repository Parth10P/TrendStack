// Load .env into process.env when running Prisma from Node so env('DATABASE_URL') works.
// This is necessary when Prisma loads this config as a JS/TS module.
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
