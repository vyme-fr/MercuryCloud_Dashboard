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

var service_id = ""
var json_products = {}
const url = new URL(window.location.href);
if (url.searchParams.get('id')) {
    fetch(`https://dash.mercurycloud.fr:8000/api/services/${url.searchParams.get("id")}?uuid=${getCookie("uuid")}&token=${getCookie("token")}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            if (json.error === false) {
                if (json.data.id == 404) {
                    window.location.replace("/dashboard/errors/error404.html");
                } else {
                    document.getElementById("title").innerHTML = `Mercury Cloud | Edition du service ${json.data.name}`
                    document.getElementById("service-title").innerHTML = `Edition du service ${json.data.name}`
                    document.getElementById("name").value = json.data.name
                    document.getElementById("price").value = json.data.price
                    document.getElementById("statut").value = json.data.statut
                    fetch(`https://dash.mercurycloud.fr:8000/api/users?uuid=${getCookie("uuid")}&token=${getCookie("token")}`)
                        .then(function (response) {
                            return response.json();
                        })
                        .then(function (json2) {
                            if (json2.error === false) {
                                var uuid_list = ``
                                for (let i = 0; i < json2.users.length; i++) {
                                    uuid_list = uuid_list + `
                                <option value="${json2.users[i].uuid}">${json2.users[i].mail}</option>
                            `
                                }
                                document.getElementById("uuid-list").innerHTML = uuid_list
                                document.getElementById("uuid-list").value = json.data.uuid
                                var logs_table = ``
                                for (let i = 0; i < json.logs.length; i++) {
                                    var username = ""
                                    for (let i = 0; i < json2.users.length; i++) {
                                        if (json.logs[i].uuid == json2.users[i].uuid) {
                                            username = json2.users[i].username
                                            break;
                                        }
                                    }
                                    let timestamp = new Date(+json.logs[i].timestamp);
                                    let date = ("0" + timestamp.getDate()).slice(-2);
                                    let month = ("0" + (timestamp.getMonth() + 1)).slice(-2);
                                    let year = timestamp.getFullYear();
                                    let hours = timestamp.getHours();
                                    let minutes = timestamp.getMinutes();
                                    let seconds = timestamp.getSeconds();
                                    if (seconds < 10) { seconds = "0" + seconds }
                                    if (hours < 10) { hours = "0" + hours }
                                    if (minutes < 10) { minutes = "0" + minutes }
                                    logs_table = logs_table + `
                                <tr>
                                    <td>${date + "/" + month + "/" + year + " " + hours + ":" + minutes + ":" + seconds}</td>
                                    <td>${username}</td>
                                    <td>${json.logs[i].ip}</td>
                                    <td>${json.logs[i].action}</td>
                                </tr>
                            `
                                }
                                document.getElementById("service-logs-table").innerHTML = logs_table
                                fetch(`https://dash.mercurycloud.fr:8000/api/products?uuid=${getCookie("uuid")}&token=${getCookie("token")}`)
                                    .then(function (response) {
                                        return response.json();
                                    })
                                    .then(function (json3) {
                                        if (json3.error === false) {
                                            json_products = json3
                                            var products_list = ``
                                            for (let i = 0; i < json3.data.length; i++) {
                                                products_list = products_list + `
                                        <option value="${json3.data[i].id}">${json3.data[i].name}</option>
                                    `
                                            }
                                            document.getElementById("products").innerHTML = products_list
                                            document.getElementById("products").value = json.data.product_id
                                        } else {
                                            window.location.replace("/dashboard/errors/error500.html");
                                        }
                                    })

                            } else {
                                window.location.replace("/dashboard/errors/error500.html");
                            }
                        })

                    service_id = json.data.id
                }
            } else {
                window.location.replace("/dashboard/errors/error500.html");
            }
        })
} else {
    window.location.replace("/dashboard/errors/error404.html");
}

function update_product() {
    for (let i = 0; i < json_products.data.length; i++) {
        if (document.getElementById("products").value == json_products.data[i].id) {
            document.getElementById("price").value = json_products.data[i].price
            break;
        }
    }
}

function save_service() {
    var ok = 0
    var no = 0
    if (document.getElementById("name").value.length > 2) {
        document.getElementById("name").classList.remove('is-invalid')
        document.getElementById("name").classList.add('is-valid')
        ok++
    } else {
        document.getElementById("name").classList.remove('is-valid')
        document.getElementById("name").classList.add('is-invalid')
        document.getElementById("name").value = ""
        no++
    }

    if (document.getElementById("uuid-list").value != 0) {
        document.getElementById("uuid-list").classList.remove('is-invalid')
        document.getElementById("uuid-list").classList.add('is-valid')
        ok++
    } else {
        document.getElementById("uuid-list").classList.remove('is-valid')
        document.getElementById("uuid-list").classList.add('is-invalid')
        document.getElementById("uuid-list").value = ""
        no++
    }

    if (document.getElementById("products").value != 0) {
        document.getElementById("products").classList.remove('is-invalid')
        document.getElementById("products").classList.add('is-valid')
        ok++
    } else {
        document.getElementById("products").classList.remove('is-valid')
        document.getElementById("products").classList.add('is-invalid')
        document.getElementById("products").value = ""
        no++
    }

    if (document.getElementById("statut").value != 0) {
        document.getElementById("statut").classList.remove('is-invalid')
        document.getElementById("statut").classList.add('is-valid')
        ok++
    } else {
        document.getElementById("statut").classList.remove('is-valid')
        document.getElementById("statut").classList.add('is-invalid')
        document.getElementById("statut").value = ""
        no++
    }

    document.getElementById("price").classList.remove('is-valid')

    if (ok == 4 && no == 0) {
        body = {
            "id": service_id,
            "name": document.getElementById("name").value,
            "uuid": document.getElementById("uuid-list").value,
            "price": document.getElementById("price").value,
            "product_id": document.getElementById("products").value,
            "statut": document.getElementById("statut").value
        }

        putData(`https://dash.mercurycloud.fr:8000/api/services/${url.searchParams.get("id")}?uuid=${getCookie("uuid")}&token=${getCookie("token")}`, body).then(data => {
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