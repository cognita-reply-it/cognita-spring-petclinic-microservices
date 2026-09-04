# Funzionalità, attori ed esperienza utente

[Indice](README.md) · [Regole](regole.md) · [Fonti e scenari](verifica-evidenze.md)

## Attori e autorizzazioni

L'**operatore della clinica** è una deduzione dal tipo di operazioni, non un ruolo configurato. **Chiamante API** indica un sistema in grado di raggiungere gli endpoint. **Operatore tecnico** indica chi gestisce servizi e configurazioni. Proprietari e veterinari sono entità, non profili di login verificati.

Non sono stati individuati login, assegnazioni di ruolo, controlli di identità o tenant nelle route e nei controller esaminati, né configurazioni `SecurityFilterChain`, `@PreAuthorize` o `@Secured` nel codice applicativo. Questo non determina quali protezioni esterne siano presenti in un deployment (E02–E12).

| Operazione | Operatore via UI | Chiamante API | Chat tramite tool | Controllo effettivo nel backend |
|---|---|---|---|---|
| Leggere proprietari e animali | Sì | Sì | Elenco proprietari con animali | Nessun filtro per utente individuato |
| Creare proprietario | Sì | Sì | Sì, condizionato ad AI | Validazione dati; nessun ruolo verificato |
| Modificare proprietario | Sì | Sì | Nessun tool | ID esistente e validazione dati |
| Creare animale | Sì, da proprietario | Sì | Sì, condizionato ad AI | Proprietario deve esistere |
| Leggere/modificare animale | Sì, percorso dal proprietario | Sì | Nessun tool di modifica | Lettura per ID animale; modifica per ID nel corpo; proprietario nel percorso non verificato |
| Leggere/creare visite | Sì, da animale | Sì | Nessun tool visite | `petId` del percorso; nessun controllo applicativo di appartenenza |
| Leggere veterinari | Sì | Sì | Ricerca semantica limitata | Elenco completo via Vets; ricerca su indice via chat |
| Eliminare/archiviare dati clinici | Nessuna azione individuata | Nessun endpoint individuato | Nessun tool | Metodi repository generici non equivalgono a un'operazione pubblica |
| Gestire infrastruttura | Fuori UI clinica | Superfici tecniche dipendenti da configurazione | Nessun tool | Permessi operativi non determinabili dal repository |

La navigazione dall'anagrafica corretta facilita l'uso, ma non costituisce una restrizione di accesso. R03 e R04 descrivono i controlli sugli identificativi.

## Mappa delle funzionalità

| ID | Funzionalità | Attori | Stato nel sorgente |
|---|---|---|---|
| F01 | Elenco e filtro proprietari | Operatore, API, chat per elenco | Implementata; filtro nel browser |
| F02 | Creazione e modifica proprietario | Operatore, API; chat solo creazione | Implementata con vincoli divergenti fra canali |
| F03 | Gestione scheda animale e tipi | Operatore, API; chat solo creazione | Implementata con controlli incompleti sul contesto proprietario |
| F04 | Dettaglio proprietario, animali e visite | Operatore, API | Implementata; può restituire dati parziali senza indicatore |
| F05 | Registrazione e consultazione visite | Operatore, API | Implementata; nessun ciclo di prenotazione |
| F06 | Consultazione veterinari | Operatore, API, chat | Implementata; cache e indice chat condizionati |
| F07 | Conversazione e operazioni AI | Operatore | Condizionata a provider, configurazione e servizi; copertura parziale del dominio |
| F08 | Preparazione indice veterinari | Sistema; operatore tecnico per recupero | Implementata all'avvio, condizionata a risorsa o servizi AI |

## F01 — Elenco e filtro proprietari

**Obiettivo e avvio.** L'operatore seleziona “Find owners” (`#!/owners`); il chiamante API richiede `GET /api/customer/owners`. Non sono richiesti dati obbligatori. La precondizione è che Customers sia disponibile.

**Percorso.** `OwnerListController` legge tutti i proprietari, inclusi gli animali; `OwnerResource.findAll` invoca il repository. La UI mostra nome collegato al dettaglio, indirizzo, città, telefono e nomi degli animali. Il testo “Search Filter” filtra localmente la struttura ricevuta: non è una ricerca remota per solo cognome, non ha paginazione e non modifica dati. Svuotare il filtro ripristina l'elenco (R08).

**Alternative ed esito.** Nessun risultato produce una tabella senza righe; il template non distingue esplicitamente filtro senza corrispondenze, caricamento ed elenco vuoto. Un errore passa all'intercettore comune, con i limiti sotto descritti. L'elenco chat usa lo stesso servizio dati, non il filtro UI. Evidenze E02, E06, E09; scenari S01–S02.

## F02 — Creazione e modifica proprietario

**Obiettivo, precondizioni e input.** “Register owner” apre `#!/owners/new`; “Edit Owner” carica un proprietario esistente in `#!/owners/:ownerId/edit`. Nome, cognome, indirizzo, città e telefono sono richiesti. R01 distingue i vincoli UI e API; nessun controllo di unicità anagrafica è implementato nel percorso.

**Percorso.** Il form vuoto invia POST a Customers, che mappa solo i cinque campi della richiesta su una nuova entità e restituisce 201 con il proprietario salvato. La UI torna all'elenco. In modifica il controller carica i dati, invia PUT all'ID e, dopo risposta, torna al dettaglio; il backend aggiorna i cinque campi, preserva le associazioni agli animali e risponde 204.

**Alternative.** Una modifica a ID assente genera `ResourceNotFoundException` (404). La lettura diretta restituisce un `Optional`, senza la stessa eccezione esplicita: non assumere un 404 uniforme in lettura. Input non validi sono sottoposti a `@Valid`; errori di persistenza non sono trasformati in messaggi business dedicati. Correzione possibile nel form, senza salvataggio bozza o ripresa persistente; lasciare la pagina perde le modifiche non inviate. Non c'è annullamento post-salvataggio: è possibile una nuova modifica, senza storico versioni esposto.

**Limiti.** Le etichette “First name is required.” e simili sono presenti, ma fanno riferimento a `ownerForm` senza che il form abbia quel nome; non se ne garantisce la visualizzazione. La chat può creare proprietari senza un passaggio applicativo obbligatorio di approvazione. Evidenze E02, E06, E09; R01, R06, R07; S03–S06.

## F03 — Scheda animale e catalogo tipi

**Obiettivo e avvio.** Dal dettaglio proprietario si sceglie “Add New Pet”, “Edit Pet” o il nome animale. La creazione richiede un proprietario esistente. La UI carica prima `GET /api/customer/petTypes`, poi proprietario o animale. In creazione preseleziona l'ID tipo `1`, non il primo tipo ricevuto.

**Input.** Nome e nascita sono obbligatori nel form; tipo da catalogo. Il corpo contiene `id`, `name`, `birthDate`, `typeId`; la richiesta backend dichiara data `yyyy-MM-dd`. In UI la nascita viene convertita in oggetto Date e inviata tramite serializzazione JSON: il comportamento completo data/fuso va provato nel browser (S09). Non sono individuati limiti “nascita non futura”. R02 specifica i vincoli realmente applicati.

**Percorso.** POST verifica il proprietario, crea un animale e imposta l'associazione; salva nome, data e tipo trovato; risponde 201. PUT cerca l'animale usando **l'ID nel corpo**, aggiorna i dati e risponde 204. La UI torna al dettaglio del proprietario. La lettura restituisce nome completo proprietario, animale e tipo.

**Alternative ed effetti.** Proprietario inesistente in creazione o animale inesistente in lettura/modifica: 404. Un tipo sconosciuto non produce un rifiuto business esplicito: in modifica resta il precedente; in creazione può risultare nullo e causare errore nel logging/persistenza. Non attribuire un codice HTTP specifico senza prova. Il segmento proprietario delle route di lettura/modifica è wildcard; non valida l'appartenenza (R03).

**Esperienza e limiti.** Catalogo vuoto o non disponibile non ha messaggio dedicato; mancano spinner, bozza persistente e pulsante annulla. I messaggi di campo referenziano `petForm` non nominato e quello nascita controlla il campo nome. Non sono esposte eliminazione, trasferimento proprietario o storico modifiche. Evidenze E03, E06; S07–S11.

## F04 — Dettaglio aggregato

**Obiettivo e precondizioni.** Aprire `#!/owners/details/:ownerId` per vedere recapiti, animali, date e descrizioni delle visite. La UI chiama `GET /api/gateway/owners/{ownerId}`.

**Percorso.** Il gateway ottiene proprietario e animali da Customers; poi chiede a Visits le visite dei relativi ID con una chiamata aggregata. Le associa agli animali per `petId` e risponde. Non viene salvata una copia del dettaglio. Gli animali sono ordinati per nome dal modello Customers; non è imposto un ordine cronologico delle visite nel repository esaminato.

**Alternative.** Un errore di Visits attiva una lista vuota e mantiene proprietario/animali con risposta 200 (R05, test dedicato). La UI non mostra un avviso di dati incompleti: “nessuna visita visibile” non prova che non esistano visite. Customers è a monte del fallback; un suo errore non viene convertito nello stesso modo. Anche un proprietario senza animali causa la chiamata Visits con lista vuota di ID, senza ramo dedicato.

**Azioni successive.** Modifica proprietario, nuovo animale, modifica animale, aggiunta visita. Ricaricare può recuperare visite dopo ripristino servizio; non c'è pulsante di ripresa specifico. Evidenze E06–E08, E15; S12–S15; processo P02.

## F05 — Visite

**Obiettivo e input.** “Add Visit” apre `#!/owners/:ownerId/pets/:petId/visits`, carica precedenti visite e propone la data corrente. La UI richiede descrizione, non la data. Il backend riceve l'entità Visit con `@Valid`: descrizione massimo 8192 caratteri, nessun `@NotBlank`; data inizializzata all'istante corrente se il campo non viene sovrascritto, incluso da un null esplicito (R04).

**Percorso.** POST su `/api/visit/owners/{ownerId}/pets/{petId}/visits`: il servizio imposta `petId` dal percorso, salva, risponde 201. La UI torna al dettaglio. GET sullo stesso percorso restituisce la lista; `GET /pets/visits?petId=...` nel servizio è usato per più animali e restituisce `{items: [...]}`.

**Alternative e autorizzazioni.** Il proprietario nel percorso non è usato; Visits non interroga Customers per verificare l'animale. La possibilità di salvare un ID animale inesistente dipende dai vincoli DB (E13). Il corpo accetta anche un ID visita: non viene azzerato prima di `save`, quindi non è garantito che ogni POST produca un nuovo record (R04). Dati troppo lunghi sono rifiutati dalla validazione. Mancano regole su appuntamenti sovrapposti, disponibilità, visita futura o veterinario assegnato.

**Esito e recupero.** Non sono esposte modifica/cancellazione visita, annullamento o approvazione. La tabella “Previous Visits” è vuota senza messaggio dedicato se non riceve righe. Nessun blocco dell'invio durante attesa, nessuna conferma di successo separata dalla navigazione. Evidenze E04, E06, E13, E16; S16–S20.

## F06 — Veterinari

**Obiettivo e percorso.** L'operatore apre `#!/vets`; `VetListController` chiama `GET /api/vet/vets`. `VetResource.showResourcesVetList` restituisce l'intero elenco dal repository. La UI mostra nome e specializzazioni; senza specializzazioni la cella è vuota. Non ci sono parametri obbligatori, filtri UI o scritture.

**Regole e alternative.** Le specializzazioni sono ordinate per nome. La cache `vets` è annotata sul metodo e abilitata dalla configurazione nel profilo `production`; valori effettivi e scadenze non sono dimostrati dai soli campi delle proprietà. UI vuota/errore seguono il comportamento comune. La chat usa invece ricerca semantica, massimo 20 risultati o 50 con richiesta nulla; non equivale a elenco esaustivo o filtro esatto per specializzazione (R09).

**Limiti.** Nessuna associazione automatica veterinario–visita. Manutenzione del catalogo esterna ai flussi esposti. Evidenze E05, E06, E10; S21–S22.

## F07 — Chat e strumenti applicativi

**Obiettivo e avvio.** Dal riquadro “Chat with Us!” l'utente invia testo con Send o Invio. Spazi soli sono ignorati dal browser. Il testo compare subito, il campo viene svuotato, quindi parte POST `/api/genai/chatclient` con stringa JSON. Non è una risposta in streaming: il browser attende il testo completo.

**Percorso.** Il servizio invia il prompt al modello con memoria, istruzioni e quattro tool: elencare proprietari, creare proprietario, cercare veterinari, aggiungere animale. Se il modello richiede un tool, l'applicazione lo esegue; i risultati contribuiscono alla risposta. Le scritture raggiungono Customers e i suoi vincoli. Nessuna conferma strutturata obbligatoria precede la scrittura; eventuali domande del modello non costituiscono un controllo applicativo (R07).

**Alternative.** Eccezioni nella chat restituiscono testo di indisponibilità, senza impostare uno status d'errore. Il fallback POST gateway restituisce 503 con testo simile. Il browser legge il testo senza controllare `response.ok`; un errore di trasporto produce “Chat is currently unavailable”. Nessun retry UI, blocco invii paralleli, timeout browser esplicito, annullamento o indicatore “sta scrivendo”. Non si può dedurre dal messaggio di errore che una precedente scrittura non sia avvenuta.

**Memoria ed effetti.** Messaggi renderizzati da Markdown; HTML della conversazione salvato in `localStorage` quando si lascia la pagina e ricaricato all'apertura. Questo è storico visuale locale, distinto dalla memoria lato server. Nessun ID conversazione o utente è passato esplicitamente dal controller; isolamento e durata non sono stabiliti dal codice locale. `.order(10)` ordina l'advisor: non configura dieci messaggi di memoria, malgrado il commento (R10).

**Limiti di copertura.** Non ci sono tool per leggere/creare visite, modificare/eliminare proprietari o animali. La menzione delle visite nel prompt non dimostra accesso ai loro dati. OpenAI è la dipendenza attiva; Azure è un'alternativa commentata nel POM. Nessuna disponibilità reale del provider è stata verificata. Evidenze E09–E12; S23–S27; P03.

## F08 — Preparazione dell'indice veterinari

**Precondizioni e avvio.** Il sistema riceve `ApplicationStartedEvent`. Non c'è comando UI. È necessario un `SimpleVectorStore` e la configurazione del modello embedding.

**Percorso e alternative.** Se `vectorstore.json` esiste nel classpath (presente nel repository), lo carica tramite `getFile()` e termina. Altrimenti legge tutti i veterinari via discovery, attende la risposta, converte in documenti, aggiunge all'indice e salva su file temporaneo. Non è pianificata una sincronizzazione periodica; il file temporaneo non viene automaticamente installato nel classpath per il prossimo avvio (R11).

**Errori e recupero.** Errori di lettura, disponibilità Vets o embedding non hanno retry/compensazione applicativa in questo listener; gli effetti sull'avvio richiedono prova runtime. `getFile()` rende necessario verificare il caricamento della risorsa anche da JAR. Un operatore deve ripristinare risorse/configurazione e riavviare; non è un processo riprendibile con stato persistente. La UI chat non mostra progresso dell'indicizzazione. Evidenze E11; S28–S30; D04.

## Comportamenti UI comuni

Le schermate sono in inglese. Home è una pagina di benvenuto con navigazione; non è una dashboard clinica. Non sono implementate differenze di schermata per ruolo o stato clinico. Non sono presenti indicatori applicativi di caricamento, messaggi dedicati “nessun dato”, bozze persistenti o disabilitazione sistematica dei pulsanti durante gli invii.

`HttpErrorHandlingInterceptor.responseError` tenta un alert usando `error.error` e `error.errors.map`. Corpi senza `errors` possono impedire la gestione; inoltre restituisce la risposta senza rigettare esplicitamente la promise. La navigazione nei callback di successo non va quindi usata da sola come prova del salvataggio: verificarlo tramite rilettura (R12, S31). La chat usa `fetch` e non questo intercettore. Questi sono limiti ricavati dal sorgente, non risultati di test browser eseguiti.
