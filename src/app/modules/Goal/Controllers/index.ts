import { FastifyReply, FastifyRequest } from "fastify";

// Services
import { createGoal, getAllWeekPending } from "../Services";

// Types
import { ICreateGoalData } from "../types";

export class Controller {
    constructor() {
        // do anything
    }

    async create(request: FastifyRequest, response: FastifyReply){
        try {
            const GOAL_CREATED = await createGoal(request.body as ICreateGoalData);

            if(!GOAL_CREATED) {
                response.status(500).send("The goal do not created");
                return;
            }

            response.status(201).send(GOAL_CREATED);
        } catch (error) {
            throw error;
        }
    }  

    async getAllPendings(request: FastifyRequest, response: FastifyReply){
        try {
            const GOALS_PENDINGS = await getAllWeekPending();

            if(!GOALS_PENDINGS) {
                response.status(500).send("The goal do not created");
                return;
            }

            response.status(201).send(GOALS_PENDINGS);
        } catch (error) {
            throw error;
        }
    }   

}