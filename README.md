# Coronalog

Mit CoronaLog behältst du deine COVID-19 Symptome im Auge und vereinfachst deine Kommunikation mit den Ärzten. Du leistest einen wichtigen Beitrag zur Bekämpfung des Virus, indem du deine anonymisierten Daten für Forscher zugänglich machst. Aus der wachsenden Datenbasis gewinnen die Forscher neue Erkenntnisse zu Krankheitsverläufen sowie bisher unbekannten Symptomen und Risikofaktoren.

Hier geht's zum Kurzvideo auf [YouTube](https://www.youtube.com/watch?v=YFxHOLcjwQI).

![Coronalog Screenshots](./screenshots.png?raw=true)

## Running the application in Development

Both backend and frontend are included in this project and must be seperately installed and started. 

The technology stack:
- React.js frontend
- FastAPI (Python) backend
- Google Firestore NoSQL database

### Backend

Requirements:
- [Python 3](https://www.python.org/downloads/) und [Pip](https://pip.pypa.io/en/stable/installing/)
- Pipenv must be installed:
```bash
pip install pipenv
```
- You will need an [SSH certificate](https://gist.github.com/cecilemuller/9492b848eb8fe46d462abeb26656c4f8) to run the server via https. Store the .key and .crt files safely as they will be needed to start the server.
- To use the firestore NoSQL database, create a new firebase project (basic usage is free). Open the firebase console of your project and go to *Database* -> *Create Database*. Create the database and create two new collections:
  1. Name: `usage_purposes`. In the dialog, create a document named `fAAmChFEatGHgUDuORqX` (The name can be chosen arbitrarily, however unit tests look for a doc with this id) with a field `purpose` set to `private`.
  2. Name: `users`. Insert an arbitrary document. In firestore, at least one document is required inside a collection.

  Afterwards, create a new private key to access this database from the python server: *Settings* -> *project settings* -> *service accounts* -> *Generate new private key*  
  Download the file, make sure it is named `firebase_key.json`, and save it to the api folder of the project.
- Create a new json file `config.json` and save it to *api/auth*. This file will contain configuration for user authentication. Replace the secret key, at least.
```json
{
    "access_token": {
        "secret": "YourSecretKey",
        "lifetime": 3600,
        "sign_alg": "HS256",
        "body_cookie_key": "__Host-idTokenBody",
        "signature_cookie_key": "__Host-idTokenSign"
    }
}
```


Now, you can finally run the server:

Windows (Powershell):
```bash
# run in the api directory
$env:PYTHONPATH += ";./model"
$env:GOOGLE_APPLICATION_CREDENTIALS = "./firebase_key.json"

pipenv install
pipenv run uvicorn app:app --ssl-keyfile="path_to_keyfile.key" --ssl-certfile="path_to_certfile.crt" --port=5000
```
Linux:
```bash
# run in the api directory
export PYTHONPATH=$PYTHONPATH:model
export GOOGLE_APPLICATION_CREDENTIALS=firebase_key.json

pipenv install
pipenv run uvicorn app:app --ssl-keyfile="path_to_keyfile.key" --ssl-certfile="path_to_certfile.crt" --port=5000
```

Your server should now be running on localhost:5000.

#### Caveats
- Make sure that your system clock is in sync with your real local time!!!
    (otherwise you will get  [this error](https://github.com/googleapis/google-cloud-python/issues/3100))

### Frontend

Requirements:
- Install [Node.js and npm](https://nodejs.org/en/)

Run the application:
```bash
npm install
npm start
```
If you are prompted to choose a different port, select Yes.

Note that at the moment, the application only supports mobile devices. When opening on a desktop, use the dev tools to emulate a mobile screen.

## Deployment

That's a whole different story...

## Contributing

The project originated in the #WirVsVirus hackathon in Germany. Coronalog is the result of our project group.

[Confluence-Doku inklusive Guide zum Aufsetzen des Projekts](https://penny-private.atlassian.net/wiki/spaces/C/pages/23724078/Aufsetzen+des+Entwicklungsprojekts)

[Devpost-Page](https://devpost.com/software/27_patientenaustausch_coronalog)

[Jira](https://penny-private.atlassian.net/secure/RapidBoard.jspa?projectKey=CL&rapidView=2)
