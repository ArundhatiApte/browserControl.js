"use strict";

const createOnceListener = function(event, needToRemoveAndDoSomething) {
  const listener = function() {
    _callListenerAndRemoveIfNeed(
      needToRemoveAndDoSomething, 
      arguments, 
      listener, 
      event
    );
  };
  
  return listener;
};

const _callListenerAndRemoveIfNeed = async function(
  needToRemoveAndDoSomething, 
  args, 
  listener, 
  event
) {
  const willRemove = needToRemoveAndDoSomething.apply(null, args);
  if (willRemove) {
    await event.removeListener(listener);
  }
};

module.exports = createOnceListener;
