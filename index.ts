import "dotenv/config";
// import { wrapEntitiesWithChar } from "@botmock-api/text";
import { RewriteFrames } from "@sentry/integrations";
import path from "path";
import chalk from "chalk";
import * as Sentry from "@sentry/node";
import { writeJson } from "fs-extra";
import { remove, mkdirp, writeJSON } from "fs-extra";
import { default as APIWrapper } from "./lib/project";
import { SENTRY_DSN } from "./lib/constants";
import * as Assets from "./lib/types";
// @ts-ignore
import pkg from "./package.json";

declare global {
  namespace NodeJS {
    interface Global {
      __rootdir__: string;
    }
  }
}

global.__rootdir__ = __dirname || process.cwd();

Sentry.init({
  dsn: SENTRY_DSN,
  release: `${pkg.name}@${pkg.version}`,
  integrations: [new RewriteFrames({
    root: global.__rootdir__
  })],
  beforeSend(event): Sentry.Event {
    // if (event.user.email) {
    //   delete event.user.email;
    // }
    return event;
  }
});

Sentry.init({
  dsn: SENTRY_DSN,
  release: `botmock-luis-export@${pkg.version}`,
  
});

interface LogConfig {
  readonly hasError: boolean;
}

function log(str: string | number, config: LogConfig = { hasError: false }): void {
  const method = !config.hasError ? "dim" : "bold";
  console.info(chalk[method](`> ${str}`));
}

async function main(args: string[]): Promise<void> {
  let [, , outputDirectory] = args;
  if (typeof outputDirectory === "undefined") {
    outputDirectory = process.env.OUTPUT_DIR;
  }
  const DEFAULT_OUTPUT = "output";
  const outputDir = path.join(__dirname, outputDirectory || DEFAULT_OUTPUT);
  log("recreating output directory");
  await remove(outputDir);
  await mkdirp(outputDir);
  const apiWrapper = new APIWrapper({
    token: process.env.BOTMOCK_TOKEN,
    teamId: process.env.BOTMOCK_TEAM_ID,
    projectId: process.env.BOTMOCK_PROJECT_ID,
    boardId: process.env.BOTMOCK_BOARD_ID,
  });
  apiWrapper.on("asset-fetched", (assetName: string) => {
    log(`fetched ${assetName}`);
  });
  apiWrapper.on("error", (err: Error) => {
    throw err;
  });
  try {
    log("fetching botmock assets");
    const projectData = await apiWrapper.fetch();
    log(`generating json`);
    await writeToOutput(projectData, outputDir);
  } catch (err) {
    log(err.stack, { hasError: true });
    throw err;
  }
  log("done");
}

export async function writeToOutput(projectData: Partial<Assets.Project>, outputDir: string): Promise<void> {
  const writeDir = path.join(outputDir, `${projectData.project.name}.json`)
  return await writeJSON(
    writeDir,
    {
      luis_schema_version: process.env.LUIS_SCHEMA_VERSION || "3.2.0",
      versionId: process.env.VERSION_ID || "0.1",
      name: projectData.project.name,
      desc: projectData.project.platform,
      culture: "en-us",
      tokenizerVersion: "1.0.0",
      intents: projectData.intents.map(intent => ({ name: intent.name })),
      entities: projectData.variables.map(variable => ({ name: variable.name, roles: [] })),
      composites: [],
      closedLists: [],
      patternAnyEntities: [],
      regex_entities: [],
      prebuiltEntities: [],
      model_features: [],
      regex_features: [],
      patterns: [],
      utterances: projectData.intents
        .filter(intent => !!intent.utterances.length)
        .reduce((acc, intent) => {
          return [
            ...acc,
            ...intent.utterances.map(utterance => ({
              text: utterance.text.replace(/%/g, ""),
              intent: intent.name,
              entities: utterance.variables.map((variable, i: number) => {
                const indexOffset = i * 2;
                const SURROUNDING_VARIABLE_SIGN_OFFSET = 3;
                return {
                  entity: variable.name.replace(/%/g, ""),
                  startPos: parseInt(variable.start_index, 10) - indexOffset,
                  endPos: parseInt(variable.start_index, 10) + variable.name.length - SURROUNDING_VARIABLE_SIGN_OFFSET - indexOffset
                }
              })
            }))
          ]
        }, [])
    }
  );
}

process.on("unhandledRejection", () => {});
process.on("uncaughtException", () => {});

main(process.argv).catch(async (err: Error) => {
  if (process.env.OPT_IN_ERROR_REPORTING) {
    Sentry.captureException(err);
  } else {
    const { message, stack } = err;
    await writeJson(path.join(__dirname, "err.json"), {
      message,
      stack
    });
  }
});
