"use strict";

const expect = require("assert");

const ControllingSide = require("./../../../../ControllingSide/ControllingSide");
const ControlledSide = require("./../../../../ControlledSide/ControlledSide");

const checkTimeoutOfCall = async function(controllingSide, controlledSide) {
  const timeMsToWait = 100;

  controlledSide.setInvokingMessageListener(function(objectId, methodId, args, senderResponse) {
    return setTimeout(
      () => senderResponse.sendSuccesStatus(),
      timeMsToWait + 500
    );
  });

  controllingSide.setMaxTimeMsToWaitResponse(timeMsToWait);
  await expect.rejects(
    () => controllingSide.sendInvokingMessage(1, 2, ["foo"]),
    ControllingSide.TimeoutToReceiveResponseError
  );
};

module.exports = checkTimeoutOfCall;
