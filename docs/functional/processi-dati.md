# Processi completi e dati di business

[Torna all'indice](README.md). I diagrammi rappresentano collegamenti verificati nel sorgente; i servizi non sono stati avviati. Riferimenti E-xx in [verifica](verifica.md).

## D-01 — Contesto (F-01–F-09)

```mermaid
flowchart LR
    U[Operatore UI] -->|Consulta e registra| G[Gateway e interfaccia]
    A[Chiamante API] -->|Richieste HTTP| G
    G -->|Anagrafiche| C[Customers]
    G -->|Visite| V[Visits]
    G -->|Catalogo| T[Vets]
    G -->|Messaggio chat| AI[GenAI]
    AI <-->|Prompt, risultati tool e risposte| L[Provider linguistico]
    AI -->|Letture e creazioni| C
    AI -->|Solo indicizzazione alternativa all'avvio| T
    AI -->|Ricerca| I[Indice veterinari precalcolato o generato]
    C --> DC[(Dati proprietari e animali)]
    V --> DV[(Dati visite)]
    T --> DT[(Dati veterinari)]
    CF[Configurazione esterna] --> S[Servizi applicativi]
    DS[Discovery] -->|Indirizzi istanze| S
    S -->|Telemetria se configurata| O[Strumenti operativi]
    OP[Operatore tecnico] -->|Diagnosi| O
```

Le frecce indicano finalità degli scambi; i contenitori dati indicano responsabilità logiche, non garantiscono database fisicamente separati in ogni profilo. Configurazione/discovery si applicano ai servizi pertinenti; non sono tappe manuali di ogni visita. Fonti E-01, E-03–E-11.

## P-01 — Dalla registrazione alla prima visita (F-01–F-05)

L'operatore cerca prima il proprietario per evitare una duplicazione manuale, ma il sistema non impone questa verifica. Può registrare il proprietario, aprirne il dettaglio, aggiungere un animale e infine annotare una visita. Ogni invio è una richiesta e un salvataggio distinti. Se l'ultimo fallisce, i dati creati prima restano: non c'è una transazione unica, compensazione o annullamento dell'intero percorso. Non sono previsti approvazione, assegnazione al veterinario o invio di notifiche nel flusso analizzato.

### D-02 — Responsabilità ed errori di registrazione

```mermaid
flowchart TD
    A[Operatore: cerca proprietario] --> B{Record presente?}
    B -->|No| C[Operatore: compila anagrafica]
    C --> D[Customers: valida e salva]
    D --> E{Salvataggio riuscito?}
    E -->|No| C
    E -->|Si| F[Operatore: apre dettaglio]
    B -->|Si| F
    F --> G[Operatore: inserisce animale e tipo]
    G --> H[Customers: collega e salva animale]
    H --> I{Salvataggio riuscito?}
    I -->|No| G
    I -->|Si| J[Operatore: inserisce data e descrizione visita]
    J --> K[Visits: valida e salva visita]
    K --> L{Salvataggio riuscito?}
    L -->|No| J
    L -->|Si| M[UI: torna al dettaglio aggregato]
```

Le frecce di correzione descrivono un nuovo tentativo manuale, non un retry automatico né una garanzia sul comportamento dell'interceptor. Alla riapertura controllare l'eventuale salvataggio già avvenuto. Fonti E-02–E-06; regole R-02–R-07. Esito: dati registrati senza cambio di uno stato clinico.

## P-02 — Dettaglio e risultato parziale (F-04)

### D-03 — Sequenza di lettura

```mermaid
sequenceDiagram
    actor U as Operatore
    participant UI as Interfaccia
    participant G as Gateway aggregatore
    participant C as Customers
    participant V as Visits
    U->>UI: Apre proprietario
    UI->>G: GET dettaglio ownerId
    G->>C: GET proprietario e animali
    alt Customers risponde
        C-->>G: Anagrafica e lista animali
        G->>V: GET visite per lista petId
        alt Visits risponde
            V-->>G: Visite
            G->>G: Associa per petId
        else Errore Visits
            G->>G: Usa lista visite vuota
        end
        G-->>UI: Dettaglio, senza indicatore di parzialita
        UI-->>U: Mostra dati e azioni
    else Errore Customers
        C-->>G: Errore
        G-->>UI: Errore, nessun recupero anagrafica nel controller
    end
```

È una catena richiesta/risposta HTTP. L'uso di client reattivi non dimostra un processo di business asincrono con coda o callback. Il fallback Visits è coperto da un test con client simulato, non da una prova di indisponibilità reale. E-05, E-12; R-05.

## P-03 — Richiesta in chat con possibile scrittura (F-07)

### D-04 — Sequenza di conversazione

```mermaid
sequenceDiagram
    actor U as Utente
    participant B as Browser
    participant A as GenAI tramite gateway
    participant L as Modello esterno
    participant T as Strumenti applicativi
    participant C as Customers o indice veterinari
    U->>B: Testo e invio
    B->>B: Mostra messaggio e svuota input
    B->>A: POST stringa query
    A->>L: Prompt e contesto
    opt Il modello richiede uno strumento
        L-->>A: Richiesta tool
        A->>T: Esegue tool registrato
        T->>C: Legge oppure crea dati
        C-->>T: Risultato o errore
        T-->>A: Esito tool
        A->>L: Esito nel contesto
    end
    alt Elaborazione completata
        L-->>A: Contenuto finale
        A-->>B: Risposta completa
    else Eccezione elaborazione
        A-->>B: Testo di indisponibilita
    end
    B-->>U: Messaggio renderizzato
```

Lo schema mostra il possibile ciclo tool, non un numero garantito di invocazioni. Nessun callback utente o approvazione intermedia è implementato; il browser attende con una promessa, senza streaming. L'esito di una creazione è verificabile rileggendo Customers, non dal solo testo del modello. E-08, E-09; R-09, R-10.

### D-05 — Preparazione indice (F-08)

```mermaid
flowchart TD
    A[Evento avvio GenAI] --> B{File vectorstore.json presente?}
    B -->|Si| C[Carica indice dal classpath]
    B -->|No| D[Legge elenco Vets]
    D --> E[Converte in documenti e aggiunge al vector store]
    E --> F[Salva file temporaneo]
    C --> G[Indice disponibile alla ricerca]
    F --> G
    C -.->|Errore file| H[Completamento non garantito]
    D -.->|Errore servizio| H
    E -.->|Errore conversione o provider| H
    F -.->|Errore scrittura| H
```

Non è una schedulazione periodica; non c'è ripresa applicativa codificata. Il file temporaneo non sostituisce automaticamente la risorsa classpath al riavvio. Fonti E-10; R-11.

## Modello concettuale e ciclo di vita

| Entità | Significato e campi | Vita del dato nel perimetro esposto |
|---|---|---|
| Proprietario | ID, nome, cognome, indirizzo, città, telefono | Creato e modificabile; contiene zero o più animali. Nessuna archiviazione/eliminazione via UI/API dedicata |
| Animale | ID, nome, nascita, tipo, proprietario | Creato sotto un proprietario; nome/data/tipo modificabili. Trasferimento, morte, cancellazione non modellati |
| Tipo animale | ID e nome | Consultabile per scegliere il tipo; nessuna manutenzione UI/API rilevata |
| Visita | ID, petId, data, descrizione | Creata e letta; nessuno stato, veterinario assegnato, durata o storico revisioni. Nessuna operazione dedicata di modifica/annullamento |
| Veterinario | ID, nome e cognome, specialità | Catalogo letto dall'applicazione; caricamenti demo non sono una gestione utente |
| Specialità | ID e nome | Associata a più veterinari; nessuna gestione UI/API rilevata |
| Conversazione visibile | Messaggi HTML del browser | Ripristino da localStorage; distinta dalla memoria del modello e dai dati clinici |
| Documento vettoriale | Rappresentazione del veterinario per similarità | Caricato/generato all'avvio; nessuna sincronizzazione continua verificata |

### D-06 — Relazioni di dominio

```mermaid
erDiagram
    PROPRIETARIO ||--o{ ANIMALE : possiede
    TIPO ||--o{ ANIMALE : classifica
    ANIMALE ||..o{ VISITA : riferimento_logico
    VETERINARIO }o--o{ SPECIALITA : possiede
```

E-03, E-04, E-06, E-07: Customers e i relativi schemi richiedono un proprietario e un tipo per animale. La relazione tratteggiata visita–animale descrive il significato del petId: **non garantisce** che ogni visita abbia un animale esistente in ogni profilo. HSQLDB non ha la FK fra visite e animali; lo script MySQL richiede una tabella `pets` nello stesso database. Le specialità sono molti-a-molti nel modello Vet. Non c'è relazione verificata fra visita e veterinario.

Non è incluso un diagramma di stati clinici: le entità non hanno un campo di stato o transizioni di approvazione, scadenza, chiusura e riapertura. Creazione e aggiornamento sono operazioni sui dati, non stati di business da inventare. La persistenza al riavvio dipende da datasource e inizializzazione; gli script HSQLDB contengono DROP, quelli MySQL usano CREATE IF NOT EXISTS. Non sono politiche di conservazione o procedure di backup.
