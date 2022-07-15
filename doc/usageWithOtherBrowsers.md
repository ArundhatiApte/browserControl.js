# Использование в различных браузерах

Клиентское расширение было проверено в Firefox и Waterfox. Модуль browserControl представляет API из
[WebExtensions], поддерживаемый основными браузерами. Поэтому существует перспектива использования дополнения
browserControl В других веб-обозревателях.

Возможно отличие сигнатур некоторых методов из [WebExtensions] в реализациях браузеров между собой.
Внутренне расширение использует динамическую природу JavaScript и вызывает функции при запросу таким образом:
`method.apply(context, receivedArgs)`, поэтому требование изменений на стороне клиента в основном коде отпадает.
Аналогично серверная часть передаёт любой список переданных аргументов в запросе через WebSocket соединение,
поэтому необходимость в изменении составляющей browserControl на node.js отсутствует.

Chromium, Edge и Opera реализуют API [WebExtensions], основанный на обратных вызовах, в пространстве имен chrome.
Методы интерфейсов Firefox возвращают Promise и расположены в объекте с названием browser.
Эти отличия будут преградой для использования текущего расширения в перечисленных веб-обозревателях.
Решению данного вопроса может помочь модуль
[webextension-polyfill](https://github.com/mozilla/webextension-polyfill), представляющий интерфейс,
методы которого возвращают Promise, основанный на объекте browser. Указанный скрипт требуется запустить раньше
основного кода дополнения, добавив сценарий в папку
[background](project/src/clientExtension/background),
указав ссылку в [manifest.json](project/src/clientExtension/manifest.json).

Firefox использует xpi файлы для расширений, Chromium - crx. Поэтому требуется изменить сценарий сборки клиентского
дополнения [createExtension.sh](project/building/clientExtension/createExtension.sh).

[WebExtensions]: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions
