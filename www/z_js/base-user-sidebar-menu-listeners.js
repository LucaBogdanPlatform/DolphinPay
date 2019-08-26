function attachBaseLeftMenuListeners(){
    var username = document.getElementById('username');
    var userNameAndSurname = document.getElementById('user-name-surname');

    var userInfo = getUserInfo();
    userNameAndSurname.innerHTML = userInfo.username;
}
