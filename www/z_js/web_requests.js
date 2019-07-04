var BASE_API_URL = 'http://dolphinpaysv.us-west-2.elasticbeanstalk.com:80/dolphinpayREST-API/';
var API_VERSION = 'v1';
var REST_API_URL = BASE_API_URL + API_VERSION;

// REQUESTS PATHS DEFINITIONS
var REQ_AUTH_PATH = REST_API_URL + '/auth';
// END REQUESTS PATHS DEFINITIONS


// ERROR OBJECT DEFINITION
var CODE_UNKNOWN = -1;
var CODE_NETWORK_ABSENT = 0;
var Error = function (error){
    this.error = error;
}:

Error.prototype.isUnauthorized = function(){
    return this.error.status == 401;
};

Error.prototype.isBadRequest = function(){
    return this.error.status == 400;
};

Error.prototype.isMissingInternetConnection = function(){
    return this.error.status == CODE_NETWORK_ABSENT;
};

Error.prototype.isUnknownError = function(){
    return !this.isUnauthorized() && !this.isBadRequest() && !this.isMissingInternetConnection;
};
// END ERROR OBJECT DEFINITION


// GLOBAL ERROR HANDLER
function errorHandler(retryRequest, failureCallback, error, hasCredentialsRefreshed){
    if(navigator.network.connection.type == Connection.NONE){
        failureCallback(new Error({status : CODE_NETWORK_ABSENT}));
    }else if(hasCredentialsRefreshed){
        failureCallback(new Error(error));
    }else{
        var parsedError = new Error(error);
        if(parsedError.isUnauthorized()){
            googleSilentLogin(function(){
                retryRequest(true);
            }, function(){
                failureCallback(new Error(error));
            });
        }else{
            failureCallback(new Error(error));
        }
    }
}
// END GLOBAL ERROR HANDLER

// FIREBASE

var KEY_FIREBASE_TOKEN = "KFT";
function firebaseSaveToken(token){
    window.localStorage.setItem(KEY_FIREBASE_TOKEN,  token);
}

function firebaseGetToken(successCallback, failureCallback){
    window.FirebasePlugin.getToken(function(token) {
        firebaseSaveToken(token);
        firebaseRefreshToken(successCallback, failureCallback);
    }, function(error) {
        if(navigator.network.connection.type == Connection.NONE){
            failureCallback(new Error({status : CODE_NETWORK_ABSENT}));
        }else{
            failureCallback(new Error({status : CODE_UNKNOWN}));
        }
    });
}

function firebaseRefreshToken(successCallback, failureCallback){
    window.FirebasePlugin.onTokenRefresh(function(token) {
        firebaseSaveToken(token);
        successCallback(token);
    }, function(error) {
        if(navigator.network.connection.type == Connection.NONE){
            failureCallback(new Error({status : CODE_NETWORK_ABSENT}));
        }else{
            failureCallback(new Error({status : CODE_UNKNOWN}));
        }
    });
}
//END FIREBASE

// GOOGLE AUTH
var WEB_CLIENT_ID = '806071370102-hrqrkdqkhkgdrci01qi4ovaml2hki4jv.apps.googleusercontent.com';
var KEY_GOOGLE_CREDENTIALS = "KGC";

function googleSaveCredentials(obj){
    window.localStorage.setItem(KEY_GOOGLE_CREDENTIALS,  JSON.stringify(obj));
}

function googleSilentLogin(successCallback, failureCallback){
    window.plugins.googleplus.trySilentLogin(
        {
            'webClientId' : WEB_CLIENT_ID,
        },
        function (obj) {
            googleSaveCredentials(obj);
            successCallback(obj);
        },
        function (msg) {
            if(navigator.network.connection.type == Connection.NONE){
                failureCallback(new Error({status : CODE_NETWORK_ABSENT}));
            }else{
                failureCallback(new Error({status : CODE_UNKNOWN}));
            }
        }
    );
}

function googleExplicitLogin(successCallback, failureCallback){
    window.plugins.googleplus.login(
        {
            'webClientId' : WEB_CLIENT_ID,
        },
        function (obj) {
            googleSaveCredentials(obj);
            successCallback(obj);
        },
        function (msg) {
            if(navigator.network.connection.type == Connection.NONE){
                failureCallback(new Error({status : CODE_NETWORK_ABSENT}));
            }else{
                failureCallback(new Error({status : CODE_UNKNOWN}));
            }
        }
    );
}
// END GOOGLE AUTH

// GENERAL CREDENTIALS DEFINITION
function getCredentials(){
    if(localStorage.getItem(this.KEY_GOOGLE_CREDENTIALS) === null){
        return null;
    }else{
        var credentials = JSON.parse(localStorage.getItem(this.KEY_GOOGLE_CREDENTIALS));
        credentials.firebaseToken = localStorage.getItem(this.KEY_FIREBASE_TOKEN);
        return credentials;
    }
}
// END GENERAL CREDENTIALS DEFINITION


// REQUESTS DEFINITIONS

// Body requires idToken, username
function login(successCallback, failureCallback, hasCredentialsRefreshed = false){
    cordova.plugin.http.setDataSerializer('json');

    var credentials = getCredentials();
    const options = {method: 'post', data: {idToken: credentials.idToken, username: credentials.email, firebaseToken: credentials.firebaseToken}};

    cordova.plugin.http.sendRequest(REQ_AUTH_PATH, options, function(response) {
        successCallback(response);
    }, function(error) {
        errorHandler(
            function(wasTokenRefreshed){
                login(successCallback, failureCallback, wasTokenRefreshed);
            },
            error,
            hasCredentialsRefreshed
        );
    });

}
// END REQUESTS