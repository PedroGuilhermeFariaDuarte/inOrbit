import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import * as Zod from "zod";

// Controller
import { Controller } from "../Controllers";

export function setGoalRoutes(server: FastifyInstance) {
    try {
        server.withTypeProvider<ZodTypeProvider>().route({
            url: '/goals/create',
            method: 'POST',
            schema: {
                body: Zod.object({
                    title: Zod.string(),
                    desiredWeeklyFrequency: Zod.number()
                        .int()
                        .min(1,'The frequency cannot be less that 1')
                        .max(7, "The frequency cannot be than that 7")
                })
            },
            handler: async (request, response) => {
                await new Controller().create(request, response);
            }
        })        

        server.withTypeProvider<ZodTypeProvider>().route({
            url: '/goals/pendings',
            method: 'GET',
            handler: async (request, response) => {
                await new Controller().getAllPendings(request, response);
            }
        })
    } catch (error) {
        throw error
    }
}