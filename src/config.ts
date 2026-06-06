import { z } from "zod";

const envSchema = z.object({
  PORT: z.string().default("3000"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  SESSION_SECRET: z.string().min(32),
  SESSION_MAX_AGE: z.string().default("86400000"),
  DATABASE_URL: z.string(),
  BCRYPT_ROUNDS: z.string().default("12"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:", parsed.error.flatten());
  process.exit(1);
}

export const config = {
  port: parseInt(parsed.data.PORT, 10),
  nodeEnv: parsed.data.NODE_ENV,
  session: {
    secret: parsed.data.SESSION_SECRET,
    maxAge: parseInt(parsed.data.SESSION_MAX_AGE, 10),
  },
  databaseUrl: parsed.data.DATABASE_URL,
  bcryptRounds: parseInt(parsed.data.BCRYPT_ROUNDS, 10),
  isProduction: parsed.data.NODE_ENV === "production",
};
