function attachBaseMenuListeners(){
    var userEnvironmentsButton = document.getElementById('user-environments-button');
    var logoutButton = document.getElementById('logout-button');
    userEnvironmentsButton.onclick = environmentsOnClickListener;
    logoutButton.onclick = logoutOnClickListener;
}

function environmentsOnClickListener(e){
    PGMultiView.loadView("environments.html","", function(){PGMultiView.dismissView("")});
}

function logoutOnClickListener(e){
    userInvalidateCredentials(function(){PGMultiView.loadView("login.html","", function(){PGMultiView.dismissView("");})});
}