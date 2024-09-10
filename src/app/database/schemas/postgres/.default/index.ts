import { timestamp } from "drizzle-orm/pg-core";


export const DEFAULT_COLUMNS = {
    createdAt: timestamp('created_at', {
        withTimezone: true
    }).defaultNow(),
    updatedAt: timestamp('updated_at', {
        withTimezone: true
    }),
    deletedAt: timestamp('deleted_at', {
        withTimezone: true
    })
}