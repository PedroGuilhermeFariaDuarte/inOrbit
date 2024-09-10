import { pgTable, text } from "drizzle-orm/pg-core";

// Schemas
import { DEFAULT_COLUMNS } from "../.default";
import { goals } from "../goals/schema";

export const goalsCompletions = pgTable('goals_completions', {    
    ...DEFAULT_COLUMNS,
    goalId: text('goal_id').references(() => goals.id, {
        onDelete: "cascade",
        onUpdate: 'set null'
    }).notNull(),
})