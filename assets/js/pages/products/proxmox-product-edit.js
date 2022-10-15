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

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
var id_string = ""
var category_string = ""

fetch(`https://dash.mercurycloud.fr:8000/api/products/proxmox/nodes?uuid=${getCookie("uuid")}&token=${getCookie("token")}`)
    .then(function (response) {
        return response.json();
    })
    .then(function (json) {
        let nodes_html = ``
        for (var i = 0; i < json.nodes.length; i++) {
            nodes_html = nodes_html + `
        <option value="${json.nodes[i].node}">${json.nodes[i].node}</option>
        `
        }
        document.getElementById('nodes').innerHTML = '<option value="0">Veuillez choisir un noeud</option>' + nodes_html
        const url = new URL(window.location.href);
        if (url.searchParams.get('id')) {
            fetch(`https://dash.mercurycloud.fr:8000/api/products/${url.searchParams.get('id')}?uuid=${getCookie("uuid")}&token=${getCookie("token")}`)
                .then(function (response) {
                    return response.json();
                })
                .then(function (json) {
                    if (json.error === false) {
                        if (json.data.id == 404) {
                            window.location.replace("/dashboard/errors/error404.html");
                        } else {
                            document.getElementById("title").innerHTML = `Mercury Cloud | Edition du produit Pterodactyl ${json.data.name}`
                            document.getElementById("product-title").innerHTML = `Edition du produit ${json.data.name}`
                            document.getElementById('name').value = json.data.name
                            document.getElementById('description').value = json.data.description
                            document.getElementById('price').value = json.data.price
                            document.getElementById('nodes').value = json.data.node
                            fetch(`https://dash.mercurycloud.fr:8000/api/products/proxmox/qemu?uuid=${getCookie("uuid")}&token=${getCookie("token")}&node=${document.getElementById('nodes').value}`)
                                .then(function (response) {
                                    return response.json();
                                })
                                .then(function (json1) {
                                    let template_vm_html = ``
                                    for (var i = 0; i < json1.vms.length; i++) {
                                        template_vm_html = template_vm_html + `
                            <option value="${json1.vms[i].vmid}">${json1.vms[i].name}</option>
                            `
                                    }
                                    document.getElementById('template_vm').innerHTML = template_vm_html
                                    document.getElementById('template_vm').value = json.data.template_vmid
                                })

                            fetch(`https://dash.mercurycloud.fr:8000/api/products/proxmox/storage?uuid=${getCookie("uuid")}&token=${getCookie("token")}&node=${document.getElementById('nodes').value}`)
                                .then(function (response) {
                                    return response.json();
                                })
                                .then(function (json2) {
                                    let storage_html = ``
                                    for (var i = 0; i < json2.storage.length; i++) {
                                        storage_html = storage_html + `
                            <option value="${json2.storage[i].storage}">${json2.storage[i].storage}</option>
                            `
                                    }
                                    document.getElementById('storage').innerHTML = storage_html
                                    document.getElementById('storage').value = json.data.storage
                                })
                            document.getElementById('cores').value = json.data.cores
                            document.getElementById('ram').value = json.data.ram
                            document.getElementById('disk_size').value = json.data.disk_size
                            document.getElementById('add_conf').value = json.data.add_conf
                            id_string = json.data.id
                            category_string = json.data.category
                        }
                    } else {
                        // window.location.replace("/dashboard/errors/error500.html");
                    }
                })
        } else {
            window.location.replace("/dashboard/errors/error404.html");
        }
    })

function update_node() {
    fetch(`https://dash.mercurycloud.fr:8000/api/products/proxmox/qemu?uuid=${getCookie("uuid")}&token=${getCookie("token")}&node=${document.getElementById('nodes').value}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            let template_vm_html = ``
            for (var i = 0; i < json.vms.length; i++) {
                template_vm_html = template_vm_html + `
            <option value="${json.vms[i].vmid}">${json.vms[i].name}</option>
            `
            }
            document.getElementById('template_vm').innerHTML = template_vm_html
        })

    fetch(`https://dash.mercurycloud.fr:8000/api/products/proxmox/storage?uuid=${getCookie("uuid")}&token=${getCookie("token")}&node=${document.getElementById('nodes').value}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            let storage_html = ``
            for (var i = 0; i < json.storage.length; i++) {
                storage_html = storage_html + `
            <option value="${json.storage[i].storage}">${json.storage[i].storage}</option>
            `
            }
            document.getElementById('storage').innerHTML = storage_html
        })
}

function save_product() {
    var ok = 0
    var no = 0
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
            "category": category_string,
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
        putData(`https://dash.mercurycloud.fr:8000/api/products/${id_string}?uuid=${getCookie("uuid")}&token=${getCookie("token")}`, body).then(data => {
            console.log(data)
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