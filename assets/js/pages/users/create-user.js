function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

async function postData(url = '', data = {}) {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return response.json()
}

function create_user() {
    var ok = 0
    var no = 0
    if(document.getElementById("first-name").value.length > 2) {
        document.getElementById("first-name").classList.remove('is-invalid')
        document.getElementById("first-name").classList.add('is-valid')
        ok++
    } else {
        document.getElementById("first-name").classList.remove('is-valid')
        document.getElementById("first-name").classList.add('is-invalid')
        document.getElementById("first-name").value = ""
        no++
    }

    if(document.getElementById("username-input").value.length > 2) {
        fetch(`https://api.mercurycloud.fr/api/users/username-exist?uuid=${getCookie("uuid")}&token=${getCookie("token")}&username=${document.getElementById("username-input").value}`)
        .then(function (response) {
          return response.json();
        })
        .then(function (myJson) { 
            if(myJson.exist == false) {
                document.getElementById("username-input").classList.remove('is-invalid')
                document.getElementById("username-input").classList.add('is-valid')
                document.getElementById("username-toast").innerHTML = ``
                ok++
            } else {
                no++
                document.getElementById("username-input").classList.remove('is-valid')
                document.getElementById("username-input").classList.add('is-invalid')
                document.getElementById("username-input").value = ""
                if (myJson.error != true) {
                    document.getElementById("username-toast").innerHTML = `<div class="toast-body">Le nom d'utilisateur ${document.getElementById("username-input").value} éxiste déja !</div>`
                }
            }
        })
    } else {
        document.getElementById("username-input").classList.remove('is-valid')
        document.getElementById("username-input").classList.add('is-invalid')
        document.getElementById("username-input").value = ""
        no++
    }


    if(document.getElementById("last-name").value.length > 2) {
        document.getElementById("last-name").classList.remove('is-invalid')
        document.getElementById("last-name").classList.add('is-valid')
        ok++
    } else {
        document.getElementById("last-name").classList.remove('is-valid')
        document.getElementById("last-name").classList.add('is-invalid')
        document.getElementById("last-name").value = ""
        no++
    }


    if(document.getElementById("mail").value.length > 2) {
        fetch(`https://api.mercurycloud.fr/api/users/mail-exist?uuid=${getCookie("uuid")}&token=${getCookie("token")}&mail=${document.getElementById("mail").value}`)
        .then(function (response) {
          return response.json();
        })
        .then(function (myJson) { 
            if(myJson.exist == false) {
                document.getElementById("mail").classList.remove('is-invalid')
                document.getElementById("mail").classList.add('is-valid')
                document.getElementById("mail-toast").innerHTML = ``
                ok++
            } else {
                document.getElementById("mail").classList.remove('is-valid')
                document.getElementById("mail").classList.add('is-invalid')
                document.getElementById("mail").value = ""
                if (myJson.error != true) {
                    document.getElementById("mail-toast").innerHTML = `<div class="toast-body">L'adresse mail ${document.getElementById("mail").value} est déja utilisé !</div>`
                }
                no++
            }
        })
    } else {
        document.getElementById("mail").classList.remove('is-valid')
        document.getElementById("mail").classList.add('is-invalid')
        document.getElementById("mail").value = ""
        no++
    }

    
    if(document.getElementById("password").value.length >= 8) {
        document.getElementById("password").classList.remove('is-invalid')
        document.getElementById("password").classList.add('is-valid')
        ok++
    } else {
        document.getElementById("password").classList.remove('is-valid')
        document.getElementById("password").classList.add('is-invalid')
        document.getElementById("password").value = ""
        no++
    }


    if(document.getElementById("tel").value.length == 12 && document.getElementById("tel").value.match(/[0-9]/gi) != null && document.getElementById("tel").value.includes("+", 0) == true) {
        document.getElementById("tel").classList.remove('is-invalid')
        document.getElementById("tel").classList.add('is-valid')
        ok++
    } else {
        document.getElementById("tel").classList.remove('is-valid')
        document.getElementById("tel").classList.add('is-invalid')
        document.getElementById("tel").value = ""
        no++
    }


    if(document.getElementById("address-1").value.length > 2) {
        document.getElementById("address-1").classList.remove('is-invalid')
        document.getElementById("address-1").classList.add('is-valid')
        ok++
    } else {
        document.getElementById("address-1").classList.remove('is-valid')
        document.getElementById("address-1").classList.add('is-invalid')
        document.getElementById("address-1").value = ""
        no++
    }


    if(document.getElementById("city").value.length > 2) {
        document.getElementById("city").classList.remove('is-invalid')
        document.getElementById("city").classList.add('is-valid')
        ok++
    } else {
        document.getElementById("city").classList.remove('is-valid')
        document.getElementById("city").classList.add('is-invalid')
        document.getElementById("city").value = ""
        no++
    }


    if(document.getElementById("zip").value.length == 5 && /^\d+$/.test(document.getElementById("zip").value) == true) {
        document.getElementById("zip").classList.remove('is-invalid')
        document.getElementById("zip").classList.add('is-valid')
        ok++
    } else {
        document.getElementById("zip").classList.remove('is-valid')
        document.getElementById("zip").classList.add('is-invalid')
        document.getElementById("zip").value = ""
        no++
    }


    if(document.getElementById("country").value > 0) {
        document.getElementById("country").classList.remove('is-invalid')
        document.getElementById("country").classList.add('is-valid')
        ok++
    } else {
        document.getElementById("country").classList.remove('is-valid')
        document.getElementById("country").classList.add('is-invalid')
        document.getElementById("country").value = ""
        no++
    }


    if(document.getElementById("state").value.length > 2) {
        document.getElementById("state").classList.remove('is-invalid')
        document.getElementById("state").classList.add('is-valid')
        ok++
    } else {
        document.getElementById("state").classList.remove('is-valid')
        document.getElementById("state").classList.add('is-invalid')
        document.getElementById("state").value = ""
        no++
    }   

    console.log("ok " + ok + " no " + no)

    if(ok == 11 && no == 0) {       
        body = {
            "username": document.getElementById("username-input").value,
            "mail": document.getElementById("mail").value,
            "password": document.getElementById("password").value,
        }
        postData(`https://api.mercurycloud.fr/api/users/create-user?uuid=${getCookie("uuid")}&token=${getCookie("token")}`, body).then(data => {
            if (data.error == false) {
                window.location.replace("/dashboard/users/users-list.html")
            } else {
                console.log('[ERROR] ' + data);
                location.href = "../errors/error500.html";
            }
        })    
        
    }
}