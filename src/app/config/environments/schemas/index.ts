import * as Zod from "zod"

export const MAIN_SCHEMA =  Zod.object({
    DATABASE_URL: Zod.string().url()
})