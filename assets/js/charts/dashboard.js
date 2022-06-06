
(function (jQuery) {
  "use strict";
  var cpu = []
  var ram = []

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
  function create_ptero_services(name, user, egg, docker_image, startup, memory, disk, io, cpu, db, allocations, bkp, env, additional_allocations, locations, dedicated_ip, port_range) {
    let data = {
      'name': name,
      'user': user,
      'egg': egg,
      'docker_image': docker_image,
      'startup': startup,
      'limits': {
          'memory': memory,
          'swap': -1,
          'disk': disk,
          'io': io,
          'cpu': cpu,
      },
      'feature_limits': {
          'databases': db,
          'allocations': allocations,
          'backups': bkp
      },
      'environment': env,
      'allocation': {
        'default': 1,
        'additional': additional_allocations,
      },
      'deploy': {
        'locations': locations,
        'dedicated_ip': dedicated_ip,
        'port_range': port_range
      },
      'start_on_completion': false,
      'skip_scripts': false,
      'oom_disabled': true
  }
  console.log(data);
  postData('http://localhost:400/api/create_ptero_services', data)
  .then(data => {});
}
  fetch(`http://127.0.0.1:400/?uuid=${getCookie("uuid")}&token=${getCookie("token")}`)
  .then(function (response) {
    return response.json();
  })
  .then(function (myJson) {
    console.log(myJson)
    if (myJson.error === false) {

      document.getElementById("hello").innerHTML = "Bonjour " + myJson.username + " !"
      document.getElementById("username").innerHTML = myJson.username
      document.getElementById("solde").innerHTML = myJson.counters[0]
      document.getElementById("cost_per_monts").innerHTML = myJson.counters[1]
      document.getElementById("services").innerHTML = myJson.counters[2]
      document.getElementById("tickets").innerHTML = myJson.counters[3]
      document.getElementById("services_suspended").innerHTML = myJson.counters[4]
      document.getElementById("alerts").innerHTML = myJson.counters[5]
      var invoiced_table = ""
      var color = "#39EE30"
      for (let i = 0; i < myJson.invoices_table.length; i++) {
        if (myJson.invoices_table[i].status == "Terminé") {color = "#28B463"}
        if (myJson.invoices_table[i].status == "En Attente") {color = "#E67E22"}
        if (myJson.invoices_table[i].status == "Remboursé") {color = "#2874A6"}

        invoiced_table = invoiced_table + `
        <tr>
        <td>
           <div class="d-flex align-items-center">
              <img class="rounded bg-soft-primary img-fluid avatar-40 me-3" src="../assets/images/shapes/01.png" alt="profile">
              <h6>${myJson.invoices_table[i].name}</h6>
           </div>
        </td>
        <td>
           <p id="invoice_date">${myJson.invoices_table[i].date}</p>
        </td>
        <td>${myJson.invoices_table[i].price}€</td>
        <td>
           <div class="mb-2 d-flex align-items-center">
              <h6 style="color:${color};">${myJson.invoices_table[i].status}</h6>
           </div>
        </td>
     </tr>`    
      }
      document.getElementById("invoices_table").innerHTML = invoiced_table
      var activitys = ""
      for (let i = 0; i < myJson.activity.length; i++) {
        activitys = activitys + `
        <div class="mb-2  d-flex profile-media align-items-top">
            <div class="mt-1 profile-dots-pills border-primary"></div>
            <div class="ms-4">
              <h6 class="mb-1 ">${myJson.activity[i].name}</h6>
              <span class="mb-0">${myJson.activity[i].date}</span>
            </div>
        </div>`    
      }
  
      document.getElementById("activity_card").innerHTML = activitys
      cpu = myJson.stats_array.CPU
      ram = myJson.stats_array.RAM
      if (document.querySelectorAll('#myChart').length) {
        const options = {
          series: [55, 75],
          chart: {
          height: 230,
          type: 'radialBar',
        },
        colors: ["#4bc7d2", "#3a57e8"],
        plotOptions: {
          radialBar: {
            hollow: {
                margin: 10,
                size: "50%",
            },
            track: {
                margin: 10,
                strokeWidth: '50%',
            },
            dataLabels: {
                show: false,
            }
          }
        },
        labels: ['Apples', 'Oranges'],
        };
        if(ApexCharts !== undefined) {
          const chart = new ApexCharts(document.querySelector("#myChart"), options);
          chart.render();
          document.addEventListener('ColorChange', (e) => {
              const newOpt = {colors: [e.detail.detail2, e.detail.detail1],}
              chart.updateOptions(newOpt)
             
          })
        }
      }
      if (document.querySelectorAll('#d-activity').length) {
          const options = {
            series: [{
              name: 'Successful deals',
              data: [30, 50, 35, 60, 40, 60, 60, 30, 50, 35,]
            }, {
              name: 'Failed deals',
              data: [40, 50, 55, 50, 30, 80, 30, 40, 50, 55]
            }],
            chart: {
              type: 'bar',
              height: 230,
              stacked: true,
              toolbar: {
                  show:false
                }
            },
            colors: ["#3a57e8", "#4bc7d2"],
            plotOptions: {
              bar: {
                horizontal: false,
                columnWidth: '28%',
                endingShape: 'rounded',
                borderRadius: 5,
              },
            },
            legend: {
              show: false
            },
            dataLabels: {
              enabled: false
            },
            stroke: {
              show: true,
              width: 2,
              colors: ['transparent']
            },
            xaxis: {
              categories: ['S', 'M', 'T', 'W', 'T', 'F', 'S', 'M', 'T', 'W'],
              labels: {
                minHeight:20,
                maxHeight:20,
                style: {
                  colors: "#8A92A6",
                },
              }
            },
            yaxis: {
              title: {
                text: ''
              },
              labels: {
                  minWidth: 19,
                  maxWidth: 19,
                  style: {
                    colors: "#8A92A6",
                  },
              }
            },
            fill: {
              opacity: 1
            },
            tooltip: {
              y: {
                formatter: function (val) {
                  return "$ " + val + " thousands"
                }
              }
            }
          };
        
          const chart = new ApexCharts(document.querySelector("#d-activity"), options);
          chart.render();
          document.addEventListener('ColorChange', (e) => {
          const newOpt = {colors: [e.detail.detail1, e.detail.detail2],}
          chart.updateOptions(newOpt)
          })
        }
      if (document.querySelectorAll('#d-main').length) {    
          const options = {
            series: [{
                name: 'CPU',
                data: cpu
            }, {
                name: 'RAM',
                data: ram
            }],
            chart: {
                fontFamily: '"Inter", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
                height: 245,
                type: 'area',
                toolbar: {
                    show: false
                },
                sparkline: {
                    enabled: false,
                },
            },
            colors: ["#3a57e8", "#4bc7d2"],
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'smooth',
                width: 3,
            },
            yaxis: {
              show: true,
              labels: {
                show: true,
                minWidth: 19,
                maxWidth: 19,
                style: {
                  colors: "#8A92A6",
                },
                offsetX: -5,
              },
            },
            legend: {
                show: false,
            },
            xaxis: {
                labels: {
                    minHeight:22,
                    maxHeight:22,
                    show: true,
                    style: {
                      colors: "#8A92A6",
                    },
                },
                lines: {
                    show: false  //or just here to disable only x axis grids
                },
                categories: ["Jan", "Feb", "Mar", "Apr", "Jun", "Jul", "Aug"]
            },
            grid: {
                show: false,
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shade: 'dark',
                    type: "vertical",
                    shadeIntensity: 0,
                    gradientToColors: undefined, // optional, if not defined - uses the shades of same color in series
                    inverseColors: true,
                    opacityFrom: .4,
                    opacityTo: .1,
                    stops: [0, 50, 80],
                    colors: ["#3a57e8", "#4bc7d2"]
                }
            },
            tooltip: {
              enabled: true,
            },
        };
      
        const chart = new ApexCharts(document.querySelector("#d-main"), options);
        chart.render();
        document.addEventListener('ColorChange', (e) => {
          console.log(e)
          const newOpt = {
            colors: [e.detail.detail1, e.detail.detail2],
            fill: {
              type: 'gradient',
              gradient: {
                  shade: 'dark',
                  type: "vertical",
                  shadeIntensity: 0,
                  gradientToColors: [e.detail.detail1, e.detail.detail2], // optional, if not defined - uses the shades of same color in series
                  inverseColors: true,
                  opacityFrom: .4,
                  opacityTo: .1,
                  stops: [0, 50, 60],
                  colors: [e.detail.detail1, e.detail.detail2],
              }
          },
         }
          chart.updateOptions(newOpt)
        })
      }
      if ($('.d-slider1').length > 0) {
          const options = {
              centeredSlides: false,
              loop: false,
              slidesPerView: 4,
              autoplay:false,
              spaceBetween: 32,
              breakpoints: {
                  320: { slidesPerView: 1 },
                  550: { slidesPerView: 2 },
                  991: { slidesPerView: 3 },
                  1400: { slidesPerView: 3 },
                  1500: { slidesPerView: 4 },
                  1920: { slidesPerView: 6 },
                  2040: { slidesPerView: 7 },
                  2440: { slidesPerView: 8 }
              },
              pagination: {
                  el: '.swiper-pagination'
              },
              navigation: {
                  nextEl: '.swiper-button-next',
                  prevEl: '.swiper-button-prev'
              },  
      
              // And if we need scrollbar
              scrollbar: {
                  el: '.swiper-scrollbar'  
              }
          } 
          let swiper = new Swiper('.d-slider1',options);
      
          document.addEventListener('ChangeMode', (e) => {
            if (e.detail.rtl === 'rtl' || e.detail.rtl === 'ltr') {
              swiper.destroy(true, true)
              setTimeout(() => {
                  swiper = new Swiper('.d-slider1',options);
              }, 500);
            }
          })
      }
    } else {
       // window.location.replace("file:///C:/Users/Savalet/Documents/DEV/sites/MercuryCloud_Dashboard/dashboard/auth/sign-in.html");
    }
  })
})(jQuery)
