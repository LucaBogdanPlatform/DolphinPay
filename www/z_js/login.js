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
    firebaseGetToken(getGoogleExplicitLogin, handleGetFirebaseTokenError);
}

function handleGetFirebaseTokenError(e){
    if(e.isMissingInternetConnection()){
        handleMissingInternetConnectionError();
    }else if(e.isUnknownError()){
        handleGetFirebaseTokenAbort();
    }
}

function handleGetFirebaseTokenAbort(){
    showAbortDialog(
        stringKeys.unexpected_error_description,
        stringKeys.unexpected_error,
        stringKeys.exit,
        function(){navigator.app.exitApp();}
    );
}

function getGoogleExplicitLogin(){
    googleExplicitLogin(function(){
        login(successLogin, handleLoginError);
    }, function(ex){
        handleGetGoogleLoginError(ex);
    });
}

function handleGetGoogleLoginError(e){
    if(e.isMissingInternetConnection()){
        handleMissingInternetConnectionError();
    }
}

function handleLoginError(e){
    alert(e.error);
    // TODO handle login error
}

function handleMissingInternetConnectionError(){
    showAbortDialog(
        stringKeys.missing_internet_connection_description,
        stringKeys.missing_internet_connection,
        stringKeys.ok,
        null
    );
}

function successLogin(){
// TODO request available ambient and go next
    window.location = "../z_pages/main.html"
}

function showAbortDialog(message, title, buttonTxt, confirmCallback){
    getStringsResources([
        message,
        title,
        buttonTxt
    ], function(translations){
        navigator.notification.confirm(
            translations[0], // message
            confirmCallback,       // callback to invoke with index of button pressed
            translations[1],      // title
            [translations[2]]     // buttonLabels
        );
    });
}