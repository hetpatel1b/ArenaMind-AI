declare module '@asteasolutions/zod-to-openapi' {
  export function extendZodWithOpenApi(z: SafeAny): void;

  export class OpenAPIRegistry {
    registerComponent(type: string, name: string, options: SafeAny): SafeAny;
    register(name: string, schema: SafeAny): SafeAny;
    registerPath(config: SafeAny): void;
    definitions: SafeAny[];
  }

  export class OpenApiGeneratorV31 {
    constructor(definitions: SafeAny[]);
    generateDocument(config: SafeAny): SafeAny;
  }
}
