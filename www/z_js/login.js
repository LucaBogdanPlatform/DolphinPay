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

function getGoogleExplicitLogin(){
    disableButton(true);
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
    showDialogSingleAction(
        stringKeys.server_authentication_error_description,
        stringKeys.server_authentication_error,
        stringKeys.ok,
        null
    );
    disableButton(false);
}


function handleMissingInternetConnectionError(){
    showDialogSingleAction(
        stringKeys.missing_internet_connection_description,
        stringKeys.missing_internet_connection,
        stringKeys.ok,
        null
    );
    disableButton(false);
}

function successLogin(result){
    //here check if the cart exist ...if no, will create a new one
    PGMultiView.loadView("dashboard.html","", function(){PGMultiView.dismissView("");},
     function(){PGMultiView.dismissView("");});
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
        wrapper.onclick = function(){getGoogleExplicitLogin();}
    }
}
