# Regole e tabelle decisionali

[Indice](README.md) · [Funzionalità](funzionalita.md) · [Evidenze](verifica-evidenze.md)

Queste regole descrivono il codice corrente, incluse le anomalie; non costituiscono nuovi requisiti approvati. I numeri indicati sono valori locali, modificabili solo dove esplicitamente configurabili.

| ID | Regola verificabile | Fonte |
|---|---|---|
| R01 | Proprietario: cinque campi non vuoti; telefono con `@Digits(integer=12, fraction=0)` nel backend. UI richiede esattamente 12 cifre; testo del tool AI ne chiede 10 | E02, E06, E09 |
| R02 | Animale: nome e nascita richiesti solo dal form; `@Size(min=1)` nella richiesta non è attivato da `@Valid` sul parametro. Tipo risolto solo se trovato; ID tipo iniziale UI = 1 | E03, E06 |
| R03 | POST animale controlla proprietario; GET animale usa ID nel percorso; PUT usa ID nel corpo. Nessun controllo del proprietario wildcard né confronto ID corpo/percorso | E03 |
| R04 | Visita: `petId` del percorso prevale su quello nel corpo; descrizione fino a 8192, non obbligatoria nel backend; ID del corpo non azzerato. Nessun controllo applicativo di esistenza animale | E04, E13 |
| R05 | Dettaglio: recupero Customers prima di Visits; errore Visits sostituito con lista vuota, risposta 200 senza marcatore di incompletezza | E08, E15 |
| R06 | Nessuna chiave di idempotenza/deduplicazione nei controller di scrittura. Gateway configura un retry per POST con 503 sulle route, non solo chat | E02–E04, E07 |
| R07 | Tool di creazione eseguibili nel ciclo del modello senza approvazione applicativa separata; validazione finale affidata a Customers | E09–E10 |
| R08 | Ricerca UI proprietari filtrata sul dataset completo già scaricato; nessuna query remota o paginazione nel percorso | E02, E06 |
| R09 | Vets via API restituisce `findAll`; ricerca AI restituisce fino a 20 documenti, fino a 50 se richiesta nulla. Specializzazioni ordinate per nome | E05, E10 |
| R10 | Storico HTML chat locale distinto da memoria server; controller non imposta identità conversazione. Il valore 10 è ordine advisor, non limite verificato di memoria | E06, E09 |
| R11 | All'avvio GenAI prevale il file classpath; in sua assenza caricamento Vets, embedding e salvataggio temporaneo; nessun refresh periodico individuato | E11 |
| R12 | Errori UI Angular trattati assumendo un array `errors` e senza rigetto esplicito; chat tratta anche status HTTP falliti come testo | E06 |
| R13 | Creazione/modifica non producono storico business, versionamento o undo esposto. Eliminazione e archiviazione non hanno endpoint individuati | E02–E05 |
| R14 | Dati e accesso non suddivisi per ruolo/tenant nei controller e modelli esaminati; configurazioni esterne restano ignote | E02–E12 |

## Dati proprietario: precedenza dei vincoli (R01)

Esempi sintetici, senza riferimenti a persone reali. Per l'API le cifre indicate non contengono segni o separatori.

| Input | Form browser | Richiesta API diretta | Tool AI |
|---|---|---|---|
| Uno dei cinque campi vuoto | `required`; messaggi personalizzati da verificare | Rifiuto `@NotBlank` | Descrizioni/annotazioni non sostituiscono validazione Customers |
| Telefono di 10 cifre | Non rispetta pattern di 12 | Rispetta limite massimo di 12 | Coerente col testo del tool |
| Telefono di 12 cifre | Rispetta pattern | Rispetta vincolo | Diverso dall'istruzione testuale di 10 |
| Telefono di 13 cifre | Campo limitato a 12 / pattern non valido | Rifiuto | Rifiuto quando raggiunge Customers |
| Telefono alfabetico | Non rispetta pattern | Rifiuto | Rifiuto quando raggiunge Customers |
| Anagrafica uguale a una esistente | Nessun controllo dedicato | Nuovo proprietario su POST | Possibile duplicazione |

La validazione backend resta vincolante anche se UI o AI accettano un input. I limiti SQL dei nomi (30), indirizzo (255), città (80) non sono replicati da `@Size` nella richiesta: un valore più lungo può fallire in persistenza. Il telefono SQL differisce fra HSQLDB (12) e MySQL (20), ma l'API resta limitata da R01 (E13).

## Identità animale e tipo (R02–R03)

| Operazione/condizione | Decisione ed esito | Priorità/eccezione |
|---|---|---|
| POST con proprietario inesistente | 404 prima del salvataggio | Precede creazione animale |
| POST con proprietario esistente e tipo valido | Nuovo animale associato, 201 | ID animale del corpo non usato per crearlo |
| GET con ID animale esistente e proprietario diverso nel percorso | Animale recuperato per il proprio ID | Il segmento proprietario non è un filtro |
| PUT con ID percorso A, ID corpo B esistente | Viene cercato e modificato B | Corpo prevale; nessun confronto |
| PUT con ID corpo inesistente | 404 | Anche se ID percorso esiste |
| PUT con tipo inesistente, animale con tipo valido | Tipo precedente conservato; altri campi aggiornati | Non c'è errore business sul tipo |
| POST con tipo inesistente | Tipo rimane nullo; possibile errore logging/DB | Non promettere 400 o salvataggio riuscito |

## Dettaglio e indisponibilità (R05)

| Customers | Visits | Risultato applicativo |
|---|---|---|
| Proprietario disponibile | Visite disponibili | Dettaglio completo, visite associate per ID animale |
| Proprietario disponibile | Lista vuota | Dettaglio con visite vuote |
| Proprietario disponibile | Errore/timeout gestito dal circuit breaker | Dettaglio con visite vuote, 200: indistinguibile nella UI dalla riga precedente |
| Errore | Non raggiunto | Nessun fallback proprietario definito nell'aggregatore |
| Proprietario senza animali | Chiamata con lista ID vuota | Nessun ramo dedicato; eventuale errore Visits ricade nel fallback |

Il timeout predefinito del circuit breaker è fissato nel Java a **10 secondi** (E08); non è una garanzia di durata massima dell'intera operazione, che comprende anche Customers. Il retry delle route è configurato in YAML a **1** per POST/503 (E07); l'interazione effettiva con fallback e ordine dei filtri non è stata provata end-to-end.

## Indice AI e recupero (R09–R11)

| Condizione | Azione | Limite/esito negativo |
|---|---|---|
| File indice presente | Caricamento e ritorno immediato | Nessun confronto con Vets né aggiornamento automatico |
| File assente | Lettura Vets → documenti → embedding → indice → file temporaneo | Dipende da servizi e provider; nessun retry nel listener |
| File presente ma illeggibile | Eccezione propagabile | Non passa automaticamente alla ricostruzione |
| Richiesta veterinari nulla | Ricerca semantica, topK 50 | Non è il totale dei veterinari |
| Richiesta veterinari valorizzata | Ricerca semantica, topK 20 | Criteri non equivalgono a filtri SQL esatti |
| Errore di serializzazione in `listVets` | Lista vuota | Altri errori possono raggiungere la gestione generica della chat |
