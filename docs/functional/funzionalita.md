# Schede funzionali ed esperienza utente

[Torna all'indice](README.md). Regole dettagliate in [regole-integrazioni](regole-integrazioni.md); fonti nel [registro E-xx](verifica.md). Le precondizioni comuni sono gateway e servizi pertinenti raggiungibili, discovery/configurazione coerenti e database disponibile. Nessuna scheda implica autorizzazioni di ruolo non presenti nel sorgente.

## F-01 — Consultare e filtrare proprietari

**Obiettivo/attori:** l'operatore trova un proprietario; API e assistente possono leggere la lista. Avvio da «Find owners», route `#!/owners`, senza input obbligatori. Il controller richiede `GET /api/customer/owners`; Customers restituisce tutti i proprietari con animali. Il campo «Search Filter» applica il filtro Angular alla collezione già ricevuta, non avvia una ricerca server per cognome. E-02, E-03; R-01.

La tabella mostra nome cliccabile, indirizzo, città, telefono e nomi degli animali. L'apertura del nome avvia F-04. Il filtro può essere corretto o svuotato senza effetti sui dati. Non sono presenti paginazione, conteggio risultati o messaggio dedicato «nessun risultato»; una lista vuota lascia le intestazioni. Non c'è uno stato di caricamento dedicato. Gli errori usano l'interceptor comune, con i limiti descritti sotto. Non si applica una separazione per proprietario autenticato.

## F-02 — Registrare o modificare proprietario

**Obiettivo/attori:** UI e API mantengono l'anagrafica; la chat può crearla. Da «Register owner» (`#!/owners/new`) si apre un modulo vuoto; da «Edit Owner» (`#!/owners/:ownerId/edit`) si carica il record esistente.

| Input | Interfaccia | Backend |
|---|---|---|
| Nome, cognome, indirizzo, città | Obbligatori | `@NotBlank` tramite `@Valid OwnerRequest` |
| Telefono | Obbligatorio; pattern esattamente 12 cifre, massimo 12 caratteri | Non vuoto; `@Digits(integer=12,fraction=0)`, senza vincolo di esattamente 12 cifre |
| ID | Ricavato dal record | Identificativo del percorso in modifica; nuovo ID in creazione |

Invio: il controller sceglie POST se manca l'ID, PUT altrimenti. Il backend mappa i cinque campi e salva. POST restituisce 201 con il proprietario e la UI torna all'elenco; PUT restituisce 204 e la UI torna al dettaglio. La modifica di un ID inesistente solleva `ResourceNotFoundException` (404). La GET singola restituisce un `Optional`: il codice non definisce la stessa eccezione 404 per l'assenza; il comportamento della schermata con record assente richiede prova runtime. E-03; R-02.

Il modulo contiene testi «First name is required», «Last name is required», «Address is required», «City is required», «Telephone is required», ma non dichiara `name="ownerForm"` sul form cui fanno riferimento gli `ng-show`: la visualizzazione dei messaggi non è dimostrata. La validazione HTML `required` resta dichiarata. Nessuna conferma separata, salvataggio bozza o annullamento dedicato: si può correggere prima dell'invio o uscire dalla schermata perdendo i valori non salvati. Non si controllano omonimie o duplicati; una correzione successiva sovrascrive i dati senza storico applicativo. La chat descrive un telefono di 10 cifre: è un'ulteriore divergenza, non la regola backend.

## F-03 — Gestire un animale e scegliere il tipo

**Obiettivo/attori:** operatore/API registrano o correggono l'animale; assistente può aggiungerlo. Serve un proprietario esistente per la creazione. Avvio «Add New Pet», `#!/owners/:ownerId/new-pet`, o «Edit Pet»/nome animale, `#!/owners/:ownerId/pets/:petId`.

Prima si caricano i tipi con `GET /api/customer/petTypes`, ordinati per nome nel repository. In creazione si legge il proprietario e si preseleziona l'ID tipo `1` (valore fisso della UI, non «primo tipo disponibile»). In modifica si legge l'animale e si valorizzano campi e tipo.

Input: nome e data di nascita obbligatori nella UI; tipo da elenco; nome del proprietario solo informativo. `PetRequest` dichiara data `yyyy-MM-dd` e `@Size(min=1)` sul nome, ma il controller **non applica `@Valid`** e non dichiara `@NotNull`: questi metadati non dimostrano validazione della richiesta. Non risultano divieto di date future, unicità del nome o cambio di proprietario nel modulo. E-04; R-03, R-04.

POST `/api/customer/owners/{ownerId}/pets`: ricerca proprietario (404 se assente), crea animale, imposta relazione, nome/data/tipo e salva; esito 201. PUT `/api/customer/owners/{segmento}/pets/{petId}`: usa **l'ID nel corpo** per scegliere l'animale, aggiorna e restituisce 204. Entrambi ritornano alla scheda proprietario in caso di successo. GET e PUT non verificano il segmento proprietario; un animale inesistente dà 404.

Tipo inesistente: `ifPresent` non assegna un tipo nuovo; in modifica resta il precedente, in creazione resta nullo e i vincoli SQL richiedono un tipo. Non c'è un errore funzionale esplicito «tipo non valido»; anche `Pet.toString()` dereferenzia il tipo, per cui il punto preciso del fallimento va verificato. La UI serializza un oggetto Date mentre il DTO dichiara il formato data: interoperabilità e fusi orari richiedono un test browser.

Il template contiene messaggi obbligatori collegati a `petForm` non nominato; il messaggio nascita controlla il campo nome. Non ci sono bozza, annullamento dedicato o protezione dall'invio multiplo. Correzione tramite riapertura del modulo; nessun undo o storico.

## F-04 — Consultare la scheda completa del proprietario

**Obiettivo/attori:** UI/API leggono anagrafica, animali e visite insieme. Avvio dal nome nell'elenco, `#!/owners/details/:ownerId`; il browser usa `GET /api/gateway/owners/{ownerId}`.

Il gateway legge Customers, estrae gli ID animali e richiede Visits in batch. Associa le visite per `petId`; rende anagrafica, animali con tipo/data e relative visite. Le azioni aprono F-02, F-03 e F-05. Gli animali sono ordinati per nome dal modello Owner; non è dichiarato un ordinamento delle visite. E-05; R-05; D-03.

Se Visits fallisce, il circuit breaker dell'aggregazione restituisce visite vuote e preserva proprietario/animali. Il test esistente si aspetta HTTP 200. La UI non mostra un indicatore di incompletezza: «nessuna visita visibile» non prova che non vi siano visite. L'errore Customers non dispone dello stesso recupero nel controller. Con nessun animale viene comunque costruita la richiesta batch con lista vuota; l'esito preciso richiede prova runtime. Lettura senza modifiche; ricaricare può recuperare i dati dopo il ripristino del servizio. Nessun banner di successo o caricamento dedicato.

## F-05 — Leggere e registrare visite

**Obiettivo/attori:** operatore/API annotano un evento riferito a un animale. Dal dettaglio si seleziona «Add Visit», `#!/owners/:ownerId/pets/:petId/visits`. La UI carica `GET /api/visit/owners/{segmento}/pets/{petId}/visits` e mostra «Previous Visits» con date e descrizioni.

Input: data inizializzata a oggi dal browser (campo non `required`), descrizione obbligatoria nella UI. Invio POST sul medesimo percorso, data formattata `yyyy-MM-dd`. Backend: `@Valid Visit`, descrizione con massimo 8192 caratteri ma non obbligatoria; data inizializzata con `new Date()` nell'entità se omessa, non garantita se inviata esplicitamente nulla. Il controller imposta `petId` dal percorso e salva; 201 con visita, quindi ritorno UI al dettaglio. E-06; R-06, R-07.

Il controller non verifica proprietario o animale presso Customers. Per l'integrità conta anche il database: lo schema HSQLDB non ha la FK verso pets, quello MySQL la dichiara. Il client API riceve direttamente il modello Visit, incluso l'ID: non viene azzerato in `create`, quindi un ID fornito dal chiamante non ha una semantica di «sempre nuovo» garantita. Non documentare tale percorso come modifica ufficiale.

Non si verificano disponibilità del veterinario, sovrapposizioni, passato/futuro o stato clinico. Non sono esposti modifica/cancellazione visita, conferma o annullamento dell'appuntamento. Correzione del form prima dell'invio possibile; dopo il salvataggio non esiste recupero utente dedicato. Errori di validazione/persistenza dipendono dal backend e dall'interceptor; doppio invio può creare doppioni. Lista vuota senza messaggio specifico, nessun caricamento dedicato.

## F-06 — Consultare veterinari e specialità

**Obiettivo/attori:** UI/API consultano il catalogo tramite «Veterinarians», `#!/vets`. Nessun input richiesto. `GET /api/vet/vets` restituisce `findAll()`, la UI mostra nome e specialità; queste sono ordinate per nome dal modello. Senza specialità la cella resta vuota. Non sono presenti filtro UI, paginazione, selezione medico per visita o manutenzione del catalogo. E-07; R-08.

Il controller è annotato `@Cacheable("vets")`; l'abilitazione cache dipende dal profilo `production`. Freschezza e durata reali dipendono dalla configurazione, non dal nome del profilo. Errori via interceptor, nessun messaggio specifico per lista vuota o caricamento. La ricerca chat F-07 non coincide con questo elenco autorevole.

## F-07 — Conversare e operare tramite assistente

**Obiettivo/attori:** l'utente scrive domande o richieste operative nella chat disponibile sulla pagina. Servono GenAI avviato, provider funzionante e servizi dati necessari. «Send» o Invio ignorano testo composto solo da spazi; altrimenti svuotano il campo e aggiungono subito il messaggio alla conversazione.

Il browser invia una stringa JSON a `POST /api/genai/chatclient`. GenAI aggiunge il testo al prompt, usa memoria e strumenti e attende `.call().content()`; restituisce una risposta completa, non uno stream. Il modello può richiedere: elenco proprietari/animali, creazione proprietario, aggiunta animale a proprietario, ricerca veterinari. I primi tre leggono/scrivono Customers; l'ultimo usa similarità sull'indice. Gli input di scrittura sono quelli delle relative API; il testo del tool non sostituisce i controlli backend. E-08, E-09; R-09, R-10; D-04.

Non c'è un passaggio di approvazione applicativo prima delle scritture. Una risposta non garantisce l'esecuzione desiderata; una scrittura riuscita può precedere un errore nella risposta finale. Rileggere le anagrafiche è necessario per accertare l'effetto; ripetere il messaggio può duplicarlo. Nessun refresh automatico delle tabelle dopo il tool. Il prompt menziona visite, ma non è registrato un tool per leggerle o crearle: presenza di `VisitDetails` nei DTO non dimostra quel flusso.

Eccezioni GenAI: restituzione della frase «Chat is currently unavailable. Please try again later.» senza status di errore esplicito nel metodo. Fallback gateway POST: 503 con analoga frase. Il browser usa `response.text()` senza controllare `response.ok`, quindi mostra anche risposte HTTP d'errore come messaggi; errori di rete generano «Chat is currently unavailable». Nessun indicatore di attesa, blocco invio o annullamento. Invii simultanei possono mostrare risposte nell'ordine di completamento.

Markdown viene convertito in HTML e inserito con `innerHTML`, senza sanificazione esplicita in questo codice. I messaggi visibili vengono salvati in `localStorage` all'uscita e ripristinati all'apertura; minimizzare non li elimina. Non è una prova di memoria conversazionale lato server né di isolamento fra utenti: l'endpoint non passa un identificativo conversazione per utente. Nessuna scadenza o funzione «svuota chat» rilevata.

## F-08 — Preparare la ricerca dei veterinari

**Obiettivo/attore:** all'evento di avvio GenAI, preparare i contenuti su cui cerca F-07. Nessun intervento UI. Se esiste `vectorstore.json` nel classpath, carica l'indice precalcolato e termina; altrimenti legge Vets, converte i veterinari in documenti, li aggiunge al vector store e salva un file temporaneo. E-10; R-11; D-05.

L'alternativa può effettuare embedding a pagamento; non è un processo periodico, né una sincronizzazione dopo modifiche. Non c'è stato/progresso visibile al business. Errori di file/servizio/provider possono impedire il completamento; non è definita una procedura automatica di ripresa. La conversione JSON cattura errori e può restituire null. `getFile()` sul classpath necessita verifica nel JAR eseguibile. L'indice incluso non prova che gli attuali veterinari siano tutti presenti.

## F-09 — Supporto operativo

**Obiettivo/attori:** sistema e operatore tecnico ottengono configurazione, individuano servizi e osservano lo stato tecnico. Config Server legge configurazione da Git oppure backend nativo; Discovery registra/risolve servizi; Admin e strumenti Compose offrono superfici di diagnosi. Input: profili, indirizzi e impostazioni dell'ambiente. Avvio dei servizi e richieste operative sono i trigger. E-11, E-12; R-12.

Output attesi: proprietà applicate, istanze individuabili, metriche/tracce consultabili dove abilitate. Mancanza di configurazione o discovery può rendere impossibili i flussi clinici; GenAI seleziona la prima istanza Customers e non gestisce esplicitamente una lista vuota. Log/metriche aiutano la diagnosi ma non costituiscono uno storico delle modifiche di business. Ripristino e disponibilità dipendono dall'ambiente; non esistono SLA o procedura di recupero dati dimostrati da questi componenti.

## Gestione degli errori comune alle schermate AngularJS

L'interceptor si aspetta `response.data.error` e un array `errors` di coppie campo/messaggio, poi apre un alert. Non gestisce esplicitamente corpi senza `errors`; inoltre restituisce `response` invece di mantenere una promessa rifiutata. Ne consegue un rischio, da verificare nel browser, di errore JS o prosecuzione dei callback di successo dopo una risposta fallita. Non è corretto promettere che ogni errore lasci il form in uno stato recuperabile. E-02. Le differenze di visibilità responsive non sono autorizzazioni; non sono state verificate visivamente.
