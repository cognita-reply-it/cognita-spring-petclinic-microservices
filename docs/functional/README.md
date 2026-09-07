# Documentazione funzionale — Spring Petclinic Microservices

**Analisi:** 7 settembre 2026 · **branch/commit esaminato:** `main` / `f3b392c92580b740f4bafd0364b326e0bd1774f0` · **base della documentazione:** evidenze nel repository.  
Questa documentazione descrive lo stato implementato; non attesta la configurazione o l'attivazione di ambienti esterni.

## Indice

- [Sistema, perimetro, attori e dati](sistema-e-dati.md)
- [Funzionalità e processi](funzionalita-e-processi.md)
- [Verifica, tracciabilità e punti aperti](verifica-e-tracciabilita.md)

## Come leggere il documento

Gli identificativi `FUN-*`, `RB-*`, `PROC-*`, `DGM-*` e `SCN-*` rendono tracciabili rispettivamente funzionalità, regole, processi, diagrammi e scenari. “Implementata” significa che è stato verificato il percorso fra UI/API e componente responsabile; “condizionata” segnala una dipendenza da configurazione o servizio esterno. I riferimenti sono percorsi relativi alla root del repository e, quando utile, simboli sorgente.

## Copertura e limiti

Sono state esaminate le UI AngularJS, le route gateway, i controller REST, modelli, repository, configurazioni locali, compose e test presenti per i servizi customers, visits, vets, gateway e GenAI. Config Server, Discovery, Admin, tracing e monitoraggio sono documentati come componenti di supporto. Non sono state eseguite chiamate a servizi esterni, né una prova end-to-end con Docker; le configurazioni effettive del repository esterno di Spring Cloud Config non sono nel checkout. Il knowledge graph locale era allineato al commit, ma segnala corpus troncato: è stato usato come indice e non come unica evidenza.

## Glossario

| Termine | Significato nel sistema |
|---|---|
| Proprietario (Owner) | Anagrafica del cliente della clinica e titolare di uno o più animali. |
| Animale (Pet) | Animale collegato a un proprietario, con nome, data di nascita e tipo. |
| Visita (Visit) | Registrazione datata, testuale, riferita a un identificativo di animale. |
| Veterinario (Vet) | Professionista visualizzato con eventuali specializzazioni. |
| Gateway | Punto di accesso web/API che serve la UI e instrada le richieste ai microservizi. |
| LLM / GenAI | Modello linguistico esterno usato dal chatbot per rispondere e invocare strumenti. |
| RAG / vector store | Ricerca semantica sui veterinari attraverso un archivio di vettori precaricato o generato all'avvio. |
| HSQLDB / MySQL | Persistenze alternativa in memoria e relazionale configurabili per i tre servizi di dominio. |
