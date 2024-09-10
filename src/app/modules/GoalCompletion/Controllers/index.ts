import { FastifyReply, FastifyRequest } from "fastify";

// Services
import { createGoalCompletion } from "../Services";

// Types
import { ICreateGoalCompletionsData } from "../types";

export class Controller {
    constructor() {
        // do anything
    }

    async create(request: FastifyRequest, response: FastifyReply){
        try {
            const GOAL_COMPLETION_CREATED = await createGoalCompletion(request.body as ICreateGoalCompletionsData);

            if(!GOAL_COMPLETION_CREATED) {
                response.status(500).send("The goal completion can not be created");
                return;
            }

            response.status(201).send(GOAL_COMPLETION_CREATED);
        } catch (error) {
            throw error;
        }
    }  
      

}