import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { and, count, eq, gte, lte, sql } from "drizzle-orm";

dayjs.extend(weekOfYear)

// Database
import { DRIZZLE_CLIENT } from "app/database";

// Types
import { ICreateGoalData } from "../types";

// Utils
import { setLogger } from "@utils/Log";

// Schema
import { goals } from "@database/postgres/goals/schema";
import { goalsCompletions } from "@database/postgres/goalsCompletions/schema";

export async function createGoal(data: ICreateGoalData) {
    try {
        if(!data) throw new Error('The data of goal is not valid');

        if(data.desiredWeeklyFrequency <= 0) throw new Error('The weekly frequency should be equal or than that 1');

        return (await DRIZZLE_CLIENT.insert(goals).values(data).returning())[0] || null
    } catch (error) {
        setLogger(error)
        throw error;
    }
}

export async function getAllWeekPending() {
    try {
        const lastDayOfWeek = dayjs().endOf('week').toDate()
        const firstDayOfWeek = dayjs().startOf('week').toDate()

        const GOALS_CREATED_UP_TO_WEEK = DRIZZLE_CLIENT.$with('goals_created_up_to_week').as(
            DRIZZLE_CLIENT.select({
                id: goals.id,
                title: goals.title,
                desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
                createdAt: goals.createdAt
            })
            .from(goals)
            .where(lte(goals.createdAt, lastDayOfWeek))
        );

        const GOAL_COMPLETION_COUNTS = DRIZZLE_CLIENT.$with('goal_completion_counts').as(
            DRIZZLE_CLIENT.select({
                goalId: goalsCompletions.goalId,
                completionCount: count(goalsCompletions.id).as('completionCount')
            })
            .from(goalsCompletions)
            .where(
                and(
                    gte(goalsCompletions.createdAt, firstDayOfWeek),
                    lte(goalsCompletions.createdAt, lastDayOfWeek)
                )
            )
            .groupBy(goalsCompletions.goalId)
        )

        const GOALS_PENDINGS = await DRIZZLE_CLIENT
            .with(GOALS_CREATED_UP_TO_WEEK, GOAL_COMPLETION_COUNTS)
            .select(
                {
                    id: GOALS_CREATED_UP_TO_WEEK.id,
                    title: GOALS_CREATED_UP_TO_WEEK.title,
                    desiredWeeklyFrequency: GOALS_CREATED_UP_TO_WEEK.desiredWeeklyFrequency,
                    completionCount: sql`
                        COALESCE(${GOAL_COMPLETION_COUNTS.completionCount}, 0)
                    `.mapWith(Number)
                }
            )
            .from(GOALS_CREATED_UP_TO_WEEK)
            .leftJoin(GOAL_COMPLETION_COUNTS, eq(GOAL_COMPLETION_COUNTS.goalId, GOALS_CREATED_UP_TO_WEEK.id))

        return GOALS_PENDINGS

    } catch (error) {
        throw error;
    }
}