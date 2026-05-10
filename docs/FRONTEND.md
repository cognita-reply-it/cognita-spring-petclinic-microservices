# Frontend Architecture

Il frontend e' una applicazione AngularJS legacy servita dal modulo
`spring-petclinic-api-gateway` come risorse statiche Spring Boot. Non esiste
una build JavaScript separata, non ci sono sorgenti TypeScript/React e non c'e'
un package manager Node nel flusso corrente: la shell HTML, gli script, i
template, il CSS e gli asset sono pubblicati direttamente da
`src/main/resources/static`.

## Struttura dei file statici

| Percorso | Ruolo |
| --- | --- |
| `spring-petclinic-api-gateway/src/main/resources/static/index.html` | shell principale AngularJS; include WebJars, script applicativi, `ui-view`, layout e chatbox |
| `.../static/scripts/app.js` | modulo root `petClinicApp`, configurazione UI Router, interceptor HTTP e fragment layout |
| `.../static/scripts/fragments/` | template statici `welcome.html`, `nav.html`, `footer.html` usati dai component `layout*` |
| `.../static/scripts/owner-list/` | modulo, state, controller, component e template della lista owners |
| `.../static/scripts/owner-details/` | modulo, state, controller, component e template dei dettagli owner |
| `.../static/scripts/owner-form/` | modulo, state, controller, component e template create/edit owner |
| `.../static/scripts/pet-form/` | modulo, state, controller, component e template create/edit pet |
| `.../static/scripts/visits/` | modulo, state, controller, component e template aggiunta visite |
| `.../static/scripts/vet-list/` | modulo, state, controller, component e template lista veterinari |
| `.../static/scripts/infrastructure/` | modulo `infrastructure` e interceptor globale `HttpErrorHandlingInterceptor` |
| `.../static/scripts/genai/chat.js` | widget chat GenAI imperativo, fuori dal ciclo component AngularJS |
| `.../static/css/` | CSS compilato servito come asset statico |
| `.../static/scss/` | sorgenti SCSS compilabili con profilo Maven `css` |
| `.../static/images/` | favicon, loghi e immagini usate da shell, welcome e footer |
| `.../static/fonts/` | font Montserrat e Varela Round serviti localmente |

## Shell e caricamento

`index.html` dichiara `ng-app="petClinicApp"` sull'elemento `<html>`.
Carica da WebJars:

- Bootstrap CSS e JS;
- AngularJS;
- Angular UI Router;
- Font Awesome;
- Marked.

Carica poi gli script applicativi uno per uno in ordine esplicito:
`app.js`, `genai/chat.js`, i moduli di feature, i controller, i component e
infine `infrastructure`. Non c'e' bundling.

La shell HTML monta:

- `<layout-nav></layout-nav>`;
- un contenitore Bootstrap con `<div ui-view=""></div>`;
- la chatbox GenAI fuori da `ui-view`;
- `<layout-footer></layout-footer>`.

Gli handler globali `window.onload = loadChatMessages` e
`window.onbeforeunload = saveChatMessages` collegano la chatbox a
`localStorage`.

## Moduli AngularJS

| Modulo | File | Dipendenze dichiarate | Scopo |
| --- | --- | --- | --- |
| `petClinicApp` | `scripts/app.js` | `ui.router`, `infrastructure`, `layoutNav`, `layoutFooter`, `layoutWelcome`, feature modules | modulo root e configurazione globale |
| `infrastructure` | `scripts/infrastructure/infrastructure.js` | nessuna | contenitore per l'interceptor HTTP |
| `layoutWelcome` | creato in `scripts/app.js` | nessuna | component `layoutWelcome` con `scripts/fragments/welcome.html` |
| `layoutNav` | creato in `scripts/app.js` | nessuna | component `layoutNav` con `scripts/fragments/nav.html` |
| `layoutFooter` | creato in `scripts/app.js` | nessuna | component `layoutFooter` con `scripts/fragments/footer.html` |
| `ownerList` | `scripts/owner-list/owner-list.js` | `ui.router` | state `owners` |
| `ownerDetails` | `scripts/owner-details/owner-details.js` | `ui.router` | state `ownerDetails` |
| `ownerForm` | `scripts/owner-form/owner-form.js` | `ui.router` | state `ownerNew` e `ownerEdit` |
| `petForm` | `scripts/pet-form/pet-form.js` | `ui.router` | state `petNew` e `petEdit` |
| `visits` | `scripts/visits/visits.js` | `ui.router` | state `visits` |
| `vetList` | `scripts/vet-list/vet-list.js` | `ui.router` | state `vets` |

`app.js` imposta anche:

- `Cache-Control: no-cache` come header comune AngularJS;
- `HttpErrorHandlingInterceptor` in `$httpProvider.interceptors`;
- hash prefix `!`;
- fallback route `$urlRouterProvider.otherwise('/welcome')`.

## Route UI

| State | URL AngularJS | Template inline dello state | Component | Modulo |
| --- | --- | --- | --- | --- |
| `app` | `''` | `<ui-view></ui-view>` | n/a | `petClinicApp` |
| `welcome` | `/welcome` | `<layout-welcome></layout-welcome>` | `layoutWelcome` | `petClinicApp` |
| `owners` | `/owners` | `<owner-list></owner-list>` | `ownerList` | `ownerList` |
| `ownerDetails` | `/owners/details/:ownerId` | `<owner-details></owner-details>` | `ownerDetails` | `ownerDetails` |
| `ownerNew` | `/owners/new` | `<owner-form></owner-form>` | `ownerForm` | `ownerForm` |
| `ownerEdit` | `/owners/:ownerId/edit` | `<owner-form></owner-form>` | `ownerForm` | `ownerForm` |
| `petNew` | `/owners/:ownerId/new-pet` | `<pet-form></pet-form>` | `petForm` | `petForm` |
| `petEdit` | `/owners/:ownerId/pets/:petId` | `<pet-form></pet-form>` | `petForm` | `petForm` |
| `visits` | `/owners/:ownerId/pets/:petId/visits` | `<visits></visits>` | `visits` | `visits` |
| `vets` | `/vets` | `<vet-list></vet-list>` | `vetList` | `vetList` |

La navbar usa `ui-sref` per `owners`, `ownerNew` e `vets`. Il link Home usa
`href="/"`; con la configurazione router attuale la route applicativa definita
per la home e' comunque `/welcome`.

## Controller, component e template

| Area | Controller | Component file | Template | Comportamento principale |
| --- | --- | --- | --- | --- |
| Owner list | `OwnerListController` | `scripts/owner-list/owner-list.component.js` | `scripts/owner-list/owner-list.template.html` | legge la lista owners e applica filtro client-side `filter:$ctrl.query` |
| Owner details | `OwnerDetailsController` | `scripts/owner-details/owner-details.component.js` | `scripts/owner-details/owner-details.template.html` | legge owner aggregato con pets e visits e mostra azioni edit/add |
| Owner form | `OwnerFormController` | `scripts/owner-form/owner-form.component.js` | `scripts/owner-form/owner-form.template.html` | inizializza create/edit owner e invia `POST` o `PUT` |
| Pet form | `PetFormController` | `scripts/pet-form/pet-form.component.js` | `scripts/pet-form/pet-form.template.html` | legge pet types, owner/pet corrente e invia `POST` o `PUT` |
| Visits | `VisitsController` | `scripts/visits/visits.component.js` | `scripts/visits/visits.template.html` | legge visite esistenti del pet e crea una nuova visita |
| Vet list | `VetListController` | `scripts/vet-list/vet-list.component.js` | `scripts/vet-list/vet-list.template.html` | legge e visualizza i veterinari |
| Layout welcome | n/a | generato in `scripts/app.js` | `scripts/fragments/welcome.html` | home statica |
| Layout nav | n/a | generato in `scripts/app.js` | `scripts/fragments/nav.html` | navigazione principale |
| Layout footer | n/a | generato in `scripts/app.js` | `scripts/fragments/footer.html` | footer con logo |

I component sono wrapper sottili: registrano `templateUrl` e controller, senza
binding espliciti.

## Mapping UI e API

Le chiamate sono costruite direttamente nei controller con `$http`, senza un
service layer AngularJS. La chatbox usa invece `fetch`.

| UI / file | Evento o momento | Metodo | URL chiamato dal browser | Gateway / servizio raggiunto | Note |
| --- | --- | --- | --- | --- | --- |
| `OwnerListController` | init controller | `GET` | `api/customer/owners` | route gateway `/api/customer/**` -> `customers-service`, endpoint reale `/owners` | popola `$ctrl.owners`; ricerca solo client-side nel template |
| `OwnerDetailsController` | init controller | `GET` | `api/gateway/owners/{ownerId}` | controller gateway `GET /api/gateway/owners/{ownerId}` | aggrega owner da customers e visits dal gateway |
| `OwnerFormController` | edit owner | `GET` | `api/customer/owners/{ownerId}` | `/api/customer/**` -> `customers-service`, endpoint reale `/owners/{ownerId}` | non eseguito in create |
| `OwnerFormController` | submit create | `POST` | `api/customer/owners` | `/api/customer/**` -> `customers-service`, endpoint reale `/owners` | al successo va allo state `owners` |
| `OwnerFormController` | submit edit | `PUT` | `api/customer/owners/{id}` | `/api/customer/**` -> `customers-service`, endpoint reale `/owners/{id}` | al successo va allo state `ownerDetails` |
| `PetFormController` | init controller | `GET` | `api/customer/petTypes` | `/api/customer/**` -> `customers-service`, endpoint reale `/petTypes` | eseguito prima della logica create/edit |
| `PetFormController` | create pet init | `GET` | `api/customer/owners/{ownerId}` | `/api/customer/**` -> `customers-service`, endpoint reale `/owners/{ownerId}` | usato per mostrare il nome owner |
| `PetFormController` | edit pet init | `GET` | `api/customer/owners/{ownerId}/pets/{petId}` | `/api/customer/**` -> `customers-service`, endpoint reale `/owners/{ownerId}/pets/{petId}` | converte `birthDate` in `Date` |
| `PetFormController` | submit create | `POST` | `api/customer/owners/{ownerId}/pets` | `/api/customer/**` -> `customers-service`, endpoint reale `/owners/{ownerId}/pets` | invia `id`, `name`, `birthDate`, `typeId` |
| `PetFormController` | submit edit | `PUT` | `api/customer/owners/{ownerId}/pets/{petId}` | `/api/customer/**` -> `customers-service`, endpoint reale `/owners/{ownerId}/pets/{petId}` | al successo torna a `ownerDetails` |
| `VisitsController` | init controller | `GET` | `api/visit/owners/{ownerId}/pets/{petId}/visits` | `/api/visit/**` -> `visits-service`, endpoint reale `/owners/{ownerId}/pets/{petId}/visits` | popola visite precedenti |
| `VisitsController` | submit | `POST` | `api/visit/owners/{ownerId}/pets/{petId}/visits` | `/api/visit/**` -> `visits-service`, endpoint reale `/owners/{ownerId}/pets/{petId}/visits` | formatta la data con `$filter('date')` |
| `VetListController` | init controller | `GET` | `api/vet/vets` | `/api/vet/**` -> `vets-service`, endpoint reale `/vets` | popola `$ctrl.vetList` |
| `chat.js` | send message | `POST` | `/api/genai/chatclient` | `/api/genai/**` -> `genai-service`, endpoint reale `/chatclient` | body JSON e risposta letta come testo |

Le route proxy del gateway sono in
`spring-petclinic-api-gateway/src/main/resources/application.yml`:

| Path pubblico | Destinazione | Filtro |
| --- | --- | --- |
| `/api/vet/**` | `lb://vets-service` | `StripPrefix=2` |
| `/api/visit/**` | `lb://visits-service` | `StripPrefix=2` |
| `/api/customer/**` | `lb://customers-service` | `StripPrefix=2` |
| `/api/genai/**` | `lb://genai-service` | `StripPrefix=2`, circuit breaker dedicato `genaiCircuitBreaker` |

## Chatbox GenAI

La chatbox non e' un modulo o componente AngularJS. E' DOM imperativo in
`static/scripts/genai/chat.js`, richiamato direttamente da attributi HTML in
`index.html`.

Funzioni globali definite:

- `appendMessage(message, type)`;
- `toggleChatbox()`;
- `sendMessage()`;
- `handleKeyPress(event)`;
- `saveChatMessages()`;
- `loadChatMessages()`.

Comportamento attuale:

- il bottone header chiama `toggleChatbox()`;
- l'input invia con `Enter` tramite `handleKeyPress(event)`;
- il bottone Send chiama `sendMessage()`;
- `sendMessage()` scarta input vuoti, aggiunge il messaggio user e invia
  `fetch('/api/genai/chatclient', { method: 'POST', body: JSON.stringify(query) })`;
- la risposta del servizio viene letta con `response.text()` e visualizzata come
  messaggio bot;
- in caso di errore viene mostrato `Chat is currently unavailable`;
- `appendMessage()` converte Markdown in HTML con `marked.parse(message)` e poi
  assegna `messageElement.innerHTML`;
- `saveChatMessages()` salva l'`innerHTML` del contenitore in `localStorage`;
- `loadChatMessages()` ripristina lo stesso HTML da `localStorage`.

Questo comportamento va tenuto presente quando si modifica la chat: la sua
surface non passa da AngularJS, non usa `$http` e oggi conserva HTML renderizzato
in local storage.

## Error handling frontend

`HttpErrorHandlingInterceptor` e' registrato globalmente da `app.js`. In caso di
errore HTTP tenta di leggere:

- `response.data.error`;
- `response.data.errors`, trattato come array di errori con `field` e
  `defaultMessage`.

Il messaggio viene mostrato con `alert(...)` e l'interceptor restituisce
`response`. I template dei form contengono validazioni AngularJS locali
(`required`, pattern telephone, input date), ma non hanno un rendering inline
ricco per gli errori backend.

## Template e navigazione

| Template | Uso UI | Link o azioni rilevanti |
| --- | --- | --- |
| `scripts/fragments/nav.html` | navbar | Home `href="/"`, `owners`, `ownerNew`, `vets` |
| `scripts/fragments/welcome.html` | home | immagine `images/pets.png` |
| `scripts/fragments/footer.html` | footer | immagine `/images/spring-pivotal-logo.png` |
| `scripts/owner-list/owner-list.template.html` | tabella owners | link a `ownerDetails({ ownerId: owner.id })` |
| `scripts/owner-details/owner-details.template.html` | dettagli owner, pets e visits | link a `ownerEdit`, `petNew`, `petEdit`, `visits` |
| `scripts/owner-form/owner-form.template.html` | create/edit owner | submit con `$ctrl.submitOwnerForm()` |
| `scripts/pet-form/pet-form.template.html` | create/edit pet | submit con `$ctrl.submit()` |
| `scripts/visits/visits.template.html` | form nuova visita e lista visite precedenti | submit con `$ctrl.submit()` |
| `scripts/vet-list/vet-list.template.html` | tabella veterinari | nessuna navigazione interna |

## Asset e CSS

`index.html` carica direttamente:

- `/webjars/bootstrap/css/bootstrap.min.css`;
- `/css/petclinic.css`;
- `/webjars/font-awesome/css/font-awesome.min.css`.

La directory `static/css/` contiene anche `header.css`, `responsive.css` e
`typography.css`, ma la shell attuale include solo `petclinic.css` oltre ai CSS
WebJars. I sorgenti corrispondenti sono in `static/scss/`.

Asset statici presenti:

| Directory/file | Uso osservato |
| --- | --- |
| `static/images/favicon.png` | favicon in `index.html` |
| `static/images/pets.png` | immagine welcome |
| `static/images/spring-pivotal-logo.png` | footer |
| `static/images/platform-bg.png` | referenziato dal CSS compilato |
| `static/images/spring-logo-dataflow.png` e `spring-logo-dataflow-mobile.png` | referenziati dal CSS compilato |
| `static/fonts/montserrat-webfont.*` | font custom referenziato da CSS |
| `static/fonts/varela_round-webfont.*` | font custom referenziato da CSS |

## Processo build CSS

Il modulo gateway ha un profilo Maven `css` in
`spring-petclinic-api-gateway/pom.xml`.

Il profilo:

1. usa `maven-dependency-plugin` in fase `generate-resources` per estrarre gli
   SCSS Bootstrap dal WebJar `org.webjars.npm:bootstrap`;
2. usa `libsass-maven-plugin` in fase `generate-resources`;
3. compila da
   `spring-petclinic-api-gateway/src/main/resources/static/scss/`;
4. scrive in
   `spring-petclinic-api-gateway/src/main/resources/static/css/`;
5. aggiunge come include path gli SCSS Bootstrap estratti in `target/webjars`.

Comando mirato:

```bash
./mvnw -pl spring-petclinic-api-gateway generate-resources -P css
```

Per la sola modifica di template o controller non serve questo processo.

## Validazione delle referenze

La tabella sotto riporta i file controller/component/template citati e verificati
nel repository.

| Elemento citato | File verificato |
| --- | --- |
| `OwnerListController` | `spring-petclinic-api-gateway/src/main/resources/static/scripts/owner-list/owner-list.controller.js` |
| `ownerList` component | `spring-petclinic-api-gateway/src/main/resources/static/scripts/owner-list/owner-list.component.js` |
| owner list template | `spring-petclinic-api-gateway/src/main/resources/static/scripts/owner-list/owner-list.template.html` |
| `OwnerDetailsController` | `spring-petclinic-api-gateway/src/main/resources/static/scripts/owner-details/owner-details.controller.js` |
| `ownerDetails` component | `spring-petclinic-api-gateway/src/main/resources/static/scripts/owner-details/owner-details.component.js` |
| owner details template | `spring-petclinic-api-gateway/src/main/resources/static/scripts/owner-details/owner-details.template.html` |
| `OwnerFormController` | `spring-petclinic-api-gateway/src/main/resources/static/scripts/owner-form/owner-form.controller.js` |
| `ownerForm` component | `spring-petclinic-api-gateway/src/main/resources/static/scripts/owner-form/owner-form.component.js` |
| owner form template | `spring-petclinic-api-gateway/src/main/resources/static/scripts/owner-form/owner-form.template.html` |
| `PetFormController` | `spring-petclinic-api-gateway/src/main/resources/static/scripts/pet-form/pet-form.controller.js` |
| `petForm` component | `spring-petclinic-api-gateway/src/main/resources/static/scripts/pet-form/pet-form.component.js` |
| pet form template | `spring-petclinic-api-gateway/src/main/resources/static/scripts/pet-form/pet-form.template.html` |
| `VisitsController` | `spring-petclinic-api-gateway/src/main/resources/static/scripts/visits/visits.controller.js` |
| `visits` component | `spring-petclinic-api-gateway/src/main/resources/static/scripts/visits/visits.component.js` |
| visits template | `spring-petclinic-api-gateway/src/main/resources/static/scripts/visits/visits.template.html` |
| `VetListController` | `spring-petclinic-api-gateway/src/main/resources/static/scripts/vet-list/vet-list.controller.js` |
| `vetList` component | `spring-petclinic-api-gateway/src/main/resources/static/scripts/vet-list/vet-list.component.js` |
| vet list template | `spring-petclinic-api-gateway/src/main/resources/static/scripts/vet-list/vet-list.template.html` |
| layout welcome template | `spring-petclinic-api-gateway/src/main/resources/static/scripts/fragments/welcome.html` |
| layout nav template | `spring-petclinic-api-gateway/src/main/resources/static/scripts/fragments/nav.html` |
| layout footer template | `spring-petclinic-api-gateway/src/main/resources/static/scripts/fragments/footer.html` |
| GenAI chatbox script | `spring-petclinic-api-gateway/src/main/resources/static/scripts/genai/chat.js` |

Questa documentazione e' stata validata tramite lettura statica di
`index.html`, moduli AngularJS, controller, component, template, `chat.js`,
`application.yml`, `ApiGatewayController`, `FallbackController` e POM del
gateway. Non implica avvio runtime o verifica browser.
