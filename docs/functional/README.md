# Documentazione funzionale di Spring Petclinic

Analisi del **21 settembre 2026**, ticket **COG-298**. Sorgente esaminato: branch `main`, commit `ad874c63673aaf6d1407ff359703481e85f473f4`; branch di consegna `codex/cog-298-documentazione-funzionale`.

L'applicazione dimostrativa permette di registrare proprietari e animali, annotare visite, consultare veterinari e interagire con un assistente che può anche creare dati. Questa documentazione descrive il codice presente, non certifica un ambiente in produzione e non introduce requisiti approvati.

## Guida alla lettura

| Documento | Destinatari e contenuto |
|---|---|
| [Perimetro, attori e mappa](perimetro.md) | Product Owner e stakeholder: finalità, confini, autorizzazioni, copertura e glossario |
| [Schede funzionali ed esperienza utente](funzionalita.md) | Business, delivery e QA: azioni, input, risultati, eccezioni e limiti per funzione |
| [Processi e dati](processi-dati.md) | Flussi completi, diagrammi Mermaid e ciclo di vita delle informazioni |
| [Regole, integrazioni e aspetti trasversali](regole-integrazioni.md) | Decisioni, configurazione, risultati parziali e recupero |
| [Scenari e tracciabilità](verifica.md) | QA: scenari riproducibili, matrice e registro delle fonti nel repository |
| [Attendibilità, punti aperti e handoff](attendibilita.md) | Evidenze dell'analisi, contraddizioni, domande ordinate per impatto e verifiche eseguite |

Gli identificativi `F-xx`, `R-xx`, `D-xx`, `S-xx`, `E-xx` designano rispettivamente funzionalità, regole, diagrammi, scenari e gruppi di evidenze. Le fonti `E-xx` sono risolte in [verifica](verifica.md). «Implementata» significa che i collegamenti sono presenti nel sorgente: non equivale a «collaudata end-to-end». Le carenze e le parti condizionate sono riportate vicino al comportamento interessato.

Per installazione e gestione tecnica consultare l'[indice agent-readiness](../agent-readiness/README.md). I documenti esistenti sono preservati; le divergenze riscontrate sono registrate in [attendibilità](attendibilita.md).
