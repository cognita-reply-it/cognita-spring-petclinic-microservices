# Processi completi e diagrammi

[Indice](README.md) · [Funzioni](funzionalita.md) · [Regole](regole.md) · [Fonti](verifica-evidenze.md)

## D01 — Contesto applicativo

F01–F08; E02–E12. Le frecce etichettano richieste o dati. “Operatore” è un attore dedotto; non rappresenta un ruolo autorizzativo implementato.

```mermaid
flowchart LR
    U[Operatore della clinica] -->|Consulta e registra| UI[Interfaccia Petclinic]
    UI -->|Richieste HTTP| G[Gateway]
    X[Chiamante API] -->|Dati e comandi| G
    G -->|Anagrafiche| C[Customers]
    G -->|Registrazioni visite| V[Visits]
    G -->|Elenco veterinari| T[Vets]
    G -->|Conversazione| A[GenAI]
    C -->|Legge e salva| DB[(Archivio anagrafiche)]
    V -->|Legge e salva| DV[(Archivio visite)]
    T -->|Legge| DT[(Archivio veterinari)]
    A -->|Legge e crea anagrafiche| C
    A -->|Carica se indice assente| T
    A -->|Prompt e risultati tool| AI[Provider AI esterno]
    AI -->|Risposte e richieste tool| A
    CF[Config Server] -->|Configurazioni| G
    CF -->|Configurazioni| C
    DS[Discovery] -->|Indirizzi servizi| G
    DS -->|Indirizzi servizi| A
```

Gli archivi sono responsabilità logiche: il diagramma non garantisce database fisicamente separati. Config e Discovery supportano anche gli altri servizi; le frecce sono ridotte per leggibilità. E13 mostra una possibile relazione SQL MySQL fra archivi visite e animali.

## P01 / D02 — Registrare proprietario, animale e visita

F02, F03, F05; R01–R04, R06, R13; E02–E04, E06. L'operatore avvia tre salvataggi distinti. Non esiste una transazione unica: se la visita fallisce, proprietario e animale già creati restano. Nessuna approvazione o notifica a cliente/veterinario è individuata.

```mermaid
flowchart TD
    A[Operatore apre nuovo proprietario] --> B[Compila e invia anagrafica]
    B --> C{Customers accetta e salva?}
    C -->|No| E[Operatore corregge o verifica errore]
    E --> B
    C -->|Sì| D[201 e ritorno elenco]
    D --> F[Operatore apre dettaglio e nuovo animale]
    F --> G[Carica tipi e compila scheda]
    G --> H{Customers salva animale?}
    H -->|No| I[Verifica proprietario, tipo e dati]
    I --> G
    H -->|Sì| J[201 e ritorno dettaglio]
    J --> K[Operatore apre Add Visit]
    K --> L[Legge precedenti e invia data e descrizione]
    L --> M{Visits salva?}
    M -->|No| N[Verifica errore e rileggi prima di reinviare]
    N --> K
    M -->|Sì| O[201 e rilettura dettaglio aggregato]
```

I nodi di correzione descrivono l'intervento manuale, non una procedura guidata implementata. La gestione errori UI è incompleta (R12); verificare tramite rilettura anziché affidarsi alla sola navigazione. Duplicati non prevenuti.

## P02 / D03 — Consultare il dettaglio anche con Visits indisponibile

F04; R05; E08, E15. Il browser avvia una richiesta asincrona rispetto alla pagina, ma l'operazione HTTP attende la composizione del risultato: non viene creato un job in background.

```mermaid
sequenceDiagram
    actor O as Operatore
    participant UI as Interfaccia
    participant G as Gateway
    participant C as Customers
    participant V as Visits
    O->>UI: Apre dettaglio proprietario
    UI->>G: GET dettaglio aggregato
    G->>C: GET proprietario e animali
    alt Customers risponde con proprietario
        C-->>G: Proprietario e ID animali
        G->>V: GET visite per ID animali
        alt Visits disponibile
            V-->>G: Visite
            G->>G: Associa visite agli animali
        else Errore gestito o timeout
            G->>G: Sostituisce visite con lista vuota
        end
        G-->>UI: 200 con dettaglio
        UI-->>O: Dati e azioni, nessun indicatore di parzialità
    else Errore Customers
        C-->>G: Errore
        G-->>UI: Propagazione errore senza fallback anagrafica dedicato
    end
```

Il test dell'aggregatore simula sia successo sia errore Visits con mock; non dimostra una catena reale di servizi avviati. Il recupero dopo indisponibilità è una nuova lettura.

## P03 / D04 — Chat e preparazione dell'indice

F07–F08; R07, R09–R11; E09–E11. Il caricamento avviene sull'evento di avvio, senza scheduler o coda applicativa. È separato dalle richieste chat.

```mermaid
flowchart TD
    A[Evento avvio GenAI] --> B{Indice nel classpath?}
    B -->|Sì| C[Carica file nell'indice]
    B -->|No| D[Legge veterinari da Vets e attende]
    D --> E[Converte documenti e calcola embedding]
    E --> F[Popola indice e salva file temporaneo]
    C --> G[Indice utilizzabile dai tool]
    F --> G
    C -.->|Errore lettura| H[Errore senza recupero automatico dedicato]
    D -.->|Servizio non disponibile| H
    E -.->|Errore provider| H
```

Nessuna freccia da file temporaneo a classpath: quel passaggio non è implementato. Un indice caricato può essere diverso dal catalogo corrente.

### D05 — Richiesta chat con lettura o scrittura

F07; E06–E10. Il modello può invocare più tool; non è garantito che ne invochi uno. Le richieste e le risposte del provider sono parte della stessa operazione dal punto di vista del browser.

```mermaid
sequenceDiagram
    actor O as Operatore
    participant UI as Chat nel browser
    participant G as Gateway
    participant A as GenAI
    participant M as Modello esterno
    participant C as Customers o indice veterinari
    O->>UI: Invia testo
    UI->>UI: Mostra messaggio e svuota campo
    UI->>G: POST chat
    G->>A: Inoltra richiesta
    A->>M: Prompt con memoria e strumenti
    loop Se il modello richiede strumenti
        M-->>A: Richiesta tool
        A->>C: Lettura o creazione
        C-->>A: Dati oppure esito scrittura
        A->>M: Risultato tool
    end
    alt Risposta completata
        M-->>A: Testo finale
        A-->>G: Testo
    else Eccezione nel servizio chat
        A-->>G: Testo di indisponibilità
    end
    G-->>UI: Risposta completa
    UI-->>O: Aggiunge testo alla conversazione
```

Non è rappresentata un'approvazione perché non esiste un controllo dedicato nel percorso. Un timeout gateway o un errore dopo la scrittura non costituisce rollback. Inviare nuovamente il testo può ripetere la creazione.

## D06 — Modello concettuale

F02–F06; E02–E05, E13. Le cardinalità proprietario–animale e tipo–animale sono sostenute dagli script SQL con chiavi obbligatorie; quelle veterinario–specializzazione dalla relazione molti-a-molti. Per le visite il collegamento ad animale è logico e il vincolo fisico varia per database.

```mermaid
erDiagram
    PROPRIETARIO ||--o{ ANIMALE : possiede
    TIPO ||--o{ ANIMALE : classifica
    VETERINARIO }o--o{ SPECIALIZZAZIONE : possiede
```

```mermaid
flowchart LR
    V[Visita con petId] -.->|Riferimento logico; FK solo nello script MySQL| A[Animale]
```

Non esiste relazione visita–veterinario nel modello esaminato. Non si aggiunge un diagramma di stati clinici: le entità non hanno stato di prenotazione, approvazione, annullamento o scadenza. Creazione e modifica sono operazioni sui dati, non transizioni di un workflow clinico documentato.
