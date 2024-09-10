import { integer, pgTable, text } from "drizzle-orm/pg-core";

// Schemas
import { DEFAULT_COLUMNS } from "../.default";

export const goals = pgTable('goals', {
    ...DEFAULT_COLUMNS,
    title: text('title').notNull(),
    desiredWeeklyFrequency: integer('desired_weekly_frequency').default(1).notNull(),    
})