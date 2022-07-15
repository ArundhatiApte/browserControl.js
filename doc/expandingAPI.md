# Расширение API

Внутренне в системе browserControl сервер передаёт запросы на вызов методов клиенту, отправляющему ответы и сообщения
о событиях. Экспортируемый браузером API можно расширить, изменив описание интерфейса, находящегося в файле
[descriptionOfBrowserExportedApi.js](project/src/clientExtension/background/descriptionOfBrowserExportedApi.js),
предоставляющее собой структуру, состоящую из дескрипторов методов и событий.
Пример описания API:

```js
const description = {
  tabs: {
    // ссылка на объект всегда указывается
    link: browser.tabs,
    create: {
      link: browser.tabs.create,
      isMethod: true,
      isAsync: true,
      isReturning: true
    },
    // ...
    onUpdated: {
      link: browser.tabs.onUpdated,
      isEvent: true
    }
  },
  runtime: {
    link: browser.runtime,
    // ...
    onMessage: {
      link: browser.runtime.onMessage,
      isEvent: true,
      // обработчик имеет возможность отправить ответ на сообщение
      isInteractive: true
    }
  }
};
```

Структура, описывающая метод имеет следующие свойства:

* `link <function>` Ссылка на метод
* `isMethod <boolean>` Равно истине
* `isAsync <boolean>` Показывает, является ли метод асинхронным, возвращающим Promise. По умолчанию false.
* `isReturning <boolean>` Показывает, возвращает ли метод результат. По умолчанию false. Возвращаемое методом
значение должно быть представляемой в формате json структурой. В случае возврата имеющего методы экземпляра
невстроенного класса серверная часть получит просто объект, функции будут отброшены.

Также описатель метода должен находиться внутри родительского объекта, т.е. создание функций верхнего уровня
является ошибкой:

```js
const description = {
  calcSomething: {
    link: someFn,
    isMethod: true,
    // ...
  }
};
```

При описании объекта указывается ссылка на него:

```js
const description = {
  tabs: {
    link: browser.tabs,
    // ...
  }
};
```

Описание события является структурой со свойствами:

* `link: Event`
Ссылка на объект, представляющего следующие интерфейс:
    * `addListener(listener: function[, ...filters: object]) => void`
    * `hasListener(listener: function) => boolean`
    * `removeListener(listener: function) => void`
Параметры, передаваемые обработчику при возникновении события должны быть представляемые в формате json
(Большинство событий [WebExtensions] соответсвуют данному требованию).
Пример: [browser.tabs.onCreated](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/Tabs/onCreated)
* `isEvent: boolean` Задаёт тип события. Равно истине
* `isInteractive: boolean` Показывает является ли событие интерактивным. Примером такого события является
[browser.runtime.onMessage](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/Runtime/onMessage).
По умолчанию false - информационное событие.
* `isPromised: booleand` По умолчанию обработчик интерактивного события на стороне сервера получает последним
параметром функцию, передающую ответ обратно браузеру. Если данное св-во равно true, то для отправки результата
слушатель возвращает Promise, который завершится ответным значением. По умолчанию - false.

Добавив новые записи в файл с описанием, предоставляемого клиентом API, успешно собрав файл дополнения, изменения
на стороне сервера интерфейса класса Browser автоматически произойдут при запуске. Так происходит за счёт
динамической природы JavaScript и использования обстоятельства, что объекты в данном языке разделяют общие черты с
отображениями, имеющими строки в качестве ключей.

В описании интерфейса возможно добавление объектов верхнего уровня. Данное обстоятельство создаёт перспективу
расширения предоставляемого клиентом API за счёт добавления других интерфейсов [WebExtensions] или использования и
создания собственных плагинов.

[WebExtensions]: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions
