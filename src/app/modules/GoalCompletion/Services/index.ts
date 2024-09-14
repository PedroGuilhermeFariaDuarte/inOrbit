// Database
import { DRIZZLE_CLIENT } from "app/database";

// Types
import { ICreateGoalCompletionsData } from "../types";

// Utils
import { setLogger } from "@utils/Log";

// Schema
import { goals } from "@database/postgres/goals/schema";
import { goalsCompletions } from "@database/postgres/goalsCompletions/schema";
import dayjs from "dayjs";
import { and, count, eq, gte, lte, sql } from "drizzle-orm";

export async function createGoalCompletion(data: ICreateGoalCompletionsData) {
    try {
        if(!data) throw new Error('The data of goal completion is not valid');

        if(data.goalId?.trim() === '' || typeof data.goalId !== 'string') throw new Error('The weekly frequency should be equal or than that 1');

        const lastDayOfWeek = dayjs().endOf('week').toDate()
        const firstDayOfWeek = dayjs().startOf('week').toDate()


        const GOAL_COMPLETION_COUNTS = DRIZZLE_CLIENT.$with('goal_completion_counts').as(
            DRIZZLE_CLIENT.select({
                goalId: goalsCompletions.goalId,
                completionCount: count(goalsCompletions.id).as('completionCount')
            })
            .from(goalsCompletions)
            .where(
                and(
                    gte(goalsCompletions.createdAt, firstDayOfWeek),
                    lte(goalsCompletions.createdAt, lastDayOfWeek),
                    eq(goalsCompletions.goalId, data.goalId)
                )
            )
            .groupBy(goalsCompletions.goalId)
        )

        const RESULT = (await DRIZZLE_CLIENT
            .with(GOAL_COMPLETION_COUNTS)
            .select({
                desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
                completionCount: sql`
                    COALESCE(${GOAL_COMPLETION_COUNTS.completionCount}, 0)
                `.mapWith(Number)
            })
            .from(goals)
            .leftJoin(GOAL_COMPLETION_COUNTS, eq(GOAL_COMPLETION_COUNTS.goalId, data.goalId))
            .where(eq(goals.id, data.goalId)))[0];

        if(RESULT.completionCount >= RESULT.desiredWeeklyFrequency) {
            throw new Error('The goal already completed this week');
        }else{
            return (await DRIZZLE_CLIENT.insert(goalsCompletions).values(data).returning())[0] || null
        }
    } catch (error) {
        setLogger(error)
        throw error;
    }
}