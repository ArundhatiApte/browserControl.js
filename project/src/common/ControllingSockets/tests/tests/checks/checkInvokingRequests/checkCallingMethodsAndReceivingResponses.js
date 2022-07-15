"use strict";

const expectDeepEqual = require("assert").deepStrictEqual;

const ControllingSide = require("./../../../../ControllingSide/ControllingSide");

const {
  status: symbolsOfResponseOnInvokingMessage_status,
  result: symbolsOfResponseOnInvokingMessage_result
} = ControllingSide.symbolsOfResponseOnInvokingMessage;

const argsSet = require("./../_argsSet");

const checkCallingMethodsAndReceivingResponses = async function(controllingSide, controlledSide) {
  const objectId = 16;
  const methodId = 22;
  const dataOfCalls = [];
  const expectedDataOfCalls = [];

  const responsesFromClient = [];
  const expectedResponsesFromClient = [];

  const serverSuccesStatusOfCall = ControllingSide.statusOfCall.succes;

  controlledSide.setInvokingMessageListener(function(objectId, methodId, args, senderOfResponse) {
    dataOfCalls.push({objectId, methodId, args});
    senderOfResponse.sendResult(args[0]);
  });

  for (const args of argsSet) {
    expectedDataOfCalls.push({objectId, methodId, args});
    expectedResponsesFromClient.push({
      [symbolsOfResponseOnInvokingMessage_status]: serverSuccesStatusOfCall,
      [symbolsOfResponseOnInvokingMessage_result]: args[0]
    });

    const response = await controllingSide.sendInvokingMessage(objectId, methodId, args);
    responsesFromClient.push(response);
  }

  expectDeepEqual(expectedDataOfCalls, dataOfCalls);
  expectDeepEqual(expectedResponsesFromClient, responsesFromClient);
};

module.exports = checkCallingMethodsAndReceivingResponses;
