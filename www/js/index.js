var userCredentials = {
    KEY_PREVIOUS_LOGIN : "key_previous_login",
    VALUE_FACEBOOK : "facebook",
    VALUE_GOOGLE : "google",
    isValid : function(){
        return this._firebaseToken != 'undefined' &&
            this._userEmail != 'undefined';
    },
    checkPreviousFacebookLogin : function(){
        if (localStorage.getItem(KEY_PREVIOUS_LOGIN) === null) {
            return false;
        }
        return localStorage.getItem(KEY_PREVIOUS_LOGIN) == VALUE_FACEBOOK;
    },
    checkPreviousGoogleLogin : function(){
        if (localStorage.getItem(KEY_PREVIOUS_LOGIN) === null) {
            return false;
        }
        return localStorage.getItem(KEY_PREVIOUS_LOGIN) == VALUE_GOOGLE;
    },
    setGoogleAuth(email){
        saveLoginSource(VALUE_GOOGLE);
        setUserEmail(email);
    },
    setFacebookAuth(email) {
        saveLoginSource(VALUE_FACEBOOK);
        setUserEmail(email);
    },
    setUserEmail : function(email){
        this._userEmail = email;
    },
    setToken : function(token){
        this._firebaseToken = token;
    },
    saveLoginSource : function(source){
        window.localStorage.setItem(KEY_PREVIOUS_LOGIN, source);
    }
}; // User credentials required to login, _firebaseToken, _userEmail

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
        _setLoadingUI();
        requestFirebaseToken();
    },
    onPause: function() {

    },
    onResume: function(event) {

    }
}
app.initialize();

/**
*   Use to setting up Token refresh and GetToken listener
*   Server auth requires firebase token and user email
*/
function requestFirebaseToken(){
        window.FirebasePlugin.getToken(function(token) {
            // save this server-side and use it to push notifications to this device
            console.log(token);
            userCredentials.setToken(token);
            if(userCredentials.checkPreviousGoogleLogin()){
                requestGoogleLoginSilent();
            }else{
                _setBaseLoginUI();
            }
        }, function(error) {
            if(navigator.network.connection.type == Connection.NONE){
                // TODO signal interner connection absent and set base ui
            }else{
                // TODO signal abort
            }
        });
}

function requestGoogleLoginSilent(){
    window.plugins.googleplus.trySilentLogin(
        {
            'offline': false, // Optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
        },
        function (obj) {
            userCredentials.setGoogleAuth(obj.email);
            requestServerAuth();
        },
        function (msg) {
            requestGoogleLoginExplicit();
        }
    );
}

function requestGoogleLoginExplicit(){
    window.plugins.googleplus.login(
        {
            'offline': false, // optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
        },
        function (obj) {
            userCredentials.setGoogleAuth(obj.email);
            requestServerAuth();
        },
        function (msg) {
            if(navigator.network.connection.type == Connection.NONE){
                // TODO signal interner connection absent and set base ui
            }else{
                // TODO signal abort
            }
        }
    );
}

function requestFacebookLoginExplicit(){
    // TODO coming soon
}

function requestServerAuth(){
    if(!userCredentials.isValid()){
        return; // Missing credentials
    }

    //todo fix me
    window.location = "preview.html";
}

function _signalAbort(){
    // TODO
}

function _signalRequestInternetConnection(_callback){
    // TODO
}

function _setBaseLoginUI(){
     // TODO
}

function _setLoadingUI(){
    // TODO
}