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

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

function update_eggs() {
    if (document.getElementById("egg").value == 1) {
        document.getElementById("env_var").innerHTML = `
        <div class="form-group col-md-12">
            <label class="form-label" for="env_1">BUNGEE_VERSION :</label>
            <input type="text" class="form-control" id="env_1" value="latest">
        </div>
        <div class="form-group col-md-12">
            <label class="form-label" for="env_2">SERVER_JARFILE :</label>
            <input type="text" class="form-control" id="env_2" value="bungeecord.jar">
        </div>
        `
    }
    if (document.getElementById("egg").value == 2) {
        document.getElementById("env_var").innerHTML = `
        <div class="form-group col-md-12">
            <label class="form-label" for="env_2">SERVER_JARFILE :</label>
            <input type="text" class="form-control" id="env_1" value="server.jar">
        </div>
        <div class="form-group col-md-12">
            <label class="form-label" for="env_1">VANILLA_VERSION :</label>
            <input type="text" class="form-control" id="env_2" value="latest">
        </div>
        `
    }
    if (document.getElementById("egg").value == 3) {
        document.getElementById("env_var").innerHTML = `
        <div class="form-group col-md-12">
            <label class="form-label" for="env_1">MINECRAFT_VERSION :</label>
            <input type="text" class="form-control" id="env_1" value="latest">
        </div>
        <div class="form-group col-md-12">
            <label class="form-label" for="env_2">SERVER_JARFILE :</label>
            <input type="text" class="form-control" id="env_2" value="server.jar">
        </div>
        <div class="form-group col-md-12">
            <label class="form-label" for="env_3">DL_PATH :</label>
            <input type="text" class="form-control" id="env_3" value="">
        </div>
        <div class="form-group col-md-12">
            <label class="form-label" for="env_4">BUILD_NUMBER :</label>
            <input type="text" class="form-control" id="env_4" value="latest">
        </div>
        `
    }
    if (document.getElementById("egg").value == 4) {
        document.getElementById("env_var").innerHTML = `
        <div class="form-group col-md-12">
            <label class="form-label" for="env_1">SERVER_JARFILE :</label>
            <input type="text" class="form-control" id="env_1" value="server.jar">
        </div>
        <div class="form-group col-md-12">
            <label class="form-label" for="env_2">MC_VERSION :</label>
            <input type="text" class="form-control" id="env_2" value="latest">
        </div>
        <div class="form-group col-md-12">
            <label class="form-label" for="env_3">BUILD_TYPE :</label>
            <input type="text" class="form-control" id="env_3" value="recommended">
        </div>
        <div class="form-group col-md-12">
            <label class="form-label" for="env_4">FORGE_VERSION :</label>
            <input type="text" class="form-control" id="env_4" value="">
        </div>
        `
    }
    if (document.getElementById("egg").value == 5) {
        document.getElementById("env_var").innerHTML = `
        <div class="form-group col-md-12">
            <label class="form-label" for="env_1">SPONGE_VERSION :</label>
            <input type="text" class="form-control" id="env_1" value="1.12.2-7.3.0">
        </div>
        <div class="form-group col-md-12">
            <label class="form-label" for="env_2">SERVER_JARFILE :</label>
            <input type="text" class="form-control" id="env_2" value="server.jar">
        </div>
        `
    }
    if (document.getElementById("egg").value == 6) {
        document.getElementById("env_var").innerHTML = `
        <div class="form-group col-md-12">
            <label class="form-label" for="env_2">SERVER_JARFILE :</label>
            <input type="text" class="form-control" id="env_1" value="fabric-server-launch.jar">
        </div>
        <div class="form-group col-md-12">
            <label class="form-label" for="env_1">MC_VERSION :</label>
            <input type="text" class="form-control" id="env_2" value="latest">
        </div>
        <div class="form-group col-md-12">
            <label class="form-label" for="env_3">FABRIC_VERSION :</label>
            <input type="text" class="form-control" id="env_3" value="latest">
        </div>
        `
    }
    if (document.getElementById("egg").value == 7) {
        document.getElementById("env_var").innerHTML = `
        <div class="form-group col-md-12">
            <label class="form-label" for="env_1">BEDROCK_VERSION :</label>
            <input type="text" class="form-control" id="env_1" value="latest">
        </div>
        <div class="form-group col-md-12">
            <label class="form-label" for="env_2">LD_LIBRARY_PATH :</label>
            <input type="text" class="form-control" id="env_2" value=".">
        </div>
        <div class="form-group col-md-12">
            <label class="form-label" for="env_3">SERVERNAME :</label>
            <input type="text" class="form-control" id="env_3" value="Mercury Cloud Bedrock Server">
        </div>
        <div class="form-group col-md-12">
            <label class="form-label" for="env_4">GAMEMODE :</label>
            <input type="text" class="form-control" id="env_4" value="survival">
        </div>
        <div class="form-group col-md-12">
            <label class="form-label" for="env_5">DIFFICULTY :</label>
            <input type="text" class="form-control" id="env_5" value="normal">
        </div>
        <div class="form-group col-md-12">
            <label class="form-label" for="env_6">CHEATS :</label>
            <input type="text" class="form-control" id="env_6" value="false">
        </div>  
        `
    }
    if (document.getElementById("egg").value == 8) {
        document.getElementById("env_var").innerHTML = `
        <div class="form-group col-md-12">
            <label class="form-label" for="env_1">GITHUB_PACKAGE :</label>
            <input type="text" class="form-control" id="env_1" value="pmmp/PocketMine-MP">
        </div>
        <div class="form-group col-md-12">
            <label class="form-label" for="env_2">MATCH :</label>
            <input type="text" class="form-control" id="env_2" value="PocketMine-MP.phar">
        </div>
        `
    }
}

function create_product() {
    var ok = 0
    var no = 0
    if(document.getElementById('name').value.length > 0) {
        document.getElementById('name').classList.remove('is-invalid')
        document.getElementById('name').classList.add('is-valid')
        ok++
    } else {
        document.getElementById('name').classList.remove('is-valid')
        document.getElementById('name').classList.add('is-invalid')
        document.getElementById('name').value = ""
        no++
    }

    if(document.getElementById('description').value.length > 0) {
        document.getElementById('description').classList.remove('is-invalid')
        document.getElementById('description').classList.add('is-valid')
        ok++
    } else {
        document.getElementById('description').classList.remove('is-valid')
        document.getElementById('description').classList.add('is-invalid')
        document.getElementById('description').value = ""
        no++
    }

    if(document.getElementById('price').value.length > 0) {
        document.getElementById('price').classList.remove('is-invalid')
        document.getElementById('price').classList.add('is-valid')
        ok++
    } else {
        document.getElementById('price').classList.remove('is-valid')
        document.getElementById('price').classList.add('is-invalid')
        document.getElementById('price').value = ""
        no++
    }

    if(document.getElementById('cpu').value.length > 0) {
        document.getElementById('cpu').classList.remove('is-invalid')
        document.getElementById('cpu').classList.add('is-valid')
        ok++
    } else {
        document.getElementById('cpu').classList.remove('is-valid')
        document.getElementById('cpu').classList.add('is-invalid')
        document.getElementById('cpu').value = ""
        no++
    }

    if(document.getElementById('ram').value.length > 0) {
        document.getElementById('ram').classList.remove('is-invalid')
        document.getElementById('ram').classList.add('is-valid')
        ok++
    } else {
        document.getElementById('ram').classList.remove('is-valid')
        document.getElementById('ram').classList.add('is-invalid')
        document.getElementById('ram').value = ""
        no++
    }

    if(document.getElementById('disk').value.length > 0) {
        document.getElementById('disk').classList.remove('is-invalid')
        document.getElementById('disk').classList.add('is-valid')
        ok++
    } else {
        document.getElementById('disk').classList.remove('is-valid')
        document.getElementById('disk').classList.add('is-invalid')
        document.getElementById('disk').value = ""
        no++
    }

    if(document.getElementById('swap').value.length > 0) {
        document.getElementById('swap').classList.remove('is-invalid')
        document.getElementById('swap').classList.add('is-valid')
        ok++
    } else {
        document.getElementById('swap').classList.remove('is-valid')
        document.getElementById('swap').classList.add('is-invalid')
        document.getElementById('swap').value = ""
        no++
    }

    if(document.getElementById('io').value.length > 0) {
        document.getElementById('io').classList.remove('is-invalid')
        document.getElementById('io').classList.add('is-valid')
        ok++
    } else {
        document.getElementById('io').classList.remove('is-valid')
        document.getElementById('io').classList.add('is-invalid')
        document.getElementById('io').value = ""
        no++
    }

    if(document.getElementById('startup_command').value.length > 0) {
        document.getElementById('startup_command').classList.remove('is-invalid')
        document.getElementById('startup_command').classList.add('is-valid')
        ok++
    } else {
        document.getElementById('startup_command').classList.remove('is-valid')
        document.getElementById('startup_command').classList.add('is-invalid')
        document.getElementById('startup_command').value = ""
        no++
    }


    if(ok == 9 && no == 0) {

        var env_vars_count = 2
        var env_vars = []
        var env_vars_title = []
        var env_vars_json = `{`
        if (document.getElementById("egg").value == 1) {env_vars_count = 2, env_vars_title = ['BUNGEE_VERSION', 'SERVER_JARFILE']}
        if (document.getElementById("egg").value == 2) {env_vars_count = 2, env_vars_title = ['SERVER_JARFILE', 'VANILLA_VERSION']}
        if (document.getElementById("egg").value == 3) {env_vars_count = 4, env_vars_title = ['MINECRAFT_VERSION', 'SERVER_JARFILE', 'DL_PATH', 'BUILD_NUMBER']}
        if (document.getElementById("egg").value == 4) {env_vars_count = 4, env_vars_title = ['SERVER_JARFILE', 'MC_VERSION', 'BUILD_TYPE', 'FORGE_VERSION ']}
        if (document.getElementById("egg").value == 5) {env_vars_count = 2, env_vars_title = ['SPONGE_VERSION', 'SERVER_JARFILE']}
        if (document.getElementById("egg").value == 6) {env_vars_count = 3, env_vars_title = ['SERVER_JARFILE', 'MC_VERSION', 'FABRIC_VERSION']}
        if (document.getElementById("egg").value == 7) {env_vars_count = 6, env_vars_title = ['BEDROCK_VERSION', 'LD_LIBRARY_PATH', 'SERVERNAME', 'GAMEMODE', 'DIFFICULTY', 'CHEATS']}
        if (document.getElementById("egg").value == 8) {env_vars_count = 2, env_vars_title = ['GITHUB_PACKAGE', 'MATCH']}
        for(var i= 1; i < env_vars_count + 1; i++) {
            env_vars.push(document.getElementById("env_" + i).value)
        }
        for(var i= 0; i < env_vars.length; i++) {
            env_vars_json = env_vars_json + `"${env_vars_title[i]}": "${env_vars[i]}"` 
            if (i < env_vars.length - 1) {env_vars_json = env_vars_json + ","}
            if (i == env_vars.length - 1) {env_vars_json = env_vars_json + "}"}
        }
        body = {
            "name": document.getElementById("name").value,
            "description": document.getElementById("description").value,
            "price": document.getElementById("price").value,
            "cpu": document.getElementById("cpu").value,
            "cpu_pinning": document.getElementById("cpu_pinning").value,
            "ram": document.getElementById("ram").value,
            "disk": document.getElementById("disk").value,
            "swap": document.getElementById("swap").value,
            "io": document.getElementById("io").value,
            "egg": document.getElementById("egg").value,
            "startup_command": document.getElementById("startup_command").value,
            "env": env_vars_json
        }
        postData(`https://api.mercurycloud.fr/api/products/ptero-create-product?uuid=${getCookie("uuid")}&token=${getCookie("token")}`, body).then(data => {
            console.log(data)
            if (data.error == false) {
                window.location.replace("/dashboard/products/ptero-products-list.html")
            } else {
                console.log('[ERROR] ' + data);
                location.href = "../errors/error500.html";
            }
        })    
    }
}