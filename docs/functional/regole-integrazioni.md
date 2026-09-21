# Regole, integrazioni e comportamenti trasversali

[Torna all'indice](README.md). I valori sotto sono del sorgente esaminato; fonti nel [registro](verifica.md).

## Regole identificabili

| ID | Regola o comportamento attuale | Natura e fonte |
|---|---|---|
| R-01 | L'elenco proprietari è completo lato API; il filtro UI opera sui dati scaricati | Implementazione F-01, E-02/E-03; nessuna garanzia di ordine proprietari |
| R-02 | Cinque campi proprietario non vuoti; telefono numerico con massimo 12 cifre intere, zero decimali. UI richiede esattamente 12; descrizione tool ne chiede 10 | Vincoli fissi e contraddizione F-02, E-03/E-09 |
| R-03 | Creazione animale richiede proprietario esistente; tipo cercato per ID. Se non trovato, nessuna assegnazione | F-03, E-04; nessun errore di dominio esplicito per tipo |
| R-04 | Lettura animale per ID percorso; modifica per ID corpo. Segmento proprietario wildcard non confrontato | F-03, E-04; comportamento attuale, non autorizzazione approvata |
| R-05 | Errore Visits nell'aggregazione produce lista vuota; errore Customers non ha questo fallback | F-04, E-05/E-12 |
| R-06 | Visita associata al petId percorso; descrizione massimo 8192 caratteri, non obbligatoria backend; UI richiede descrizione | F-05, E-06; default data in browser/entità, nessuna scadenza |
| R-07 | Controller visite non verifica appartenenza/esistenza in Customers; integrità SQL differente HSQLDB/MySQL | F-05, E-06; non dedurre isolamento dal percorso |
| R-08 | Elenco Vets via repository; cache abilitata dalla configurazione con profilo production | F-06, E-07; TTL effettivo non determinato |
| R-09 | Solo quattro tool registrati: lista proprietari, crea proprietario, aggiungi animale, cerca veterinari | F-07, E-09; nessun tool visite, update o delete |
| R-10 | Ricerca veterinari per similarità: topK 20 con richiesta non nulla; 50 se richiesta nulla | F-07, E-09; limiti fissi nel metodo, non conteggio totale; oggetto vuoto non equivale a null |
| R-11 | File vettoriale presente: caricamento; assente: acquisizione Vets e indicizzazione all'avvio | F-08, E-10; non sincronizzazione periodica |
| R-12 | Gateway configura un retry POST su SERVICE_UNAVAILABLE; config import opzionale di default e obbligatorio nel profilo docker | F-09 e scritture, E-01/E-11; parametri configurabili, non garanzia sul tempo totale |

## Tabelle decisionali

### Proprietario: ammissibilità del telefono (R-02)

Gli altri quattro campi si assumono validi. Le righe vanno lette per canale: la UI può impedire che il backend riceva la richiesta.

| Condizione | UI dichiarata | Backend dichiarato | Eccezione/limite |
|---|---|---|---|
| Vuoto o soli spazi | Required/pattern non soddisfatti | NotBlank non soddisfatto | Visibilità del messaggio UI non garantita |
| Da 1 a 11 cifre decimali semplici | Pattern non soddisfatto | Compatibile con Digits | Test runtime da eseguire |
| 12 cifre | Compatibile | Compatibile | Non controlla unicità o titolarità |
| Oltre 12 cifre | Maxlength/pattern | Digits non soddisfatto | Inviare direttamente all'API per testare backend |
| Lettere o numero frazionario | Pattern non soddisfatto | Digits non soddisfatto | Nessuna normalizzazione telefonica codificata |

### Animale: selezione e tipo (R-03/R-04)

Priorità operativa: ricerca del record/proprietario, assegnazione campi, ricerca tipo, salvataggio. Il controllo di appartenenza non precede queste operazioni.

| Operazione e condizione | Esito nel codice | Limite |
|---|---|---|
| POST, proprietario assente | 404 | Nessun animale salvato dal percorso normale |
| POST, proprietario e tipo presenti | Nuovo animale associato al proprietario | Persistenza può comunque fallire |
| POST, tipo assente | Tipo nullo, nessuna gestione funzionale dedicata | Violazione schema/errore da verificare |
| PUT, ID corpo assente nel DB | 404 | Il petId URL non viene usato per scegliere il record |
| PUT, ID corpo esistente e diverso da URL | Aggiornato record indicato dal corpo | Anomalia di coerenza, non autorizzazione |
| PUT, tipo assente, animale con tipo precedente | Tipo precedente mantenuto | Nome/data vengono comunque assegnati |

### Dettaglio proprietario (R-05)

| Customers | Visits | Risultato | Priorità/default |
|---|---|---|---|
| Risposta con proprietario | Risposta con visite | Dettaglio aggregato per petId | Percorso normale |
| Risposta con proprietario | Lista vuota | Dettaglio senza visite | Nessun avviso |
| Risposta con proprietario | Errore | Dettaglio con visite vuote | Fallback, indistinguibile in UI dal caso precedente |
| Errore | Non chiamato | Errore di lettura | Customers è necessario prima di Visits |
| Record assente/risposta vuota | Non determinato | Nessun contratto funzionale uniforme verificato | Da provare; non assimilare a lista vuota |

### Chat e indice (R-09–R-11)

| Condizione | Decisione/esito | Eccezione/default |
|---|---|---|
| Messaggio UI vuoto dopo trim | Non invia | API non ha equivalente validazione esplicita nel metodo |
| Domanda veterinari, vetRequest null | Similarità fino a 50 risultati | Non elenco completo garantito |
| Domanda veterinari, vetRequest non null | Similarità fino a 20 risultati | Nessun filtro relazionale esatto codificato |
| Modello richiede tool di creazione | Chiamata Customers | Nessuna conferma applicativa intermedia |
| Eccezione durante exchange | Frase di indisponibilità | Non annulla scritture precedenti |
| Indice classpath presente | Carica e termina il listener | Precede la lettura Vets |
| Indice classpath assente | Legge Vets, indicizza, salva temporaneo | Nessun fallback codificato su errore |

## Integrazioni e automazioni

| Scambio | Finalità, dati e direzione | Avvio ed esito atteso | Fallimenti/limiti |
|---|---|---|---|
| Browser → gateway → Customers/Visits/Vets | JSON anagrafiche, visite e catalogo | Azione utente; lettura o salvataggio | Interceptor fragile; nessuna coda offline |
| Gateway → Customers → poi Visits | Ricomporre dettaglio da anagrafica e petId | Apertura scheda; risposta aggregata | Fallback silenzioso solo su Visits |
| GenAI ↔ provider | Messaggi, contesto e risultati tool; risposta generata | Invio chat; risposta completa | Credenziale/configurazione necessarie; errori convertiti in testo |
| GenAI → Customers | Lettura elenco, creazione proprietario/animale | Tool richiesto dal modello | Prima istanza discovery; nessuna compensazione locale |
| GenAI → Vets/embedding | Preparare indice veterinari | Solo avvio senza file incluso | Costo potenziale, errori non recuperati automaticamente |
| Applicazioni → Config Server → Git o file locale | Proprietà di esecuzione | Import all'avvio; configurazione ricevuta | Revisione esterna non fissata qui; import opzionale non garantisce valori sufficienti |
| Applicazioni ↔ Discovery | Registrazione e indirizzi servizi | Avvio/risoluzione client | Registrazione non equivale a correttezza funzionale |
| Applicazioni → strumenti operativi | Metriche, tracce, stato tecnico | Secondo configurazione di monitoraggio | Nessuna garanzia di raccolta, conservazione o audit business |

E-01, E-05, E-08–E-12. I POM/configurazioni mostrano OpenAI come starter attivo e Azure commentato; qui non si modifica né certifica un'integrazione SDK. Non sono stati individuati broker, job di dominio schedulati o notifiche di business nelle classi applicative esaminate. Il listener d'avvio dell'indice non è annotato `@Async`.

## Duplicati, concorrenza, tempi e recupero

- **Duplicati:** POST di proprietari, animali e visite non applicano chiavi di idempotenza o deduplicazione esplicita. I form non disabilitano l'invio durante la richiesta. Il retry configurato sul gateway può ripetere POST su 503; l'effetto in presenza di risposta persa va provato, non è garantito «una volta sola».
- **Concorrenza:** non risultano `@Version`, confronto della versione ricevuta o conflitti funzionali espliciti nelle entità. Due modifiche possono sovrascriversi; ordine e isolamento effettivi dipendono dal database. Nessuna promessa di serializzazione.
- **Attesa e risultati parziali:** i timeout del singolo ambiente non sono ricostruibili dalle sole proprietà locali. Non sono previste scadenze di visite o pratiche. D-03 descrive il risultato parziale verificato nel codice; il fallback POST generico del gateway non prova un recupero equivalente per GET.
- **Reversibilità:** nome/indirizzo/tipo possono essere corretti con un nuovo aggiornamento, senza ripristino di una versione precedente. Creazioni e visite non hanno un undo dedicato. Un errore visualizzato non prova che il dato non sia stato scritto: controllare prima di ripetere.
- **Audit e storico:** le visite sono dati consultabili, non un registro delle modifiche. Logging di payload e advisor è presente, ma non una traccia business con autore autenticato, valori prima/dopo e conservazione garantita. Non confondere localStorage chat con audit centrale.
- **Configurazione:** profili e proprietà influenzano datasource, persistenza, cache, provider, discovery e resilienza. Il nome `production` non prova esercizio in produzione; immagini Compose senza pin immutabile non provano equivalenza al commit analizzato.
- **Separazione clienti:** non risultano tenant, organizzazioni o filtri per utente nei modelli/controller. L'eventuale separazione tramite deployment o rete è sconosciuta. Le query proprietari possono trasferire l'intero elenco alla chat; politiche esterne di trattamento/conservazione non sono deducibili dal codice.

Fonti E-03–E-11. Queste sono osservazioni sul funzionamento, non un audit di sicurezza completo o proposte già approvate.
