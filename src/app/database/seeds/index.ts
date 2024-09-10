import { DRIZZLE_STATEMENT } from "..";
import { goalsCompletionsSeed } from "./goalsCompletions";

goalsCompletionsSeed().finally(() => {
    DRIZZLE_STATEMENT.end()
})