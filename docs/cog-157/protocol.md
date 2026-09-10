# Protocollo baseline e pilota

## Decisioni da bloccare prima della prima misura

Il referente clinico deve compilare e far approvare questi campi prima della
baseline. Una modifica successiva rende non confrontabili le misure interessate.

| Campo | Valore da registrare |
|---|---|
| Referente clinico | **Da nominare** |
| Sponsor/owner che approva soglie e calendario | **Da confermare** |
| Operatori | Almeno 5, con veterinari e segreteria rappresentati |
| Dispositivo e identificativo configurazione | **Da fissare** |
| Sistema operativo | **Da fissare** |
| Browser e versione | **Da fissare** |
| Viewport/zoom/input | **Da fissare** |
| Rete e ambiente applicativo | **Da fissare** |
| Dataset e revisione | Catalogo COG-157, revisione del commit di esecuzione |
| Calendario baseline | **Da fissare; deve precedere lo sviluppo della candidata** |
| Calendario pilota | **Da fissare dopo il superamento dei controlli tecnici** |

Finché referente, partecipanti e configurazione non sono registrati, AC-020
resta non verificato e la validazione business resta bloccata.

## Campione e bilanciamento

- Ogni condizione comprende 20 compiti per ciascuno di almeno 5 operatori:
  almeno 100 tentativi baseline e almeno 100 tentativi pilota.
- Ogni operatore completa tutti i 20 slot del [catalogo](task-catalog.csv).
- I dataset sintetici A e B hanno gli stessi tipi di caso e la stessa
  distribuzione di difficoltà, ma entità, date e risposte diverse.
- O01, O03 e O05 usano A in baseline e B nel pilota; O02 e O04 usano B in
  baseline e A nel pilota. Il [generatore](generate-register.mjs) applica questa
  assegnazione.
- L'ordine dei compiti usa cinque rotazioni. Nel pilota la rotazione parte
  dalla metà opposta del catalogo. La baseline rimane comunque interamente
  precedente allo sviluppo: non si alternano temporalmente baseline e pilota.
- Pausa, istruzioni, posizione del browser e modalità di conferma restano
  uguali nelle due condizioni. Non si riutilizza la stessa variante con lo
  stesso operatore.

## Script della prova

1. Il facilitatore legge il compito e verifica che l'operatore abbia compreso
   la domanda prima di iniziare.
2. Il proprietario è già individuato, ma la scheda non è aperta.
3. Al comando «Apri il proprietario», il facilitatore avvia il tempo e
   l'operatore apre la scheda.
4. L'operatore consulta lo storico e comunica una sola risposta definitiva.
5. Il tempo termina quando la risposta definitiva è pronunciata o confermata;
   caricamento, selezione e filtri sono inclusi.
6. Il facilitatore confronta la risposta con quella prefissata nel catalogo e
   registra soltanto i campi ammessi. Non corregge durante il tentativo.

## Esiti e calcoli AC-020–AC-023

| Esito | Definizione | Successo entro 30 s | Tempo per la mediana |
|---|---|---:|---:|
| `correct` | Risposta attesa, autonoma | Sì, solo se tempo osservato ≤30 s | Tempo osservato, massimo 120 s |
| `late` | Risposta attesa oltre 30 s | No | Tempo osservato, massimo 120 s |
| `wrong` | Risposta diversa dall'attesa | No | 120 s |
| `helped` | Qualunque aiuto sul percorso o sulla risposta | No | 120 s |
| `abandoned` | Nessuna risposta definitiva entro il limite | No | 120 s |
| `technical` | Prova invalidata da guasto non imputabile all'operatore | No; non sostituire senza nota predefinita | Esclusa solo se la regola di invalidazione era fissata prima |

Il limite operativo proposto è 120 s. Tempi osservati e penalità restano in
colonne separate. La percentuale di successo è:

`100 × risposte corrette entro 30 s / tutti i tentativi previsti`.

Il target proposto è almeno 90%. Il beneficio sulla mediana è:

`100 × (mediana baseline − mediana pilota) / mediana baseline`.

Il target proposto è almeno 30%. La mediana include tutti i tentativi previsti
e usa 120 s per errori, aiuti e abbandoni. I risultati vanno presentati anche
per ruolo e fascia di volume; non si compensano gruppi non confrontabili.

## Registro minimo e riservatezza

Il file `measurement-register.csv` contiene gli incarichi preparati e questi
soli dati di prova: run, condizione, slot operatore, ruolo, posizione, slot del
compito, variante, caso, tempo osservato, esito, penalità e nota di validità.

- Lo slot operatore non contiene nome, email o identificativo aziendale.
- Non si registrano proprietari, animali, query o descrizioni.
- Il registro di dettaglio è temporaneo e accessibile soltanto al team della
  misura. Dopo il controllo si producono aggregati per condizione/ruolo/volume
  e si elimina il dettaglio secondo il periodo concordato prima della prova.
- I risultati del prototipo tecnico e delle sessioni esplorative restano in un
  file separato e non popolano baseline o pilota.

## Regole di arresto

Interrompere e marcare la raccolta come non valida se mancano cinque operatori,
un ruolo non è rappresentato, la baseline parte dopo lo sviluppo, cambiano
dataset/configurazione senza equivalenza documentata o il totale previsto non
è completato. In questi casi non si imputa il beneficio e non si sostituiscono
le osservazioni mancanti con benchmark o test QA.
