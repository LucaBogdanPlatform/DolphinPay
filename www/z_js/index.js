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
    firebaseGetToken(trySilentGoogleLogin, handleGetFirebaseTokenError);
}

function handleGetFirebaseTokenError(e){
    if(e.isMissingInternetConnection()){
        handleMissingInternetConnectionError(function(){
            navigator.app.exitApp();
        });
    }else{
        showDialogSingleAction(
            stringKeys.unexpected_error_description,
            stringKeys.unexpected_error,
            stringKeys.exit,
            function(){navigator.app.exitApp();}
        );
    }
}

function handleMissingInternetConnectionError(action){
     showDialogSingleAction(
         stringKeys.missing_internet_connection_description,
         stringKeys.missing_internet_connection,
         stringKeys.ok,
         action
     );
}

function trySilentGoogleLogin(){
     googleSilentLogin(function(){
        login(successLogin, function(){
            webview.Show('z_pages/login.html');
        });
     }, function(ex){
            webview.Show('z_pages/login.html');
     });
}

function successLogin(result){
    webview.Show('z_pages/dashboard.html');
}
