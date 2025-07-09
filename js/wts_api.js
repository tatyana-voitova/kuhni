
var IsidaWtsUtils = {
  resolve_function: {},
  reject_function: {},

  generateUUID: function () {
    var d = new Date().getTime();
    if(window.performance && typeof window.performance.now === "function") {
      d += performance.now();
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d + Math.random()*16)%16 | 0;
      d = Math.floor(d/16);
      return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
  },
    
  sendMessageToExtension: function(message, resolve, reject) {
    IsidaWtsUtils.resolve_function[message.messageId] = resolve;
    IsidaWtsUtils.reject_function[message.messageId] = reject;
    window.postMessage( message, "*");      
  },
  
  getWTSClientName: function(enabled) {
    var message =
    {
      messageId: IsidaWtsUtils.generateUUID(),
      destination: "isidaWtsUtilsNative",
      command: "getWTSClientName"
    };
    return new Promise(function(resolve, reject) {
      IsidaWtsUtils.sendMessageToExtension(message, resolve, reject);  
    });
  },
  
  getWTSIpAddress: function(enabled) {
    var message =
    {
      messageId: IsidaWtsUtils.generateUUID(),
      destination: "isidaWtsUtilsNative",
      command: "getWTSIpAddress"
    };
    return new Promise(function(resolve, reject) {
      IsidaWtsUtils.sendMessageToExtension(message, resolve, reject);  
    });
  },
  
  getWTSIpAddressPublic: function(enabled) {
    var message =
    {
      messageId: IsidaWtsUtils.generateUUID(),
      destination: "isidaWtsUtilsNative",
      command: "getWTSIpAddressPublic"
    };
    return new Promise(function(resolve, reject) {
      IsidaWtsUtils.sendMessageToExtension(message, resolve, reject);  
    });
  },
  
  getWTSUserName: function() {
    var message =
    {
      messageId: IsidaWtsUtils.generateUUID(),
      destination: "isidaWtsUtilsNative",
      command: "getWTSUserName"
    };
    return new Promise(function(resolve, reject) {
      IsidaWtsUtils.sendMessageToExtension(message, resolve, reject);
    });
  }
};

window.addEventListener("message", function(event) {
    if(event.source == window && event.data.destination == "isidaWtsUtilsWebExt") {
      if(event.data.data.result == "success") {
        IsidaWtsUtils.resolve_function[event.data.messageId](event.data);
      } else if(event.data.data.result == "error") {
        IsidaWtsUtils.reject_function[event.data.messageId](event.data);
      }
      delete IsidaWtsUtils.reject_function[event.data.messageId];
      delete IsidaWtsUtils.resolve_function[event.data.messageId];
    }
}, false);