"use strict";

const ControllingServer = require("./../../../server/ControllingServer/ControllingServer");
const createRemoteApi = require("./../../../server/createRemoteApi/createRemoteApi");

const ControlledClient = require(
  "./../../../clientExtension/background/ControlledSocketClient/ControlledSocketClient"
);
const apificateControlledClient = require(
  "./../../../clientExtension/background/apificateControlledClient/apificateControlledClient"
);

const { createAndAddTestsFromTable } = require("./../../utils/addingTestsFromTable");

const {
  clientApi,
  descriptionOfClientApi
} = require("./clientsApi");

const {
  checkCallingInternallySyncFnMethod,
  checkCallingInternallyAsyncFnMethod,
  checkCallingInternallySyncPrcdMethod,
  checkCallingInternallyAsyncPrcdMethod
} = require("./checks/methods/checkingCallingMethods");

const {
  checkThrowingErrorFromInternallySyncFnMethod,
  checkThrowingErrorFromInternallyAsyncFnMethod,
  checkThrowingErrorFromInternallySyncPrcdMethod,
  checkThrowingErrorFromInternallyAsyncPrcdMethod
} = require("./checks/methods/checkingThrowingErrors");

const checkInformationEvents = require("./checks/events/checkInformationEvents");
const {
  checkInteractiveCallbackedEvents,
  checkInteractivePromisedEvents
} = require("./checks/events/checkingInteractiveEvents");

const executeTests = function(describeTests, addTest, options) {
  describeTests(options.nameOfTests, function() {
    const {
      responsiveWebSocketServer,
      port,
      ResponsiveWebSocketClient
    } = options;

    let responsiveWebSocketClient;
    let remoteApi;

    before(async function setupConnectionsAndRemoteApi() {
      await responsiveWebSocketServer.listen(port);
      const controllingSever = new ControllingServer(responsiveWebSocketServer);
      responsiveWebSocketClient = new ResponsiveWebSocketClient();

      const {
        controllingConnection,
        controlledClient
      } = await createControllingConnectionAndControlledClient(
        controllingSever,
        responsiveWebSocketClient,
        "ws://127.0.0.1:" + port
      );

      remoteApi = await establishRemoteApi(controllingConnection, controlledClient, descriptionOfClientApi);
    });

    const createTest = function(check) {
      return runCheck.bind(null, check);
    };
    const runCheck = async function(check) {
      return check(clientApi, remoteApi);
    };

    addTests(describeTests, addTest, createTest);

    after(function closeConnections() {
      responsiveWebSocketServer.close();
      responsiveWebSocketClient.terminate();
    });
  });
};

const createControllingConnectionAndControlledClient = function(
  controllingSever,
  responsiveWebSocketClient,
  url
) {
  return new Promise(function(resolve, reject) {
    controllingSever.setConnectionListener(async function(controllingConnection) {
      await connectingClient;
      const controlledClient = new ControlledClient(responsiveWebSocketClient);
      resolve({
        controllingConnection,
        controlledClient
      });
    });
    const connectingClient = responsiveWebSocketClient.connect(url);
  });
};

const establishRemoteApi = function(controllingConnection, controlledClient, descriptionOfApi) {
  return new Promise(function(resolve) {
    controllingConnection.setDescribingApiMessageListener(function(descOfExportedApi) {
      //console.log("получено описание storage: ", descOfExportedApi.storage);
      const api = createRemoteApi(controllingConnection, descOfExportedApi);
      resolve(api);
    });

    //console.log("клиент. описание: ", descriptionOfApi);
    const sendedDescriptionOfApi = apificateControlledClient(controlledClient, descriptionOfApi);
    //console.log("отправл. описание: ", sendedDescriptionOfApi);
    controlledClient.sendDescribingApiMessage(sendedDescriptionOfApi);
  });
};

const addTests = function(describeTests, addTest, createTest) {
  describeTests("вызов методов", function() {
    describeTests("успешный", () => createAndAddTestsFromTable(createTest, addTest, [
      ["внутренне синх. функции", checkCallingInternallySyncFnMethod],
      ["внутренне асинх. функции", checkCallingInternallyAsyncFnMethod],
      ["внутренне синх. процедуры", checkCallingInternallySyncPrcdMethod],
      ["внутренне асинх. процедуры", checkCallingInternallyAsyncPrcdMethod]
    ]));
    describeTests("ошибки", () => createAndAddTestsFromTable(createTest, addTest, [
      ["внутренне синх. функции", checkThrowingErrorFromInternallySyncFnMethod],
      ["внутренне асинх. функции", checkThrowingErrorFromInternallyAsyncFnMethod],
      ["внутренне синх. процедуры", checkThrowingErrorFromInternallySyncPrcdMethod],
      ["внутренне асинх. процедуры", checkThrowingErrorFromInternallyAsyncPrcdMethod]
    ]));
  });

  describeTests("события", () => createAndAddTestsFromTable(createTest, addTest, [
    ["интерактивные события на обратных вызовах", checkInteractiveCallbackedEvents],
    ["интерактивные события на обещаниях", checkInteractivePromisedEvents]
  ]));
};

module.exports = executeTests;
