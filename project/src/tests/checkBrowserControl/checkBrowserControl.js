"use strict";

const Tester = require("tester");

const launcher = require("./../../server/exports/launcher");
const server = require("./modules/httpServer");

const checkCallingMethods = require("./checks/checkCallingMethods");
const checkThrowingErrors = require("./checks/checkThrowingErrors");

const {
  checkInformationEvent,
  checkInteractiveListenerOfInteractiveCallbackedEvent,
  checkListenerOfInteractiveCallbackedEventThatIsNotInteractive,
  checkListenerOfInteractiveEventThatIgnoreAbilityToSendResponse
} = require("./checks/checksOfEvents");

const pathToBrowserOrCommand = process.argv[2];
if (!pathToBrowserOrCommand) {
  process.stderr.write("укажите команду для запуска браузера или путь к нему в 1-ом параметре");
  process.exit(-1);
}

const executeTests = function(pathToBrowserOrCommand, portForHttpServer) {
  const tester = new Tester("тест системы управления браузером");
  
  let browser;

  tester.onBeforeAllTestsStarted.addListener(async function launcBrowserAndStartServer() {
    [browser] = await Promise.all([
      launcher.launch(pathToBrowserOrCommand),
      server.listenAsync(portForHttpServer)
    ]);
  });

  const createTest = function(check) {
    return runTest.bind(null, check);
  };

  const runTest = async function(check) {
    return check(server, browser);
  };

  const checkToNameOfTest = [
    [checkCallingMethods, "вызов методов"],
    [checkThrowingErrors, "генерация исключений"],
    [checkInformationEvent, "информационные события"],
    [
      checkInteractiveListenerOfInteractiveCallbackedEvent,
      "интерактивные события на обратных вызовах"
    ],
    [
      checkListenerOfInteractiveCallbackedEventThatIsNotInteractive,
      "невзаимодействующий обработчик инетрактивного события"
    ],
    [
      checkListenerOfInteractiveEventThatIgnoreAbilityToSendResponse,
      "пропускающий возможность взаимодействия обработчик инетрактивного события"
    ]
  ];

  for (const [check, nameOfTest] of checkToNameOfTest) {
    tester.addTest(createTest(check), {
      name: nameOfTest,
      isParallel: true
    });
  }
  tester.run();
};

executeTests(pathToBrowserOrCommand, 12345);
