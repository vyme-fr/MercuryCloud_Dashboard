function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

async function putData(url = '', data = {}) {
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
            
            
        },
        body: JSON.stringify(data)
    });
    return response.json()
}

var uuid_string = ""
const url = new URL(window.location.href);
if (url.searchParams.get('id')) {
    fetch(api_url + `users/${url.searchParams.get('id')}`, {
        headers: {
            
            
        }
    }).then(function (response) {
        return response.json();
    })
        .then(function (json) {
            if (json.error === false) {
                if (json.data.uuid == 404) {
                    window.location.replace("/errors/error404.html");
                } else {
                    fetch(api_url + `roles`, {
                        headers: {
                            
                            
                        }
                    }).then(function (response) {
                        return response.json();
                    }).then(function (json1) {
                        var roles_select = `<option selected="" value="0">--</option>`
                        for (let i = 0; i < json1.roles.length; i++) {
                            roles_select = roles_select + `<option value="${json1.roles[i].id}">${json1.roles[i].name}</option>`
                        }
                        document.getElementById("roles-select").innerHTML = roles_select
                        document.getElementById('roles-select').value = json.data.role
                    })
                    document.getElementById("title").innerHTML = `Mercury Cloud | Edition de ${json.data.username}`
                    document.getElementById("username_title").innerHTML = `Edition de ${json.data.username}`
                    document.getElementById('username-input').value = json.data.username
                    document.getElementById('mail').value = json.data.mail
                    document.getElementById('password').value = "Q@4%738r$7"
                    document.getElementById('first-name').value = json.data.first_name
                    document.getElementById('last-name').value = json.data.last_name
                    document.getElementById('tel').value = json.data.tel
                    document.getElementById('address-1').value = json.data.address_1
                    document.getElementById('address-2').value = json.data.address_2
                    document.getElementById('city').value = json.data.city
                    document.getElementById('zip').value = json.data.zip
                    document.getElementById('country').value = json.data.country
                    document.getElementById('state').value = json.data.state
                    uuid_string = json.data.uuid
                }
            } else {
                // window.location.replace("/errors/error500.html");
            }
        })
} else {
    window.location.replace("/errors/error404.html");
}

function save_user() {
    var ok = 0
    var no = 0
    if (document.getElementById("first-name").value.length > 2) {
        document.getElementById("first-name").classList.remove('is-invalid')
        document.getElementById("first-name").classList.add('is-valid')
        ok++
    } else {
        document.getElementById("first-name").classList.remove('is-valid')
        document.getElementById("first-name").classList.add('is-invalid')
        document.getElementById("first-name").value = ""
        no++
    }

    if (document.getElementById("roles-select").value != 0) {
        document.getElementById("roles-select").classList.remove('is-invalid')
        document.getElementById("roles-select").classList.add('is-valid')
        ok++
    } else {
        document.getElementById("roles-select").classList.remove('is-valid')
        document.getElementById("roles-select").classList.add('is-invalid')
        document.getElementById("roles-select").value = ""
        no++
    }

    if (document.getElementById("username-input").value.length > 2) {
        fetch(api_url + `users/username-exist?username=${document.getElementById("username-input").value}`, {
            headers: {
                
                
            }
        }).then(function (response) {
            return response.json();
        })
            .then(function (myJson) {
                if (myJson.exist == false) {
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


    if (document.getElementById("last-name").value.length > 2) {
        document.getElementById("last-name").classList.remove('is-invalid')
        document.getElementById("last-name").classList.add('is-valid')
        ok++
    } else {
        document.getElementById("last-name").classList.remove('is-valid')
        document.getElementById("last-name").classList.add('is-invalid')
        document.getElementById("last-name").value = ""
        no++
    }


    if (document.getElementById("mail").value.length > 2) {
        fetch(api_url + `users/mail-exist?mail=${document.getElementById("mail").value}`, {
            headers: {
                
                
            }
        }).then(function (response) {
            return response.json();
        })
            .then(function (myJson) {
                if (myJson.exist == false) {
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


    if (document.getElementById("password").value.length >= 8) {
        document.getElementById("password").classList.remove('is-invalid')
        document.getElementById("password").classList.add('is-valid')
        ok++
    } else {
        document.getElementById("password").classList.remove('is-valid')
        document.getElementById("password").classList.add('is-invalid')
        document.getElementById("password").value = ""
        no++
    }


    if (document.getElementById("tel").value.length == 12 && document.getElementById("tel").value.match(/[0-9]/gi) != null && document.getElementById("tel").value.includes("+", 0) == true) {
        document.getElementById("tel").classList.remove('is-invalid')
        document.getElementById("tel").classList.add('is-valid')
        ok++
    } else {
        document.getElementById("tel").classList.remove('is-valid')
        document.getElementById("tel").classList.add('is-invalid')
        document.getElementById("tel").value = ""
        no++
    }


    if (document.getElementById("address-1").value.length > 2) {
        document.getElementById("address-1").classList.remove('is-invalid')
        document.getElementById("address-1").classList.add('is-valid')
        ok++
    } else {
        document.getElementById("address-1").classList.remove('is-valid')
        document.getElementById("address-1").classList.add('is-invalid')
        document.getElementById("address-1").value = ""
        no++
    }


    if (document.getElementById("city").value.length > 2) {
        document.getElementById("city").classList.remove('is-invalid')
        document.getElementById("city").classList.add('is-valid')
        ok++
    } else {
        document.getElementById("city").classList.remove('is-valid')
        document.getElementById("city").classList.add('is-invalid')
        document.getElementById("city").value = ""
        no++
    }


    if (document.getElementById("zip").value.length == 5 && /^\d+$/.test(document.getElementById("zip").value) == true) {
        document.getElementById("zip").classList.remove('is-invalid')
        document.getElementById("zip").classList.add('is-valid')
        ok++
    } else {
        document.getElementById("zip").classList.remove('is-valid')
        document.getElementById("zip").classList.add('is-invalid')
        document.getElementById("zip").value = ""
        no++
    }


    if (document.getElementById("country").value > 0) {
        document.getElementById("country").classList.remove('is-invalid')
        document.getElementById("country").classList.add('is-valid')
        ok++
    } else {
        document.getElementById("country").classList.remove('is-valid')
        document.getElementById("country").classList.add('is-invalid')
        document.getElementById("country").value = ""
        no++
    }


    if (document.getElementById("state").value.length > 2) {
        document.getElementById("state").classList.remove('is-invalid')
        document.getElementById("state").classList.add('is-valid')
        ok++
    } else {
        document.getElementById("state").classList.remove('is-valid')
        document.getElementById("state").classList.add('is-invalid')
        document.getElementById("state").value = ""
        no++
    }

    if (ok == 10 && no == 0) {
        body = {
            "username": document.getElementById("username-input").value,
            "role": document.getElementById("roles-select").value,
            "mail": document.getElementById("mail").value,
            "password": document.getElementById("password").value,
            "first_name": document.getElementById("first-name").value,
            "last_name": document.getElementById("last-name").value,
            "tel": document.getElementById("tel").value,
            "address_1": document.getElementById("address-1").value,
            "address_2": document.getElementById("address-2").value,
            "city": document.getElementById("city").value,
            "zip": document.getElementById("zip").value,
            "country": document.getElementById("country").value,
            "state": document.getElementById("state").value
        }
        putData(api_url + `users/${uuid_string}`, body).then(data => {
            if (data.error == false) {
                window.location.reload()
            } else {
                console.log('[ERROR] Code : ' + data.code + ' Message : ' + data.msg);
                if (data.code == 403) {
                    location.href = "../errors/error403.html"
                } else {
                    location.href = "../errors/error500.html"
                }
            }
        })

    }
}