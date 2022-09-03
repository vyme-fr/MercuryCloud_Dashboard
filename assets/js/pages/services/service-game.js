function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

const url = new URL(window.location.href);
if (url.searchParams.get('id')) {
    fetch(`https://api.mercurycloud.fr/api/services/service-info?uuid=${getCookie("uuid")}&token=${getCookie("token")}&id=${url.searchParams.get('id')}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            if (json.error === false) {

                const socket = new WebSocket(json.data.websocket.websocket_url);

                document.getElementById("cpu-counter").innerHTML = Math.round(json.data.resources.resources.cpu_absolute * 100) / 100 + "%"
                document.getElementById("ram-counter").innerHTML = Math.round((json.data.resources.resources.memory_bytes / 1024000000) * 100) / 100 + "Go"
                document.getElementById("disk-counter").innerHTML = Math.round((json.data.resources.resources.disk_bytes / 1024000000) * 100) / 100 + "Go"
                document.getElementById("net-counter").innerHTML = Math.round(json.data.resources.resources.cpu_absolute * 100) / 000 + "%"
                if (document.querySelectorAll('#cpu-chart').length) {
                    const options = {
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
                            name: 'series1',
                            data: [60, 15, 50, 30, 70, 70, 40, 60, 30, 60, 60, 40, 60, 40, 70, 75, 30, 60, 35, 60, 70, 40, 60, 68]
                        },],
                        colors: ['#344ed1'],

                        xaxis: {
                            categories: ["00H", "01H", "02H", "03H", "04H", "05H", "06H", "07H", "08H", "09H", "10H", "11H", "12H", "13H", "14H", "15H", "16H", "17H", "18H", "19H", "20H", "21H", "22H", "23H"],
                        },
                        tooltip: {
                            enabled: true,

                        }
                    };
                    const chart = new ApexCharts(
                        document.querySelector("#cpu-chart"),
                        options
                    );
                    chart.render();
                    document.addEventListener('ColorChange', (e) => {
                        const newOpt = {
                            colors: [e.detail.detail1],
                            fill: {
                                type: 'gradient',
                                gradient: {
                                    type: "vertical",
                                    inverseColors: true,
                                    gradientToColors: [e.detail.detail1],
                                    opacityFrom: 0.5,
                                    opacityTo: 0,
                                    stops: [0, 50, 60],
                                    colors: [e.detail.detail1],
                                }
                            },
                        }
                        chart.updateOptions(newOpt)
                    })
                }

                if (document.querySelectorAll('#ram-chart').length) {
                    const options = {
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
                            name: 'series1',
                            data: [60, 15, 50, 30, 70, 70, 40, 60, 30, 60, 60, 40, 60, 40, 70, 75, 30, 60, 35, 60, 70, 40, 60, 68]
                        },],
                        colors: ['#d95f18'],

                        xaxis: {
                            categories: ["00H", "01H", "02H", "03H", "04H", "05H", "06H", "07H", "08H", "09H", "10H", "11H", "12H", "13H", "14H", "15H", "16H", "17H", "18H", "19H", "20H", "21H", "22H", "23H"],
                        },
                        tooltip: {
                            enabled: true,

                        }
                    };
                    const chart = new ApexCharts(
                        document.querySelector("#ram-chart"),
                        options
                    );
                    chart.render();
                    document.addEventListener('ColorChange', (e) => {
                        const newOpt = {
                            colors: [e.detail.detail1],
                            fill: {
                                type: 'gradient',
                                gradient: {
                                    type: "vertical",
                                    inverseColors: true,
                                    gradientToColors: [e.detail.detail1],
                                    opacityFrom: 0.5,
                                    opacityTo: 0,
                                    stops: [0, 50, 60],
                                    colors: [e.detail.detail1],
                                }
                            },
                        }
                        chart.updateOptions(newOpt)
                    })
                }

                if (document.querySelectorAll('#disk-chart').length) {
                    const options = {
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
                            name: 'series1',
                            data: [60, 15, 50, 30, 70, 70, 40, 60, 30, 60, 60, 40, 60, 40, 70, 75, 30, 60, 35, 60, 70, 40, 60, 68]
                        },],
                        colors: ['#17904b'],

                        xaxis: {
                            categories: ["00H", "01H", "02H", "03H", "04H", "05H", "06H", "07H", "08H", "09H", "10H", "11H", "12H", "13H", "14H", "15H", "16H", "17H", "18H", "19H", "20H", "21H", "22H", "23H"],
                        },
                        tooltip: {
                            enabled: true,

                        }
                    };
                    const chart = new ApexCharts(
                        document.querySelector("#disk-chart"),
                        options
                    );
                    chart.render();
                    document.addEventListener('ColorChange', (e) => {
                        const newOpt = {
                            colors: [e.detail.detail1],
                            fill: {
                                type: 'gradient',
                                gradient: {
                                    type: "vertical",
                                    inverseColors: true,
                                    gradientToColors: [e.detail.detail1],
                                    opacityFrom: 0.5,
                                    opacityTo: 0,
                                    stops: [0, 50, 60],
                                    colors: [e.detail.detail1],
                                }
                            },
                        }
                        chart.updateOptions(newOpt)
                    })
                }

                if (document.querySelectorAll('#net-chart').length) {
                    const options = {
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
                            name: 'series1',
                            data: [60, 15, 50, 30, 70, 70, 40, 60, 30, 60, 60, 40, 60, 40, 70, 75, 30, 60, 35, 60, 70, 40, 60, 68]
                        },],
                        colors: ['#ad2d1e'],

                        xaxis: {
                            categories: ["00H", "01H", "02H", "03H", "04H", "05H", "06H", "07H", "08H", "09H", "10H", "11H", "12H", "13H", "14H", "15H", "16H", "17H", "18H", "19H", "20H", "21H", "22H", "23H"],
                        },
                        tooltip: {
                            enabled: true,

                        }
                    };
                    const chart = new ApexCharts(
                        document.querySelector("#net-chart"),
                        options
                    );
                    chart.render();
                    document.addEventListener('ColorChange', (e) => {
                        const newOpt = {
                            colors: [e.detail.detail1],
                            fill: {
                                type: 'gradient',
                                gradient: {
                                    type: "vertical",
                                    inverseColors: true,
                                    gradientToColors: [e.detail.detail1],
                                    opacityFrom: 0.5,
                                    opacityTo: 0,
                                    stops: [0, 50, 60],
                                    colors: [e.detail.detail1],
                                }
                            },
                        }
                        chart.updateOptions(newOpt)
                    })
                }
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
            // if (toString(error).includes("Cannot set properties of null (setting 'innerHTML')")) {console.log(" [ERROR] API fetch error " + error)}
            // window.location.replace("/dashboard/errors/error500.html")
        })
} else {
    window.location.replace("/dashboard/errors/error404.html");
}