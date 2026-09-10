# COG-157 — preparazione della cronologia visite

Questo pacchetto prepara la baseline, le regole, il design e il prototipo per il
caso d'uso «Trovare rapidamente l'ultima visita pertinente di un animale».
Non modifica la pagina AngularJS di produzione: quella integrazione appartiene
a COG-158.

## Stato della consegna

| Area | Stato | Evidenza |
|---|---|---|
| Protocollo REQ-008 / AC-020–AC-023 | Preparato, non eseguito | [protocollo](protocol.md) e [registro](measurement-register.csv) |
| Baseline | **Non raccolta** | Referente clinico e almeno cinque operatori non sono stati nominati nel ticket o nel repository |
| AC-020 | **Non verificato** | Mancano partecipanti reali; i dati del prototipo non sostituiscono la baseline |
| Regole REQ-003 / REQ-004 | Fissate per sviluppo e QA | [regole e casi attesi](rules-and-cases.md) |
| Design | Preparato | [specifica](design.md) e [concept](assets/timeline-concept.png) |
| Prototipo separato | Implementato | [prototipo statico](prototype/index.html) |
| REQ-007 / AC-018–AC-019 | Misurato sul prototipo | [risultati tecnici](prototype-results.md) |
| Validazione business | **Bloccata** | Può iniziare soltanto dopo una baseline valida e confrontabile |

## Come usare il pacchetto

1. Il referente clinico completa i campi bloccanti del [protocollo](protocol.md)
   prima di raccogliere qualunque tempo.
2. Genera un registro pulito con `node docs/cog-157/generate-register.mjs`.
3. Raccoglie la baseline sulla pagina attuale, prima dello sviluppo della
   candidata, usando i 20 compiti e le risposte prefissate nel
   [catalogo](task-catalog.csv).
4. Il team usa [regole, casi e messaggi](rules-and-cases.md),
   [design](design.md) e prototipo come input per COG-158 e COG-159.
5. Il pilota di COG-160 usa lo stesso protocollo e un dataset equivalente, ma
   non mescola i suoi risultati con quelli del prototipo.

Per aprire il prototipo dalla radice del repository:

```sh
python3 -m http.server 4173
```

Poi visitare:

- `http://127.0.0.1:4173/docs/cog-157/prototype/`
- `http://127.0.0.1:4173/docs/cog-157/prototype/?state=empty`
- `http://127.0.0.1:4173/docs/cog-157/prototype/?state=unavailable`
- `http://127.0.0.1:4173/docs/cog-157/prototype/benchmark.html`

## Confini delle evidenze

I dati sono sintetici. Le misure prestazionali descrivono soltanto il prototipo
statico nel browser indicato; non provano le prestazioni del Gateway, della
rete o della candidata integrata. Nessuna sessione con operatori è stata
eseguita e nessun beneficio business è attestato.
