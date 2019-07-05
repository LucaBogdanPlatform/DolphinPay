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
    var elements = document.getElementsByTagName('body');
    setTimeout(function(){
        elements[0].style.opacity = 1;
            (function fade(){
                var opacloader = parseFloat(elements[0].style.opacity);
                (elements[0].style.opacity = opacloader - .1)<0.1?
                window.location = 'z_pages/login.html':setTimeout(fade,40)})();
    }, START_ACTIVITY_DELAY_MILLIS);
}
