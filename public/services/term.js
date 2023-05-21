fetch("https://dash.mercurycloud.fr/api/services/a32b23/proxmox/vnc/ticket", {
    headers: {
        'auth-uuid': "0a6d6d0f-07e8-436c-bf18-1c6cbf795586",
        'auth-token': "e9509124ccd722567f967bc4a45a171bdbea9385"
    }
}).then(function (response) {
    return response.json();
}).then(function (json) {
    if (json.error === false) {
        vncticket = json.data.ticket
        vncuser = json.data.user
        vncport = json.data.port
        vncurl = json.data.socket_url
        document.cookie = `PVEAuthCookie=${json.data.pveticket}; Expires=Tue, 19 Jan 2038 03:14:07 GMT; Domain=mercurycloud.fr; Path=/`
        let socket = new WebSocket(vncurl)
        socket.addEventListener('open', (event) => {
            socket.send(vncuser + ":" + vncticket  + "\n");
        });

        socket.addEventListener('message', (event) => {
            console.log('Message from server ', event.data);
        });
    }
}).catch(error => {
    console.error(error)
})