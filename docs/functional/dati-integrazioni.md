# Dati, integrazioni e comportamenti trasversali

[Indice](README.md) · [Processi](processi.md) · [Evidenze](verifica-evidenze.md)

## Dati di business e ciclo di vita

| Entità | Significato e dati principali | Creazione, modifica e fine vita |
|---|---|---|
| Proprietario | ID, nome, cognome, indirizzo, città, telefono; elenco animali ordinato per nome | UI/API/chat creano; UI/API modificano recapiti e nome. Nessuna archiviazione/eliminazione esposta |
| Animale | ID, nome, data nascita, tipo, proprietario | UI/API/chat creano; UI/API modificano nome, nascita e tipo. Associazione proprietario impostata alla creazione, non trasferita dalla modifica |
| Tipo animale | ID e nome del catalogo | Consultabile; dati iniziali negli script. Nessun mantenimento tramite endpoint pubblico individuato |
| Visita | ID, `petId`, data, descrizione fino a 8192 caratteri | POST salva un'entità; nessuna modifica dedicata o eliminazione esposta. ID nel corpo non escluso: possibile semantica di aggiornamento secondo persistenza |
| Veterinario | ID, nome, cognome, specializzazioni | Consultabile; popolamento SQL. Nessun flusso di mantenimento UI/API |
| Specializzazione | ID, nome; associabile a più veterinari | Consultata con veterinario; popolamento SQL |
| Documento veterinario AI | Rappresentazione indicizzata per ricerca semantica | Caricato/creato all'avvio; non sincronizzato dopo ogni modifica del catalogo |
| Conversazione | Messaggi visuali nel browser, contesto nel servizio AI | HTML locale salvato all'uscita; memoria server distinta. Nessuna gestione business di cancellazione, esportazione o scadenza individuata |

E02–E05, E09–E13. I repository JPA espongono internamente più metodi dei controller: questo non dimostra che cancellazione e archiviazione siano accessibili agli utenti. I DTO con nomi di dominio non provano che tutti i dati siano popolati lungo ogni flusso; in particolare la chat legge Customers, senza arricchimento Visits.

Gli script HSQLDB eliminano e ricreano tabelle; quelli MySQL usano `CREATE TABLE IF NOT EXISTS`. L'esecuzione degli script dipende dalla configurazione, in parte esterna. Il README descrive dati demo all'avvio e profilo MySQL: non si può garantire persistenza o non distruttività di ogni riavvio senza la configurazione effettiva. Gli script MySQL Visits includono una FK verso `pets`; HSQLDB Visits non la include. Non assumere uniformità di integrità referenziale o separazione fisica fra servizi (E01, E13).

## Integrazioni e automazioni

| Integrazione | Informazioni e direzione | Avvio / esito atteso | Fallimenti e limiti |
|---|---|---|---|
| Browser → Gateway → Customers/Visits/Vets | Anagrafiche, visite, cataloghi; risposte JSON al browser | Azione utente, esito letto o salvato | Alert UI incompleto; fallback/retry globali delle route; non tutto l'errore è un messaggio business |
| Gateway → Customers e Visits | ID proprietario, ID animali, aggregazione risposte | Apertura dettaglio | Visits può essere sostituito da lista vuota; Customers non ha fallback equivalente |
| GenAI ↔ provider AI | Prompt, contesto e risultati tool; risposte e richieste di strumenti | Messaggio chat; embedding se indice ricostruito | Credenziali/provider necessari. Nessuna prova di chiamate reali o garanzia sull'esito del modello |
| GenAI → Customers | Elenco proprietari con animali, creazione proprietari/animali | Tool scelto dal modello | Prima istanza discovery; lista vuota di istanze causa errore. Nessuna conferma o compensazione dedicata |
| GenAI → Vets / indice | Catalogo completo per costruzione; documenti per ricerca | Evento avvio oppure ricerca durante chat | File preesistente prevale; nessuna freschezza garantita o sincronizzazione periodica |
| Config Server → repository configurazioni | Legge configurazioni Git; profilo native legge percorso configurabile | Bootstrap configurazioni | Repository esterno non incluso nell'analisi; import locale opzionale, profilo Docker non opzionale |
| Servizi ↔ Discovery | Registrazione e risoluzione nomi servizio | Avvio e accesso ai servizi | Presenza delle annotazioni non prova registrazione/servizi raggiungibili in produzione |
| Servizi → osservabilità | Metriche, log, tracing; Prometheus legge endpoint, Grafana consulta metriche | Scrape Prometheus configurato ogni 15 secondi; Admin/Zipkin in Compose | Esposizione effettiva dipende da configurazione; nessun SLA o audit business deducibile |
| Docker Compose → servizi | Avvio e controlli di salute infrastrutturali | `depends_on` attende Config/Discovery sani | Non verifica completezza dati, provider AI o disponibilità clinica end-to-end |

Fonti E07–E12, E18. Non sono individuati invii email/SMS, callback a clienti, code di messaggi, job clinici pianificati o webhook business. Le chiamate reattive/non bloccanti non equivalgono a processi affidabili in background.

## Configurazioni che cambiano il comportamento

- Config Server legge il repository Git configurato sul ramo `main`; il profilo `native` usa `GIT_REPO`. I client usano `CONFIG_SERVER_URL` con un default locale, e un endpoint Config fisso nel profilo Docker. L'effettiva configurazione esterna può cambiare il comportamento descritto dai default locali (E12).
- Nel POM GenAI è attivo lo starter OpenAI; Azure è commentato. YAML dichiara per OpenAI `gpt-4o-mini` e temperatura `0.7`, per Azure deployment `gpt-4o` e `0.7`. Sono valori del repository, non una verifica di disponibilità del servizio. Il fallback dimostrativo per la chiave non dimostra credenziali utilizzabili; non viene riprodotto qui (E12).
- `spring.ai.chat.client.enabled: true` è presente. Non esiste un feature flag UI che nasconda la chat in caso di indisponibilità backend. Il profilo `production` di Vets abilita caching: il suo nome non prova un rilascio in produzione (E05, E12).
- Il timer circuit breaker locale è 10 secondi; retry POST/503 una volta. Non sono limiti uniformi di ogni chiamata o scadenze di dati. `VetsProperties` dichiara TTL e dimensione heap, senza provare qui un valore effettivamente applicato (E05, E07–E08).

## Invii ripetuti e concorrenza

R06, R13; E02–E04, E06–E07. I form e la chat non bloccano invii paralleli. Non sono individuati token di idempotenza, ricerca duplicati prima della creazione o versionamento ottimistico `@Version`. Due POST proprietario/animale possono creare record distinti. Visite inviate senza ID possono duplicarsi; con ID la semantica dipende da `save`. Modifiche concorrenti non hanno un messaggio di conflitto applicativo dedicato: non si garantisce protezione dalla sovrascrittura.

Il gateway configura ripetizione POST su 503; non si presume esattamente una scrittura anche se l'utente invia una sola volta. Un errore osservato dopo un salvataggio non prova che il salvataggio sia stato annullato. Prima del reinvio l'operatore può consultare i dati; non esiste un riepilogo automatico per riconciliare richieste incerte.

## Reversibilità, storico e separazione dati

Modificare nuovamente proprietario/animale permette una correzione manuale se si conosce il valore precedente; non è un undo. Non sono esposte cancellazione delle visite, rollback di una catena di tool AI o transazioni fra servizi. Errori durante P01 possono lasciare un processo parzialmente completato.

Logger e metriche registrano attività tecniche; alcuni log includono dati delle richieste anagrafiche o della chat. Non è un registro business con autore autenticato, prima/dopo e consultazione da UI. Conservazione, accesso ai log, retention dei dati e backup non sono determinabili dal repository. Questa documentazione non riproduce dati personali presenti in dataset o log.

Nessuna entità o filtro per organizzazione/tenant è individuato. Il proprietario nel percorso API non è un confine di autorizzazione. Il browser conserva lo storico chat per origine tramite `localStorage`, senza separazione utente applicativa; il backend non riceve un ID conversazione esplicito. L'isolamento reale della memoria AI resta un punto aperto, senza dedurlo da default di librerie non verificati.
