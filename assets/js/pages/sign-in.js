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

function connect() {
    let data = {
        'mail': document.getElementById("email").value,
        'password': document.getElementById("password").value
    }
    postData('http://127.0.0.1:400/api/login-user', data).then(data => {
        console.log(data)
        if (data.error == false) {
            document.cookie = `uuid=${data.uuid}`
            document.cookie = `token=${data.token}`
            window.location.replace("file:///C:/Users/Savalet/Documents/DEV/sites/MercuryCloud_Dashboard/dashboard/index.html")
        } else {
            document.getElementById("email").value = ""
            document.getElementById("password").value = ""
            document.getElementById("message").innerHTML = "Mot de passe ou email invalide !"
        }
    });
}