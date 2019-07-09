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

function loadPageDelayed(page){
    var elements = document.getElementsByTagName('body');
    setTimeout(function(){
        elements[0].style.opacity = 1;
            (function fade(){
                var opacloader = parseFloat(elements[0].style.opacity);
                (elements[0].style.opacity = opacloader - .1)<0.1?
                window.location = page:setTimeout(fade,40)})();
    }, START_ACTIVITY_DELAY_MILLIS);
}
