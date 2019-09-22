
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
        setBackButtonListener();
    },

    onPause: function() {

    },
    onResume: function(event) {

    }
}
app.initialize();

function setBackButtonListener(){
    document.getElementById("back-button").onclick = function(){
        PGMultiView.dismissView("");
    }
}
function setBackButtonListener(){
    backButtonDOM.onclick = function(){
        PGMultiView.dismissView("");
    }
}