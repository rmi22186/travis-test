# Overview
Welcome to the mParticle JavaScript SDK kit template! This repo provides a template for our partners to create their own JS kits in order to integrate with the [mParticle](https://www.mparticle.com) ecosystem. Kits are often referred to as partner SDKs or forwarders. Once you copy this repo down, there are several steps to build an integration:

1. Run `npm install` to install dependencies
2. Fill out your client SDK mapping methods into `integration-builder.js`. There are more details below, along with in-line comments as well.
3. Compile your kit at build/kit.js by running `npm run watch`. Whenever you save changes to `integration-builder.js`, `build/kit.js` will be recompiled.
3. Testing (tbd...)

### integration-builder.js
This file contains an `mParticleIntegration` object which you will fill in.  For each key, fill in the respective value/mapping. See the below notes, as well as the inline comments for help:

* `name`: Fill in the name of your SDK here

* `initForwarder`: Provide code to dynamically load your web SDK here
  * Generally, our partners ask their customers to load the partner SDK into the <head> of an HTML file. There is commented code here to help you load it dynamically via JavaScript instead.
  * `eventQueue` - If your SDK does not have its own eventQueueing system (ie. if a user logs an event before your SDK is loaded), then you should use the provided `eventQueue`. If your SDK is not yet loaded and users log events, they will be added to the `eventQueue`. Once your SDK loads, the `clientSdk.onload` function will process each event in the queue and then clear the queue. If your SDKs has its own method stubbing and internal queueing mechanism to allow for methods to be called before the SDK is loaded, then you can ignore using the eventQueue in your integration.


* `logPageView/Event/PurchaseEvent`:

  * For each method, an mParticle `event` object is passed as an argument for you to modify and map to your respective SDK method. `event` objects have several keys, but you may find the following keys useful when writing your mappings:

| Key | Type | Notes |
|-----|------|-------------|
| DeviceId | String | Randomly generated string to identify device |
| EventName | String |  |
| EventAttributes | Object |  |
| MPID | String | mParticle ID |
| UserAttributes | Object |  |
| User Identities | Array | See below for schema; additional `Types` [here](https://github.com/mParticle/mparticle-sdk-javascript/blob/master-v2/src/types.js#L88-L101) |

E-commerce events have the above attributes, as well as a few more:

| Key | Type | Notes |
|-----|------|-------------|
| CurrencyCode | String | Country currency code |
| ProductAction | Object | See schema below for more details. Contains a ProductList key with an array of products as its value |


Example Log Page View Event:
```
{
    DeviceId: "a80eea1c-57f5-4f84-815e-06fe971b6ef2",
    EventAttributes: {test1: "value1"},
    EventName: "hi",
    MPID: "-8278431810143183490",
    UserAttributes: {},
    UserIdentities: []
}
```

Example Log Purchase Event:
```
{
    CurrencyCode: 'USD',
    DeviceId:'a80eea1c-57f5-4f84-815e-06fe971b6ef2', // MP generated
    EventAttributes: { key1: 'value1', key2: 'value2' },
    EventName: "eCommerce - Purchase",
    MPID: "8278431810143183490",
    ProductAction: {
        Affiliation: 'aff1',
        CouponCode: 'coupon',
        ProductActionType: 7,
        ProductList: [
            {
                Attributes: { prodKey1: 'prodValue1', prodKey2: 'prodValue2' },
                Brand: 'Apple',
                Category: 'phones',
                CouponCode: 'coupon1',
                Name: 'iPhone',
                Price: '600',
                Quantity: 2,
                Sku: "SKU123",
                TotalAmount: 1200,
                Variant: '64GB'
            }
        ],
        TransactionId: "tid1",
        ShippingAmount: 10,
        TaxAmount: 5,
        TotalAmount: 1215,
    },
    UserAttributes: { userKey1: 'userValue1', userKey2: 'userValue2' }
    UserIdentities: [
        {
            Identity: 'test@gmail.com', Type: 7
        }
    ]
}
```

* `setUserIdentity/setUserAttribute
removeUserAttribute
onUserIdentified/Event/PurchaseEvent`:

### Testing
TBD

### Submitting for review
TBD
=======
