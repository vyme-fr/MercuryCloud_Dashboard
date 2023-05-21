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

fetch(api_url + `products/proxmox/nodes`, {
    headers: {
        
        
    }
}).then(function (response) {
    return response.json();
}).then(function (json) {
    let nodes_html = ``
    for (let i = 0; i < json.nodes.length; i++) {
        nodes_html = nodes_html + `
        <option value="${json.nodes[i].node}">${json.nodes[i].node}</option>
        `
    }
    document.getElementById('nodes').innerHTML = '<option value="0">Veuillez choisir un noeud</option>' + nodes_html
    fetch(api_url + `upgrades`, {
        headers: {
            
            
        }
    }).then(function (response) {
        return response.json();
    }).then(function (json) {
        let upgrades_html = ``
        for (let i = 0; i < json.data.length; i++) {
            upgrades_html = upgrades_html + `
        <li>
          <input type="checkbox" class="form-check-input" id="${json.data[i].id}">
          <label class="form-check-label pl-2" for="${json.data[i].id}">${json.data[i].name}</label>
      </li>
        `
        }
        document.getElementById('UpgradesListBody').innerHTML = upgrades_html + `
        <li class="add-upgrades-btn">
        <a
        class="btn btn-sm btn-icon btn-primary" data-toggle="tooltip"
        onclick="document.getElementById('popupForm').style.display = 'block'; disableScrolling()" data-placement="top"
        title="" data-original-title="Ajouter">
        Ajouter
      </a>
      </li>`
    })
})

function update_node() {
    fetch(api_url + `products/proxmox/qemu?node=${document.getElementById('nodes').value}`, {
        headers: {
            
            
        }
    }).then(function (response) {
        return response.json();
    }).then(function (json) {
        let template_vm_html = ``
        for (let i = 0; i < json.vms.length; i++) {
            template_vm_html = template_vm_html + `
            <option value="${json.vms[i].vmid}">${json.vms[i].name}</option>
            `
        }
        document.getElementById('template_vm').innerHTML = template_vm_html
    })

    fetch(api_url + `products/proxmox/storage?node=${document.getElementById('nodes').value}`, {
        headers: {
            
            
        }
    }).then(function (response) {
        return response.json();
    })
        .then(function (json) {
            let storage_html = ``
            for (let i = 0; i < json.storage.length; i++) {
                storage_html = storage_html + `
            <option value="${json.storage[i].storage}">${json.storage[i].storage}</option>
            `
            }
            document.getElementById('storage').innerHTML = storage_html
        })
}

function create_product() {
    let ok = 0
    let no = 0
    if (document.getElementById('name').value.length > 0) {
        document.getElementById('name').classList.remove('is-invalid')
        document.getElementById('name').classList.add('is-valid')
        ok++
    } else {
        document.getElementById('name').classList.remove('is-valid')
        document.getElementById('name').classList.add('is-invalid')
        document.getElementById('name').value = ""
        no++
    }

    if (document.getElementById('description').value.length > 0) {
        document.getElementById('description').classList.remove('is-invalid')
        document.getElementById('description').classList.add('is-valid')
        ok++
    } else {
        document.getElementById('description').classList.remove('is-valid')
        document.getElementById('description').classList.add('is-invalid')
        document.getElementById('description').value = ""
        no++
    }

    if (document.getElementById('price').value.length > 0) {
        document.getElementById('price').classList.remove('is-invalid')
        document.getElementById('price').classList.add('is-valid')
        ok++
    } else {
        document.getElementById('price').classList.remove('is-valid')
        document.getElementById('price').classList.add('is-invalid')
        document.getElementById('price').value = ""
        no++
    }

    if (document.getElementById('nodes').value != 0) {
        document.getElementById('nodes').classList.remove('is-invalid')
        document.getElementById('nodes').classList.add('is-valid')
        ok++
    } else {
        document.getElementById('nodes').classList.remove('is-valid')
        document.getElementById('nodes').classList.add('is-invalid')
        no++
    }

    if (document.getElementById('template_vm').value != 0) {
        document.getElementById('template_vm').classList.remove('is-invalid')
        document.getElementById('template_vm').classList.add('is-valid')
        ok++
    } else {
        document.getElementById('template_vm').classList.remove('is-valid')
        document.getElementById('template_vm').classList.add('is-invalid')
        no++
    }

    if (document.getElementById('cores').value.length > 0) {
        document.getElementById('cores').classList.remove('is-invalid')
        document.getElementById('cores').classList.add('is-valid')
        ok++
    } else {
        document.getElementById('cores').classList.remove('is-valid')
        document.getElementById('cores').classList.add('is-invalid')
        document.getElementById('cores').value = ""
        no++
    }

    if (document.getElementById('ram').value.length > 0) {
        document.getElementById('ram').classList.remove('is-invalid')
        document.getElementById('ram').classList.add('is-valid')
        ok++
    } else {
        document.getElementById('ram').classList.remove('is-valid')
        document.getElementById('ram').classList.add('is-invalid')
        document.getElementById('ram').value = ""
        no++
    }

    if (document.getElementById('storage').value != 0) {
        document.getElementById('storage').classList.remove('is-invalid')
        document.getElementById('storage').classList.add('is-valid')
        ok++
    } else {
        document.getElementById('storage').classList.remove('is-valid')
        document.getElementById('storage').classList.add('is-invalid')
        no++
    }

    if (document.getElementById('disk_size').value.length > 0) {
        document.getElementById('disk_size').classList.remove('is-invalid')
        document.getElementById('disk_size').classList.add('is-valid')
        ok++
    } else {
        document.getElementById('disk_size').classList.remove('is-valid')
        document.getElementById('disk_size').classList.add('is-invalid')
        document.getElementById('disk_size').value = ""
        no++
    }



    if (ok == 9 && no == 0) {
        body = {
            "name": document.getElementById("name").value,
            "description": document.getElementById("description").value,
            "price": document.getElementById("price").value,
            "category": "proxmox",
            "node": document.getElementById("nodes").value,
            "template_vm": document.getElementById("template_vm").value,
            "cores": document.getElementById("cores").value,
            "ram": document.getElementById("ram").value,
            "storage": document.getElementById("storage").value,
            "disk_size": document.getElementById("disk_size").value,
            "add_conf": document.getElementById("add_conf").value
        }
        postData(api_url + `products`, body).then(data => {
            if (data.error == false) {
                window.location.replace("/products/proxmox-products-list.html")
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

function create_upgrade() {
    let ok = 0
    let no = 0
    document.getElementById("popupBtn").innerHTML = `<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>`;
    if (document.getElementById('upgrade_name').value.length > 0) {
        document.getElementById('upgrade_name').classList.remove('is-invalid')
        document.getElementById('upgrade_name').classList.add('is-valid')
        ok++
    } else {
        document.getElementById('upgrade_name').classList.remove('is-valid')
        document.getElementById('upgrade_name').classList.add('is-invalid')
        document.getElementById('upgrade_name').value = ""
        no++
    }

    if (document.getElementById('upgrade_description').value.length > 0) {
        document.getElementById('upgrade_description').classList.remove('is-invalid')
        document.getElementById('upgrade_description').classList.add('is-valid')
        ok++
    } else {
        document.getElementById('upgrade_description').classList.remove('is-valid')
        document.getElementById('upgrade_description').classList.add('is-invalid')
        document.getElementById('upgrade_description').value = ""
        no++
    }

    if (document.getElementById('upgrade_price').value.length > 0) {
        document.getElementById('upgrade_price').classList.remove('is-invalid')
        document.getElementById('upgrade_price').classList.add('is-valid')
        ok++
    } else {
        document.getElementById('upgrade_price').classList.remove('is-valid')
        document.getElementById('upgrade_price').classList.add('is-invalid')
        document.getElementById('upgrade_price').value = ""
        no++
    }

    if (document.getElementById('upgrade_param').value.length > 0) {
        document.getElementById('upgrade_param').classList.remove('is-invalid')
        document.getElementById('upgrade_param').classList.add('is-valid')
        ok++
    } else {
        document.getElementById('upgrade_param').classList.remove('is-valid')
        document.getElementById('upgrade_param').classList.add('is-invalid')
        document.getElementById('upgrade_param').value = ""
        no++
    }

    if (document.getElementById('upgrade_value').value.length > 0) {
        document.getElementById('upgrade_value').classList.remove('is-invalid')
        document.getElementById('upgrade_value').classList.add('is-valid')
        ok++
    } else {
        document.getElementById('upgrade_value').classList.remove('is-valid')
        document.getElementById('upgrade_value').classList.add('is-invalid')
        document.getElementById('upgrade_value').value = ""
        no++
    }

    const body = {
        "category": "proxmox",
        "name": document.getElementById('upgrade_name').value,
        "description": document.getElementById('upgrade_description').value,
        "price": document.getElementById('upgrade_price').value,
        "param": document.getElementById('upgrade_param').value,
        "value": document.getElementById('upgrade_value').value
    }
    if (ok == 5 && no == 0) {
        postData(api_url + `upgrades`, body).then(data => {
            if (data.error == false) {
                document.getElementById("popupBtn").innerHTML = `Ajouter`
                document.getElementById('popupForm').style.display = 'none'
                enableScrolling()
                fetch(api_url + `upgrades`, {
                    headers: {
                        
                        
                    }
                }).then(function (response) {
                    return response.json();
                }).then(function (json) {
                    let upgrades_html = ``
                    for (let i = 0; i < json.data.length; i++) {
                        upgrades_html = upgrades_html + `
                    <li>
                      <input type="checkbox" class="form-check-input" id="${json.data[i].id}">
                      <label class="form-check-label pl-2" for="${json.data[i].id}">${json.data[i].name}</label>
                  </li>
                    `
                    }
                    document.getElementById('UpgradesListBody').innerHTML = upgrades_html + `
                    <li class="add-upgrades-btn">
                    <a
                    class="btn btn-sm btn-icon btn-primary" data-toggle="tooltip"
                    onclick="document.getElementById('popupForm').style.display = 'block'; disableScrolling()" data-placement="top"
                    title="" data-original-title="Ajouter">
                    Ajouter
                  </a>
                  </li>`
                })
            } else {
                console.log('[ERROR] Code : ' + data.code + ' Message : ' + data.msg)
                if (data.code == 403) {
                    location.href = "../errors/error403.html"
                } else {
                    location.href = "../errors/error500.html"
                }
            }
        })
    }
    document.getElementById("popupBtn").innerHTML = `Ajouter`;
}

function disableScrolling(){
    window.scrollTo(0, 0);
    document.body.classList.add("stop-scrolling")
}
function enableScrolling(){document.body.classList.remove("stop-scrolling")}