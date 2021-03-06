var BASE_API_URL = "http://dolphinpaysv.us-west-2.elasticbeanstalk.com:80/dolphinpayREST-API/";
var TEST_API_URL = "192.168.43.51:5000/dolphinpayREST-API/";
var API_VERSION = "v1";
var REST_API_URL = BASE_API_URL + API_VERSION;


//----------------------------------------------------------------------------------------------------------------------

// FORMATTED PARAMS
var PARAM_ROOM_ID = "{roomId}";
var PARAM_STAND_ID = "{standId}";
var PARAM_CATEGORY_ID = "{categoryId}";
var PARAM_PLATFORM_ID = "{platformId}";
var PARAM_ORDER_ID = "{orderId}";
var PARAM_PRODUCT_ID = "{productId}";

// REQUESTS PATHS DEFINITIONS
var REQ_AUTH_PATH = REST_API_URL + "/auth";
var REQ_PARTNERSHIPS_PLATFORMS = REST_API_URL + "/platforms/partnerships/";
var REQ_PLATFORMS_ALL = REST_API_URL + "/platforms/all";
var REQ_STANDS = REST_API_URL + "/stands";
var REQ_CATEGORIES_ROOM = REST_API_URL + "/categories/" + PARAM_ROOM_ID;
var REQ_CATEGORIES_STAND = REST_API_URL + "/categories/stand/" + PARAM_STAND_ID;
var REQ_DELETE_CATEGORY_FROM_ROOM = REST_API_URL + "/categories/" + PARAM_CATEGORY_ID + "/rooms/" + PARAM_ROOM_ID;
var REQ_DELETE_PLATFORM_SUBSCRIBER = REST_API_URL + "/platforms/" + PARAM_PLATFORM_ID + "/subscribers";
var REQ_ADD_CATEGORY_TO_ROOM = REST_API_URL + "/categories/rooms";
var REQ_CREATE_ROOM_FOR_STAND = REST_API_URL + "/stands/rooms";
var REQ_GET_STAND_ROOMS = REST_API_URL + "/stands/"+ PARAM_STAND_ID +"/rooms";
var REQ_ROOM_SUBSCRIPTION_CODE = REST_API_URL + "/rooms/"+ PARAM_ROOM_ID +"/subscriptionCode";
var REQ_CREATE_SUBSCRIPTION_PLATFORM = REST_API_URL + "/platforms/subscriptions";
var REQ_PRODUCTS_OF_CATEGORY_OF_STAND = REST_API_URL + "/stand/"+ PARAM_STAND_ID +"/categories/"+ PARAM_CATEGORY_ID +"/products";
var REQ_CREATE_ORDER = REST_API_URL + "/stands/"+ PARAM_STAND_ID +"/orders";
var REQ_SET_ORDER_PRODUCT_READY = REST_API_URL + "/orders/"+ PARAM_ORDER_ID +"/products/" + PARAM_PRODUCT_ID + "/ready";
var REQ_ORDER_NOT_RETIRED = REST_API_URL + "/orders";
// END REQUESTS PATHS DEFINITIONS


// DEFAULT CONSTANTS
var DEFAULT_CHUNK_SIZE = 20;
// END DEFAULT CONSTANTS
//----------------------------------------------------------------------------------------------------------------------

// ERROR OBJECT DEFINITION
var CODE_UNKNOWN = -1;
var CODE_NETWORK_ABSENT = 0;
var Error = function (error){
    this.error = error;
};

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

//----------------------------------------------------------------------------------------------------------------------

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

function checkNetworkOrUnknownError(failureCallback){
    if(navigator.network.connection.type == Connection.NONE){
        failureCallback(new Error({status : CODE_NETWORK_ABSENT}));
    }else{
        failureCallback(new Error({status : CODE_UNKNOWN}));
    }
}

// END GLOBAL ERROR HANDLER

//----------------------------------------------------------------------------------------------------------------------

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
        checkNetworkOrUnknownError(failureCallback);
    });
}

function firebaseRefreshToken(successCallback, failureCallback){
    window.FirebasePlugin.onTokenRefresh(function(token) {
        firebaseSaveToken(token);
        successCallback(token);
    }, function(error) {
        checkNetworkOrUnknownError(failureCallback);
    });
}

function firebaseObserveNotification(successCallback, failureCallback){
    window.FirebasePlugin.onNotificationOpen(function(notification) {
        successCallback(notification);
    }, function(error) {
        failureCallback(error);
    });
}

//END FIREBASE

//----------------------------------------------------------------------------------------------------------------------

// GOOGLE AUTH
var WEB_CLIENT_ID = '806071370102-h2i7k86tb9shfgkqbibgg451svi9o3o6.apps.googleusercontent.com';
var KEY_GOOGLE_CREDENTIALS = "KGC";

function googleSaveCredentials(obj){
    window.localStorage.setItem(KEY_GOOGLE_CREDENTIALS,  JSON.stringify(obj));
}

function googleSilentLogin(successCallback, failureCallback){
    window.plugins.googleplus.trySilentLogin(
        {
            'webClientId' : WEB_CLIENT_ID
        },
        function (obj) {
            googleSaveCredentials(obj);
            successCallback(obj);
        },
        function (msg) {
            checkNetworkOrUnknownError(failureCallback);
        }
    );
}

function googleExplicitLogin(successCallback, failureCallback){
    window.plugins.googleplus.login(
        {
            'webClientId' : WEB_CLIENT_ID
        },
        function (obj) {
            googleSaveCredentials(obj);
            successCallback(obj);
        },
        function (msg) {
            checkNetworkOrUnknownError(failureCallback);
        }
    );
}
// END GOOGLE AUTH

//----------------------------------------------------------------------------------------------------------------------

// GENERAL CREDENTIALS DEFINITION
var KEY_APP_USER = "KAU";
function saveUser(obj){
    window.localStorage.setItem(KEY_APP_USER,  JSON.stringify(obj));
}

function updatePlatform(platform){
    var userInfo = getUserInfo();
    userInfo.genericPlatform = platform;
    saveUser(userInfo);
}

function isCurrentPlatform(platform){
    var userInfo = getUserInfo();
    return JSON.stringify(platform) == JSON.stringify(userInfo.genericPlatform);
}

function getUserInfo(){
    if(localStorage.getItem(this.KEY_APP_USER) === null){
        return null;
    }else{
        return JSON.parse(localStorage.getItem(this.KEY_APP_USER));
    }
}

function userInvalidateCredentials(successCallback){
    window.plugins.googleplus.disconnect(
        function (msg) {
            saveUser(null);
            googleSaveCredentials(null);
            successCallback();
        }
    );
}

function getStoredCredentials(){
    if(localStorage.getItem(this.KEY_GOOGLE_CREDENTIALS) === null ||
        localStorage.getItem(this.KEY_FIREBASE_TOKEN) === null){
        return null;
    }else{
        var credentials = JSON.parse(localStorage.getItem(this.KEY_GOOGLE_CREDENTIALS));
        credentials.firebaseToken = localStorage.getItem(this.KEY_FIREBASE_TOKEN);
        return credentials;
    }
}
// END GENERAL CREDENTIALS DEFINITION

// STORAGE MANAGEMENT
var KEY_CART = "KC";
var KEY_STAND_SELECTED = "KSS";
var KEY_CATEGORY_SELECTED = "KCS";
function initCart(){
    window.localStorage.setItem(KEY_CART,JSON.stringify({}));
}

function saveCart(cart){
    window.localStorage.setItem(KEY_CART,JSON.stringify(cart));
}

function getCart(){
    if(localStorage.getItem(this.KEY_CART) === null){
        return null;
    }else{
        return JSON.parse(localStorage.getItem(this.KEY_CART))
    }
}

function isCartEmptyForStand(standId){
    var cart = getCart();
    if(cart[standId] === undefined) {
        cart[standId] = new Array();
    }
    return cart[standId].length == 0;
}

function getCartProductsCount(){
    var counter = 0;
    var cart = getCart();
    for(var elem in cart){
        for(var prod in cart[elem]) {
            counter = counter + cart[elem][prod].quantity;
        }
    }
    return counter;
}

function removeCartElement(standId, product){
    var cart = getCart();
    if(cart[standId] === undefined) {
        cart[standId] = new Array();
    }

    var content = cart[standId].filter(function(elem){
        return elem.id === product.id;
    });

    if(content.length == 0){
        saveCart(cart);
        return true;
    }else{
        content[0].quantity --;
        if(content[0].quantity <= 0){
            cart[standId] = cart[standId].filter(function(elem){
                return elem.id != content[0].id;
            });
            saveCart(cart);
            return true;
        }else{
            saveCart(cart);
            return false;
        }
    }
}

function addProductToCartStand(standId, product){
    var cart = getCart();
    if(cart[standId] === undefined) {
        cart[standId] = new Array();
    }

    var content = cart[standId].filter(function(elem){
        return elem.id === product.id;
    });

    if(content.length == 0){
        product.quantity = 1;
        cart[standId].push(product);
    } else{
        content[0].quantity = content[0].quantity + 1;
    }

    saveCart(cart);
}

function addProductToCart(product){
    var cart = getCart();
    var standSelected = getSelectedStand();
    var categorySelected = getSelectedCategory();

    if(cart == null || standSelected == null || categorySelected == null ){
        return false;
    }

    if(cart[standSelected.id] === undefined) {
        cart[standSelected.id] = new Array();
    }

    var content = cart[standSelected.id].filter(function(elem){
        return elem.id === product.id;
    });

    if(content.length == 0){
        product.quantity = 1;
        cart[standSelected.id].push(product);
    } else{
        content[0].quantity = content[0].quantity + 1;
    }

    saveCart(cart);
    return true;
}


function saveStandSelected(stand){
    window.localStorage.setItem(KEY_STAND_SELECTED,JSON.stringify(stand));
}

function getSelectedStand(){
    if(localStorage.getItem(this.KEY_STAND_SELECTED) === null){
        return null;
    }else{
        return JSON.parse(localStorage.getItem(this.KEY_STAND_SELECTED))
    }
}
function saveCategorySelected(category){
    var catSavedJSON = {};
    catSavedJSON.id = category;
    window.localStorage.setItem(KEY_CATEGORY_SELECTED,JSON.stringify(catSavedJSON));
}

function getSelectedCategory(){
    if(localStorage.getItem(this.KEY_CATEGORY_SELECTED) === null){
        return null;
    }else{
        return JSON.parse(localStorage.getItem(this.KEY_CATEGORY_SELECTED))
    }
}
//


//----------------------------------------------------------------------------------------------------------------------

// QR-CODE manager
var QR_CODE_GENERATOR_API = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=";
function getQrCodeImageUrl(data){
    return QR_CODE_GENERATOR_API + data;
}
// QR-CODE manager

// REQUESTS DEFINITIONS

// This method must be called after google or facebook authentication

function execHttpRequest(path, options, successCallback, failureCallback, retryRequest, hasCredentialsRefreshed = false){
    cordova.plugin.http.sendRequest(path, options, function(response) {
        successCallback(JSON.parse(response.data));
    }, function(error) {
        errorHandler(retryRequest, failureCallback, error, hasCredentialsRefreshed);
    });
}

function login(successCallback, failureCallback, wasTokenRefreshed = false){
    var credentials = getStoredCredentials();
    console.log("GOOGLE TOKEN -> " + credentials.idToken);
    console.log("EMAIL -> " + credentials.email);
    console.log("FIREBASE TOKEN -> " + credentials.firebaseToken);
    const options = {
        method: 'post',
        data: {
            idToken: credentials.idToken,
            email: credentials.email,
            firebaseToken: credentials.firebaseToken
        },
        serializer: 'json'
    };

    execHttpRequest(REQ_AUTH_PATH, options, function(response){
        saveUser(response);
        initCart();
        successCallback(response.data);
    }, failureCallback, function(wasTokenRefreshed){
           login(successCallback, failureCallback, wasTokenRefreshed);
    }, wasTokenRefreshed);
}

function getStands(successCallback, failureCallback, offset, count = DEFAULT_CHUNK_SIZE, wasTokenRefreshed = false){
    var credentials = getStoredCredentials();
    const options = {
        method: 'get'
    };
    var formattedRequest = REQ_STANDS +
        "?token=" +credentials.idToken +
        "&offset=" +offset +
        "&count=" +count;

    execHttpRequest(formattedRequest, options, successCallback, failureCallback, function(wasTokenRefreshed){
        getStands(successCallback, failureCallback, offset, count, wasTokenRefreshed);
    }, wasTokenRefreshed);
}

function getUserPlatforms(successCallback, failureCallback, wasTokenRefreshed = false){
    var credentials = getStoredCredentials();
    const options = {
        method: 'get'
    };
    var formattedRequest = REQ_PLATFORMS_ALL + "?token=" +credentials.idToken;

    execHttpRequest(formattedRequest, options, successCallback, failureCallback, function(wasTokenRefreshed){
        getUserPlatforms(successCallback, failureCallback, wasTokenRefreshed);
    }, wasTokenRefreshed);
}

function getRoomCategories(successCallback, failureCallback, roomId, wasTokenRefreshed = false){
    var credentials = getStoredCredentials();
    const options = {
        method: 'get'
    };
    var formattedRequest = REQ_CATEGORIES_ROOM.replace(PARAM_ROOM_ID, roomId.toString()) + "?token=" +credentials.idToken;

    execHttpRequest(formattedRequest, options, successCallback, failureCallback, function(wasTokenRefreshed){
        getRoomCategories(successCallback, failureCallback, roomId, wasTokenRefreshed);
    }, wasTokenRefreshed);
}

function getStandCategories(successCallback, failureCallback, standId, wasTokenRefreshed = false){
    var credentials = getStoredCredentials();
    const options = {
        method: 'get'
    };
    var formattedRequest = REQ_CATEGORIES_STAND.replace(PARAM_STAND_ID, standId.toString()) + "?token=" +credentials.idToken;

    execHttpRequest(formattedRequest, options, successCallback, failureCallback, function(wasTokenRefreshed){
        getStandCategories(successCallback, failureCallback, standId, wasTokenRefreshed);
    }, wasTokenRefreshed);
}

function getProductsOfCategoryOfStand(successCallback, failureCallback, standId, categoryId, wasTokenRefreshed = false){
     var credentials = getStoredCredentials();
     const options = {
         method: 'get'
     };

     var formattedRequest = REQ_PRODUCTS_OF_CATEGORY_OF_STAND
                                .replace(PARAM_STAND_ID, standId.toString())
                                .replace(PARAM_CATEGORY_ID, categoryId.toString()) + "?token=" +credentials.idToken;

     execHttpRequest(formattedRequest, options, successCallback, failureCallback, function(wasTokenRefreshed){
         getProductsOfCategoryOfStand(successCallback, failureCallback, standId, categoryId, wasTokenRefreshed);
     }, wasTokenRefreshed);
 }

function deleteCategoryFromRoom(successCallback, failureCallback, categoryId, roomId, wasTokenRefreshed = false){
    var credentials = getStoredCredentials();
    const options = {
        method: 'delete'
    };

    var formattedRequest = REQ_DELETE_CATEGORY_FROM_ROOM
            .replace(PARAM_CATEGORY_ID, categoryId)
            .replace(PARAM_ROOM_ID, roomId) + "?token=" +credentials.idToken;

    execHttpRequest(formattedRequest, options, successCallback, failureCallback, function(wasTokenRefreshed){
        deleteCategoryFromRoom(successCallback, failureCallback, categoryId, roomId, wasTokenRefreshed);
    }, wasTokenRefreshed);
}

function deletePlatformSubscriber(successCallback, failureCallback, platformId, wasTokenRefreshed = false){
    var credentials = getStoredCredentials();
    const options = {
        method: 'delete'
    };
    var formattedRequest = REQ_DELETE_PLATFORM_SUBSCRIBER.replace(PARAM_PLATFORM_ID, platformId.toString()) + "?token=" +credentials.idToken;

    execHttpRequest(formattedRequest, options, successCallback, failureCallback, function(wasTokenRefreshed){
        deletePlatformSubscriber(successCallback, failureCallback, platformId, wasTokenRefreshed);
    }, wasTokenRefreshed);
}

function addCategoryToRoom(successCallback, failureCallback, roomId, categoryId, wasTokenRefreshed = false){
    var credentials = getStoredCredentials();
    const options = {
        method: 'post',
        data: {
            key: roomId,
            value: categoryId,
        },
        serializer: 'json'
    };
    var formattedRequest = REQ_ADD_CATEGORY_TO_ROOM + "?token=" + credentials.idToken;

    execHttpRequest(formattedRequest, options, successCallback, failureCallback, function(wasTokenRefreshed){
        addCategoryToRoom(successCallback, failureCallback, roomId, categoryId, wasTokenRefreshed);
    }, wasTokenRefreshed);
}


function getStandRooms(successCallback, failureCallback, standId, wasTokenRefreshed = false){
    var credentials = getStoredCredentials();
    const options = {
        method: 'get'
    };
    var formattedRequest = REQ_GET_STAND_ROOMS.replace(PARAM_STAND_ID, standId) + "?token=" + credentials.idToken;

    execHttpRequest(formattedRequest, options, successCallback, failureCallback, function(wasTokenRefreshed){
        getStandRooms(successCallback, failureCallback, standId, wasTokenRefreshed);
    }, wasTokenRefreshed);
}

function createRoomForStand(successCallback, failureCallback, roomName, standId, wasTokenRefreshed = false){
    var credentials = getStoredCredentials();
    const options = {
        method: 'post',
        data: {
            name: roomName,
            stand: { id: standId },
        },
        serializer: 'json'
    };
    var formattedRequest = REQ_CREATE_ROOM_FOR_STAND + "?token=" + credentials.idToken;

    execHttpRequest(formattedRequest, options, successCallback, failureCallback, function(wasTokenRefreshed){
        createRoomForStand(successCallback, failureCallback, roomName, standId, wasTokenRefreshed);
    }, wasTokenRefreshed);
}

function getRoomSubscriptionCode(successCallback, failureCallback, roomId, wasTokenRefreshed = false){
    var credentials = getStoredCredentials();
    const options = {
        method: 'get'
    };
    var formattedRequest = REQ_ROOM_SUBSCRIPTION_CODE.replace(PARAM_ROOM_ID, roomId) + "?token=" + credentials.idToken;

    execHttpRequest(formattedRequest, options, successCallback, failureCallback, function(wasTokenRefreshed){
        getRoomSubscriptionCode(successCallback, failureCallback, roomId, wasTokenRefreshed);
    }, wasTokenRefreshed);
}

function createSubscriptionPlatform(successCallback, failureCallback, platformName, roomCode, wasTokenRefreshed = false){
    var credentials = getStoredCredentials();
    const options = {
        method: 'post',
        data: {
            standRoomSubscriptionCode: roomCode,
            platformSubscriptionName: platformName,
        },
        serializer: 'json'
    };
    var formattedRequest = REQ_CREATE_SUBSCRIPTION_PLATFORM + "?token=" + credentials.idToken;

    execHttpRequest(formattedRequest, options, successCallback, failureCallback, function(wasTokenRefreshed){
        createSubscriptionPlatform(successCallback, failureCallback, platformName, roomCode, wasTokenRefreshed);
    }, wasTokenRefreshed);
}

function createOrder(successCallback, failureCallback, standId, data, wasTokenRefreshed = false){
    var credentials = getStoredCredentials();
    const options = {
        method: 'post',
        data: {
            products : data
        },
        serializer: 'json'
    };
    var formattedRequest = REQ_CREATE_ORDER.replace(PARAM_STAND_ID, standId) + "?token=" + credentials.idToken;

    execHttpRequest(formattedRequest, options, successCallback, failureCallback, function(wasTokenRefreshed){
        createOrder(successCallback, failureCallback, standId, data, wasTokenRefreshed);
    }, wasTokenRefreshed);
}

function setProductsOfOrderReady(successCallback, failureCallback, orderId, productId, endTimeMillis, wasTokenRefreshed = false){
     var credentials = getStoredCredentials();
     const options = {
         method: 'post',
         data: {
             closureTime : endTimeMillis
         },
         serializer: 'json'
     };


     var formattedRequest = REQ_SET_ORDER_PRODUCT_READY
        .replace(PARAM_ORDER_ID, orderId)
        .replace(PARAM_PRODUCT_ID, productId) + "?token=" + credentials.idToken;

     execHttpRequest(formattedRequest, options, successCallback, failureCallback, function(wasTokenRefreshed){
         setProductsOfOrderReady(successCallback, failureCallback, orderId, productId, endTimeMillis, wasTokenRefreshed);
     }, wasTokenRefreshed);
 }

function getOrdersNotRetired(successCallback, failureCallback, wasTokenRefreshed = false){
    var credentials = getStoredCredentials();
    const options = {
        method: 'get'
    };
    var formattedRequest = REQ_ORDER_NOT_RETIRED+ "?token=" + credentials.idToken;

    execHttpRequest(formattedRequest, options, successCallback, failureCallback, function(wasTokenRefreshed){
        getOrdersNotRetired(successCallback, failureCallback, wasTokenRefreshed);
    }, wasTokenRefreshed);
}

function retireOrder(successCallback, failureCallback, retireCode, wasTokenRefreshed = false){
     var credentials = getStoredCredentials();
     const options = {
         method: 'post',
         data: {
             retireOrderCode : retireCode
         },
         serializer: 'json'
     };


     var formattedRequest = REQ_ORDER_NOT_RETIRED + "?token=" + credentials.idToken;

     execHttpRequest(formattedRequest, options, successCallback, failureCallback, function(wasTokenRefreshed){
         retireOrder(successCallback, failureCallback, retireCode, wasTokenRefreshed);
     }, wasTokenRefreshed);
 }

// END REQUESTS

//----------------------------------------------------------------------------------------------------------------------