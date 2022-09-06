document.querySelector('body').classList.add('dark')

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
  postData('https://api.mercurycloud.fr/api/users/login-user', data).then(data => {
    console.log(data)
    if (data.error == false) {
      document.cookie = `uuid=${data.uuid};max-age=604800; path=/;`
      document.cookie = `token=${data.token};max-age=604800; path=/;`
      window.location.replace("/dashboard")
    } else {
      document.getElementById("email").value = ""
      document.getElementById("password").value = ""
      document.getElementById("message").innerHTML = "Mot de passe ou email invalide !"
    }
  }).catch(error => {
    console.log(" [ERROR] API post error " + error)
    window.location.replace("/dashboard/errors/error500.html")
  })
}