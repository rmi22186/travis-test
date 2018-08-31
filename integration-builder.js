var mParticleIntegration = {
    name: 'insertSDKNameHere',
    initForwarder: function(forwarderSettings, userAttributes, userIdentities, processEvent, eventQueue) {
        // forwarderSettings will have any SDK settings required to use your SDK (ie, API key)
        if (!testMode) {
            /* Load your Web SDK here using a variant of your snippet from your readme that your customers would generally put into their <head> tags
               Generally, our integrations create script tags and append them to the <head>. Please follow the following format as a guide:
            */

            // var clientScript = document.createElement('script');
            // clientScript.type = 'text/javascript';
            // clientScript.async = true;
            // clientScript.src = 'https://www.clientscript.com/static/clientSDK.js';   // <---- Update this to be your script
            // (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(clientScript);
            // clientScript.onload = function() {
            //     if (clientSDKObject && eventQueue.length > 0) {
            //         // Process any events that may have been queued up while forwarder was being initialized.
            //         for (var i = 0; i < eventQueue.length; i++) {
            //             processEvent(eventQueue[i]);
            //         }
            //          // now that each queued event is processed, we empty the eventQueue
            //         eventQueue = [];
            //     }
            //    clientSDKObject.initialize(forwarderSettings.apiKey);
            // };
        } else {
            // For testing, you should fill out this section in order to ensure any required initialization calls are made,
            // clientSDKObject.initialize(forwarderSettings.apiKey)
        }
    },
    logPageView: function(event) {
        // Sample logPageView Schema
        // {
        //     DeviceId: "a80eea1c-57f5-4f84-815e-06fe971b6ef2",
        //     EventAttributes: {test1: "value1"},
        //     EventName: "Test Page View",
        //     MPID: "123123123123",
        //     UserAttributes: {userAttr1: 'value1', userAttr2: 'value2'},
        //     UserIdentities: [{Identity: 'email@gmail.com', Type: 7}]
        // }
    },
    logEvent: function(event) {

    },
    logPurchaseEvent: function(event) {
        // Sample ecommerce event:
        // {
        //     CurrencyCode: 'USD',
        //     DeviceId:'a80eea1c-57f5-4f84-815e-06fe971b6ef2', // MP generated
        //     EventAttributes: { key1: 'value1', key2: 'value2' },
        //     EventName: "eCommerce - Purchase",
        //     MPID: "8278431810143183490",
        //     ProductAction: {
        //         Affiliation: 'aff1',
        //         CouponCode: 'coupon',
        //         ProductActionType: 7,
        //         ProductList: [
        //             {
        //                 Attributes: { prodKey1: 'prodValue1', prodKey2: 'prodValue2' },
        //                 Brand: 'Apple',
        //                 Category: 'phones',
        //                 CouponCode: 'coupon1',
        //                 Name: 'iPhone',
        //                 Price: '600',
        //                 Quantity: 2,
        //                 Sku: "SKU123",
        //                 TotalAmount: 1200,
        //                 Variant: '64GB'
        //             }
        //         ],
        //         TransactionId: "tid1",
        //         ShippingAmount: 10,
        //         TaxAmount: 5,
        //         TotalAmount: 1215,
        //     },
        //     UserAttributes: { userKey1: 'userValue1', userKey2: 'userValue2' }
        //     UserIdentities: [
        //         {
        //             Identity: 'test@gmail.com', Type: 7
        //         }
        //     ]
        // }
    },
    setUserAttribute: function(key, value, forwarderSettings) {

    },
    removeUserAttribute: function(key, forwarderSettings) {

    },
    onUserIdentified: function(mParticleUser, forwarderSettings) {
        // the mParticleUser is an object returned after a user is identified in the MP SDK
        // onUserIdentified is then called so that our partners can determine what userIds are available to use in their SDK
        // call mParticleUser.getUserIdentities() to receive an object of userIdentities back --> { userIdentities: {customerid: '1234', email: 'email@gmail.com'} }
        // for more identity types, see http://docs.mparticle.com/developers/sdk/javascript/identity#allowed-identity-types
        // mParticleUser.getMPID() to get mParticle ID
        // for any additional methods, see http://docs.mparticle.com/developers/sdk/javascript/apidocs/classes/mParticle.Identity.getCurrentUser().html
    }
};

module.exports = mParticleIntegration;
