# Regole, messaggi e casi attesi

Questa specifica fissa le decisioni richieste da REQ-003 e REQ-004 e fornisce
input verificabili per COG-158 e COG-159.

## Regole di ricerca e ordinamento

| ID | Regola |
|---|---|
| R-01 | Il dataset ricevuto non viene mutato. Selezione, ordinamento e filtri producono copie derivate e non generano richieste HTTP. |
| R-02 | Le visite valide sono ordinate per giorno decrescente. A parità di giorno si usa l'identificativo numerico decrescente; questo è solo un criterio deterministico, non una sequenza clinica. |
| R-03 | Senza limiti data, date mancanti o impossibili restano in coda. Con almeno un limite data sono escluse. |
| R-04 | `Dal` e `Al` sono inclusivi. È valido un solo estremo. `Dal > Al` mostra errore e nessun risultato viene presentato come valido. |
| R-05 | I giorni usano il formato civile `YYYY-MM-DD` e sono confrontati senza conversione di fuso orario. |
| R-06 | La ricerca è una sottostringa letterale nella sola descrizione: nessuna espressione regolare e nessuna interpretazione HTML. |
| R-07 | La ricerca ignora maiuscole/minuscole con locale italiano, ma non rimuove gli accenti: `È` corrisponde a `è`; `e` resta diverso da `è`. |
| R-08 | Un criterio vuoto o composto solo da spazi non applica il filtro testo. Una descrizione vuota non soddisfa una ricerca non vuota. |
| R-09 | Data e testo si combinano con AND. Il conteggio mostra `corrispondenze / totale` per l'animale selezionato. |
| R-10 | Cambiare animale azzera criteri, errori e risultati precedenti. `Azzera` fa lo stesso senza cambiare animale. |

## Messaggi

| Stato | Testo proposto | Azione disponibile |
|---|---|---|
| Caricamento | `Caricamento del proprietario e dello storico visite…` | Nessuna finché il contesto non è pronto |
| Nessun animale selezionato | `Seleziona un animale per consultare le visite.` | Selezione animale |
| Proprietario senza animali | `La risposta ricevuta non contiene animali da selezionare.` | Riprova o torna all'elenco |
| Storico disponibile ma vuoto | `La risposta è stata ricevuta, ma non contiene visite per questo animale.` | Aggiungi visita, se il percorso è autorizzato |
| Storico indisponibile o stato sconosciuto | `Lo storico delle visite non è disponibile in questo momento. Riprova.` | Riprova |
| Filtro senza risultati | `Nessuna visita corrisponde ai filtri applicati. Modifica o azzera i filtri.` | Azzera |
| Intervallo invertito | `La data iniziale deve precedere o coincidere con la data finale.` | Correggi i limiti |
| Proprietario non caricato | `Impossibile caricare il proprietario. Riprova.` | Riprova |

Il messaggio di storico vuoto descrive soltanto la risposta ricevuta; non
afferma che nella realtà clinica non esistano visite. Finché il Gateway
converte il fallimento del servizio visite in un elenco vuoto, lo stato
`disponibile ma vuoto` non è distinguibile in modo affidabile da
`indisponibile`: la candidata deve introdurre un contratto osservabile prima
di usare i due messaggi separatamente.

## Matrice dei casi attesi

| Caso | Visite/criteri sintetici | Risultato atteso |
|---|---|---|
| C-01 | Date `2026-06-18`, `2025-11-12`, nessun filtro | Ordine 18 giugno, 12 novembre |
| C-02 | Stessa data, ID 2 e 10 | ID 10 prima di ID 2 |
| C-03 | Data mancante e data valida, nessun filtro | Valida prima, mancante in coda |
| C-04 | Data `2026-02-30`, nessun filtro | Visita segnalata/non valida in coda |
| C-05 | `Dal=2026-02-04` con visita nello stesso giorno | La visita è inclusa |
| C-06 | `Al=2026-02-04` con visita nello stesso giorno | La visita è inclusa |
| C-07 | Solo `Dal`, con visita precedente e successiva | Solo la successiva o coincidente |
| C-08 | Solo `Al`, con visita precedente e successiva | Solo la precedente o coincidente |
| C-09 | `Dal=2026-06-01`, `Al=2026-05-01` | Errore intervallo; nessun elenco dichiarato valido |
| C-10 | Query `controllo` su `Controllo post-operatorio` | Corrispondenza |
| C-11 | Query `.` su `Controllo.` | Corrispondenza letterale, non regex |
| C-12 | Query `[a-z]` su descrizione identica | Corrispondenza solo se la sequenza compare letteralmente |
| C-13 | Query `È` su `è stabile` | Corrispondenza |
| C-14 | Query `e` su `è stabile` senza altra `e` | Nessuna corrispondenza |
| C-15 | Query non vuota su descrizione vuota | Nessuna corrispondenza |
| C-16 | Data compatibile e testo incompatibile | Nessuna corrispondenza (AND) |
| C-17 | HTML `<script>…</script>` in descrizione | Visualizzato come testo; nessuna esecuzione |
| C-18 | Stato visite disponibile, elenco vuoto | Messaggio “risposta ricevuta” |
| C-19 | Stato visite assente/sconosciuto o errore | Messaggio indisponibile; mai messaggio di assenza certa |
| C-20 | Reset dopo filtri e errore | Criteri vuoti, errore rimosso, ordine originale derivato ripristinato |
