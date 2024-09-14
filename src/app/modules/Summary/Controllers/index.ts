import { FastifyReply, FastifyRequest } from "fastify";

// Services
import { getWeekSummary } from "../Services";

// Types

export class Controller {
    constructor() {
        // do anything
    }

    async getWeek(request: FastifyRequest, response: FastifyReply){
        try {
            const SUMMARY_WEEK = await getWeekSummary();

            if(!SUMMARY_WEEK || SUMMARY_WEEK.length <= 0) {
                response.status(500).send("The summary can not be generate");
                return;
            }

            response.status(200).send(SUMMARY_WEEK[0]);
        } catch (error) {
            throw error;
        }
    }  
      

}