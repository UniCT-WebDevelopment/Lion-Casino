
# Lion Casinò 🦁🎰 💸
## Descrizione
Lion casinò è un sito di gioco d'azzardo online.
All'interno del sito, sarà possibile giocare a giochi come roulette e slot machine.
Ogni utente potrà:
- Depositare del denaro nel conto gioco.
- Giocare alla roulette.
- Giocare alle slot.
- Interagire con gli altri utenti mediante una chat di gioco.

E' presente la possibilità di avere un account admin che, oltre a tutti i benefici di un account normale, potrà:

- Creare una room di gioco, settando: bet minimo,nome , descrizione e immagine della room.
- Modificare/eliminare le room esistenti.
- Aggiungere slot.


## Frontend
Il lato frontend del sito è stato realizzato tramite i seguenti componenti:
- **HTML** per lo scheletro della pagina statica e importazioni varie
- **CSS** per la gestione degli stili, delle animazioni e delle media query
- **Bootstrap** per la gestione di alcuni elementi stilistici
- **JavaScript** per la gestione di funzioni ed algoritmi, per la manipolazione del DOM e per alcune responsabilità relative allo scrolling
- **JQuery** per una facilitata gestione delle chiamate asincrone AJAX al server (GET e POST) 


## Backend
- **NodeJS** per supportare express e per usufruire di componenti aggiuntive (elencate sotto)
- **ExpressJS** per la gestione dell'applicazione, delle chiamate AJAX (GET e POST) e del routing
- **MongoDB** per conservare i dati relativi ai giochi, agli utenti e agli annunci
- **Socket** per inviare e ricevere dati tra client e server

## Prerequisiti
1. Un package manager (ad esempio npm)
2. NodeJS per avviare il programma
3. Un database MongoDB, che conterrà: dati degli utenti, dati delle room (roulette), dati delle slot



## Lion backend porta nel .env file
```json
PORT=4000
```
## Lion backend
Le impostazioni del db sono all'interno del docker compose.
```json
mongo-container:
  image: mongo:3.4.2
  environment:
      # provide your credentials here
      - MONGO_INITDB_ROOT_USERNAME=root
      - MONGO_INITDB_ROOT_PASSWORD=rootPassword
  ports:
    - "27017:27017"
  volumes:
      # if you wish to setup additional user accounts specific per DB or with different roles you can use following entry point
    - "$PWD/mongo-entrypoint/:/docker-entrypoint-initdb.d/"
  # no --auth is needed here as presence of username and password add this option automatically
  command: mongod

```

## Lion backend
```sh
npm install
npm start

```

## Backend roulette
```sh
npm install
node .\main.js
```


# Author 💻 👦
Lion casinò è stato creato da Enrico Sorbello, studente di informatica presso l'università degli studi di catania.

Email: enrico.sorbello00@gmail.com










