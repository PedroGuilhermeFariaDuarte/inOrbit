import { fastify } from "fastify"

const APP_STATEMENT = fastify()

APP_STATEMENT.listen({
    port: 3333
}).then(() => {
    console.log('The HTTP Server is running on port 3333')
})