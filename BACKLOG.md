# Backlog Hands-On

Lista ordinata di feature adatte a una sessione hands-on progressiva su questo repository. Ogni item e' ancorato a codice realmente presente nei moduli Spring Boot e nel frontend AngularJS servito dal gateway.

## 1. Filtro veterinari per nome o specialita'

- Obiettivo: aggiungere alla pagina veterinari un filtro semplice per `lastName` e `specialty`, mantenendo invariata la risposta completa quando non vengono passati parametri.
- Perche' e' utile didatticamente: introduce una feature end-to-end piccola, leggibile e a basso rischio su repository JPA, controller REST e UI AngularJS.
- File probabili: `spring-petclinic-vets-service/src/main/java/org/springframework/samples/petclinic/vets/model/VetRepository.java`, `spring-petclinic-vets-service/src/main/java/org/springframework/samples/petclinic/vets/web/VetResource.java`, `spring-petclinic-vets-service/src/test/java/org/springframework/samples/petclinic/vets/web/VetResourceTest.java`, `spring-petclinic-api-gateway/src/main/resources/static/scripts/vet-list/vet-list.controller.js`, `spring-petclinic-api-gateway/src/main/resources/static/scripts/vet-list/vet-list.template.html`.
- Backend coinvolto: `spring-petclinic-vets-service`, esposto dal gateway tramite la route `/api/vet/**` in `spring-petclinic-api-gateway/src/main/resources/application.yml`.
- Frontend coinvolto: pagina `vet-list` nel modulo `spring-petclinic-api-gateway`.
- Test attesi: aggiornamento di `VetResourceTest` con casi filtrati e senza filtri; controllo manuale della vista veterinari.
- Criterio di completamento: i filtri restituiscono i veterinari attesi, la lista completa resta disponibile senza query params e la UI mostra anche uno stato vuoto leggibile.
- Livello di difficolta': bassa.
- Rischi o prerequisiti: va scelto un matching coerente con i dati seed HSQLDB/MySQL gia' presenti in `spring-petclinic-vets-service/src/main/resources/db/`.

## 2. Owner Search con filtri realistici

- Obiettivo: estendere la pagina Find Owners con filtri almeno per `lastName` e `city`, senza rompere il comportamento corrente di elenco completo.
- Perche' e' utile didatticamente: esercita repository query methods, contratto API evolutivo e una UI di ricerca molto visibile durante una demo.
- File probabili: `spring-petclinic-customers-service/src/main/java/org/springframework/samples/petclinic/customers/model/OwnerRepository.java`, `spring-petclinic-customers-service/src/main/java/org/springframework/samples/petclinic/customers/web/OwnerResource.java`, `spring-petclinic-api-gateway/src/main/resources/static/scripts/owner-list/owner-list.controller.js`, `spring-petclinic-api-gateway/src/main/resources/static/scripts/owner-list/owner-list.template.html`, `spring-petclinic-api-gateway/src/main/resources/static/scripts/owner-list/owner-list.component.js`.
- Backend coinvolto: `spring-petclinic-customers-service`, esposto dal gateway tramite la route `/api/customer/**`.
- Frontend coinvolto: pagina `owner-list` nel modulo `spring-petclinic-api-gateway`.
- Test attesi: nuovo test mirato per `OwnerResource` o copertura equivalente sul filtro owners; verifica browser del caso con risultati e del caso senza risultati.
- Criterio di completamento: la ricerca filtra correttamente per cognome e citta', la chiamata senza filtri continua a funzionare e la UI non duplica logica di query nel controller.
- Livello di difficolta': bassa-media.
- Rischi o prerequisiti: il repo contiene `PetResourceTest` ma non un test dedicato a `OwnerResource`, quindi va introdotta una copertura backend mirata.

## 3. Error handling coerente per owner, pet e visit

- Obiettivo: rendere stabili e leggibili i `404` e gli errori di validazione, mantenendo l'interceptor globale solo per errori non gestibili inline.
- Perche' e' utile didatticamente: mostra come fissare un contratto errore comune senza un refactor ampio e come collegarlo a form AngularJS esistenti.
- File probabili: `spring-petclinic-customers-service/src/main/java/org/springframework/samples/petclinic/customers/web/OwnerResource.java`, `spring-petclinic-customers-service/src/main/java/org/springframework/samples/petclinic/customers/web/PetResource.java`, `spring-petclinic-customers-service/src/main/java/org/springframework/samples/petclinic/customers/web/ResourceNotFoundException.java`, `spring-petclinic-visits-service/src/main/java/org/springframework/samples/petclinic/visits/web/VisitResource.java`, `spring-petclinic-customers-service/src/test/java/org/springframework/samples/petclinic/customers/web/PetResourceTest.java`, `spring-petclinic-visits-service/src/test/java/org/springframework/samples/petclinic/visits/web/VisitResourceTest.java`, `spring-petclinic-api-gateway/src/main/resources/static/scripts/infrastructure/httpErrorHandlingInterceptor.js`, `spring-petclinic-api-gateway/src/main/resources/static/scripts/owner-form/owner-form.controller.js`, `spring-petclinic-api-gateway/src/main/resources/static/scripts/pet-form/pet-form.controller.js`, `spring-petclinic-api-gateway/src/main/resources/static/scripts/visits/visits.controller.js`.
- Backend coinvolto: `spring-petclinic-customers-service` e `spring-petclinic-visits-service`.
- Frontend coinvolto: form owners, pets e visits nel modulo `spring-petclinic-api-gateway`.
- Test attesi: aggiornamento dei test REST esistenti per status code e payload errore; una verifica UI rappresentativa di errore inline.
- Criterio di completamento: `404` e validation error usano un payload coerente, i form mostrano messaggi utili senza `alert` bloccanti per i casi previsti e non restano fallimenti silenziosi.
- Livello di difficolta': media.
- Rischi o prerequisiti: serve definire con precisione il contratto errore per non creare divergenze tra customers e visits.

## 4. Timeline visite piu' leggibile nella owner details

- Obiettivo: migliorare la pagina owner details ordinando le visite per data, evidenziando l'assenza di visite e rendendo piu' leggibile il blocco pet/visit.
- Perche' e' utile didatticamente: e' un task di rifinitura a basso impatto che attraversa gateway aggregation, DTO e template senza richiedere nuovi microservizi.
- File probabili: `spring-petclinic-api-gateway/src/main/java/org/springframework/samples/petclinic/api/boundary/web/ApiGatewayController.java`, `spring-petclinic-api-gateway/src/main/java/org/springframework/samples/petclinic/api/dto/OwnerDetails.java`, `spring-petclinic-api-gateway/src/main/java/org/springframework/samples/petclinic/api/dto/VisitDetails.java`, `spring-petclinic-api-gateway/src/main/resources/static/scripts/owner-details/owner-details.controller.js`, `spring-petclinic-api-gateway/src/main/resources/static/scripts/owner-details/owner-details.template.html`, `spring-petclinic-api-gateway/src/test/java/org/springframework/samples/petclinic/api/boundary/web/ApiGatewayControllerTest.java`.
- Backend coinvolto: `spring-petclinic-api-gateway`, con consumo di `customers-service` e `visits-service` tramite `CustomersServiceClient` e `VisitsServiceClient`.
- Frontend coinvolto: pagina `owner-details` nel modulo `spring-petclinic-api-gateway`.
- Test attesi: aggiornamento di `ApiGatewayControllerTest` per l'ordinamento o la trasformazione dei dati; controllo manuale della pagina owner details.
- Criterio di completamento: ogni pet mostra visite ordinate e uno stato esplicito quando la lista e' vuota, senza alterare il flusso di modifica owner/pet/visit gia' esistente.
- Livello di difficolta': media.
- Rischi o prerequisiti: bisogna chiarire se l'ordinamento va applicato nel gateway o nel template per evitare logica sparsa lato UI.

## 5. Dashboard summary nella home del gateway

- Obiettivo: aggiungere alla welcome page una sintesi con conteggi di owners, pets, vets e visits, con fallback quando un servizio dipendente non risponde.
- Perche' e' utile didatticamente: introduce un endpoint aggregatore sul gateway, test reattivi e una home piu' utile per orientarsi nel sistema durante la demo.
- File probabili: `spring-petclinic-api-gateway/src/main/java/org/springframework/samples/petclinic/api/boundary/web/ApiGatewayController.java`, `spring-petclinic-api-gateway/src/main/java/org/springframework/samples/petclinic/api/application/CustomersServiceClient.java`, `spring-petclinic-api-gateway/src/main/java/org/springframework/samples/petclinic/api/application/VisitsServiceClient.java`, `spring-petclinic-api-gateway/src/main/resources/application.yml`, `spring-petclinic-api-gateway/src/main/resources/static/scripts/fragments/welcome.html`, `spring-petclinic-api-gateway/src/main/resources/static/scripts/app.js`, `spring-petclinic-api-gateway/src/test/java/org/springframework/samples/petclinic/api/boundary/web/ApiGatewayControllerTest.java`.
- Backend coinvolto: `spring-petclinic-api-gateway`, con chiamate a `customers-service`, `vets-service` e `visits-service`.
- Frontend coinvolto: fragment `welcome` nel modulo `spring-petclinic-api-gateway`.
- Test attesi: nuovi test sull'endpoint summary del gateway e verifica browser della home aggiornata.
- Criterio di completamento: la home mostra indicatori compatti e link utili, l'endpoint aggregatore gestisce almeno un fallback ragionevole e il layout resta coerente con il frontend esistente.
- Livello di difficolta': media-alta.
- Rischi o prerequisiti: oggi il gateway ha client dedicati per customers e visits ma non per vets, quindi il task richiede una piccola estensione del layer client.

## 6. Hardening della chat GenAI

- Obiettivo: mettere in sicurezza il rendering Markdown della chat, aggiungere loading state, errore leggibile e azione per pulire la history locale, senza richiedere credenziali AI per validare la parte frontend.
- Perche' e' utile didatticamente: combina sicurezza frontend, UX di errore e robustezza di un endpoint AI senza richiedere un'infrastruttura esterna complessa per il primo giro.
- File probabili: `spring-petclinic-api-gateway/src/main/resources/static/scripts/genai/chat.js`, `spring-petclinic-api-gateway/src/main/resources/static/index.html`, `spring-petclinic-api-gateway/src/main/resources/static/css/petclinic.css`, `spring-petclinic-genai-service/src/main/java/org/springframework/samples/petclinic/genai/PetclinicChatClient.java`, `spring-petclinic-genai-service/src/main/java/org/springframework/samples/petclinic/genai/AIBeanConfiguration.java`, `spring-petclinic-genai-service/src/main/java/org/springframework/samples/petclinic/genai/GenAIServiceApplication.java`.
- Backend coinvolto: `spring-petclinic-genai-service`, esposto dal gateway tramite la route `/api/genai/**`.
- Frontend coinvolto: widget chat servito da `spring-petclinic-api-gateway`.
- Test attesi: verifica statica o test frontend che non venga usato `innerHTML` con contenuto non sanitizzato; test backend sul payload invalido o provider non disponibile; verifica manuale degli stati invio/loading/errore/clear history.
- Criterio di completamento: la chat non renderizza HTML non sanificato, mostra stato di caricamento e fallback leggibile, e la history locale puo' essere ripulita senza rompere il comportamento attuale.
- Livello di difficolta': alta.
- Rischi o prerequisiti: il flusso chat attuale usa `marked.parse(...)` e `innerHTML`, quindi la feature richiede una scelta esplicita sulla sanitizzazione o sul rendering testuale sicuro.
