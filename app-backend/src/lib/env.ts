import { config } from "dotenv";
import { expand } from "dotenv-expand";
import { z, ZodError } from "zod";

const envSchema = z.object({
    POSTGRES_URL: z.string().min(1),
    JWT_SECRET: z.string().min(1),
    NEXTAUTH_SECRET: z.string().min(1).optional()
});

expand(config());

try {
    envSchema.parse(process.env);
} catch (e) {
    if (e instanceof ZodError) {
        console.error("Environment validation error:", e.errors);
    }
}

export default envSchema.parse(process.env);

