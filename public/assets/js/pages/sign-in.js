document.querySelector('body').classList.add('dark')
const api_url = "https://dash.mercurycloud.fr/api/"

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
    'password': document.getElementById("password").value
  }
  postData(api_url + `users/${document.getElementById("email").value}/login`, data).then(data => {
    if (data.error == false) {
      document.cookie = `uuid=${data.uuid};max-age=604800; path=/;`
      document.cookie = `token=${data.token};max-age=604800; path=/;`
      window.location.replace("/")
    } else {
      document.getElementById("email").value = ""
      document.getElementById("password").value = ""
      document.getElementById("message").innerHTML = "Mot de passe ou email invalide !"
    }
  }).catch(error => {
    console.log(" [ERROR] API post error " + error)
    window.location.replace("/errors/error500.html")
  })
}

document.getElementById("password").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    connect()
  }
});

document.getElementById("email").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    connect()
  }
});