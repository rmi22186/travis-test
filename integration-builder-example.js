/*
The below is an example SDK integration using integration-builder.js and is
intended to be used as a guide to create your own integration. A real world
example can be viewed at https://www.github.com/mparticle-integrations....
*/


var mParticleIntegration = {
    name: 'clientSDK',
    initForwarder: function(forwarderSettings, testMode, userAttributes, userIdentities, processEvent, eventQueue) {
        if (!testMode) {
            var clientSDKScript = document.createElement('script');
            clientSDKScript.type = 'text/javascript';
            clientSDKScript.async = true;
            clientSDKScript.src = 'https://www.clientSDK.com/static/clientSDK.js';
            (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(clientSDKScript);
            clientSDKScript.onload = function() {
                ClientSDK.initialize(forwarderSettings.apiKey);
                if (ClientSDK && eventQueue.length > 0) {
                    // Process any events that may have been queued up while forwarder was being initialized.
                    for (var i = 0; i < eventQueue.length; i++) {
                        processEvent(eventQueue[i]);
                    }

                    eventQueue = [];
                }
            };
        }
        else {
            // initialize will be stubbed in your tests
            ClientSDK.initialize(forwarderSettings.apiKey);
        }
    },
    logPageView: function(event) {
        if (event.EventAttributes) {
            ClientSDK.logScreen(event.EventName, event.EventAttributes);
        }
        else {
            ClientSDK.logScreen(event.EventName);
        }
    },
    logEvent: function(event) {
        if (event.EventAttributes) {
            ClientSDK.logEvent(event.EventName, event.EventAttributes);
        }
        else {
            ClientSDK.logEvent(event.EventName);
        }
    },
    logPurchaseEvent: function(event) {
        var reportEvent = false;
        if (event.ProductAction.ProductList) {
            try {
                event.ProductAction.ProductList.forEach(function(product) {
                    ClientSDK.track('Purchase', parseFloat(product.TotalAmount), product);
                });
            }
            catch (e) {
                return {error: e};
            }
        }
    },
    setUserAttribute: function(key, value) {
        var attributeDict = {};
        attributeDict[key] = value;
        ClientSDK.setUserAttribute(attributeDict);
    },
    removeUserAttribute: function(key) {
        this.setUserAttribute(key, null);
    },
    onUserIdentified: function(mParticleUser, forwarderSettings) {
        // mParticleUser.getUserIdentities(); --> {userIdentities: {customerid: 'abc', email: 'email@gmail.com'}}
        var userIdentities = mParticle.getUserIdentities().userIdentities;
        for (var userIdType in userIdentities) {
            if (userIdType === 'customerid') {
                var userId = userIdentities[userIdType];
                ClientSDK.setUserIdentity(userId, userIdType);
            }
        }
    }
};

module.exports = mParticleIntegration;
