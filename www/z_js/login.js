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
        getFirebaseToken();
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
    // TODO
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
    // TODO
}

function handleLoginError(e){
    // TODO handle login error
}

function handleMissingInternetConnectionError(){
    // TODO
}

function successLogin(){
    // TODO success login
}


function onConfirmAbort() {
    navigator.app.exitApp();
}

function showAbortDialog(message, title){
    navigator.notification.confirm(
        message, // message
        onConfirm,            // callback to invoke with index of button pressed
        title,           // title
        ['Exit']     // buttonLabels
    );
}