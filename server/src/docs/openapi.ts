export const openApiDocument = {
  openapi: "3.1.0",
  info: {
    title: "MiniLink - Minimal URL Shortener API",
    version: "1.0.0",
    description:
      "OpenAPI specification for the MiniLink API, a minimal URL shortener service.",
  },
  servers: [{ url: "http://localhost:3000", description: "Local Server" }],
  tags: [
    { name: "Auth" },
    { name: "Me" },
    { name: "Links" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      RegisterInput: {
        type: "object",
        required: ["username", "email", "password"],
        properties: {
          username: { type: "string", minLength: 2, maxLength: 100 },
          email: { type: "string", format: "email", maxLength: 254 },
          password: { type: "string", minLength: 8, maxLength: 72 },
        },
      },
      RegisterOutput: {
        type: "object",
        required: ["user", "token"],
        properties: {
          user: {
            type: "object",
            required: ["id", "username", "email"],
            properties: {
              id: { type: "string" },
              username: { type: "string", minLength: 2, maxLength: 100 },
              email: { type: "string", format: "email", maxLength: 254 },
            },
          },
          token: { type: "string" },
        },
      },
      LoginInput: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", maxLength: 254 },
          password: { type: "string", minLength: 8, maxLength: 72 },
        },
      },
      LoginOutput: {
        type: "object",
        required: ["token"],
        properties: {
          token: { type: "string" },
        },
      },
      CreateShortLinkInput: {
        type: "object",
        required: ["longUrl"],
        properties: {
          longUrl: { type: "string", format: "uri", maxLength: 2048 },
        },
      },
      CreateShortLinkOutput: {
        type: "object",
        required: ["shortUrl", "longUrl"],
        properties: {
          shortUrl: { type: "string", format: "uri" },
          longUrl: { type: "string", format: "uri" },
        },
      },
      LinkNotFoundOutput: {
        type: "object",
        required: ["message"],
        properties: {
          message: { type: "string" },
        },
      },
      LinkItem: {
        type: "object",
        required: [
          "id",
          "slug",
          "longUrl",
          "shortUrl",
          "createdAt",
          "updatedAt",
          "isActive",
        ],
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          longUrl: { type: "string", format: "uri" },
          shortUrl: { type: "string", format: "uri" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          isActive: { type: "boolean" },
        },
      },
      MeLinksOutput: {
        type: "object",
        required: ["links"],
        properties: {
          links: {
            type: "array",
            items: { $ref: "#/components/schemas/LinkItem" },
          },
        },
      },
      ErrorResponse: {
        type: "object",
        required: ["message"],
        properties: {
          message: { type: "string" },
          errors: { type: "object", additionalProperties: true },
        },
      },
    },
  },
  paths: {
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterInput" },
            },
          },
        },
        responses: {
          "201": {
            description: "Successful response",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/RegisterOutput" },
              },
            },
          },
          "400": {
            description: "Invalid body",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "409": {
            description: "Email already in use",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login a user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginInput" },
            },
          },
        },
        responses: {
          "200": {
            description: "Successful response",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginOutput" },
              },
            },
          },
          "400": {
            description: "Invalid body",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "401": {
            description: "Invalid credentials",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/me/links": {
      get: {
        tags: ["Me"],
        summary: "List links created by the authenticated user",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Successful response",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/MeLinksOutput" },
              },
            },
          },
          "401": {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      post: {
        tags: ["Me"],
        summary: "Create a short link",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateShortLinkInput" },
            },
          },
        },
        responses: {
          "200": {
            description: "Successful response",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateShortLinkOutput" },
              },
            },
          },
          "400": {
            description: "Invalid body",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "401": {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "409": {
            description: "Slug already in use",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/{slug}": {
      get: {
        tags: ["Links"],
        summary: "Redirect to the original URL",
        parameters: [
          {
            name: "slug",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "302": {
            description: "Redirect to the original URL",
          },
          "404": {
            description: "Link not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LinkNotFoundOutput" },
              },
            },
          },
        },
      },
    },
  },
} as const;
