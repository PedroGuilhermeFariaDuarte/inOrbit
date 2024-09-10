import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Config
import { ENVIRONMENTS } from "@config/environments";

// Schemas
import { goals } from "@database/postgres/goals/schema";
import { goalsCompletions } from "@database/postgres/goalsCompletions/schema";

export const DRIZZLE_STATEMENT = postgres(ENVIRONMENTS.DATABASE_URL)
export const DRIZZLE_CLIENT = drizzle(DRIZZLE_STATEMENT, {
    logger: true,
    schema: {
        goals,
        goalsCompletions
    }
})