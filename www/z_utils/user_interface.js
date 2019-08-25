var START_ACTIVITY_DELAY_MILLIS = 2000;

function showDialogSingleAction(message, title, buttonTxt, confirmCallback){
    getStringsResources([
        message,
        title,
        buttonTxt
    ], function(translations){
        navigator.notification.confirm(
            translations[0], // message
            confirmCallback,       // callback to invoke with index of button pressed
            translations[1],      // title
            [translations[2]]     // buttonLabels
        );
    });
}
