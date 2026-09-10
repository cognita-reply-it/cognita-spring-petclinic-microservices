# Risultati del prototipo

Esecuzione UTC: 2026-09-10. Questi sono risultati tecnici del prototipo
statico, separati dal registro baseline/pilota e non prodotti da operatori.

## Configurazione

| Voce | Valore osservato |
|---|---|
| Host | worker Linux `aarch64`, kernel 6.12.54-linuxkit, 8 CPU logiche, 8.025.132 kB RAM |
| Browser | Playwright Chromium/HeadlessChrome 153.0.8010.12 |
| Locale / fuso | `it-IT` / `Europe/Rome` |
| Viewport benchmark | 1536 × 1024 |
| Dataset | 1.000 visite sintetiche; descrizioni vuote, HTML come testo e lunghezze fino a 8.192 caratteri |
| Ripetizioni | 100 per scenario |
| Intervallo | Da ultimo criterio applicato al frame successivo al completamento del DOM visibile |
| Soglia | 95° valore ordinato ≤ 200 ms per ciascuno scenario |

Il browser dichiara `x86_64` nel proprio user agent mentre l'host osservato è
`aarch64`; entrambi i dati sono conservati per rendere la configurazione
riconoscibile, senza dedurre la modalità di emulazione.

## AC-018 / AC-019 sul prototipo

| Scenario | Corrispondenze | Misure | p95 | Massimo | Esito |
|---|---:|---:|---:|---:|---|
| Solo data, risultato quasi completo | 906 | 100 | 49,50 ms | 53,40 ms | PASS |
| Solo testo, risultato vuoto | 0 | 100 | 21,40 ms | 23,70 ms | PASS |
| Data AND testo, risultato quasi completo | 844 | 100 | 19,50 ms | 20,90 ms | PASS |

Ogni scenario rispetta la soglia senza compensazione tra scenari. Il runner
espone i valori in `window.cog157Benchmark` soltanto nella pagina tecnica
`benchmark.html`; il prototipo operativo non registra query o descrizioni.

## Verifiche funzionali e visuali

- 11 asserzioni pure passate: date valide/impossibili, estremi inclusivi,
  singolo estremo, ordine a parità di giorno, ricerca letterale, accenti, AND
  e non-mutazione.
- Playwright: 2 test passati. Verificati caricamento non vuoto, filtro
  `controllo` (3/12), intervallo invertito, reset, cambio animale (2 visite),
  HTML mostrato come testo, stato vuoto e stato indisponibile.
- Rendering ispezionato a 1536 × 1024 e 390 × 844. Nessuna sovrapposizione o
  overflow orizzontale osservato; il mobile impila contesto, filtri e timeline.
- Il primo ciclo browser ha rilevato e fatto correggere un conflitto tra
  `id="reset"` e il metodo nativo `form.reset()`; l'intero ciclo è poi passato.

## Comandi ripetibili

```sh
node docs/cog-157/prototype/verify-rules.cjs
python3 -m http.server 4173
npx --yes playwright screenshot --browser chromium \
  --viewport-size '1536,1024' --lang it-IT --timezone Europe/Rome \
  --wait-for-selector '#timeline li' \
  http://127.0.0.1:4173/docs/cog-157/prototype/ /tmp/cog-157.png
```

Aprire `http://127.0.0.1:4173/docs/cog-157/prototype/benchmark.html` con la
stessa configurazione per ripetere le 300 misure. La prova automatizzata
Playwright è stata mantenuta fuori dal repository come artefatto runtime,
perché il progetto non ha una suite browser configurata.

## Limiti

Il benchmark non include Gateway, discovery, rete, caricamento del
proprietario, tecnologia AngularJS o dispositivi degli operatori. Deve essere
ripetuto sulla candidata integrata se cambia il rendering. Non misura
comprensione, correttezza clinica o beneficio: baseline e AC-020 restano non
verificati.
