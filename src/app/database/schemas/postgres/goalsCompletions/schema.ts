import { pgTable, text } from "drizzle-orm/pg-core";

// Schemas
import { DEFAULT_COLUMNS } from "../.default";
import { goals } from "../goals/schema";

export const goalsCompletions = pgTable('goals_completions', {
    id: text('id').primaryKey(),
    goalId: text('goal_id').references(() => goals.id).notNull(),
    ...DEFAULT_COLUMNS,
})