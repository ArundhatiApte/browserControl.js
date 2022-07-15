"use strcit";

const createExportedDescOfApi = function(innerDescOfApi) {
  const id = innerDescOfApi.id;

  const out = (isNaN(id)) ? {} : {
    id: innerDescOfApi.id
  } ;

  for (const [key, value] of Object.entries(innerDescOfApi)) {
    if (key === "link") {
      continue;
    }

    if (typeof value === "object") {

      if (value.isEvent) {
        out[key] = descriptorOfEvent(value);
        continue;
      }

      if (value.isMethod) {
        out[key] = descriptorOfMethod(value.id, value.isReturning);
        continue;
      }

      const subDesc = createExportedDescOfApi(value);
      out[key] = subDesc;
    }
  }
  return out;
};

const descriptorOfMethod = function(id, isReturning) {
  return {id, isMethod: true, isReturning};
};

const descriptorOfEvent = function(innerDescOfEvent) {
  const setNewListener = innerDescOfEvent.setNewListener,
        hasListenerById = innerDescOfEvent.hasListenerById,
        removeListenerById = innerDescOfEvent.removeListenerById;

  const out = {
    isEvent: true,
    id: innerDescOfEvent.id,
    isPromised: !!innerDescOfEvent.isPromised,
    isInteractive: !!innerDescOfEvent.isInteractive,

    setNewListener: descriptorOfMethod(setNewListener.id, true),
    hasListenerById: descriptorOfMethod(hasListenerById.id, true),
    removeListenerById: descriptorOfMethod(removeListenerById.id, true)
  };

  return out;
};

module.exports = createExportedDescOfApi;
