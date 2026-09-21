# Attendibilità, punti aperti e handoff COG-298

[Torna all'indice](README.md).

## Metodo ed evidenza

Analisi statica di UI → route gateway → controller → repository/modello e dei percorsi alternativi, con confronto dei test. Data e commit sono nell'[indice](README.md). Le API e i template definiscono comportamento implementato; i test dichiarano aspettative circoscritte. Non sono stati avviati servizi, database, strumenti chaos o provider reali.

Il knowledge graph è stato interrogato in sola lettura (`kg_health`, `kg_search`, `kg_subgraph`, `kg_recent_changes`): HEAD indicizzato uguale al commit esaminato, stato ready. Il subgraph limitato era troncato; è servito a orientare la lettura, non come inventario completo o prova del funzionamento.

Company Knowledge era disponibile: catalogo e lista fonti letti; recall «Petclinic funzionalità proprietari animali visite veterinari requisiti» ha restituito candidati sintetici non sufficienti per ricostruire requisiti Petclinic. Il documento PORTO è stato verificato direttamente e si dichiara prova MCP, non documentazione cliente. Nessuna sua soglia è stata applicata all'applicazione. Provenienza della verifica: sourceId `b2099288-f16e-4b9a-8d49-227162af2e1b`, revisionId `f44dc90a-0876-433a-8f6c-cf5311ef5735`, contentHash `143fdd4e32c70df6793d5144db71224b4570c212a7293ac52fede8503b58ab00`, locator righe 1–7, stato editoriale `unreviewed`, conflictIds vuoto. Questo è un risultato non pertinente, non un servizio indisponibile o una prova che altrove non esistano requisiti.

## Fatti, deduzioni e informazioni non determinabili

| Classe | Elementi | Trattamento |
|---|---|---|
| Fatti verificati nel sorgente | Route e salvataggi, quattro tool, fallback visite, pattern telefono, parametri topK, SQL | Descritti con E-xx; non dichiarati collaudati |
| Deduzioni da confermare | Sovrascritture concorrenti, duplicati dopo errore, resa errori AngularJS, data pet serializzata, caricamento indice da JAR | Scenari di caratterizzazione; non status HTTP inventati |
| Non determinabile localmente | Ruoli organizzativi, protezione esterna, configurazione effettiva, deployment attivo, conservazione, costi/tempi reali, freschezza indice | Domande aperte; nessuna assunzione di produzione |
| Assenza di evidenze nel perimetro | Tenant, stato clinico, notifiche/approvazioni, cancellazione UI/API, audit business | Non estesa a sistemi esterni o roadmap |

## Contraddizioni e anomalie osservate

| ID | Evidenza e contrasto | Impatto documentale |
|---|---|---|
| A-01 | E-03/E-09: UI 12 cifre, vincolo backend massimo 12, descrizione tool 10 | R-02 distingue i tre canali; regola di prodotto da scegliere |
| A-02 | E-04: ID animale nel corpo prevale sull'URL, owner wildcard ignorato | Nessuna promessa di appartenenza o protezione basata sulla route |
| A-03 | E-04/E-06: obbligatorietà UI e validazione backend non equivalenti; manca Valid su PetRequest | Documentati limiti per nome/data animale e descrizione visita |
| A-04 | E-05/E-12: errore Visits convertito in lista vuota con 200 | Dettaglio può essere incompleto senza avviso |
| A-05 | E-02: interceptor presume errors e restituisce response; form owner/pet non nominati | Non garantire messaggi e permanenza sul modulo dopo errore |
| A-06 | E-09: prompt promette assistenza sulle visite, ma nessun tool le acquisisce/crea; commento memoria menziona dieci messaggi, configurazione usa order(10) | Capacità visite non dimostrata; nessuna garanzia di retention di dieci messaggi |
| A-07 | [Architettura esistente](../agent-readiness/architecture.md), sezione Data and trust boundaries, generalizza l'assenza di FK visita–animale. E-06: assente HSQLDB, presente nello schema MySQL | Specificata distinzione; topologia MySQL reale da verificare |
| A-08 | Commento E-10 richiama H2; repository fornisce HSQLDB/MySQL. Caricamento getFile dipende dal packaging | Commento non usato come evidenza della base dati |
| A-09 | E-01/E-05: fallback globale ma controller solo POST; retry POST e assenza idempotenza | Nessuna promessa di recupero GET o creazione unica |
| A-10 | E-09/README: opzione Azure descritta, starter Azure commentato nel POM | Condizionata da modifica dipendenza, non sola configurazione ambientale |

Non si modifica il comportamento né si correggono documenti di altre aree in questo ticket.

## Domande aperte ordinate per impatto

1. **Accesso e responsabilità:** quali attori devono leggere/modificare quali dati? Esiste un perimetro esterno e servono confini per organizzazione? Il repository non definisce questi requisiti.
2. **Scritture tramite assistente:** quali operazioni possono partire senza conferma? Come riconoscere un effetto già eseguito quando la risposta fallisce? Isolamento delle conversazioni e conservazione del contenuto richiedono una decisione verificabile.
3. **Visite mancanti:** un dettaglio parziale deve avvisare l'operatore o bloccare il flusso? Oggi non distingue errore da assenza di visite.
4. **Integrità e recupero:** quale profilo/database rappresenta l'ambiente di riferimento? Come correggere una visita errata e gestire duplicati o aggiornamenti simultanei?
5. **Dati obbligatori:** qual è il formato telefonico approvato? Nome/data animale e descrizione visita devono essere obbligatori anche via API? Date future/passate sono ammesse?
6. **Catalogo veterinari:** chi lo aggiorna e con quale frequenza deve aggiornarsi la ricerca chat? Quale livello di completezza è richiesto?
7. **Ambito clinico:** le visite sono solo annotazioni o è previsto un vero processo di appuntamento? Non risulta un requisito implementato di pianificazione.

Sono domande non bloccanti per questa fotografia. Possibili miglioramenti (autorizzazione esplicita, conferma tool, segnalazione parzialità, idempotenza e uniformità dei vincoli) sono proposte separate; nessuno è requisito approvato o parte delle modifiche consegnate.

## Verifiche effettivamente svolte

La modifica è solo documentale. Il guard esistente copre agent-readiness e **non** `docs/functional`; per questo sono controllati separatamente tutti i collegamenti dei nuovi documenti. I risultati finali e le limitazioni sono registrati qui prima del commit.

- Baseline `python3 scripts/check-agent-docs.py`: exit 0, 13 Markdown e 8 moduli.
- Analisi incrociata di schede, regole, diagrammi, scenari e simboli delle fonti: eseguita sul commit indicato.
- `python3 scripts/check-agent-docs.py` finale: exit 0; baseline preservata.
- `PYTHONDONTWRITEBYTECODE=1 python3 /opt/project/logs/COG-298/check-docs.py`: exit 0; 7 Markdown, 127 collegamenti verificati, 6 blocchi Mermaid estratti, intervalli degli ID coerenti. Controllo aggiuntivo locale basato sul parser di link del guard esistente.
- `node /opt/project/logs/COG-298/mermaid-qa/check.mjs`: exit 0; parser Mermaid 11.12.0 con DOM simulato, tutti i 6 diagrammi validi. **Rendering grafico non eseguito**: CLI Mermaid e browser Chromium/Chrome non disponibili; il controllo sintattico non certifica la resa visiva.
- `git diff --check` e `git diff --cached --check`: exit 0; revisione dei soli nuovi documenti e dei riferimenti, nessuna modifica applicativa.
- `java -version`: exit 127 (`java: command not found`). Suite Maven non eseguita; non necessaria per attestare la modifica di soli Markdown, ma nessun nuovo esito applicativo viene dichiarato.
- Nessun test browser, persistenza, concorrenza, provider, packaging JAR o ambiente esterno eseguito. Gli scenari S-01–S-24 restano specifiche di verifica.

## Handoff

Obiettivo: documentazione funzionale italiana dello stato attuale. File consegnati: README, perimetro, funzionalita, processi-dati, regole-integrazioni, verifica e attendibilita, tutti sotto `docs/functional/`. Copertura: nove funzioni, dodici regole, sei diagrammi e ventiquattro scenari. Nessuna modifica applicativa; AGENTS.md preesistente modificato dal runtime è escluso dalla consegna.

La consegna GitHub e lo stato corrente sono mantenuti nel singolo `## Codex Workpad` di [COG-298](https://linear.app/cognita-reply/issue/COG-298/genera-la-documentazione-funzionale-dellapplicazione). Passo successivo del workflow: Human Review della PR, senza dichiarare merge o Done. I limiti principali sono ruoli non codificati, comportamento della chat e verifiche runtime non eseguite.
