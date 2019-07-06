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
    disableButton(true);
    firebaseGetToken(getGoogleExplicitLogin, handleGetFirebaseTokenError);

}

function handleGetFirebaseTokenError(e){
    if(e.isMissingInternetConnection()){
        handleMissingInternetConnectionError();
    }else{
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
    }else{
        handleLoginError(e);
    }
}

function handleLoginError(e){
    showAbortDialog(
        stringKeys.server_authentication_error_description,
        stringKeys.server_authentication_error,
        stringKeys.ok,
        null
    );
    disableButton(false);
}


function handleMissingInternetConnectionError(){
    showAbortDialog(
        stringKeys.missing_internet_connection_description,
        stringKeys.missing_internet_connection,
        stringKeys.ok,
        null
    );
    disableButton(false);
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

function disableButton(disable) {
    var logo = document.getElementById('logo-google');
    var anim = document.getElementById('animation-google');
    var text = document.getElementById('google-text');
    var wrapper = document.getElementById('inline');
    if(disable){
        logo.style.display = 'none';
        anim.style.display = 'block';
        anim.classList.add("buttonPressed");
        text.classList.add("buttonPressed");
        wrapper.onclick = function(){}
    }
    else{
        anim.style.display = 'none';
        logo.style.display = 'block';
        anim.classList.remove("buttonPressed");
        text.classList.remove("buttonPressed");
        wrapper.onclick = function(){getFirebaseToken();}
    }
}
