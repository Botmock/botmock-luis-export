# Botmock Luis Export

[![Build status](https://ci.appveyor.com/api/projects/status/tgof5738pfqppis7?svg=true)](https://ci.appveyor.com/project/nonnontrivial/botmock-luis-export)

Import Botmock projects in Luis.ai

The script generates a `.json` file that can be imported from the Luis.ai dashboard.

> **Note**: this repo has just been rewritten to become `.json` import based, and the docs are still being updated.

## Getting Started
First off, you will need to clone the code from: https://github.com/Botmock/botmock-botframework-export

Once cloned, Clone this repository and install dependencies:

``git clone git@github.com:Botmock/botmock-botframework-export.git``

cd botmock-botframework-export

```npm i```

Next, go to the folder and you create a file called /.env 

This file will contain some important information that will help the script extract the correct project from our API and run the export on it. Open the the .env file in your editor of choice.

You will need to setup the following variables:
```
BOTMOCK_TOKEN="@YOUR-BOTMOCK-TOKEN"
BOTMOCK_TEAM_ID="@YOUR-BOTMOCK-TEAM-ID"
BOTMOCK_BOARD_ID="@YOUR-BOTMOCK-BOARD-ID"
BOTMOCK_PROJECT_ID="@YOUR-BOTMOCK-PROJECT-ID"

OUTPUT_DIR=optional/directory/for/output
```

To get your Botmock team ID you will need to visit http://app.botmock.com and login. Once logged in click on the "Teams" dropdown in the top bar and click on "Team Profile". For Botmock Project ID and Board ID, simply open the project you want to export and click on the "Settings" (cog) icon in the top toolbar of your project. Lastly, you will need to generate an API token for your team. This can be done by visiting your dashboard and clicking on your avatar in the top bar. In the dropdown select "Developer API" option. Under "Create an API token" enter a descriptive name and click on "Assign All Abilities" button. Then click "Create" button. This will generate a token for your. Please make sure you copy and paste the token in a secure place. This token will not be shown again. 

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


##Expected JSON Output

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
