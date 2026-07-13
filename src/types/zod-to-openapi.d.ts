declare module '@asteasolutions/zod-to-openapi' {
  export function extendZodWithOpenApi(z: any): void;

  export class OpenAPIRegistry {
    registerComponent(type: string, name: string, options: any): any;
    register(name: string, schema: any): any;
    registerPath(config: any): void;
    definitions: any[];
  }

  export class OpenApiGeneratorV31 {
    constructor(definitions: any[]);
    generateDocument(config: any): any;
  }
}
