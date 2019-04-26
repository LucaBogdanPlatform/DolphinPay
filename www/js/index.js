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
/*

    const options = {
      method: 'get',
    };

    cordova.plugin.http.sendRequest('http://dolphinpay.us-west-2.elasticbeanstalk.com/ts', options, function(response) {
      // prints 200
      console.log(response.data);
    }, function(response) {
      // prints 403
      console.log(response.status);

      //prints Permission denied
      console.log(response.error);
    });

        window.FirebasePlugin.getToken(function(token) {
            // save this server-side and use it to push notifications to this device
            console.log(token);
        }, function(error) {
            console.error(error);
        });

        // Get notified when a token is refreshed
        window.FirebasePlugin.onTokenRefresh(function(token) {
            // save this server-side and use it to push notifications to this device
            console.log("Refresh to get new token: " + token);
        }, function(error) {
            alert(error);
        });

        // Get notified when the user opens a notification
        window.FirebasePlugin.onNotificationOpen(function(notification) {
            console.log(JSON.stringify(notification));
            alert("The notification is open!");
        }, function(error) {
            console.error(error);
        });

*/

    },
    onPause: function() {

    },
    onResume: function(event) {
        $("#xxx").append("<p> hello world again</p>");

    }
}
app.initialize();

