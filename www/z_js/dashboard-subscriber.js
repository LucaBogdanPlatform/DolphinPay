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
        attachMenuListeners();

        window.FirebasePlugin.onNotificationOpen(function(notification) {
        alert("aarrrivataNotifica");
        }, function(error) {
        alert("aaaaa");
        });
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

function attachMenuListeners(){
    var userNameAndSurname = document.getElementById('menu-configuration-button');
    userNameAndSurname.onclick = menuConfigurationButtonOnClickListener;


}

function menuConfigurationButtonOnClickListener(){
    webview.Show("z_pages/subscriber-configuration.html");
}