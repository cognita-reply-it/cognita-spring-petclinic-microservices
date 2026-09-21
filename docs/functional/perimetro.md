# Perimetro, attori e mappa

[Torna all'indice](README.md). Fonti: E-01–E-12 nel [registro](verifica.md).

## Scopo e confini

Petclinic è una dimostrazione distribuita della gestione di una clinica veterinaria. Il nucleo funzionale riguarda anagrafiche di proprietari e animali, registrazioni di visite e consultazione del catalogo veterinari. La visita contiene data e descrizione: non è un appuntamento con disponibilità, durata, assegnazione a un medico o stato clinico.

Il gateway ospita l'interfaccia AngularJS e inoltra le richieste ai servizi Customers, Visits, Vets e GenAI. Config Server, Discovery Server e Admin Server completano gli otto moduli del reactor Maven. Customers gestisce proprietari, animali e tipi; Visits le visite; Vets veterinari e specialità; GenAI la conversazione e gli strumenti collegati alle API. E-01, E-02, E-09–E-11.

Dipendenze esterne: repository di configurazione o percorso locale configurato, provider del modello linguistico e degli embedding, database secondo il profilo, strumenti di osservabilità. Sono separati dal codice dell'applicazione. Non sono stati verificati configurazioni remote effettive, deployment, dati reali, disponibilità o protezioni di rete.

Non sono emersi nei flussi esaminati fatturazione, prescrizioni, prenotazione di slot, pagamenti, notifiche a proprietari, approvazioni cliniche, import/export utente o gestione di più organizzazioni. Si tratta di limiti dell'evidenza del repository, non di dichiarazioni su sistemi esterni. Non si deduce una roadmap da pulsanti, commenti o dipendenze.

## Attori e autorizzazioni

**Operatore dell'interfaccia** è un attore funzionale: consulta e registra dati. La qualifica organizzativa (segreteria, veterinario, amministratore) non è codificata. **Chiamante API** può eseguire le operazioni esposte senza passare per i moduli. **Assistente GenAI** agisce per conto di chi scrive nella chat attraverso quattro strumenti. **Operatore tecnico** consulta gli strumenti di supporto. Proprietario e veterinario sono entità di dominio; non risultano account applicativi corrispondenti.

| Operazione | Operatore UI | Chiamante API | Assistente GenAI | Controllo effettivo nel sorgente |
|---|---|---|---|---|
| Elencare proprietari e animali | Sì | Sì | Sì | Nessun filtro per utente/organizzazione nelle risorse |
| Creare proprietario | Sì | Sì | Sì | Validazione dei dati Customers, non ruolo |
| Modificare proprietario | Sì | Sì | Nessuno strumento registrato | Identificativo e validazione dati |
| Creare animale | Sì | Sì | Sì | Esistenza del proprietario |
| Leggere/modificare animale | Sì | Sì | Lettura nella lista proprietari; nessuno strumento di modifica | Lettura per petId; modifica per ID nel corpo; segmento proprietario non verificato |
| Leggere/creare visita | Sì | Sì | Nessuno strumento visite registrato | petId del percorso; nessuna verifica Customers nel controller |
| Consultare veterinari | Sì | Sì | Ricerca per similarità | Nessun filtro di autorizzazione; risultati chat potenzialmente parziali |
| Eliminare/archiviare entità | Nessuna azione rilevata | Nessun endpoint dedicato rilevato | Nessuno strumento | Non è un permesso negato a un ruolo: operazione non esposta |
| Diagnosi tecnica | Fuori UI clinica | Superfici operative secondo configurazione | Nessuno strumento | Accessibilità e protezioni ambientali non determinate |

La navigazione non cambia per ruolo. Non risultano login, policy di ruolo o verifica dell'identità nelle risorse analizzate; ciò non dimostra l'assenza di un controllo esterno. Il nome `ownerId` non identifica l'utente autenticato. Il wildcard `*` nelle route animali/visite accetta un segmento senza usarlo come verifica di appartenenza. E-02–E-09.

## Mappa e stato

| ID | Area e descrizione | Attori | Stato nel repository |
|---|---|---|---|
| F-01 | Elenco e filtro proprietari | UI, API, assistente | Implementata; filtro UI locale, nessuna paginazione esposta |
| F-02 | Creazione e modifica proprietario | UI, API; assistente solo creazione | Implementata; vincoli telefono divergenti |
| F-03 | Creazione, lettura e modifica animale; tipi disponibili | UI, API; assistente solo creazione/lista | Implementata; validazione e appartenenza incomplete |
| F-04 | Scheda aggregata proprietario, animali e visite | UI, API | Implementata con risultato parziale silenzioso su errore Visits |
| F-05 | Consultazione e registrazione visite | UI, API | Implementata; non è un workflow di appuntamenti |
| F-06 | Elenco veterinari e specialità | UI, API | Implementata; cache condizionata dal profilo |
| F-07 | Chat e azioni in linguaggio naturale | UI, API, assistente | Condizionata da provider/configurazione; capacità visite solo annunciata nel prompt |
| F-08 | Preparazione dell'indice veterinari per la chat | Sistema all'avvio | Condizionata; file precalcolato incluso, alternativa di indicizzazione |
| F-09 | Configurazione, discovery e osservabilità | Sistema, operatore tecnico | Integrazioni presenti; attività effettiva dipendente dall'ambiente |

I mock sono nei test, non sostituiscono i servizi nei flussi applicativi descritti. L'indice vettoriale incluso è un'istantanea precalcolata, non una lettura live del catalogo. Lo starter Azure è commentato nel POM: non è un'alternativa attivabile con la sola chiave. Non sono state individuate funzioni di business disabilitate da feature flag espliciti. E-09–E-12.

## Inventario di copertura

| Area | Esame effettuato | Limite |
|---|---|---|
| Gateway | Route, controller aggregato, client, tutti i controller/template/route UI, chat, interceptor; test pertinenti | Nessuna esecuzione browser o servizi |
| Customers | API, richieste, mapper, entità, repository, schemi HSQLDB/MySQL, test | Persistenza e concorrenza non eseguite |
| Visits | Creazione/lettura singola e batch, modello, repository, schemi, test | Nessun test di scrittura presente fra quelli letti |
| Vets | API, entità/specialità, cache, schemi, test | Dati attuali e invalidazione cache non verificati |
| GenAI | Endpoint, prompt, quattro tool, client remoti, DTO, avvio indice, POM/configurazione | Contenuto completo e qualità semantica di vectorstore.json non analizzati; nessuna chiamata provider |
| Config/Discovery/Admin | Configurazioni, responsabilità da entrypoint/POM e Compose; inventario test | Nessuna dashboard live, configurazione esterna o test operativo |
| Supporto | README, istruzioni, agent-readiness, CI/check documentale, Compose | CSS/font/immagini, interni delle librerie, carico/chaos e deployment non analizzati funzionalmente |

## Glossario

- **Proprietario (owner):** persona cui sono associati animali; non un account autenticato.
- **Animale (pet):** soggetto con nome, data di nascita, tipo e proprietario.
- **Tipo:** categoria dell'animale selezionata dal catalogo, per esempio gatto o cane.
- **Visita (visit):** annotazione datata riferita a un animale; non contiene stato di prenotazione.
- **Veterinario (vet), specialità:** voce del catalogo professionisti e relativi ambiti di competenza.
- **API:** interfaccia con cui un programma legge o modifica dati del sistema.
- **Gateway:** punto d'ingresso che serve la UI e instrada/aggrega le richieste.
- **GenAI / LLM:** assistente generativo basato su un modello linguistico esterno.
- **Tool:** funzione che il modello può richiedere all'applicazione di eseguire, anche con scritture.
- **Embedding / indice vettoriale:** rappresentazione usata per cercare contenuti simili; non garantisce completezza o corrispondenza esatta.
- **Fallback:** risultato alternativo in caso di errore; nel dettaglio può essere una lista visite vuota.
- **Idempotenza:** ripetere una richiesta senza ripetere l'effetto; non garantita per le creazioni.
- **Mock:** dipendenza simulata in un test. **QA:** verifica della qualità. **UI:** interfaccia utente.
