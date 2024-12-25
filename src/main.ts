import { Project } from "ts-morph";
import { Command } from "@cliffy/command";
import { createReader } from "./reader.ts";
import { createParser } from "./parser.ts";
import { createWriter } from "./writer.ts";

interface GeneratorOptions {
  input: string;
  output: string;
  watch?: boolean;
}

async function generateSchemaTypes(options: GeneratorOptions) {
  const project = new Project({
    compilerOptions: { outDir: "/", declaration: true },
  });

  const reader = createReader(project);
  const parser = createParser();
  const writer = createWriter();

  const sourceFile = await reader.read(options.input);
  const { filePath, propertyNames } = parser.parse(sourceFile);
  await writer.write(options.output, filePath, propertyNames);
}

async function watchMode(options: GeneratorOptions) {
  console.log(`Watching ${options.input} for changes...`);
  const watcher = Deno.watchFs(options.input);

  await generateSchemaTypes(options);

  for await (const event of watcher) {
    if (event.kind === "modify") {
      console.log(`\nFile ${options.input} changed, regenerating...`);
      await generateSchemaTypes(options);
    }
  }
}

// CLI setup
await new Command()
  .name("schema-extractor")
  .version("1.0.0")
  .description("Generate TypeScript types from components schema")
  .option(
    "-i, --input <path:string>",
    "Input TypeScript file containing components interface",
    {
      required: true,
    },
  )
  .option("-o, --output <path:string>", "Output file for generated types", {
    required: true,
  })
  .option("-w, --watch", "Watch mode - regenerate on file changes")
  .action(async (options: GeneratorOptions) => {
    if (options.watch) {
      await watchMode(options);
    } else {
      await generateSchemaTypes(options);
    }
  })
  .parse(Deno.args);
