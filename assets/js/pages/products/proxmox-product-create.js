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

fetch(`https://api.mercurycloud.fr/api/products/proxmox-nodes-list?uuid=${getCookie("uuid")}&token=${getCookie("token")}`)
.then(function (response) {
  return response.json();
})
.then(function (json) {
    let nodes_html = ``
    for(var i = 0; i < json.nodes.length; i++) {
        nodes_html = nodes_html + `
        <option value="${json.nodes[i].node}">${json.nodes[i].node}</option>
        `
    }
    document.getElementById('nodes').innerHTML = nodes_html
})

function update_node() {
    fetch(`https://api.mercurycloud.fr/api/products/proxmox-qemu-list?uuid=${getCookie("uuid")}&token=${getCookie("token")}&node=${document.getElementById('nodes').value}`)
    .then(function (response) {
        return response.json();
    })
    .then(function (json) {
        let template_vm_html = ``
        for(var i = 0; i < json.vms.length; i++) {
            template_vm_html = template_vm_html + `
            <option value="${json.vms[i].vmid}">${json.vms[i].name}</option>
            `
        }
        document.getElementById('template_vm').innerHTML = template_vm_html
    })

    fetch(`https://api.mercurycloud.fr/api/products/proxmox-storage-list?uuid=${getCookie("uuid")}&token=${getCookie("token")}&node=${document.getElementById('nodes').value}`)
    .then(function (response) {
        return response.json();
    })
    .then(function (json) {
        let storage_html = ``
        for(var i = 0; i < json.storage.length; i++) {
            storage_html = storage_html + `
            <option value="${json.storage[i].storage}">${json.storage[i].storage}</option>
            `
        }
        document.getElementById('storage').innerHTML = storage_html
    })
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

    if(document.getElementById('price').value > 0) {
        document.getElementById('price').classList.remove('is-invalid')
        document.getElementById('price').classList.add('is-valid')
        ok++
    } else {
        document.getElementById('price').classList.remove('is-valid')
        document.getElementById('price').classList.add('is-invalid')
        document.getElementById('price').value = ""
        no++
    }

    if(document.getElementById('nodes').value != 0) {
        document.getElementById('nodes').classList.remove('is-invalid')
        document.getElementById('nodes').classList.add('is-valid')
        ok++
    } else {
        document.getElementById('nodes').classList.remove('is-valid')
        document.getElementById('nodes').classList.add('is-invalid')
        document.getElementById('nodes').value = ""
        no++
    }

    if(document.getElementById('template_vm').value.length > 1) {
        document.getElementById('template_vm').classList.remove('is-invalid')
        document.getElementById('template_vm').classList.add('is-valid')
        ok++
    } else {
        document.getElementById('template_vm').classList.remove('is-valid')
        document.getElementById('template_vm').classList.add('is-invalid')
        document.getElementById('template_vm').value = ""
        no++
    }

    if(document.getElementById('cores').value.length > 0) {
        document.getElementById('cores').classList.remove('is-invalid')
        document.getElementById('cores').classList.add('is-valid')
        ok++
    } else {
        document.getElementById('cores').classList.remove('is-valid')
        document.getElementById('cores').classList.add('is-invalid')
        document.getElementById('cores').value = ""
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

    if(document.getElementById('storage').value.length > 0) {
        document.getElementById('storage').classList.remove('is-invalid')
        document.getElementById('storage').classList.add('is-valid')
        ok++
    } else {
        document.getElementById('storage').classList.remove('is-valid')
        document.getElementById('storage').classList.add('is-invalid')
        document.getElementById('storage').value = ""
        no++
    }

    if(document.getElementById('disk_size').value.length > 0) {
        document.getElementById('disk_size').classList.remove('is-invalid')
        document.getElementById('disk_size').classList.add('is-valid')
        ok++
    } else {
        document.getElementById('disk_size').classList.remove('is-valid')
        document.getElementById('disk_size').classList.add('is-invalid')
        document.getElementById('disk_size').value = ""
        no++
    }



    if(ok == 9 && no == 0) {
        body = {
            "name": document.getElementById("name").value,
            "description": document.getElementById("description").value,
            "price": document.getElementById("price").value,
            "node": document.getElementById("nodes").value,
            "template_vm": document.getElementById("template_vm").value,
            "cores": document.getElementById("cores").value,
            "ram": document.getElementById("ram").value,
            "storage": document.getElementById("storage").value,
            "disk_size": document.getElementById("disk_size").value,
            "add_conf": document.getElementById("add_conf").value
        }
        postData(`https://api.mercurycloud.fr/api/products/proxmox-create-product?uuid=${getCookie("uuid")}&token=${getCookie("token")}`, body).then(data => {
            console.log(data)
            if (data.error == false) {
                window.location.replace("/dashboard/products/proxmox-products-list.html")
            } else {
                console.log('[ERROR] ' + data);
                location.href = "../errors/error500.html";
            }
        })    
    }
}