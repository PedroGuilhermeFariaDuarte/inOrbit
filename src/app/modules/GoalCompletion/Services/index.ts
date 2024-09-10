// Database
import { DRIZZLE_CLIENT } from "app/database";

// Types
import { ICreateGoalCompletionsData } from "../types";

// Utils
import { setLogger } from "@utils/Log";

// Schema
import { goalsCompletions } from "@database/postgres/goalsCompletions/schema";

export async function createGoalCompletion(data: ICreateGoalCompletionsData) {
    try {
        if(!data) throw new Error('The data of goal completion is not valid');

        if(data.goalId?.trim() === '' || typeof data.goalId !== 'string') throw new Error('The weekly frequency should be equal or than that 1');

        return (await DRIZZLE_CLIENT.insert(goalsCompletions).values(data).returning())[0] || null
    } catch (error) {
        setLogger(error)
        throw error;
    }
}