// Utils
import { setLogger } from "@utils/Log";

// Database
import { DRIZZLE_CLIENT } from "../../";

// Schemas
import { goals } from "@database/postgres/goals/schema";

export async function goalsSeed() {
    try {
        ((((await DRIZZLE_CLIENT.select().from(goals)).length) > 0) ? (await DRIZZLE_CLIENT.delete(goals)) : null);

       const GOALS_INSERTED =  await DRIZZLE_CLIENT.insert(goals).values([
            {
                title: 'Ir para academia',
                desiredWeeklyFrequency: 7
            },
            {
                title: 'Almoçar no horario',
                desiredWeeklyFrequency: 7
            },
            {
                title: 'Socializar',
                desiredWeeklyFrequency: 7
            }
        ]).returning()

        return GOALS_INSERTED;
    } catch (error: any) {
     setLogger(error);
    }
}