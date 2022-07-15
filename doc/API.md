# Документация по API browserControl

##### Содержание

- [Класс: Launcher](#класс-launcher)
    - launch(command[, maxTimeMsForWaiting])
    - setPort(port)
- [Класс: Browser](#класс-browser)
    - getProcess()
    - setDisconnectListener(listener)
    - статичный класс RemoteError
    - экспортируемый API [WebExtensions]

### Класс Launcher

Запускающий браузер класс, экземпляр которого предоставляется в экспорте по умолчанию:
`import launcher from "browserControl"`.

#### launcher.launch(command[, maxTimeMsForWaiting])

* `command <string>` Команда для запуска браузера с установленным расширением browserControl
* `maxTimeMsForWaiting <number>` Наибольшее время в миллисекундах ожидания запуска процесса браузера и подключения
WebSocket клиента дополнения. Опциональный параметр. По умолчанию 8000.
* Возвращает `<Promise<Browser>>`

Запускает браузер. При параллельном запуске могут возникнуть проблемы:

```js
const [firefox, waterfox] = await Promise.all(["firefox", "path/to/waterfox"].map(command =>
  launcher.launch(command)
));
```

В данном примере ссылка `firefox` будет указывать на браузер waterfox, ссылка `waterfox` - на firefox,
если браузер waterfox запустится раньше (или расширение в waterfox установит соединение первым).

#### setPort(port)

* `port <number>` Порт для WebSocket сервера

Устанавливает порт для будущего запуска внутреннего WebSocket сервера.
По умолчанию порт равен 45678. Метод вызывается перед первым применением запускающей браузер функции launch.
Переназначение порта WebSocket сервера по умолчанию в расширении browserControl осуществляется на странице настроек.

### Класс Browser

Предоставляющий экспортируемый браузером API класс.

### getProcess()

* Возвращает <[ChildProcess](https://nodejs.org/api/child_process.html#class-childprocess)>

Ссылка на процесс используемого браузера.

### setDisconnectListener(listener)

* `listener <function>` обработчик события

Устанавливает обработчик события, происходящего при закрытии или потере соединения с WebSocket клиентом браузера.
Ссылка `this` внутри обработчика указывает на объект класса Browser.

### Статичный класс RemoteError

Класс, предназначенный для ошибок, внутренне возникших в браузере, переданных стороне на node.js. Получение данного
типа осуществляется за счёт указания пути "browserControl/RemoteError" при импорте:
`import RemoteError from "browserControl/RemoteError"`.

#### message

* `<string>`

Исходное сообщение об ошибке со стороны клиента.

#### sourceStack

* `<string>`

Исходный стек вызовов со стороны клиента.

### Экспортируемый API [WebExtensions]

Класс Browser предоставляет часть API [WebExtensions], при использовании которого важно помнить, что все методы
являются асинхронными - возвращают Promise.

Список реализованных интерфейсов и методов [WebExtensions] со ссылками на документацию c MDN:

- [cookies](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/cookies)
    * [get](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/cookies/get)
    * [getAll](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/cookies/getAll)
    * [getAllCookieStores](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/cookies/getAllCookieStores)
    * [remove](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/cookies/remove)
    * [set](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/cookies/set)
    * [onChanged](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/cookies/onChanged)
- [privacy](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/privacy)
    - [network](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/privacy/network)
        * networkPredictionEnabled
        * peerConnectionEnabled
        * webRTCIPHandlingPolicy
        * httpsOnlyMode
    - [websites](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/privacy/websites)
        * cookieConfig
        * firstPartyIsolate
        * hyperlinkAuditingEnabled
        * referrersEnabled
        * resistFingerprinting
        * trackingProtectionMode
- [proxy](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/proxy)
    - [settings](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/proxy/settings)
- [runtime](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime)
    * [getBrowserInfo](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/getBrowserInfo)
    * [sendMessage](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/sendMessage)
    * [onMessage](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage)
    * [onMessageExternal](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessageExternal)
- [tabs](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs)
    * [create](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/create)
    * [detectLanguage](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/detectLanguage)
    * [duplicate](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/duplicate)
    * [executeScript](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/executeScript)
    * [get](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/get)
    * [insertCSS](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/insertCSS)
    * [query](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/query)
    * [reload](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/reload)
    * [remove](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/remove)
    * [removeCSS](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/removeCSS)
    * [sendMessage](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/sendMessage)
    * [update](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/update)
    * [onActivated](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/onActivated)
    * [onCreated](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/onCreated)
    * [onRemoved](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/onRemoved)
    * [onUpdated](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/onUpdated)
- [webNavigation](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webNavigation)
    * [onBeforeNavigate](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webNavigation/onBeforeNavigate)
    * [onCompleted](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webNavigation/onCompleted)
    * [onDOMContentLoaded](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webNavigation/onDOMContentLoaded)
    * [onErrorOccurred](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webNavigation/onErrorOccurred)
- [windows](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/windows)
    * [create](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/windows/create)
    * [get](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/windows/get)
    * [getAll](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/windows/getAll)
    * [getCurrent](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/windows/getCurrent)
    * [remove](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/windows/remove)
    * [update](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/windows/update)
    * [onCreated](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/windows/onCreated)

[WebExtensions]: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions
