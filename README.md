# Botmock Luis Export

[![Build status](https://ci.appveyor.com/api/projects/status/tgof5738pfqppis7?svg=true)](https://ci.appveyor.com/project/nonnontrivial/botmock-luis-export)

Import Botmock content into Luis.ai with ease through a Luis-friendly JSON file with intents, training phrases, and variables taken from any Botmock Project.

- Tutorial Video (Coming Soon)
- [Documentation](http://help.botmock.com/en/articles/3322559-integration-guide-microsoft-luis-ai)
- [Support Email](mailto:help@botmock.com)

## Prerequisites

- Node JS version 12.x

```shell
#determine nodejs version
node --version
```

- A [Luis.ai](https://www.luis.ai/home) Account

## Getting Started
First off, you will need to clone the code from: https://github.com/Botmock/botmock-luis-export/

Once cloned, Clone this repository and install dependencies:

``git clone git@github.com:Botmock/botmock-luis-export.git``

``cd botmock-luis-export``

```npm i```

Next, go to the folder and you create a file called /.env 

This file will contain some important information that will help the script extract the correct project from our API and run the export on it. Open the the .env file in your editor of choice.

You will need to setup the following variables:
```
BOTMOCK_TOKEN=@YOUR-BOTMOCK-TOKEN
BOTMOCK_TEAM_ID=@YOUR-BOTMOCK-TEAM-ID
BOTMOCK_BOARD_ID=@YOUR-BOTMOCK-BOARD-ID
BOTMOCK_PROJECT_ID=@YOUR-BOTMOCK-PROJECT-ID

OUTPUT_DIR=optional/directory/for/output
```

To get your Botmock Token, Team ID, Board ID, and Project ID, see instructions in this tutorial: http://help.botmock.com/en/articles/3322559-integration-guide-microsoft-luis-ai . All of these values are required to run the export script properly.

With this .env file, you can also choose an "Output Directory", which essentially allows you to tell the export script where to drop off the JSON file.

Once you have all the information in `.env`  file, simply run `npm start` to run the export script, and your JSON file should output in the directory that you defined.

## Importing into Luis.ai

Once your JSON export is ready and in the proper directory, you can move to the  LUIS AI dashboard to create a new app and import the data. 

To do this, you have to do a few simple steps within Luis.ai: 

1. Start by logging into your Luis.ai account/dashboard.
2. At the top, you should see a menu for "My apps". Click into that tab.
3. Within this tab, you will click the "Import new app" button
4. If you click on the "Import new app" button, you should be prompted to upload the JSON file and give your own name to the app.
5. Once you have created your new app, you can go into the application and view all of your imported data in the "BUILD" tab in the top right.


**Note: Every time you would like to upload a JSON file, you will need to do it by importing/creating a new app.**


## Expected JSON Output

If you setup everything correctly within your .env file, this is the Luis-friendly output that you should have in your JSON file that generates in whichever directory you told it to go to.

Here, you can see all your intents and variables from your Botmock Projects listed. 

It should be noted that within Luis.ai, Intents are properly equal to what intents are in Botmock, but entities are, instead, what you would call "variables" within Botmock. 

```
{
  "luis_schema_version": "3.2.0",
  "versionId": "0.1",
  "name": "Example Project",
  "desc": "facebook",
  "culture": "en-us",
  "tokenizerVersion": "1.0.0",
  "intents": [
    {
      "name": "cancel"
    },
    {
      "name": "confirm"
    }
  ],
  "entities": [
    {
      "name": "action",
      "roles": []
    }
  ],
  "composites": [],
  "closedLists": [],
  "patternAnyEntities": [],
  "regex_entities": [],
  "prebuiltEntities": [],
  "model_features": [],
  "regex_features": [],
  "patterns": [],
  "utterances": [
    {
      "text": "no!",
      "intent": "cancel",
      "entities": []
    },
    {
      "text": "no",
      "intent": "cancel",
      "entities": []
    },
    {
      "text": "not ever",
      "intent": "cancel",
      "entities": []
    },
    {
      "text": "yes",
      "intent": "confirm",
      "entities": []
    },
    {
      "text": "yes, action",
      "intent": "confirm",
      "entities": [
        {
          "entity": "action",
          "startPos": 5,
          "endPos": 10
        }
      ]
    }
  ]
}
```

## Want to help?

Found bugs or have some ideas to improve this integration? We'd love to to hear from you! You can start by submitting an issue at the [Issues](https://github.com/Botmock/botmock-luis-export/issues) tab. If you want, feel free to submit a pull request and propose a change as well!

### Submitting a Pull Request

1. Start with creating an issue if possible, the more information, the better!
2. Fork the Repository.
3. Make a new change under a branch based on master. Ideally, the branch should be based on the issue you made such as "issue-530".
4. Send the Pull Request, followed by a brief description of the changes you've made. Reference the issue.

_NOTE: Make sure to leave any sensitive information out of an issue when reporting a bug with imagery or copying and pasting error data. We want to make sure all your info is safe!_

## License

Botmock Microsoft Luis.ai Integration is copyright © 2019 Botmock. It is free software, and may be redistributed under the terms specified in the LICENSE file. Luis.ai is a property of Microsoft Corporation.

