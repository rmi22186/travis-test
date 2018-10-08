// ====================== DO NOT ALTER ANYTHING IN THIS FILE ======================
// =============== REACH OUT TO MPARTICLE IF YOU HAVE ANY QUESTIONS ===============
//
//  Copyright 2018 mParticle, Inc.
//
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.
var CommerceHandler = require('./integration-builder-example/commerce-handler');
var EventHandler = require('./integration-builder-example/event-handler');
var IdentityHandler = require('./integration-builder-example/identity-handler');
var Initialization = require('./integration-builder-example/initialization');
var SessionHandler = require('./integration-builder-example/session-handler');
var UserAttributeHandler = require('./integration-builder-example/user-attribute-handler');

(function (window) {
    var name = Initialization.name,
        MessageType = {
            SessionStart: 1,
            SessionEnd: 2,
            PageView: 3,
            PageEvent: 4,
            CrashReport: 5,
            OptOut: 6,
            Commerce: 16
        };

    var constructor = function () {
        var self = this,
            isInitialized = false,
            forwarderSettings,
            reportingService,
            eventQueue = [];

        self.name = Initialization.name;

        function initForwarder(settings, service, testMode, trackerId, userAttributes, userIdentities) {
            forwarderSettings = settings;
            reportingService = service;

            try {
                Initialization.initForwarder(settings, testMode, userAttributes, userIdentities, processEvent, eventQueue, isInitialized);
                isInitialized = true;
            } catch (e) {
                console.log('Failed to initialize ' + name + ' - ' + e);
            }
        }

        function processEvent(event) {
            var reportEvent = false;
            if (isInitialized) {
                try {
                    if (event.EventDataType === MessageType.SessionStart) {
                        reportEvent = logSessionStart(event);
                    } else if (event.EventDataType === MessageType.SessionEnd) {
                        reportEvent = logSessionEnd(event);
                    } else if (event.EventDataType === MessageType.CrashReport) {
                        reportEvent = logError(event);
                    } else if (event.EventDataType === MessageType.PageView) {
                        reportEvent = logPageView(event);
                    }
                    else if (event.EventDataType === MessageType.Commerce) {
                        reportEvent = logEcommerceEvent(event);
                    }
                    else if (event.EventDataType === MessageType.PageEvent) {
                        reportEvent = logEvent(event);
                    }
                    if (reportEvent === true && reportingService) {
                        reportingService(self, event);
                        return 'Successfully sent to ' + name;
                    }
                    else {
                        return 'Error logging event or event type not supported on forwarder ' + name;
                    }
                }
                catch (e) {
                    return 'Failed to send to ' + name + ' ' + e;
                }
            } else {
                eventQueue.push(event);
                return 'Can\'t send to forwarder ' + name + ', not initialized. Event added to queue.';
            }
        }

        function logSessionStart(event) {
            try {
                SessionHandler.onSessionStart(event);
                return true;
            } catch (e) {
                return {error: 'Error starting session on forwarder ' + name + '; ' + e};
            }
        }

        function logSessionEnd(event) {
            try {
                SessionHandler.onSessionEnd(event);
                return true;
            } catch (e) {
                return {error: 'Error ending session on forwarder ' + name + '; ' + e};
            }
        }

        function logError(event) {
            try {
                EventHandler.logError(event);
                return true;
            } catch (e) {
                return {error: 'Error logging error on forwarder ' + name + '; ' + e};
            }
        }

        function logPageView(event) {
            try {
                EventHandler.logPagView(event);
                return true;
            } catch (e) {
                return {error: 'Error logging page view on forwarder ' + name + '; ' + e};
            }
        }

        function logEvent(event) {
            try {
                EventHandler.logEvent(event);
                return true;
            } catch (e) {
                return {error: 'Error logging event on forwarder ' + name + '; ' + e};
            }
        }

        function logEcommerceEvent(event) {
            try {
                CommerceHandler.logCommerceEvent(event);
                return true;
            } catch (e) {
                return {error: 'Error logging purchase event on forwarder ' + name + '; ' + e};
            }
        }

        function setUserAttribute(key, value) {
            if (isInitialized) {
                try {
                    UserAttributeHandler.onSetUserAttribute(key, value, forwarderSettings);
                    return 'Successfully set user attribute on forwarder ' + name;
                } catch (e) {
                    return 'Error setting user attribute on forwarder ' + name + '; ' + e;
                }
            } else {
                return 'Can\'t set user attribute on forwarder ' + name + ', not initialized';
            }
        }

        function removeUserAttribute(key) {
            if (isInitialized) {
                try {
                    UserAttributeHandler.onRemoveUserAttribute(key, forwarderSettings);
                    return 'Successfully removed user attribute on forwarder ' + name;
                } catch (e) {
                    return 'Error removing user attribute on forwarder ' + name + '; ' + e;
                }
            } else {
                return 'Can\'t remove user attribute on forwarder ' + name + ', not initialized';
            }
        }

        function setUserIdentity(id, type) {
            if (isInitialized) {
                try {
                    IdentityHandler.onSetUserIdentity(forwarderSettings, id, type);
                    return 'Successfully removed user attribute on forwarder ' + name;
                } catch (e) {
                    return 'Error removing user attribute on forwarder ' + name + '; ' + e;
                }
            } else {
                return 'Can\'t call setUserIdentity on forwarder ' + name + ', not initialized';
            }

        }


        function onUserIdentified(user, method) {
            var identityMapping = {
                modify: 'onModifyCompleted',
                identify: 'onIdentifyCompleted',
                login: 'onLoginCompleted',
                logout: 'onLogoutCompleted'
            };
            if (isInitialized) {
                try {
                    if (method) {
                        IdentityHandler[identityMapping[method]](user, forwarderSettings);
                    } else {
                        IdentityHandler.onUserIdentified(user, forwarderSettings);
                    }

                    return 'Successfully set user Identity on forwarder ' + name;
                } catch (e) {
                    return {error: 'Error setting user identity on forwarder ' + name + '; ' + e};
                }
            }
            else {
                return 'Can\'t set new user identities on forwader  ' + name + ', not initialized';
            }
        }

        this.init = initForwarder;
        this.process = processEvent;
        this.setUserAttribute = setUserAttribute;
        this.removeUserAttribute = removeUserAttribute;
        this.onUserIdentified = onUserIdentified;
        this.setUserIdentity = setUserIdentity;
    };

    if (!window || !window.mParticle || !window.mParticle.addForwarder) {
        return;
    }

    window.mParticle.addForwarder({
        name: name,
        constructor: constructor
    });
})(window);
