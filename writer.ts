import { ensureDir } from "@std/fs";
import { dirname, relative } from "@std/path";

const template = `// This file is auto-generated. Do not edit directly.
import type { components } from '{{IMPORT_PATH}}';

type Schema<T extends keyof components['schemas']> = components['schemas'][T];

// Generated schema types
{{SCHEMA_TYPES}}
`;

function createWriter() {
  async function ensureOutputDir(outputPath: string): Promise<string> {
    try {
      await ensureDir(dirname(outputPath));
      return outputPath;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Unable to ensure output directory",
      );
    }
  }

  function getRelativeImport(outputPath: string, filePath: string): string {
    const relativeFilePath = relative(dirname(outputPath), filePath);

    if (!relativeFilePath) {
      throw new Error("Unable to get relative file path.");
    }

    return relativeFilePath;
  }

  function createExportedTypes(propertyNames: string[]): string {
    return propertyNames
      .map((name) => `export type ${name} = Schema<'${name}'>;`)
      .join("\n");
  }

  function populateTemplate(relativeImport: string, exportedTypes: string) {
    return template
      .replace("{{IMPORT_PATH}}", relativeImport)
      .replace("{{SCHEMA_TYPES}}", exportedTypes);
  }

  async function write(
    outputPath: string,
    filePath: string,
    propertyNames: string[],
  ) {
    const outputDir = await ensureOutputDir(outputPath);
    const relativeImport = getRelativeImport(outputDir, filePath);
    const exportedTypes = createExportedTypes(propertyNames);
    const outputContent = populateTemplate(relativeImport, exportedTypes);

    try {
      await Deno.writeTextFile(outputPath, outputContent);
      console.log(
        `✅ Generated ${propertyNames.length} schema types in ${outputPath}`,
      );
      console.log("  Types generated:", propertyNames.join(", "));
    } catch (error) {
      console.error("Error generating schema types:", error);
    }
  }

  return { write };
}

export { createWriter };
