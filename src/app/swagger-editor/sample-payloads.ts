export const samplePayloads = {
  'Swagger 2.0 (YAML)': `
swagger: '2.0'
info:
  title: Simple Swagger API
  description: A basic Swagger 2.0 API example.
  version: 1.0.0
host: api.example.com
basePath: /v1
schemes:
  - https
paths:
  /users:
    get:
      summary: Gets a list of users.
      responses:
        '200':
          description: OK
`,
  'OpenAPI 3.0 (JSON)': `
{
  "openapi": "3.0.0",
  "info": {
    "title": "Simple OpenAPI 3.0 API",
    "description": "A basic OpenAPI 3.0 API example in JSON.",
    "version": "1.0.0"
  },
  "servers": [
    {
      "url": "https://api.example.com/v1"
    }
  ],
  "paths": {
    "/users": {
      "get": {
        "summary": "Gets a list of users.",
        "responses": {
          "200": {
            "description": "A successful response."
          }
        }
      }
    }
  }
}
`,
  'OpenAPI 3.0 (YAML)': `
openapi: 3.0.0
info:
  title: Simple OpenAPI 3.0 API
  description: A basic OpenAPI 3.0 API example in YAML.
  version: 1.0.0
servers:
  - url: https://api.example.com/v1
paths:
  /users:
    get:
      summary: Gets a list of users.
      responses:
        '200':
          description: A successful response.
`,
  'OpenAPI 3.1 (YAML)': `
openapi: 3.1.0
info:
  title: Simple OpenAPI 3.1 API
  description: A basic OpenAPI 3.1 API with webhooks.
  version: 1.0.1
servers:
  - url: https://api.example.com/v2
paths:
  /items:
    get:
      summary: Retrieve a list of items.
      responses:
        '200':
          description: OK
webhooks:
  newItem:
    post:
      requestBody:
        description: Information about a new item.
        content:
          application/json:
            schema:
              type: object
              properties:
                itemName:
                  type: string
      responses:
        '200':
          description: Return a 200 status to acknowledge receipt.
`,
  'OpenAPI 3.0 (Detailed Example)': `
openapi: 3.0.0
info:
  title: Sample API with All Data
  description: This is a sample API demonstrating various OpenAPI features.
  version: 1.0.0
servers:
  - url: https://api.example.com/v1
    description: Production server
  - url: https://dev.example.com/v1
    description: Development server
paths:
  /users:
    get:
      summary: Get all users
      description: Retrieves a list of all registered users.
      operationId: getAllUsers
      tags:
        - Users
      parameters:
        - name: limit
          in: query
          description: Maximum number of users to return
          required: false
          schema:
            type: integer
            format: int32
            minimum: 1
            maximum: 100
            default: 20
      responses:
        '200':
          description: A list of users
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/User'
        '401':
          $ref: '#/components/responses/UnauthorizedError'
    post:
      summary: Create a new user
      description: Creates a new user account.
      operationId: createUser
      tags:
        - Users
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/NewUser'
      responses:
        '201':
          description: User created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '400':
          $ref: '#/components/responses/BadRequestError'
  /users/{userId}:
    get:
      summary: Get user by ID
      description: Retrieves a single user by their ID.
      operationId: getUserById
      tags:
        - Users
      parameters:
        - name: userId
          in: path
          description: ID of the user to retrieve
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: User found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '404':
          $ref: '#/components/responses/NotFoundError'
components:
  schemas:
    User:
      type: object
      required:
        - id
        - username
        - email
      properties:
        id:
          type: string
          format: uuid
          example: d290f1ee-6c54-4b01-90e6-d701748f0851
        username:
          type: string
          example: johndoe
        email:
          type: string
          format: email
          example: john.doe@example.com
        createdAt:
          type: string
          format: date-time
          readOnly: true
    NewUser:
      type: object
      required:
        - username
        - email
        - password
      properties:
        username:
          type: string
          example: janedoe
        email:
          type: string
          format: email
          example: jane.doe@example.com
        password:
          type: string
          format: password
          example: securepassword123
  responses:
    UnauthorizedError:
      description: Authentication required or invalid credentials
      content:
        application/json:
          schema:
            type: object
            properties:
              message:
                type: string
                example: Unauthorized
    BadRequestError:
      description: Invalid request payload or parameters
      content:
        application/json:
          schema:
            type: object
            properties:
              message:
                type: string
                example: Invalid input
    NotFoundError:
      description: Resource not found
      content:
        application/json:
          schema:
            type: object
            properties:
              message:
                type: string
                example: Not Found
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
security:
  - BearerAuth: []
`,
};