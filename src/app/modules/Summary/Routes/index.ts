import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

// Controller
import { Controller } from "../Controllers";

export function setSummaryRoutes(server: FastifyInstance) {
    try {
        server.withTypeProvider<ZodTypeProvider>().route({
            url: '/summary/week',
            method: 'GET',
            handler: async (request, response) => {
                await new Controller().getWeek(request, response);
            }
        })
    } catch (error) {
        throw error
    }
}