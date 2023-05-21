var editor = ace.edit("editor");
editor.setTheme("ace/theme/nord_dark");
editor.session.setMode("ace/mode/yaml");
var term = new Terminal({
  convertEol: true,
  theme: {
    background: "#222738",
  },
  cursorBlink: true,
});
const fitAddon = new FitAddon.FitAddon();
term.loadAddon(fitAddon);
term.open(document.getElementById("terminal"));
fitAddon.fit();
const url = new URL(window.location.href);

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
  if (parts.length === 2) return parts.pop().split(";").shift();
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function calc_bytes(size) {
  if (size < 1000) {
    return Math.round((size)) + "octets"
  }

  if (size < 1000000) {
    return Math.round((size / (1024)) * 100) / 100 + "Ko"
  }

  if (size < 1000000000) {
    return Math.round((size / (1024 * 1024)) * 100) / 100 + "Mo"
  }

  if (size < 1000000000000) {
    return Math.round((size / (1024 * 1024 * 1024)) * 100) / 100 + "Go"
  }

  if (size < 1000000000000000) {
    return Math.round((size / (1024 * 1024 * 1024 * 1024)) * 100) / 100 + "To"
  }

  if (size >= 1000000000000000000) {
    return Math.round((size / (1024 * 1024 * 1024 * 1024 * 1024)) * 100) / 100 + "Po"
  }
}
document.getElementById("cpu-chart").hidden = true
document.getElementById("ram-chart").hidden = true
document.getElementById("disk-chart").hidden = true
document.getElementById("net-chart").hidden = true
document.getElementById("progress-div").hidden = true


document.getElementById("editor").hidden = true;
document.getElementById("editor-mode").hidden = true;
document.getElementById("save-filecontent-btn").hidden = true;
document.getElementById("editor-back-button").hidden = true;
document.getElementById("image").hidden = true
document.getElementById("pdf").hidden = true

function main() {
  fetch(api_url + `services/${url.searchParams.get("id")}`).then(function (response) {
    return response.json();
  }).then(function (json) {
      if (json.error === false) {
        term.writeUtf8("Connexion au terminal en cours...\r\n");
        var cpu_series = [Math.round(json.data.cpu_usage * 10000) / 100]
        var ram_series = [calc_bytes(json.data.mem_usage)]
        var disk_series = [calc_bytes(json.data.disk_read + json.data.disk_write)]
        var net_series = [(Math.round(((json.data.net_in + json.data.net_out) / (1024 * 1024)) * 100) / 100) * 8]
        document.getElementById("service-title").innerHTML = json.data.name
        document.getElementById("service_name").value = json.data.name;
        const cpu_chart_options = {
          chart: {
            height: 80,
            type: "area",
            sparkline: {
              enabled: true,
            },
            group: "sparklines",
          },
          dataLabels: {
            enabled: false,
          },
          stroke: {
            width: 3,
            curve: "smooth",
          },
          fill: {
            type: "gradient",
            gradient: {
              shadeIntensity: 1,
              opacityFrom: 0.5,
              opacityTo: 0,
            },
          },

          series: [{
            name: "CPU",
            data: [],
          },],
          colors: ["#344ed1"],

          xaxis: {
            categories: [
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
            ],
          },
          noData: {
            text: "Chargement...",
          },
          tooltip: {
            enabled: true,
          },
        };
        const cpu_chart = new ApexCharts(
          document.querySelector("#cpu-chart"),
          cpu_chart_options
        );
        cpu_chart.render();
        const ram_chart_option = {
          chart: {
            height: 80,
            type: "area",
            sparkline: {
              enabled: true,
            },
            group: "sparklines",
          },
          dataLabels: {
            enabled: false,
          },
          stroke: {
            width: 3,
            curve: "smooth",
          },
          fill: {
            type: "gradient",
            gradient: {
              shadeIntensity: 1,
              opacityFrom: 0.5,
              opacityTo: 0,
            },
          },

          series: [{
            name: "RAM",
            data: [],
          },],
          colors: ["#d95f18"],

          xaxis: {
            categories: [
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
            ],
          },
          noData: {
            text: "Chargement...",
          },
          tooltip: {
            enabled: true,
          },
        };
        const ram_chart = new ApexCharts(
          document.querySelector("#ram-chart"),
          ram_chart_option
        );
        ram_chart.render();
        const disk_chart_option = {
          chart: {
            height: 80,
            type: "area",
            sparkline: {
              enabled: true,
            },
            group: "sparklines",
          },
          dataLabels: {
            enabled: false,
          },
          stroke: {
            width: 3,
            curve: "smooth",
          },
          fill: {
            type: "gradient",
            gradient: {
              shadeIntensity: 1,
              opacityFrom: 0.5,
              opacityTo: 0,
            },
          },

          series: [{
            name: "Disque",
            data: [],
          },],
          colors: ["#17904b"],

          xaxis: {
            categories: [
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
            ],
          },
          noData: {
            text: "Chargement...",
          },
          tooltip: {
            enabled: true,
          },
        };
        const disk_chart = new ApexCharts(
          document.querySelector("#disk-chart"),
          disk_chart_option
        );
        disk_chart.render();
        const net_chart_option = {
          chart: {
            height: 80,
            type: "area",
            sparkline: {
              enabled: true,
            },
            group: "sparklines",
          },
          dataLabels: {
            enabled: false,
          },
          stroke: {
            width: 3,
            curve: "smooth",
          },
          fill: {
            type: "gradient",
            gradient: {
              shadeIntensity: 1,
              opacityFrom: 0.5,
              opacityTo: 0,
            },
          },

          series: [{
            name: "Réseau",
            data: [],
          },],
          colors: ["#ad2d1e"],

          xaxis: {
            categories: [
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
            ],
          },
          noData: {
            text: "Chargement...",
          },
          tooltip: {
            enabled: true,
          },
        };
        const net_chart = new ApexCharts(
          document.querySelector("#net-chart"),
          net_chart_option
        );
        net_chart.render();


        // Action Buttons //
        document.getElementById("start-button").addEventListener("click", function () { set_state("start"); });
        document.getElementById("restart-button").addEventListener("click", function () { term.writeUtf8("Votre serveur redémarre...\r\n"); set_state("restart"); });
        document.getElementById("stop-button").addEventListener("click", function () { set_state("stop"); });
        document.getElementById("kill-button").addEventListener("click", function () { set_state("kill"); });


        // Server Stats //
        var cpu_series = [json.data.cpu_usage]
        var ram_series = [json.data.mem_usage]
        var disk_series = [json.data.disk_read + json.data.disk_write]
        var net_series = [json.data.net_in + json.data.net_out]

        document.getElementById("cpu-counter").innerHTML = Math.round(json.data.cpu_usage * 10000) / 100  + "%";
        document.getElementById("ram-counter").innerHTML = calc_bytes(json.data.mem_usage)
        document.getElementById("disk-counter").innerHTML = calc_bytes(json.data.disk_read + json.data.disk_write)
        document.getElementById("net-counter").innerHTML = (Math.round(((json.data.net_in + json.data.net_out) / (1024 * 1024)) * 100) / 100) + "Mo"
        document.getElementById("cpu-counter-span").innerHTML = "de " + json.data.cpus + " coeurs"
        document.getElementById("disk-counter-span").innerHTML = "sur " + calc_bytes(json.data.maxdisk)
        document.getElementById("ram-counter-span").innerHTML = "sur " + calc_bytes(json.data.maxmem)
        document.getElementById("net-counter-span").innerHTML = `
                            <svg xmlns="http://www.w3.org/2000/svg" width="10px" height="10px" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path fill-rule="evenodd"
                                   d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z"
                                   clip-rule="evenodd"></path>
                            </svg>
                             ${(Math.round((json.data.net_in / 1024000) * 100) / 100)}Mo
                             <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                            </svg>
                            ${(Math.round((json.data.net_out / 1024000) * 100) / 100)}Mo`;

        refresh_stats()
        async function refresh_stats() {
          await sleep(1000)
          refresh_stats()
          fetch(api_url + `services/${url.searchParams.get("id")}`).then(function (response) {
            return response.json();
          }).then(function (json) {
              if (json.error === false) {

                if (cpu_series.length > 14) {
                  cpu_series.shift();
                }
                cpu_series.push(Math.round(json.data.cpu_usage * 10000) / 100);
                cpu_chart.updateSeries([{
                  name: "CPU",
                  data: cpu_series,
                },]);
        
                if (ram_series.length > 14) {
                  ram_series.shift();
                }
                ram_series.push(calc_bytes(json.data.mem_usage));
                ram_chart.updateSeries([{
                  name: "RAM",
                  data: ram_series,
                },]);
        
                if (disk_series.length > 14) {
                  disk_series.shift();
                }
                disk_series.push(calc_bytes(json.data.disk_read + json.data.disk_write));
                disk_chart.updateSeries([{
                  name: "Disque",
                  data: disk_series,
                },]);
        
                if (net_series.length > 14) {
                  net_series.shift();
                }
                net_series.push((Math.round(((json.data.net_in + json.data.net_out) / (1024 * 1024)) * 100) / 100) * 8);
                net_chart.updateSeries([{
                  name: "Réseau",
                  data: net_series,
                },]);

              } else {
              if (json.code == 403) {
                window.location.replace("/auth/sign-in.html");
              }
              if (json.code == 404) {
                window.location.replace("/auth/sign-in.html");
              }
              if (json.code == 429) {
                window.location.replace("/errors/error429.html");
              }
            }
          }).catch((error) => {
            console.error("[ERROR] " + error);
            //window.location.replace("/errors/error500.html")
          });
        }


        document.getElementById("cpu-chart").hidden = false
        document.getElementById("ram-chart").hidden = false
        document.getElementById("disk-chart").hidden = false
        document.getElementById("net-chart").hidden = false
      } else {
        if (json.code == 403) {
          window.location.replace("/auth/sign-in.html");
        }
        if (json.code == 404) {
          window.location.replace("/auth/sign-in.html");
        }
        if (json.code == 429) {
          window.location.replace("/errors/error429.html");
        }
      }
    })
    .catch((error) => {
      console.error("[ERROR] " + error);
      //window.location.replace("/errors/error500.html")
    });
}


if (url.searchParams.get("id")) {
  main()
} else {
  window.location.replace("/errors/error404.html");
}