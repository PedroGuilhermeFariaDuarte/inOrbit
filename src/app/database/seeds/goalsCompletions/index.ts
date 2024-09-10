import dayjs from "dayjs";

// Utils
import { setLogger } from "@utils/Log";

// Database
import { DRIZZLE_CLIENT } from "../../";

// Schemas
import { goalsCompletions } from "@database/postgres/goalsCompletions/schema";

// Seed
import { goalsSeed } from "../goals";

export async function goalsCompletionsSeed() {
    try {
        const GOALS_INSERTED = await goalsSeed();
        
        const GOALS_CREATED: {[index: string]: number | Date}[] = [];

        const startOfWeek = dayjs().startOf('week')

        GOALS_INSERTED?.forEach((goal: any) => {
        Array(goal.desiredWeeklyFrequency)
            .fill(null)
            .forEach((_d, i) => {
                GOALS_CREATED.push({
                    goalId: goal.id,
                    createdAt: i % 2 ? startOfWeek.toDate() : startOfWeek.add(1, 'day').toDate()
                })
            })
        })

        if(GOALS_CREATED.length <= 0) return;

        await DRIZZLE_CLIENT.delete(goalsCompletions)

        await DRIZZLE_CLIENT.insert(goalsCompletions).values(GOALS_CREATED as any)
    } catch (error: any) {
     setLogger(error);
    }
}