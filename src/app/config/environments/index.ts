import { MAIN_SCHEMA } from "./schemas";

export const ENVIRONMENTS = MAIN_SCHEMA.parse(process.env)