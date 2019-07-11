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
//        getPartnershipsPlatforms(function(data){
//            alert(data);
//        }, function(e){
//        }, 0, 20);
    },
    onPause: function() {

    },
    onResume: function(event) {

    }
}
app.initialize();
