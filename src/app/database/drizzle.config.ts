import { defineConfig } from "drizzle-kit";

// Configs
import { ENVIRONMENTS } from "@config/environments";

export default defineConfig({    
    dialect: 'postgresql',
    schema: './**/schema.ts',
    migrations: {        
        prefix: 'supabase'
    },
    out: './src/app/database/.drizzle/.migrations',
    dbCredentials: {
        url: ENVIRONMENTS.DATABASE_URL,
    }
})