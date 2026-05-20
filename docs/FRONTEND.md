# Frontend AngularJS servito dall'API Gateway

Questo documento descrive il frontend legacy AngularJS pubblicato da
`spring-petclinic-api-gateway`. L'obiettivo e' rendere modificabile la UI
attuale senza dover riscoprire struttura, route, controller, template e chiamate
API. Non descrive una migrazione o una riscrittura del frontend.

## Punto di ingresso e serving statico

Il frontend e' servito dall'API Gateway Spring Boot/WebFlux come risorse statiche
classpath sotto:

```text
spring-petclinic-api-gateway/src/main/resources/static/
```

Il punto di ingresso e':

```text
spring-petclinic-api-gateway/src/main/resources/static/index.html
```

`ApiGatewayApplication.routerFunction()` espone le risorse statiche con
`RouterFunctions.resources("/**", new ClassPathResource("static/"))` e serve
`index.html` su `GET /`. La UI usa URL hash AngularJS con prefisso `#!`, quindi
le route applicative vivono lato browser.

`index.html` dichiara `ng-app="petClinicApp"` e carica, in ordine:

- CSS da WebJars: `/webjars/bootstrap/css/bootstrap.min.css`,
  `/webjars/font-awesome/css/font-awesome.min.css`.
- CSS locale: `/css/petclinic.css`.
- JavaScript da WebJars: Bootstrap, AngularJS, Angular UI Router, Marked.
- JavaScript applicativo sotto `/scripts/**`.
- Markup shell: `<layout-nav>`, un contenitore `<div ui-view="">`, la chatbox
  GenAI e `<layout-footer>`.

## Struttura dei file statici

```text
spring-petclinic-api-gateway/src/main/resources/static/
|-- index.html
|-- css/
|   |-- header.css
|   |-- petclinic.css
|   |-- responsive.css
|   `-- typography.css
|-- fonts/
|   |-- montserrat-webfont.*
|   `-- varela_round-webfont.*
|-- images/
|   |-- favicon.png
|   |-- pets.png
|   |-- platform-bg.png
|   |-- spring-logo-dataflow-mobile.png
|   |-- spring-logo-dataflow.png
|   `-- spring-pivotal-logo.png
|-- scripts/
|   |-- app.js
|   |-- fragments/
|   |   |-- footer.html
|   |   |-- nav.html
|   |   `-- welcome.html
|   |-- genai/chat.js
|   |-- infrastructure/
|   |   |-- httpErrorHandlingInterceptor.js
|   |   `-- infrastructure.js
|   |-- owner-details/
|   |-- owner-form/
|   |-- owner-list/
|   |-- pet-form/
|   |-- vet-list/
|   `-- visits/
`-- scss/
    |-- header.scss
    |-- petclinic.scss
    |-- responsive.scss
    `-- typography.scss
```

Ogni feature AngularJS sotto `scripts/<feature>/` segue lo stesso schema:

```text
<feature>.js              modulo AngularJS e route ui-router
<feature>.controller.js   controller AngularJS
<feature>.component.js    component con templateUrl e controller
<feature>.template.html   template HTML del component
```

## Moduli AngularJS

Il modulo root e' `petClinicApp`, definito in `scripts/app.js`.

| Modulo | File | Dipendenze | Responsabilita' |
| --- | --- | --- | --- |
| `petClinicApp` | `scripts/app.js` | `ui.router`, `infrastructure`, layout e moduli feature | Configura cache header, interceptor HTTP, hash prefix `!`, fallback `/welcome` e stato base `app`. |
| `infrastructure` | `scripts/infrastructure/infrastructure.js` | nessuna | Contenitore per servizi infrastrutturali. |
| `layoutNav` | `scripts/app.js` | nessuna | Component nav con template `scripts/fragments/nav.html`. |
| `layoutFooter` | `scripts/app.js` | nessuna | Component footer con template `scripts/fragments/footer.html`. |
| `layoutWelcome` | `scripts/app.js` | nessuna | Component welcome con template `scripts/fragments/welcome.html`. |
| `ownerList` | `scripts/owner-list/owner-list.js` | `ui.router` | Stato lista proprietari. |
| `ownerDetails` | `scripts/owner-details/owner-details.js` | `ui.router` | Stato dettaglio proprietario con visite aggregate. |
| `ownerForm` | `scripts/owner-form/owner-form.js` | `ui.router` | Stati creazione e modifica proprietario. |
| `petForm` | `scripts/pet-form/pet-form.js` | `ui.router` | Stati creazione e modifica animale. |
| `visits` | `scripts/visits/visits.js` | `ui.router` | Stato creazione visita e lista visite precedenti del pet. |
| `vetList` | `scripts/vet-list/vet-list.js` | `ui.router` | Stato lista veterinari. |

`HttpErrorHandlingInterceptor` e' registrato in `scripts/app.js` tramite
`$httpProvider.interceptors.push('HttpErrorHandlingInterceptor')`. In caso di
errore HTTP prova a mostrare `response.data.error` e la lista
`response.data.errors`.

## Route UI

La UI usa Angular UI Router. La configurazione comune e' in `scripts/app.js`:

- `$locationProvider.hashPrefix('!')`
- `$urlRouterProvider.otherwise('/welcome')`
- stato astratto `app`
- stato `welcome` su `/welcome`

| Stato ui-router | URL hash | Component/template renderizzato | File route |
| --- | --- | --- | --- |
| `welcome` | `#!/welcome` | `<layout-welcome>` -> `scripts/fragments/welcome.html` | `scripts/app.js` |
| `owners` | `#!/owners` | `<owner-list>` -> `scripts/owner-list/owner-list.template.html` | `scripts/owner-list/owner-list.js` |
| `ownerDetails` | `#!/owners/details/:ownerId` | `<owner-details>` -> `scripts/owner-details/owner-details.template.html` | `scripts/owner-details/owner-details.js` |
| `ownerNew` | `#!/owners/new` | `<owner-form>` -> `scripts/owner-form/owner-form.template.html` | `scripts/owner-form/owner-form.js` |
| `ownerEdit` | `#!/owners/:ownerId/edit` | `<owner-form>` -> `scripts/owner-form/owner-form.template.html` | `scripts/owner-form/owner-form.js` |
| `petNew` | `#!/owners/:ownerId/new-pet` | `<pet-form>` -> `scripts/pet-form/pet-form.template.html` | `scripts/pet-form/pet-form.js` |
| `petEdit` | `#!/owners/:ownerId/pets/:petId` | `<pet-form>` -> `scripts/pet-form/pet-form.template.html` | `scripts/pet-form/pet-form.js` |
| `visits` | `#!/owners/:ownerId/pets/:petId/visits` | `<visits>` -> `scripts/visits/visits.template.html` | `scripts/visits/visits.js` |
| `vets` | `#!/vets` | `<vet-list>` -> `scripts/vet-list/vet-list.template.html` | `scripts/vet-list/vet-list.js` |

La navigazione principale e' in `scripts/fragments/nav.html`:

- Home usa `href="/"`, quindi torna alla root servita dall'API Gateway.
- Find owners usa `ui-sref="owners"`.
- Register owner usa `ui-sref="ownerNew"`.
- Veterinarians usa `ui-sref="vets"`.

## Controller, component e template

| Area | Modulo | Component | Controller | Template |
| --- | --- | --- | --- | --- |
| Lista proprietari | `ownerList` | `scripts/owner-list/owner-list.component.js` | `scripts/owner-list/owner-list.controller.js` (`OwnerListController`) | `scripts/owner-list/owner-list.template.html` |
| Dettaglio proprietario | `ownerDetails` | `scripts/owner-details/owner-details.component.js` | `scripts/owner-details/owner-details.controller.js` (`OwnerDetailsController`) | `scripts/owner-details/owner-details.template.html` |
| Form proprietario | `ownerForm` | `scripts/owner-form/owner-form.component.js` | `scripts/owner-form/owner-form.controller.js` (`OwnerFormController`) | `scripts/owner-form/owner-form.template.html` |
| Form animale | `petForm` | `scripts/pet-form/pet-form.component.js` | `scripts/pet-form/pet-form.controller.js` (`PetFormController`) | `scripts/pet-form/pet-form.template.html` |
| Visite | `visits` | `scripts/visits/visits.component.js` | `scripts/visits/visits.controller.js` (`VisitsController`) | `scripts/visits/visits.template.html` |
| Veterinari | `vetList` | `scripts/vet-list/vet-list.component.js` | `scripts/vet-list/vet-list.controller.js` (`VetListController`) | `scripts/vet-list/vet-list.template.html` |
| Header | `layoutNav` | definito dinamicamente in `scripts/app.js` | nessuno | `scripts/fragments/nav.html` |
| Footer | `layoutFooter` | definito dinamicamente in `scripts/app.js` | nessuno | `scripts/fragments/footer.html` |
| Welcome | `layoutWelcome` | definito dinamicamente in `scripts/app.js` | nessuno | `scripts/fragments/welcome.html` |

## Mapping UI e API

L'API Gateway instrada i prefissi in `application.yml`:

| Prefisso chiamato dalla UI | Servizio di destinazione | Trasformazione gateway |
| --- | --- | --- |
| `/api/customer/**` | `lb://customers-service` | `StripPrefix=2`, quindi `/api/customer/owners` diventa `/owners`. |
| `/api/vet/**` | `lb://vets-service` | `StripPrefix=2`, quindi `/api/vet/vets` diventa `/vets`. |
| `/api/visit/**` | `lb://visits-service` | `StripPrefix=2`, quindi `/api/visit/...` perde `/api/visit`. |
| `/api/genai/**` | `lb://genai-service` | `StripPrefix=2` piu' circuit breaker dedicato `genaiCircuitBreaker`. |
| `/api/gateway/**` | Controller locale API Gateway | Gestito da `ApiGatewayController`, non da una route Spring Cloud Gateway. |

Le chiamate fatte direttamente dal frontend sono:

| UI / azione | Controller JS | Metodo e URL chiamato dalla UI | Endpoint backend effettivo | Note |
| --- | --- | --- | --- | --- |
| Apertura lista proprietari `owners` | `OwnerListController` | `GET api/customer/owners` | `customers-service GET /owners` | Popola `$ctrl.owners`; il template filtra localmente con `filter:$ctrl.query`. |
| Apertura dettaglio proprietario `ownerDetails` | `OwnerDetailsController` | `GET api/gateway/owners/{ownerId}` | `ApiGatewayController GET /api/gateway/owners/{ownerId}` | Il gateway chiama `customers-service /owners/{ownerId}` e `visits-service /pets/visits?petId=...`, poi compone owner + visits. |
| Apertura modifica proprietario `ownerEdit` | `OwnerFormController` | `GET api/customer/owners/{ownerId}` | `customers-service GET /owners/{ownerId}` | Usato solo quando esiste `$stateParams.ownerId`. |
| Submit modifica proprietario | `OwnerFormController` | `PUT api/customer/owners/{id}` | `customers-service PUT /owners/{id}` | Dopo il salvataggio naviga a `ownerDetails`. |
| Submit nuovo proprietario | `OwnerFormController` | `POST api/customer/owners` | `customers-service POST /owners` | Dopo il salvataggio naviga a `owners`. |
| Apertura form pet | `PetFormController` | `GET api/customer/petTypes` | `customers-service GET /petTypes` | Carica sempre i tipi prima di preparare il form. |
| Nuovo pet: recupero owner | `PetFormController` | `GET api/customer/owners/{ownerId}` | `customers-service GET /owners/{ownerId}` | Mostra nome e cognome owner nel form. |
| Modifica pet: recupero pet | `PetFormController` | `GET api/customer/owners/{ownerId}/pets/{petId}` | `customers-service GET /owners/*/pets/{petId}` | Il backend ignora l'id owner nel mapping con wildcard `*`. |
| Submit modifica pet | `PetFormController` | `PUT api/customer/owners/{ownerId}/pets/{petId}` | `customers-service PUT /owners/*/pets/{petId}` | Invia `id`, `name`, `birthDate`, `typeId`; poi torna a `ownerDetails`. |
| Submit nuovo pet | `PetFormController` | `POST api/customer/owners/{ownerId}/pets` | `customers-service POST /owners/{ownerId}/pets` | Invia `id: 0`, `name`, `birthDate`, `typeId`; poi torna a `ownerDetails`. |
| Apertura visite pet | `VisitsController` | `GET api/visit/owners/{ownerId}/pets/{petId}/visits` | `visits-service GET /owners/*/pets/{petId}/visits` | Mostra le visite precedenti. |
| Submit nuova visita | `VisitsController` | `POST api/visit/owners/{ownerId}/pets/{petId}/visits` | `visits-service POST /owners/*/pets/{petId}/visits` | Invia `date` formattata `yyyy-MM-dd` e `description`; poi torna a `ownerDetails`. |
| Apertura lista veterinari `vets` | `VetListController` | `GET api/vet/vets` | `vets-service GET /vets` | Popola `$ctrl.vetList`. |
| Invio messaggio chatbox | `scripts/genai/chat.js` | `POST /api/genai/chatclient` | `genai-service POST /chatclient` | Usa `fetch`, non `$http`; invia il testo come JSON string. |

## Chatbox GenAI

La chatbox non e' un modulo AngularJS. E' markup statico in `index.html` piu'
funzioni globali in `scripts/genai/chat.js`.

Elementi principali in `index.html`:

- `#chatbox`
- `#chatbox-content`
- `#chatbox-messages`
- `#chatbox-input`

Funzioni JavaScript globali:

| Funzione | Responsabilita' |
| --- | --- |
| `toggleChatbox()` | Aggiunge/rimuove la classe `minimized` e cambia l'altezza del contenuto. |
| `sendMessage()` | Legge l'input, aggiunge il messaggio utente, invia `POST /api/genai/chatclient`, aggiunge la risposta bot o un fallback locale. |
| `appendMessage(message, type)` | Crea una bubble, converte Markdown in HTML con `marked.parse()` e scrolla il box in basso. |
| `handleKeyPress(event)` | Su `Enter` blocca il default e chiama `sendMessage()`. |
| `saveChatMessages()` | Salva `#chatbox-messages.innerHTML` in `localStorage.chatMessages`. |
| `loadChatMessages()` | Ripristina `localStorage.chatMessages` nel contenitore messaggi. |

`index.html` collega `window.onload = loadChatMessages` e
`window.onbeforeunload = saveChatMessages`. La libreria Marked viene caricata da
WebJars con `/webjars/marked/marked.min.js`.

Il fallback infrastrutturale della route GenAI e' configurato in
`application.yml` con `CircuitBreaker=name=genaiCircuitBreaker,fallbackUri=/fallback`;
`FallbackController` espone `POST /fallback` e restituisce HTTP 503 con un
messaggio testuale. `chat.js` ha anche un fallback client-side nel blocco
`.catch()`.

## Asset e CSS

Gli asset statici sono tutti sotto `static/`.

- `images/favicon.png` e' referenziato da `index.html`.
- `images/pets.png` e' usato dal welcome fragment.
- `images/spring-pivotal-logo.png` e' usato dal footer fragment.
- `images/spring-logo-dataflow.png` e
  `images/spring-logo-dataflow-mobile.png` sono usati da header CSS/SCSS.
- `fonts/montserrat-webfont.*` e `fonts/varela_round-webfont.*` sono dichiarati
  in `typography.scss` e nel CSS compilato.

`index.html` carica solo `/css/petclinic.css` tra i CSS locali. Questo file
include Bootstrap compilato e le regole applicative, incluse le regole della
chatbox. Gli altri file CSS locali (`header.css`, `responsive.css`,
`typography.css`) esistono come output separati ma non sono linkati direttamente
da `index.html`.

Le sorgenti SCSS sono:

- `scss/petclinic.scss`: importa Bootstrap, definisce variabili Spring
  PetClinic, stili base, stili chatbox e importa `typography.scss`,
  `header.scss`, `responsive.scss`.
- `scss/header.scss`: navbar e logo.
- `scss/typography.scss`: font-face e stili tipografici.
- `scss/responsive.scss`: regole responsive residue.

## Processo di build CSS

Il build CSS e' opzionale ed e' definito nel profilo Maven `css` di:

```text
spring-petclinic-api-gateway/pom.xml
```

Il profilo:

1. usa `maven-dependency-plugin` in `generate-resources` per unpackare Bootstrap
   WebJar in `target/webjars`;
2. usa `com.gitlab.haynes:libsass-maven-plugin` in `generate-resources`;
3. compila da
   `src/main/resources/static/scss/`
   verso
   `src/main/resources/static/css/`;
4. passa come include path gli SCSS Bootstrap unpackati in
   `target/webjars/META-INF/resources/webjars/bootstrap/${webjars-bootstrap.version}/scss/`.

Comando mirato per rigenerare il CSS dell'API Gateway:

```bash
./mvnw -pl spring-petclinic-api-gateway -Pcss generate-resources
```

Il normale avvio dell'app serve i CSS gia' presenti sotto `static/css`; non c'e'
un bundler JavaScript o una pipeline npm nel frontend attuale.

## Note operative per modifiche

- Aggiungere una nuova vista AngularJS significa normalmente creare una cartella
  sotto `scripts/`, registrare il modulo in `petClinicApp`, caricare i tre file
  JS in `index.html` e aggiungere uno stato `$stateProvider`.
- Aggiungere o cambiare una chiamata API richiede verificare sia il prefisso
  usato dalla UI sia il mapping Spring Cloud Gateway in `application.yml`.
- Le route `/api/customer/**`, `/api/vet/**`, `/api/visit/**` e
  `/api/genai/**` vengono riscritte con `StripPrefix=2`; `/api/gateway/**` e'
  codice locale dell'API Gateway.
- La chatbox GenAI e' volutamente fuori dal ciclo AngularJS: modifiche a input,
  persistenza o rendering Markdown vanno fatte in `scripts/genai/chat.js` e nel
  markup di `index.html`.
- Prima di rinominare un controller, un component o un template, controllare sia
  il file `*.component.js` sia la tabella delle route sopra, perche' i
  `templateUrl` sono stringhe statiche.
