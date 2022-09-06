function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
var term = new Terminal({
    convertEol: true,
    theme: {
        background: '#222738'
    },
    cursorBlink: true
});
const fitAddon = new FitAddon.FitAddon();
term.loadAddon(fitAddon);
term.open(document.getElementById('terminal'));
fitAddon.fit();
const url = new URL(window.location.href);
if (url.searchParams.get('id')) {
    fetch(`https://api.mercurycloud.fr/api/services/service-info?uuid=${getCookie("uuid")}&token=${getCookie("token")}&id=${url.searchParams.get('id')}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            if (json.error === false) {
                term.writeUtf8("Connexion au terminal en cours...\r\n")
                var cpu_series = []
                var ram_series = []
                var disk_series = []
                var net_series = []

                const cpu_chart_options = {
                    chart: {
                        height: 80,
                        type: 'area',
                        sparkline: {
                            enabled: true
                        },
                        group: 'sparklines',

                    },
                    dataLabels: {
                        enabled: false
                    },
                    stroke: {
                        width: 3,
                        curve: 'smooth'
                    },
                    fill: {
                        type: 'gradient',
                        gradient: {
                            shadeIntensity: 1,
                            opacityFrom: 0.5,
                            opacityTo: 0,
                        }
                    },

                    series: [{
                        name: 'CPU',
                        data: []
                    },],
                    colors: ['#344ed1'],

                    xaxis: {
                        categories: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                    },
                    tooltip: {
                        enabled: true,

                    }
                };
                const cpu_chart = new ApexCharts(
                    document.querySelector("#cpu-chart"),
                    cpu_chart_options
                );
                cpu_chart.render();
                const ram_chart_option = {
                    chart: {
                        height: 80,
                        type: 'area',
                        sparkline: {
                            enabled: true
                        },
                        group: 'sparklines',

                    },
                    dataLabels: {
                        enabled: false
                    },
                    stroke: {
                        width: 3,
                        curve: 'smooth'
                    },
                    fill: {
                        type: 'gradient',
                        gradient: {
                            shadeIntensity: 1,
                            opacityFrom: 0.5,
                            opacityTo: 0,
                        }
                    },

                    series: [{
                        name: 'RAM',
                        data: []
                    },],
                    colors: ['#d95f18'],

                    xaxis: {
                        categories: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                    },
                    tooltip: {
                        enabled: true,

                    }
                };
                const ram_chart = new ApexCharts(
                    document.querySelector("#ram-chart"),
                    ram_chart_option
                );
                ram_chart.render();
                const disk_chart_option = {
                    chart: {
                        height: 80,
                        type: 'area',
                        sparkline: {
                            enabled: true
                        },
                        group: 'sparklines',

                    },
                    dataLabels: {
                        enabled: false
                    },
                    stroke: {
                        width: 3,
                        curve: 'smooth'
                    },
                    fill: {
                        type: 'gradient',
                        gradient: {
                            shadeIntensity: 1,
                            opacityFrom: 0.5,
                            opacityTo: 0,
                        }
                    },

                    series: [{
                        name: 'Disque',
                        data: []
                    },],
                    colors: ['#17904b'],

                    xaxis: {
                        categories: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                    },
                    tooltip: {
                        enabled: true,

                    }
                };
                const disk_chart = new ApexCharts(
                    document.querySelector("#disk-chart"),
                    disk_chart_option
                );
                disk_chart.render();
                const net_chart_option = {
                    chart: {
                        height: 80,
                        type: 'area',
                        sparkline: {
                            enabled: true
                        },
                        group: 'sparklines',

                    },
                    dataLabels: {
                        enabled: false
                    },
                    stroke: {
                        width: 3,
                        curve: 'smooth'
                    },
                    fill: {
                        type: 'gradient',
                        gradient: {
                            shadeIntensity: 1,
                            opacityFrom: 0.5,
                            opacityTo: 0,
                        }
                    },

                    series: [{
                        name: 'Réseau',
                        data: []
                    },],
                    colors: ['#ad2d1e'],

                    xaxis: {
                        categories: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                    },
                    tooltip: {
                        enabled: true,

                    }
                };
                const net_chart = new ApexCharts(
                    document.querySelector("#net-chart"),
                    net_chart_option
                );
                net_chart.render();
                const socket = new WebSocket(json.data.websocket.websocket_url);

                socket.onopen = function (e) {
                    socket.send(`{ "event": "auth", "args": ["${json.data.websocket.websocket_token}"] }`);
                    term.writeUtf8("Terminal connecté avec succès.\r\n")
                };

                function set_state(state) {
                    socket.send(`{"event":"set state","args":["${state}"]}`);
                }

                document.getElementById("start-button").addEventListener("click", function () {
                    set_state('start')
                });
                document.getElementById("restart-button").addEventListener("click", function () {
                    term.writeUtf8("Votre serveur redémarre...\r\n")
                    set_state('restart')
                });
                document.getElementById("stop-button").addEventListener("click", function () {
                    set_state('stop')
                });
                document.getElementById("kill-button").addEventListener("click", function () {
                    set_state('kill')
                });

                socket.addEventListener('message', function (event) {
                    data_parse = JSON.parse(event.data)
                    if (data_parse.event == "token expiring" || data_parse.event == "token expired") {
                        window.location.reload()
                    }
                    if (data_parse.event == "status") {
                        if (data_parse.args[0] == "offline") {
                            document.getElementById("restart-button").classList.add("disabled")
                            document.getElementById("stop-button").classList.add("disabled")
                            document.getElementById("kill-button").classList.add("disabled")
                            document.getElementById("start-button").classList.remove("disabled")
                            term.clear()
                            term.writeUtf8("Votre serveur est éteint.\r\n")
                        }
                        if (data_parse.args[0] == "running") {
                            document.getElementById("start-button").classList.add("disabled")
                            document.getElementById("restart-button").classList.remove("disabled")
                            document.getElementById("stop-button").classList.remove("disabled")
                            document.getElementById("kill-button").classList.remove("disabled")
                            term.writeUtf8("Votre serveur est démarrer.\r\n")
                        }
                        if (data_parse.args[0] == "stopping") {
                            document.getElementById("restart-button").classList.add("disabled")
                            document.getElementById("stop-button").classList.add("disabled")
                            document.getElementById("start-button").classList.remove("disabled")
                            document.getElementById("kill-button").classList.remove("disabled")
                            term.writeUtf8("Votre serveur est en cours d'extinction...\r\n")
                        }
                        if (data_parse.args[0] == "starting") {
                            document.getElementById("start-button").classList.add("disabled")
                            document.getElementById("restart-button").classList.remove("disabled")
                            document.getElementById("stop-button").classList.remove("disabled")
                            document.getElementById("kill-button").classList.remove("disabled")
                            term.clear()
                            term.writeUtf8("Votre serveur démarre...\r\n")
                        }
                    }
                    if (data_parse.event == "stats") {
                        args_parse = JSON.parse(data_parse.args[0])
                        document.getElementById("cpu-counter").innerHTML = Math.round(args_parse.cpu_absolute * 100) / 100 + "%"
                        document.getElementById("ram-counter").innerHTML = Math.round((args_parse.memory_bytes / 1024000000) * 100) / 100 + "Go"
                        document.getElementById("disk-counter").innerHTML = Math.round((args_parse.disk_bytes / 1024000000) * 100) / 100 + "Go"
                        document.getElementById("net-counter").innerHTML = (Math.round(((args_parse.network.rx_bytes + args_parse.network.tx_bytes) / 1024000) * 100) / 100) * 8 + "Mb/s"
                        if (cpu_series.length > 14) {
                            cpu_series.shift()
                        }
                        cpu_series.push(Math.round(args_parse.cpu_absolute * 100) / 100)
                        cpu_chart.updateSeries([{
                            name: "CPU",
                            data: cpu_series
                        }])

                        if (ram_series.length > 14) {
                            ram_series.shift()
                        }
                        ram_series.push(Math.round((args_parse.memory_bytes / 1024000000) * 100) / 100)
                        ram_chart.updateSeries([{
                            name: "RAM",
                            data: ram_series
                        }])

                        if (disk_series.length > 14) {
                            disk_series.shift()
                        }
                        disk_series.push(Math.round((args_parse.disk_bytes / 1024000000) * 100) / 100)
                        disk_chart.updateSeries([{
                            name: "Disque",
                            data: disk_series
                        }])

                        if (net_series.length > 14) {
                            net_series.shift()
                        }
                        net_series.push(Math.round(((args_parse.network.rx_bytes + args_parse.network.tx_bytes) / 1024000) * 100) / 100 * 8)
                        net_chart.updateSeries([{
                            name: "Réseau",
                            data: net_series
                        }])
                    }
                    if (data_parse.event == "console output") {
                        term.writeUtf8(data_parse.args[0] + "\r\n")
                    }
                });

                var terminal_input = document.getElementById("terminal-input");

                terminal_input.addEventListener("keypress", function (event) {
                    if (event.key === "Enter") {
                        socket.send(`{"event":"send command","args":["${terminal_input.value}"]}`);
                        terminal_input.value = ""
                    }
                });

                socket.onclose = function (event) {
                    if (event.wasClean) {
                        console.log(`[INFO] Websocket connection closed cleanly, code=${event.code} reason=${event.reason}`);
                        term.writeUtf8("Terminal deconnecté avec succès. Raison : " + event.reason + "\r\n")
                    } else {
                        console.log('[ERROR] Websocket connection died');
                        term.writeUtf8("Connexion au terminal interrompu !\r\n")
                    }
                };

                socket.onerror = function (error) {
                    console.log(`[error] ${error.message}`);
                };
            } else {
                if (json.code == 403) {
                    window.location.replace("/dashboard/auth/sign-in.html");
                }
                if (json.code == 404) {
                    window.location.replace("/dashboard/auth/sign-in.html");
                }
                if (json.code == 429) {
                    window.location.replace("/dashboard/errors/error429.html");
                }
            }
        }).catch(error => {
            window.location.replace("/dashboard/errors/error500.html")
        })
} else {
    window.location.replace("/dashboard/errors/error404.html");
}