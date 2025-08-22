import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "WebRTC Project API with Swagger",
            version: "1.0.0",
            description: "API documentation for the WebRTC Deepfake Detection project.",
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 8080}`,
                description: "Development server",
            },
        ],
    },
    apis: ["./src/routes/*.ts"],
}

export const swaggerSpec = swaggerJSDoc(options);