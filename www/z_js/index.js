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
        init();
    },
    onPause: function() {

    },
    onResume: function(event) {

    }
}
app.initialize();

var START_ACTIVITY_DELAY_MILLIS = 3000;

function init(){
    setTimeout(function(){
        window.location = "z_pages/login.html"
    }, START_ACTIVITY_DELAY_MILLIS);
}
