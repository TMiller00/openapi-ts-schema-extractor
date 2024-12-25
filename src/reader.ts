import { Project, SourceFile } from "ts-morph";

function createReader(project: Project) {
  async function verifyFileExists(inputPath: string): Promise<string> {
    try {
      await Deno.stat(inputPath);
      return inputPath;
    } catch {
      throw new Error(`File not found: ${inputPath}`);
    }
  }

  function addToProject(inputPath: string): string {
    try {
      project.addSourceFileAtPath(inputPath);
      return inputPath;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Unable to add input to project.",
      );
    }
  }

  function getSourceFile(inputPath: string): SourceFile {
    const sourceFile = project.getSourceFile(inputPath);

    if (!sourceFile) {
      throw new Error(`Failed to load source file: ${inputPath}`);
    }

    return sourceFile;
  }

  async function read(inputPath: string) {
    const verifiedPath = await verifyFileExists(inputPath);
    const addedPath = addToProject(verifiedPath);
    return getSourceFile(addedPath);
  }

  return { read };
}

export { createReader };
