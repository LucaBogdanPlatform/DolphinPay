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
    },
    onPause: function() {

    },
    onResume: function(event) {

    }
}
app.initialize();


function attachBaseMenuListeners(){
    var userEnvironmentsButton = document.getElementById('user-environments-button');
    var logoutButton = document.getElementById('logout-button');
    userEnvironmentsButton.onclick = environmentsOnClickListener;
    logoutButton.onclick = logoutOnClickListener;
}

function environmentsOnClickListener(e){
    var ref = window.open('../z_pages/environments.html', '_self', 'location=no,hidenavigationbuttons=yes,zoom=no');
    //cordova.InAppBrowser.open('../z_pages/environments.html', '_blank', 'location=no,hidenavigationbuttons=yes,zoom=no');
}

function logoutOnClickListener(e){
    userInvalidateCredentials(function(){
        var ref = window.open('../z_pages/login.html', '_self', 'location=no,hidenavigationbuttons=yes,zoom=no');
    });
}