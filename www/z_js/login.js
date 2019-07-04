var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        // Here we register our callbacks for the lifecycle events we care about
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('pause', this.onPause, false);
        document.addEventListener('resume', this.onResume, false);
    },
    onDeviceReady: function() {
    },
    onPause: function() {

    },
    onResume: function(event) {

    }
}
app.initialize();

function getFirebaseToken(){
    firebaseGetToken(getGoogleLogin, handleGetFirebaseTokenError);
}

function handleGetFirebaseTokenError(e){
    if(e.isMissingInternetConnection()){
        handleMissingInternetConnectionError();
    }else if(e.isUnknownError()){
        handleGetFirebaseTokenAbort();
    }
}

function handleGetFirebaseTokenAbort(){
    showAbortDialog(stringKeys.unexpected_error_description, stringKeys.unexpected_error);
}

function getGoogleLogin(){
    googleSilentLogin(function(){
        login(successLogin, handleLoginError);
    }, function(e){
        handleGetGoogleLoginError(e, true);
    });
}

function handleGetGoogleLoginError(e, hasToExplicitLogin){
    if(e.isMissingInternetConnection()){
        handleMissingInternetConnectionError();
    }else if(e.isUnknownError() && hasToExplicitLogin){
        googleExplicitLogin(function(){
            login(successLogin, handleLoginError);
        }, function(){
            handleGetGoogleLoginError(e, false);
        });
    }else{
        handleGoogleLoginAbortError();
    }
}

function handleGoogleLoginAbortError(){
    showAbortDialog(stringKeys.unexpected_error_description, stringKeys.unexpected_error);
}

function handleLoginError(e){
    alert(e.error);
    // TODO handle login error
}

function handleMissingInternetConnectionError(){
    alert("bbbbbb");
    // TODO
}

function successLogin(){
    alert("AAAAA");
    // TODO success login
}


function onConfirmAbort() {
    navigator.app.exitApp();
}

function showAbortDialog(message, title){
    getStringsResources([
        stringKeys.unexpected_error_description,
        stringKeys.unexpected_error,
        stringKeys.exit
    ], function(translations){
        navigator.notification.confirm(
            translations[0], // message
            onConfirmAbort,       // callback to invoke with index of button pressed
            translations[1],      // title
            [translations[2]]     // buttonLabels
        );
    });
}