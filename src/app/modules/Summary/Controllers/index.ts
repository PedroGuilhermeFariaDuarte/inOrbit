import { FastifyReply, FastifyRequest } from "fastify";

// Services
import { getWeekSummary } from "../Services";

// Types
import { ICreateGoalCompletionsData } from "../types";

export class Controller {
    constructor() {
        // do anything
    }

    async getWeek(request: FastifyRequest, response: FastifyReply){
        try {
            const SUMMARY_WEEK = await getWeekSummary();

            if(!SUMMARY_WEEK) {
                response.status(500).send("The summary can not be generate");
                return;
            }

            response.status(201).send(SUMMARY_WEEK);
        } catch (error) {
            throw error;
        }
    }  
      

}