// @ts-nocheck

import "dotenv/config";
import { EOL } from "os";
import path from "path";
import { Batcher } from "@botmock-api/client";
import { default as log } from "@botmock-api/log";
import * as Sentry from "@sentry/node";
import { writeJson } from "fs-extra";
import { remove, mkdirp, writeJSON } from "fs-extra";
import * as Assets from "./lib/types";

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
  // ..
  try {
    log("fetching assets");
    // @ts-ignore
    const { data: projectData } = await new Batcher({
      token: process.env.BOTMOCK_TOKEN as string,
      teamId: process.env.BOTMOCK_TEAM_ID as string,
      projectId: process.env.BOTMOCK_PROJECT_ID as string,
      boardId: process.env.BOTMOCK_BOARD_ID as string,
    }).batchRequest([
      "project",
      "board",
      "intents",
      "entities",
      "variables"
    ]);
    log("writing file");
    log(`generating json`);
    await writeToOutput(projectData, outputDir);
  } catch (err) {
    log(err.stack, { isError: true });
    throw err;
  }
  log("done");
}

export async function writeToOutput(projectData: Partial<Assets.Project>, outputDir: string): Promise<void> {
  const writeDir = path.join(outputDir, `${projectData.project.name}.json`);
  const intentNames = projectData.intents.map((intent, i) => `${i}_${intent.name}`);
  return await writeJSON(
    writeDir,
    {
      luis_schema_version: process.env.LUIS_SCHEMA_VERSION || "3.2.0",
      versionId: process.env.VERSION_ID || "0.1",
      name: projectData.project.name,
      desc: projectData.project.platform,
      culture: "en-us",
      tokenizerVersion: "1.0.0",
      intents: intentNames.map(name => ({ name })),
      entities: projectData.entities.map(entity => ({ name: entity.name, roles: [] })),
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
              intent: intentNames.find(name => name.endsWith(intent.name)),
              entities: utterance.variables
                .map((variable, i: number) => {
                  const indexOffset = i * 2;
                  const SURROUNDING_VARIABLE_SIGN_OFFSET = 3;
                  const entity = projectData.entities.find(entity => entity.id === variable.entity);
                  if (typeof entity === "undefined") {
                    return undefined;
                  }
                  return {
                    entity: entity.name,
                    startPos: parseInt(variable.start_index, 10) - indexOffset,
                    endPos: parseInt(variable.start_index, 10) + variable.name.length - SURROUNDING_VARIABLE_SIGN_OFFSET - indexOffset
                  };
                })
                .filter(value => typeof value !== "undefined")
            }))
          ];
        }, [])
    }, { spaces: 2, EOL }
  );
}

process.on("unhandledRejection", () => { });
process.on("uncaughtException", () => { });

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
