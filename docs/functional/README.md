# Documentazione funzionale

Documentazione funzionale dell’applicazione Spring PetClinic Microservices, ricostruita dal repository nello stato del commit `f3b392c92580b740f4bafd0364b326e0bd1774f0`.

**Analisi:** 4 settembre 2026 · **Branch esaminato:** `main` · **Ambito:** codice, configurazioni, interfaccia statica, schemi/dati HSQLDB e test presenti nel repository.

## Guida alla lettura

- [Specifica funzionale](./applicazione.md): perimetro, attori, funzionalità, flussi, dati, integrazioni, regole e diagrammi.
- [Tracciabilità e scenari QA](./tracciabilita.md): collegamento tra funzionalità, regole, diagrammi, scenari ed evidenze; limiti e punti aperti.

## Sintesi esecutiva

Il sistema gestisce un’anagrafica di proprietari di animali, animali domestici, visite e veterinari. La UI è servita dall’API Gateway; le richieste sono instradate tramite Eureka verso i microservizi. Sono disponibili anche un chatbot GenAI con strumenti per interrogare proprietari/veterinari e creare proprietari o animali, e componenti opzionali di amministrazione e monitoraggio.

La documentazione descrive comportamenti verificati nel codice. La presenza di Docker Compose o di un endpoint non è considerata prova di disponibilità produttiva; non sono state rilevate configurazioni di autenticazione o ruoli applicativi.

## Copertura

Analizzate: UI principale, route gateway, API REST dei servizi clienti/visite/veterinari, aggregazione dettaglio proprietario, chatbot e strumenti GenAI, modelli e schemi HSQLDB, configurazioni di avvio, Compose, test Java pertinenti.

Parzialmente analizzate: dettagli delle configurazioni ricevute dal repository Git esterno indicato dal Config Server, comportamento runtime effettivo dei container e rendering browser. Non risultano processi batch, code o workflow asincroni applicativi nel codice esaminato.

