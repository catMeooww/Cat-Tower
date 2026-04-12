var user = localStorage.getItem("user");
var password = localStorage.getItem("password");
var logged = false;

const firebaseConfig = {
    apiKey: "AIzaSyALeqVEk8nRUaaOjfZs8XPnMrLMH3rH-9I",
    authDomain: "cat-meooww-simplegames.firebaseapp.com",
    databaseURL: "https://cat-meooww-simplegames-default-rtdb.firebaseio.com",
    projectId: "cat-meooww-simplegames",
    storageBucket: "cat-meooww-simplegames.appspot.com",
    messagingSenderId: "326771151835",
    appId: "1:326771151835:web:f551cd3e7e98c6b5694dfe"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

function loadUserData() {
    if (user != undefined && password != undefined) {
        var userref = firebase.database().ref("/cattower/users/" + user + "/status");
        var passref = firebase.database().ref("/cattower/users/" + user + "/password");
        var isUserCreated;
        var isJoining = false;
        userref.on("value", data => {
            isUserCreated = data.val();
            console.log("logged: " + logged);
            if (!isJoining) {
                isJoining = true;
                if (isUserCreated == "online" || isUserCreated == "mod") {
                    passref.on("value", data => {
                        canPass = data.val();
                        if (canPass == password) {
                            logged = true;
                            userLogged();
                        }else{
                          userFallback();  
                        }
                    })
                }else{
                    userFallback();
                }
            }
        });
    }else{
        userFallback();
    }
    console.log("logged: " + logged);
}