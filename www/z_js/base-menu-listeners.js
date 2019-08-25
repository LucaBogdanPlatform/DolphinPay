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
    webview.Show('z_pages/environments.html');
}

function logoutOnClickListener(e){
    userInvalidateCredentials(function(){
        webview.Close();
        webview.Show('z_pages/login.html');
    });
}