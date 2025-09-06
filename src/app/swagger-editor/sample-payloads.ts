export const samplePayloads = {
  'Swagger 2.0 (YAML)': `
swagger: '2.0'
info:
  title: Simple API
  version: 1.0.0
paths:
  /:
    get:
      responses:
        '200':
          description: OK
`,
  'OpenAPI 3.0 (JSON)': `
{
  "openapi": "3.0.0",
  "info": {
    "title": "Simple API",
    "version": "1.0.0"
  },
  "paths": {
    "/": {
      "get": {
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    }
  }
}
`,
};
