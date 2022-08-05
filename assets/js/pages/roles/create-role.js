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

function admin_click() {
    const unchecked_array = ["VIEWADMINPANEL", "LISTUSERS", "CREATEUSER", "DELETEUSER", "EDTIUSER", "LISTROLES", "CREATEROLE", "DELETEROLE", "EDITROLE", "LISTPRODUCTS", "CREATEPRODUCT", "DELETEPRODUCT", "EDITPRODUCT"]
    if (document.getElementById("ADMIN").checked) {
        for (let i = 0; i < unchecked_array.length; ++i) {
            document.getElementById(unchecked_array[i]).setAttribute("disabled", "")
        }
    } else {
        for (let i = 0; i < unchecked_array.length; ++i) {
            document.getElementById(unchecked_array[i]).removeAttribute("disabled", "")
        }
    }
}

function create_role() {
    var ok = 0
    var no = 0
    if(document.getElementById("role-name").value.length > 2) {
        document.getElementById("role-name").classList.remove('is-invalid')
        document.getElementById("role-name").classList.add('is-valid')
        ok++
    } else {
        document.getElementById("role-name").classList.remove('is-valid')
        document.getElementById("role-name").classList.add('is-invalid')
        document.getElementById("role-name").value = ""
        no++
    }

    if(ok == 1 && no == 0) {    
        var permissions = []
        const permissions_array = ["ADMIN", "VIEWADMINPANEL", "LISTUSERS", "CREATEUSER", "DELETEUSER", "EDTIUSER", "LISTROLES", "CREATEROLE", "DELETEROLE", "EDITROLE", "LISTPRODUCTS", "CREATEPRODUCT", "DELETEPRODUCT", "EDITPRODUCT"]
        if (document.getElementById("ADMIN").checked) {
            permissions.push("ADMIN")
        } else {
            for (let i = 0; i < permissions_array.length; ++i) {
                if (document.getElementById(permissions_array[i]).checked) {
                    permissions.push(permissions_array[i])
                    console.log("[DEBUG] Permission " + permissions_array[i] + " added !")
                }
            }
        }
        body = {
            "name": document.getElementById("role-name").value,
            "permissions": permissions
        }

        postData(`https://api.mercurycloud.fr/api/roles/create-role?uuid=${getCookie("uuid")}&token=${getCookie("token")}`, body).then(data => {
            if (data.error == false) {
                window.location.replace("/dashboard/roles/roles-list.html")
            } else {
                console.log('[ERROR] ' + data.msg);
                location.href = "../errors/error500.html";
            }
        })  
    }
}