import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import * as Zod from "zod";

// Controller
import { Controller } from "../Controllers";

export function setGoalCompletionsRoutes(server: FastifyInstance) {
    try {
        server.withTypeProvider<ZodTypeProvider>().route({
            url: '/goals-completions/create',
            method: 'POST',
            schema: {
                body: Zod.object({
                    goalId: Zod.string({
                        coerce: true,
                        invalid_type_error: 'The data should be a string',
                        message: "The goal ID is necessary",
                        required_error: 'The goal ID is necessary',
                        description: 'The goal ID is necessary',                        
                    }),
                }, {
                    invalid_type_error: 'The data should be a object',
                    message: 'The data should be a object with goal ID'
                })
            },
            handler: async (request, response) => {
                await new Controller().create(request, response);
            }
        })        

        server.withTypeProvider<ZodTypeProvider>().route({
            url: '/goals-completions/remove',
            method: 'DELETE',
            handler: async (request, response) => {
                // await new Controller().getAllPendings(request, response);
            }
        })
    } catch (error) {
        throw error
    }
}