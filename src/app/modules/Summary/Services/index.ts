import dayjs from "dayjs";
import { and, desc, eq, gte, lte, sql } from "drizzle-orm";

// Database
import { DRIZZLE_CLIENT } from "app/database";

// Utils
import { setLogger } from "@utils/Log";

// Schema
import { goals } from "@database/postgres/goals/schema";
import { goalsCompletions } from "@database/postgres/goalsCompletions/schema";

export async function getWeekSummary() {
    try {
        const lastDayOfWeek = dayjs().endOf('week').toDate()
        const firstDayOfWeek = dayjs().startOf('week').toDate()

        const GOALS_CREATED_UP_TO_WEEK = DRIZZLE_CLIENT.$with('goals_created_up_to_week').as(
            DRIZZLE_CLIENT
            .select({
                id: goals.id,
                title: goals.title,
                desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
                // total: sum(goals.desiredWeeklyFrequency).as('desiredWeeklyFrequency'),
                createdAt: goals.createdAt
            })
            .from(goals)
            .where(and(
                gte(goals.createdAt,firstDayOfWeek),
                lte(goals.createdAt, lastDayOfWeek)
            ))
        )

        const GOAL_COMPLETED_IN_WEEK = DRIZZLE_CLIENT.$with('goal_completions_counts').as(
            DRIZZLE_CLIENT
            .select({
                id: goalsCompletions.id,
                title: goals.title,                
                completedAt: goalsCompletions.createdAt,
                completedAtDate: sql`
                    DATE(${goalsCompletions.createdAt})
                `.as('completedAtDate')
            })
            .from(goalsCompletions)
            .innerJoin(goals, eq(goals.id, goalsCompletions.goalId))            
            .where(
                and(
                    gte(goalsCompletions.createdAt,firstDayOfWeek),
                lte(goalsCompletions.createdAt, lastDayOfWeek)
                )
            )
            .orderBy(goalsCompletions.createdAt)
        )

        const GOALS_COMPLETED_BY_WEEK_DAY = DRIZZLE_CLIENT.$with('goals_completed_by_week_day').as(
            DRIZZLE_CLIENT
            .select({
                completedAtDate: GOAL_COMPLETED_IN_WEEK.completedAtDate,
                completions: sql`
                    JSON_AGG(
                        JSON_BUILD_OBJECT(
                            'id', ${GOAL_COMPLETED_IN_WEEK.id},
                            'title', ${GOAL_COMPLETED_IN_WEEK.title},
                            'completedAt', ${GOAL_COMPLETED_IN_WEEK.completedAt}
                        )
                    )
                `.as('completions')
            })
            .from(GOAL_COMPLETED_IN_WEEK)
            .groupBy(GOAL_COMPLETED_IN_WEEK.completedAtDate)
            .orderBy(desc(GOAL_COMPLETED_IN_WEEK.completedAtDate))
        )

        const RESULT = DRIZZLE_CLIENT.with(
            GOALS_CREATED_UP_TO_WEEK,
            GOAL_COMPLETED_IN_WEEK,
            GOALS_COMPLETED_BY_WEEK_DAY
        )
        .select({
            completed: sql`(SELECT COUNT(*) FROM ${GOAL_COMPLETED_IN_WEEK})`.mapWith(Number),
            goalsTotal: sql`(SELECT SUM(${GOALS_CREATED_UP_TO_WEEK.desiredWeeklyFrequency}) FROM ${GOALS_CREATED_UP_TO_WEEK})`.mapWith(Number),
            goalsPerDay: sql`
                JSON_OBJECT_AGG(
                    ${GOALS_COMPLETED_BY_WEEK_DAY.completedAtDate}, 
                    ${GOALS_COMPLETED_BY_WEEK_DAY.completions}
                ) 
            `
        })
        .from(GOALS_COMPLETED_BY_WEEK_DAY)

        return RESULT
    } catch (error) {
        setLogger(error)
        throw error;
    }
}