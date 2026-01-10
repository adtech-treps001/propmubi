import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

const server = new Server(
    {
        name: "propmubi-mcp-server",
        version: "1.0.0",
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

// Mock Database for demo purposes
const MOCK_PROJECTS = [
    { id: "1", name: "My Home Apas", location: "Kokapet", price: "3.88Cr" },
    { id: "2", name: "Aparna One", location: "Shaikpet", price: "7.2Cr" },
];

server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "inventory_search_projects",
                description: "Search for projects based on filters",
                inputSchema: {
                    type: "object",
                    properties: {
                        location: { type: "string" },
                        min_price: { type: "number" },
                    },
                },
            },
        ],
    };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    if (request.params.name === "inventory_search_projects") {
        const location = request.params.arguments?.location as string;

        const results = MOCK_PROJECTS.filter(p =>
            !location || p.location.toLowerCase().includes(location.toLowerCase())
        );

        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(results),
                },
            ],
        };
    }
    throw new Error("Tool not found");
});

const transport = new StdioServerTransport();
await server.connect(transport);
