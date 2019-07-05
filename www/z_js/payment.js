receivedEvent = function() {
    initPaymentUI();   // start to initialize PayPalMobile library
}

/**
* @var {Object} clientIDs: Used for set the client (in this case our sandbox)
*/
initPaymentUI = function() {
    var clientIDs = {
      "PayPalEnvironmentProduction": "AYc-ZjjWKMGZT1Sylbo0GgZAui-Uzl14J_-bCq6IoLY-F0aDDhUTO9vuaejGIpA0WBe7hZDM6xHcgmG6",
      "PayPalEnvironmentSandbox": "AYc-ZjjWKMGZT1Sylbo0GgZAui-Uzl14J_-bCq6IoLY-F0aDDhUTO9vuaejGIpA0WBe7hZDM6xHcgmG6"
    };
    PayPalMobile.init(clientIDs, onPayPalMobileInit);
}


onSuccesfulPayment = function(payment) {
    console.log("payment success: " + JSON.stringify(payment, null, 4));
}


onAuthorizationCallback = function(authorization) {
    console.log("authorization: " + JSON.stringify(authorization, null, 4));
}


createPayment = function() {
    var paymentDetails = new PayPalPaymentDetails("9.99", "1.00", "1.00");
    var payment = new PayPalPayment("9.99", "EUR", "Total:", "Sale",
      paymentDetails);
    return payment;
}


configuration = function() {
    // for more options see `paypal-mobile-js-helper.js`
    var config = new PayPalConfiguration({
      merchantName: "My test shop",
      merchantPrivacyPolicyURL: "https://mytestshop.com/policy",
      merchantUserAgreementURL: "https://mytestshop.com/agreement"
    });
    return config;
}


onPrepareRender = function() {
    var buyNowBtn = document.getElementById("buyNowBtn");
    buyNowBtn.onclick = function(e) {
      PayPalMobile.renderSinglePaymentUI(createPayment(), onSuccesfulPayment,onUserCanceled);
    };
}


onPayPalMobileInit = function() {
    //when is ready put into PayPalEnvironmentProduction
    PayPalMobile.prepareToRender("PayPalEnvironmentSandbox", configuration(),
      onPrepareRender);
}


onUserCanceled = function(result) {
    console.log(result);
}