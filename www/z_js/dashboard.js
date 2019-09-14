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
        if(window.localStorage.getItem("Cart") == null) window.localStorage.setItem("Cart",{})
        attachBaseMenuListeners();
        attachBaseLeftMenuListeners();
        initialContent();
        setScrollListener();
    },
    onPause: function() {

    },
    onResume: function(event) {

    }
}
app.initialize();

document.addEventListener("backbutton", function (e) {
      PGMultiView.dismissView("");
});
