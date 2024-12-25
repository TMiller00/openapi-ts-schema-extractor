import { SourceFile, Symbol } from "ts-morph";

function createParser() {
  function getSchemaProperties(sourceFile: SourceFile): Symbol[] {
    const components = sourceFile
      .getInterface("components")
      ?.getProperty("schemas")
      ?.getTypeNode()
      ?.getType()
      ?.getProperties();

    if (!components) {
      throw new Error(
        `Unable to find schema properites for file: ${sourceFile.getFilePath()}`,
      );
    }

    return components;
  }

  function getPropertyNames(components: Symbol[]): string[] {
    return components.map((component) => component.getName());
  }

  function getFilePath(sourceFile: SourceFile): string {
    return sourceFile.getFilePath();
  }

  function parse(sourceFile: SourceFile) {
    const filePath = getFilePath(sourceFile);
    const schemaProperties = getSchemaProperties(sourceFile);
    const propertyNames = getPropertyNames(schemaProperties);
    return { filePath, propertyNames };
  }

  return { parse };
}

export { createParser };
