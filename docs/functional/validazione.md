# Registro di validazione

[Indice](README.md) · [Scenari proposti e test esistenti](verifica-evidenze.md)

Data: 4 settembre 2026. Sorgente analizzato: `f3b392c92580b740f4bafd0364b326e0bd1774f0`. La modifica contiene solo documentazione sotto `docs/functional/`.

## Controlli e limiti

| Controllo | Esito |
|---|---|
| Ricostruzione statica UI → route → controller → dati | Svolta per F01–F08; limiti nell'inventario del README |
| Coerenza ruoli, regole, flussi, scenari e matrice | Revisione svolta: ruoli dedotti espliciti, nessuno stato clinico inventato, parzialità Visits e limiti chat coerenti |
| Percorsi del registro E01–E18 | Verificati esistenti durante generazione del registro |
| Collegamenti Markdown e identificativi F/R/S/E/D | Superato: 97 collegamenti locali; 8 F, 14 R, 35 S, 18 E e 6 D validi, senza ID fuori inventario |
| Whitespace e scope | `git diff --cached --check`; solo file intenzionali in `docs/functional/` |
| Mermaid | Rendering tentato con Mermaid CLI 11.17.0, bloccato: `Could not find chrome-headless-shell (ver. 152.0.7977.75)`; installazione browser tentata, fallita con `IncompleteInstallationError`. Sintassi superata per tutti i 7 blocchi con `mermaid.parse` (Mermaid 11.17.2 e JSDOM); resa grafica non verificata |
| Suite applicativa `./mvnw test` | Bloccata prima dell'esecuzione: `Error: JAVA_HOME is not defined correctly. We cannot execute`. `command -v java` non trova un eseguibile; nessun JDK in `/usr/lib/jvm` |
| Scenari funzionali/browser/provider AI | Non eseguiti; nessuna affermazione di collaudo end-to-end o validazione in produzione |

Il blocco Java è ambientale e non è stato risolto modificando configurazione o dipendenze applicative. I test esistenti sono stati letti: quelli dei controller usano repository/client mock; il client Visits usa MockWebServer. Non sono stati convertiti in prove di persistenza reale.

I log di questa esecuzione sono conservati fuori dal repository in `/opt/project/logs/COG-156/`. La PR e il workpad Linear riportano commit di consegna, collegamento e stato CI osservato; eventuali check ancora in corso non equivalgono a un esito positivo.

## Ripetere il controllo dei collegamenti

Dalla radice del repository, senza dipendenze applicative:

```bash
python3 - <<'PY'
from pathlib import Path
import re
root = Path('docs/functional')
count = 0
for source in root.glob('*.md'):
    for target in re.findall(r'\]\(([^)]+)\)', source.read_text()):
        if '://' in target:
            continue
        path = target.split('#', 1)[0]
        assert (source.parent / path).exists(), (source, target)
        count += 1
print(f'{count} collegamenti locali validi')
PY
```

La verifica delle evidenze va ripetuta semanticamente quando cambia il codice: la sola esistenza dei percorsi non garantisce che i comportamenti restino gli stessi.

Controllo sintattico eseguito con `node /opt/project/logs/COG-156/mermaid-qa/check.mjs`: sette esiti PASS. Il parser ha ricevuto ciascun blocco estratto da `processi.md`, con DOM fornito da JSDOM. Il rendering è stato tentato con `mmdc -i docs/functional/processi.md -o /opt/project/logs/COG-156/processi-rendered.md -p /opt/project/logs/COG-156/puppeteer.json`. Gli strumenti QA sono stati installati fuori dal repository, senza modificare dipendenze applicative.
