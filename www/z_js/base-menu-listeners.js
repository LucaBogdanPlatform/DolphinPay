function attachBaseMenuListeners(){
    var userEnvironmentsButton = document.getElementById('user-environments-button');
    var logoutButton = document.getElementById('logout-button');
    userEnvironmentsButton.onclick = environmentsOnClickListener;
    logoutButton.onclick = logoutOnClickListener;
}

function environmentsOnClickListener(e){
    webview.Show('z_pages/environments.html');
}

function logoutOnClickListener(e){
    userInvalidateCredentials(function(){
        webview.Close();
        webview.Show('z_pages/login.html');
    });
}