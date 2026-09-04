# Documentazione funzionale di Spring Petclinic

Analisi del **4 settembre 2026**, ticket **COG-156**. Sorgente esaminato: commit `f3b392c92580b740f4bafd0364b326e0bd1774f0` di `main`, sincronizzato con `origin/main`. Branch di consegna: `codex/cog-156-documentazione-funzionale`.

## Guida alla lettura

| Documento | Contenuto e destinatari |
|---|---|
| [Funzionalità ed esperienza utente](funzionalita.md) | Catalogo, attori, autorizzazioni, schede operative; business e delivery |
| [Processi e diagrammi](processi.md) | Percorsi completi, risultati parziali, chat, modello dei dati |
| [Dati, integrazioni e comportamenti trasversali](dati-integrazioni.md) | Ciclo di vita, dipendenze e limiti operativi |
| [Regole e decisioni](regole.md) | Regole identificabili e differenze fra canali |
| [Verifica, evidenze e punti aperti](verifica-evidenze.md) | Scenari QA, tracciabilità, fonti, anomalie e domande ordinate per impatto |
| [Registro di validazione](validazione.md) | Controlli realmente eseguiti sulla documentazione e limiti |

I riferimenti **E01–E18** rinviano al registro delle fonti in [verifica-evidenze.md](verifica-evidenze.md). Le sigle **F**, **R**, **D**, **P** e **S** identificano rispettivamente funzionalità, regole, diagrammi, processi e scenari. Gli identificativi vanno mantenuti nelle revisioni successive.

## Scopo e perimetro

Il repository realizza un'applicazione dimostrativa per una clinica veterinaria: registra proprietari e animali, conserva visite con data e descrizione, consulta veterinari e specializzazioni e offre una chat capace di leggere informazioni e inserire proprietari e animali. La finalità dimostrativa è esplicita nel README e nel titolo dell'interfaccia (E01, E06).

L'interfaccia AngularJS è servita dall'API Gateway. Customers gestisce proprietari, animali e tipi; Visits conserva visite; Vets espone veterinari; GenAI collega chat, strumenti applicativi e modello esterno. Config Server, Discovery Server e Admin Server supportano configurazione, individuazione dei servizi e osservabilità. Database e provider AI sono dipendenze; la configurazione effettiva può provenire da un repository esterno (E07, E12).

Non sono stati individuati flussi di fatturazione, pagamenti, prescrizioni, calendario con disponibilità, assegnazione delle visite a veterinari, approvazione clinica o notifiche ai clienti. Non sono quindi descritti come capacità implementate. La presenza di una data visita non prova l'esistenza di una prenotazione. Il proprietario è un'entità di business; non è dimostrato un suo accesso personale al sistema.

## Metodo e attendibilità

Analisi statica dei collegamenti schermata → controller browser → route → servizio → repository/modello, oltre a configurazioni, SQL e test. Il grafo locale è stato consultato con health, search, subgraph e recent changes: risultava allineato al commit, ma troncato a 600 nodi e 1175 relazioni, con arricchimento incompleto. È stato usato come orientamento, non come prova sostitutiva del codice.

**Implementata** significa che il percorso applicativo è presente e collegato nel sorgente; non significa verificata in esercizio. **Condizionata** indica una dipendenza di configurazione o infrastruttura. **Parziale** indica un percorso con limiti espliciti. I mock dei test non sono funzionalità simulate dell'applicazione. Le parti commentate o soltanto menzionate non sono considerate attive.

Non sono stati esaminati dati di produzione, configurazioni remote effettive, credenziali, log operativi o policy esterne. Non si deducono garanzie di disponibilità, sicurezza o prestazioni. Le conclusioni sono limitate a questo commit.

## Inventario della copertura

| Area | Copertura svolta | Limite |
|---|---|---|
| Customers | Tutti i controller, richieste, mapper, entità e repository; UI proprietari/animali; SQL e test animale | Nessun test di scrittura proprietari individuato |
| Visits | Controller, entità, repository, form, aggregazione, SQL e test | Nessun processo clinico oltre alla registrazione |
| Vets | Endpoint, modello, specializzazioni, cache, elenco UI, SQL e test | Nessuna gestione via UI/API di scrittura |
| Gateway/UI | Route, controller aggregatore, client, fallback, tutti i controller/template di business, chat e test pertinenti | Nessuna esecuzione browser end-to-end |
| GenAI | Chat, quattro tool, provider dati, caricamento indice, DTO, configurazione e dipendenze | Nessuna chiamata a provider; contenuto completo dell'indice vettoriale non analizzato |
| Config/Discovery/Admin | Bootstrap, configurazioni locali e ruolo in Compose | Configurazione remota, permessi e deployment non verificati |
| Operatività | Compose, raccolta metriche, workflow CI e istruzioni di avvio | Script chaos, JMeter e dashboard non eseguiti; stile CSS, immagini e librerie terze non auditati |

Nel checkout non erano presenti `AGENTS.md`, `BACKLOG.md`, `DESIGN.md` o `INIT_PROMPT.md`; sono state applicate le istruzioni fornite nel task, `WORKFLOW.md` e `CONTRIBUTING.md`. `docs/` conteneva immagini, non documentazione funzionale testuale da sostituire. Gli estratti grafici in `design-system/` non costituiscono requisiti di business.

## Glossario

| Termine | Significato nel sistema |
|---|---|
| Proprietario / Owner | Persona anagrafica associata a uno o più animali; non equivale a un account |
| Animale / Pet | Scheda con nome, nascita, tipo e proprietario |
| Tipo / Pet type | Categoria dell'animale, selezionata da catalogo |
| Visita / Visit | Registrazione di data e descrizione riferita a un animale |
| Veterinario / Vet | Anagrafica consultabile, con zero o più specializzazioni |
| Gateway | Punto di ingresso che inoltra richieste e compone il dettaglio proprietario |
| API | Interfaccia per scambiare dati e comandi fra sistemi |
| GenAI / LLM | Servizio di AI generativa / modello linguistico che produce risposte e può richiedere tool |
| Tool | Operazione applicativa resa invocabile dal modello attraverso il servizio GenAI |
| RAG / indice vettoriale | Ricerca semantica su documenti indicizzati, usata qui per i veterinari |
| Fallback | Risposta alternativa quando un servizio non è disponibile |
| Circuit breaker | Meccanismo che interrompe chiamate fallite o problematiche e può attivare un fallback |
| Mock | Sostituto controllato di un componente usato nei test |
| Tenant | Organizzazione cliente isolata dalle altre; nessun modello dedicato individuato |
