# browserControl

Модуль для управления браузером, предоставляющий интерфейсы из [WebExtensions], основанный на WebSockets.
Протестирован и использован в Firefox. Клиентская часть - расширение браузера, имеющее перспективу использования
в других веб-обозревателях.

## Установка

Система состоит из модуля для node.js и расширения браузера.
Перед сборкой необходимо установить зависимости, выполнив `npm install` в папке project.

Для установи серверной части требуется создать npm пакет, перейдя в каталог project/building/npmPackage/,
и выполнить скрипт оболочки createNpmPackage.sh. После в данной папке появится файл browserControl.package.tar.xz,
который можно установить в другом модуле менеджером пакетов командой `npm install path/to/browserControlPackage`.

Для установки клиентской части - расширения браузера, требуется создать файл дополнения xpi,
перейдя в каталог project/building/clientExtension/, и выполнить скрипт оболочки createExtension.sh.
После в данной папке появится файл browserControl.xpi. Затем установить собранное расширение в браузер.
Перед этим требуется проверить свойство xpinstall.signatures.required,
управляющее установкой дополнений без цифровых подписей mozilla, запустив веб-обозреватель,
перейдя на страницу about:config. Значение указанного параметра должно быть false.

## Использование

### Пример:

```js
import launcher from "browserControl";

(async function() {
  const browser = await launcher.launch("path/to/browser/or/command");

  await browser.proxy.settings.set({
    value: {
      proxyDNS: true,
      socks: "socks5://123.45.67.89:1011"
    }
  });

  await browser.webNavigation.onCompleted.addListener(function(details) {
    console.log("Загружена вкладка: ", details.url);
  });
  const tabs = browser.tabs;

  const tabId = (await tabs.create({
    url: "https://codernet.ru"
  })).id;

  const resultsFromFrames = await tabs.executeScript(tabId, {
    code: "'do something in tab'",
    runAt: "document_idle"
  });
  await tabs.remove(tabId);

  //...
})();
```

### Асинхронность

Все методы интерфейсов [WebExtensions] являются асинхронными, возвращают Promise,
включая методы объектов событий (addListener, removeListener, hasListener).

### События

API [WebExtensions] предоставляет информационные события (например, browser.tabs.onRemoved) и интерактивные.
Примером второго является browser.runtime.onMessage,
обработчик которого может отправить ответ на входящее сообщение.
BrowserControl может устанавливать два вида обработчиков для интерактивных событий:

* активные - с возможностью взаимодействия
* пассивные - без возможности взаимодействия

По умолчанию обработчик считается пассивным, наблюдающим.
Второй параметр isListenerActive метода addListener задаёт, является ли обработчик активным.
Пример:

```js
await browser.runtime.onMessage.addListener(function logMessage(data, sender, _) {
  console.log("Получено сообщение: \"", data, "\".");
  const sendResponse = _;
  console.log("является sendResponse функцией: ", typeof sendResponse === "function"); // false
});

const listenerIsActive = true;

await browser.runtime.onMessage.addListener(function(data, sender, sendResponse) {
  console.log("является sendResponse функцией: ", typeof sendResponse === "function"); // true
  const response = data.toUpperCase();
  sendResponse(response);
}, listenerIsActive);
```

### Фильтры событий

Объекты события часто принимают параметры для фильтрации происходящий событий,
например browser.webNavigation.onCompleted. Передача фильтров аналогична использованию в браузере:

```js
await browser.webNavigation.onCompleted.addListener(listener, {
  url: [
    {hostContains: "example.com"},
    {hostPrefix: "developer"}
  ]
});
```

Фильтры для интерактивных событий указываются после второго параметра isListenerActive.

### Обработка ошибок

Исключения, произошедшие в браузере, обрабатываются обычным способом:

```js
const malformedParam = {url: "abcd:/efgh"};
try {
  await browser.tabs.create(malformedParam);
} catch(error) {
  // ...
}
```

Ошибки, возникшие удалённо, имеют свойство sourceStack, содержащее исходный стек клиента.
Импорт указанного исключения возможен при задании пути browserControl/RemoteError:

```js
import RemoteBrowserError from "browserControl/RemoteError";
```

## Запуск тестов

Процессу тестирования необходимо наличие зависимостей, устанавливаемых командой `npm install` в папке project/.
Для проверки модулей требуется открыть оболочку и выполнить `npm test`.

В папке project/src/tests/checkBrowserControl/ находится js скрипт, тестирующий систему целиком.
Для выполнения данной проверки требуется запустить сценарий, передав в качестве параметра
команду для запуска браузера с установленным расширением browserControl,
например `node checkBrowserControl path/to/waterfox`.

## Ссылки

* [Документация об API](/doc/API.md)
* [Расширение API браузера и создание дополнений](/doc/expandingAPI.md)
* [Использование дополнения в других браузерах](/doc/usageWithOtherBrowsers.md)

## Лицензия

[Apache-2.0](http://www.apache.org/licenses/LICENSE-2.0)

## Поддержка

- Bitcoin Cash: qruf96kpx63dqz46flu453xxkpq5e7wlpgpl2zdnx8
- Ethereum: 0x8dF38FfBd066Ba49EE059cda8668330304CECD57
- Litecoin: ltc1quygsxll92wwn88hx2rper3p9eq0ez49qu4tj5w
- Polkadot: 14GqUGDwGzowm92n9xaiD5R2miPxrEdtXPxgkCtar2vw18yn

[WebExtensions]: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions
