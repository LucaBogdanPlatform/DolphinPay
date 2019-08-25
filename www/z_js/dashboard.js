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
        document.addEventListener("backbutton", this.onBackKeyDown, false);

        environmentsContainerDOM = document.getElementById("environments-container");
        backButtonDOM = document.getElementById("back-button");

        initialContent();
        setScrollListener();
        attachBaseMenuListeners();
        setBackButtonListener();
        getUserEnvironments();
    },

    onPause: function() {

    },
    onResume: function(event) {

    },
    onBackKeyDown: function(){
        alert("A");
        navigator.app.exitApp();
        return false;
    }
}
app.initialize();