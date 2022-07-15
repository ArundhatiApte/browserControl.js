"use strict";

const {
  checkSendingBinaryRequests: {
    checkSendingBinaryRequestsByServer,
    checkSendingBinaryRequestsByClient,
  },
  checkSendingUnrequestingBinaryMessages: {
    checkSendingUnrequestingBinaryMessagesByServer,
    checkSendingUnrequestingBinaryMessagesByClient
  }
} = require("./../checks/checkSendingMessages/checkSendingMessages");

const {
  checkSendingManyBinaryRequestsAtOnceByServer,
  checkSendingManyBinaryRequestsAtOnceByClient
} = require("./../checks/checkSendingMessages/checkSendingManyRequestsAtOnce");

const {
  checkTimeoutByServer,
  checkTimeoutByClient
} = require("./../checks/checkSendingMessages/checkTimeout");

const {
  checkSending2FragmentsOfBinaryRequestByServer,
  checkSending2FragmentsOfBinaryResponseByServer
} = require("./../checks/checkSendingMessages/checkSendingFragmentsOfMessages");

const fromServerToClientPostfix = " by server to client";
const fromClientToServerPostfix = " by client to server";

const addCheckingSendingMessagesTests = function(
  describeTests,
  addTest,
  createFnToTestFromServerToClient,
  createFnToTestFromClientToServer
) {
  return describeTests("sending messages", function() {
    add2SidesTests(addTest, createFnToTestFromServerToClient, createFnToTestFromClientToServer, [
      [
        checkSendingBinaryRequestsByServer,
        checkSendingBinaryRequestsByClient,
        "send awaiting response binary messages"
      ],
      [
        checkSendingUnrequestingBinaryMessagesByServer,
        checkSendingUnrequestingBinaryMessagesByClient,
        "send unrequesting binary messages"
      ]
    ]);

    describeTests("timeouts", function() {
      add2SidesTests(addTest, createFnToTestFromServerToClient, createFnToTestFromClientToServer, [
        [checkTimeoutByServer, checkTimeoutByClient, "timeout to receive response on request"]
      ]);
    });

    describeTests("sending many requests at once", function() {
      const maxTimeMsToSendMessages = 4000;
      this.timeout(maxTimeMsToSendMessages);
      this.slow(maxTimeMsToSendMessages);

      add2SidesTests(addTest, createFnToTestFromServerToClient, createFnToTestFromClientToServer, [
        [
          checkSendingManyBinaryRequestsAtOnceByServer,
          checkSendingManyBinaryRequestsAtOnceByClient,
          "send many binary requests at once"
        ]
      ]);
    });

    addTest("send 2 fragments of binary request", createFnToTestFromServerToClient(
      checkSending2FragmentsOfBinaryRequestByServer
    ));

    addTest("send 2 fragments of binary response by server to client", createFnToTestFromClientToServer(
      checkSending2FragmentsOfBinaryResponseByServer
    ));
  });
};

const add2SidesTests = function(
  addTest,
  createFnToTestFromServerToClient,
  createFnToTestFromClientToServer,
  checkToNameOfTest
) {
  for (const [checkAtServer, checkAtClient, nameOfTest] of checkToNameOfTest) {
    addTestFormOneSideToAnotherToTester(
      addTest,
      checkAtServer,
      nameOfTest,
      createFnToTestFromServerToClient,
      fromServerToClientPostfix
    );
    addTestFormOneSideToAnotherToTester(
      addTest,
      checkAtClient,
      nameOfTest,
      createFnToTestFromClientToServer,
      fromClientToServerPostfix
    );
  }
};

const addTestFormOneSideToAnotherToTester = function(
  addTest,
  check,
  nameOfTest,
  createFnToTestOneSideToAnother,
  postfixOfTestName
) {
  const name = nameOfTest + postfixOfTestName;
  addTest(name, createFnToTestOneSideToAnother(check));
};

module.exports = addCheckingSendingMessagesTests;
