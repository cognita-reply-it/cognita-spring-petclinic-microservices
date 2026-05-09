# 12 - Chat Hardening

## Prompt

Fai hardening della chat GenAI.

Frontend:

- evita rendering HTML non sicuro dei messaggi Markdown;
- aggiungi loading state;
- mostra errore leggibile quando il backend GenAI non risponde;
- aggiungi un comando per pulire la history locale;
- non rompere il comportamento esistente della chatbox.

Backend:

- verifica il payload ricevuto dal chat endpoint;
- mantieni un fallback chiaro quando il provider AI non e' disponibile.

Non richiedere una API key per validare la parte frontend e sicurezza.

## Expected Output

Una chatbox piu' robusta e piu' sicura, validabile anche senza credenziali OpenAI/Azure.

## Validation

- Verifica che non venga usato `innerHTML` con contenuto non sanitizzato.
- Se possibile, verifica con Playwright gli stati: invio, loading, errore e clear history.
