var app = (function () {
    'use strict';

    // global error handling boilerplate
    var showAlert = function(message, title, callback) {
        navigator.notification.alert(message, callback || function () {
        }, title, 'OK');
    };
    var showError = function(message) {
        showAlert(message, 'Error occured');
    };
    window.addEventListener('error', function (e) {
        e.preventDefault();
        var message = e.message + "' from " + e.filename + ":" + e.lineno;
        showAlert(message, 'Error occured');
        return true;
    });
    // To keep me from being an idiot and backspace-key-ing away from the app.
    var onBackKeyDown = function(e) {
        e.preventDefault();
        navigator.notification.confirm('Do you really want to exit?', function (confirmed) {
            var exit = function () {
                navigator.app.exitApp();
            };
            if (confirmed === true || confirmed === 1) {
                AppHelper.logout().then(exit, exit);
            }
        }, 'Exit', 'Ok,Cancel');
    };
    var onDeviceReady = function() {
        //Handle document events
        document.addEventListener("backbutton", onBackKeyDown, false);
    };

    document.addEventListener("deviceready", onDeviceReady, false);

    // Standard Everlive app (generated) boilerplate
    var applicationSettings = {
        emptyGuid: '00000000-0000-0000-0000-000000000000',
        apiKey: 'gz7JWORqkS4PDlps'
    };

    // initialize Everlive SDK
    var el = new Everlive({
        apiKey: applicationSettings.apiKey
    });
    
    var mobileApp = new kendo.mobile.Application(document.body, { transition: 'slide', layout: 'mobile-tabstrip' });
    
    return {
        viewModels: {}
    }
}());