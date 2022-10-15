fetch('https://dash.mercurycloud.fr:8000/api/products')
   .then(function (response) {
      return response.json();
   })
   .then(function (json) {
      let products = ``
      for (var i = 0; i < json.data.length; i++) {
         if (window.location.href.includes("vps-pricings.html")) {
            if (json.data[i].category == "proxmox") {
               products = products + `
            <div class="col iq-star-inserted-3">
            <div class="card my-5">
               <div class="card-body">
                  <h2 class="my-0 fw-normal mb-4">${json.data[i].name}</h2>
                  <h1 class="card-title pricing-card-title mb-0">${json.data[i].price}€ <small class="text-secondary"> / mois</small></h1>
                  <ul class="list-unstyled my-3 p-0">
                   <li><p>${json.data[i].configuration.cores} vCPU</p></li>
                   <li><p>${Math.round(json.data[i].configuration.ram / 1024)}Go de RAM</p></li>
                   <li><p>${Math.round(json.data[i].configuration.disk_size / 1024)}Go de stockage</p></li>
                   <li><p>Réseau de 500Mb/s (2 IPv6)</p></li>
                   <li><p>+0,30€ par IPv6 supplémentaire</p></li>
                </ul>
                  <button type="button" class="btn btn-primary rounded-pill w-100" onclick="location.href='/dashboard/products/order-form.html?id=${json.data[i].id}'">Commander</button>
               </div>
            </div>
         </div>
            `
            }
         }
         if (window.location.href.includes("game-pricings.html")) {
            if (json.data[i].category == "pterodactyl") {
               products = products + `
            <div class="col iq-star-inserted-3">
            <div class="card my-5">
               <div class="card-body">
                  <h2 class="my-0 fw-normal mb-4">${json.data[i].name}</h2>
                  <h1 class="card-title pricing-card-title mb-0">${json.data[i].price}€ <small class="text-secondary"> / mois</small></h1>
                  <ul class="list-unstyled my-3 p-0">
                   <li><p>${Math.round(json.data[i].configuration.cpu / 100)} vCPU</p></li>
                   <li><p>${Math.round(json.data[i].configuration.ram / 1024)}Go de RAM</p></li>
                   <li><p>${Math.round(json.data[i].configuration.disk / 1024)}Go de stockage</p></li>
                   <li><p>Réseau de 500Mb/s (1 IPv6)</p></li>
                   <li><p>+0,30€ par IPv6 supplémentaire</p></li>
                </ul>
                  <button type="button" class="btn btn-primary rounded-pill w-100" onclick="location.href='/dashboard/products/order-form.html?id=${json.data[i].id}'">Commander</button>
               </div>
            </div>
         </div>
            `
            }
         }
      }
      document.getElementById('pricings').innerHTML = products
   })