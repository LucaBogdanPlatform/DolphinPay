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
        attachBaseMenuListeners();
        attachBaseLeftMenuListeners();
        attachLeftMenuListener();
        initialContent();
        setScrollListener();
    },

    onPause: function() {

    },
    onResume: function(event) {

    }
//    onBackKeyDown: function(){
//        alert("A");
//        navigator.app.exitApp();
//        return false;
//    }
}
app.initialize();

function attachLeftMenuListener(){
    var newSubscriptionButton = document.getElementById("menu-new-subscription-button");

    newSubscriptionButton.onclick = onNewSubscriptionListener;
}


function onNewSubscriptionListener(o){
    //QRScanner.prepare(onDone); // show the prompt
}


function onDone(err, status){
    if (err) {
        // here we can handle errors and clean up any loose ends.
        console.error(err);
    }if (status.authorized) {
        // W00t, you have camera access and the scanner is initialized.
        QRScanner.show();

    } else if (status.denied) {
        // The video preview will remain black, and scanning is disabled. We can
        // try to ask the user to change their mind, but we'll have to send them
        // to their device settings with `QRScanner.openSettings()`.
    } else {
        // we didn't get permission, but we didn't get permanently denied. (On
        // Android, a denial isn't permanent unless the user checks the "Don't
        // ask again" box.) We can ask again at the next relevant opportunity.
    }
}