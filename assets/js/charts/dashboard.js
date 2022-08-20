
(function (jQuery) {
  "use strict";
  document.querySelector('body').classList.add('dark')

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

  fetch(`https://api.mercurycloud.fr/api/?uuid=${getCookie("uuid")}&token=${getCookie("token")}`)
  .then(function (response) {
    return response.json();
  })
  .then(function (json) {
    if (json.error === false) {
      const permissions_array = json.permissions.split(",")
      var admin_navbar = `         
      <li class="nav-item static-item">
      <a class="nav-link static-item disabled" href="#" tabindex="-1">
          <span class="default-icon">Admin</span>
          <span class="mini-icon">-</span>
      </a>
     </li>`
      if (permissions_array.includes("ADMIN")) {
        admin_navbar = admin_navbar + `
    <li class="nav-item">
      <a id="users-list" class="nav-link " href="../../dashboard/users/users-list.html">
          <i class="icon">
                <svg width="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">                                
                  <path d="M11.9488 14.54C8.49884 14.54 5.58789 15.1038 5.58789 17.2795C5.58789 19.4562 8.51765 20.0001 11.9488 20.0001C15.3988 20.0001 18.3098 19.4364 18.3098 17.2606C18.3098 15.084 15.38 14.54 11.9488 14.54Z" fill="currentColor"></path>                                
                  <path opacity="0.4" d="M11.949 12.467C14.2851 12.467 16.1583 10.5831 16.1583 8.23351C16.1583 5.88306 14.2851 4 11.949 4C9.61293 4 7.73975 5.88306 7.73975 8.23351C7.73975 10.5831 9.61293 12.467 11.949 12.467Z" fill="currentColor"></path>                                
                  <path opacity="0.4" d="M21.0881 9.21923C21.6925 6.84176 19.9205 4.70654 17.664 4.70654C17.4187 4.70654 17.1841 4.73356 16.9549 4.77949C16.9244 4.78669 16.8904 4.802 16.8725 4.82902C16.8519 4.86324 16.8671 4.90917 16.8895 4.93889C17.5673 5.89528 17.9568 7.0597 17.9568 8.30967C17.9568 9.50741 17.5996 10.6241 16.9728 11.5508C16.9083 11.6462 16.9656 11.775 17.0793 11.7948C17.2369 11.8227 17.3981 11.8371 17.5629 11.8416C19.2059 11.8849 20.6807 10.8213 21.0881 9.21923Z" fill="currentColor"></path>                                
                  <path d="M22.8094 14.817C22.5086 14.1722 21.7824 13.73 20.6783 13.513C20.1572 13.3851 18.747 13.205 17.4352 13.2293C17.4155 13.232 17.4048 13.2455 17.403 13.2545C17.4003 13.2671 17.4057 13.2887 17.4316 13.3022C18.0378 13.6039 20.3811 14.916 20.0865 17.6834C20.074 17.8032 20.1698 17.9068 20.2888 17.8888C20.8655 17.8059 22.3492 17.4853 22.8094 16.4866C23.0637 15.9589 23.0637 15.3456 22.8094 14.817Z" fill="currentColor"></path>                                
                  <path opacity="0.4" d="M7.04459 4.77973C6.81626 4.7329 6.58077 4.70679 6.33543 4.70679C4.07901 4.70679 2.30701 6.84201 2.9123 9.21947C3.31882 10.8216 4.79355 11.8851 6.43661 11.8419C6.60136 11.8374 6.76343 11.8221 6.92013 11.7951C7.03384 11.7753 7.09115 11.6465 7.02668 11.551C6.3999 10.6234 6.04263 9.50765 6.04263 8.30991C6.04263 7.05904 6.43303 5.89462 7.11085 4.93913C7.13234 4.90941 7.14845 4.86348 7.12696 4.82926C7.10906 4.80135 7.07593 4.78694 7.04459 4.77973Z" fill="currentColor"></path>                                
                  <path d="M3.32156 13.5127C2.21752 13.7297 1.49225 14.1719 1.19139 14.8167C0.936203 15.3453 0.936203 15.9586 1.19139 16.4872C1.65163 17.4851 3.13531 17.8066 3.71195 17.8885C3.83104 17.9065 3.92595 17.8038 3.91342 17.6832C3.61883 14.9167 5.9621 13.6046 6.56918 13.3029C6.59425 13.2885 6.59962 13.2677 6.59694 13.2542C6.59515 13.2452 6.5853 13.2317 6.5656 13.2299C5.25294 13.2047 3.84358 13.3848 3.32156 13.5127Z" fill="currentColor"></path>                                
                </svg>                                                                                               
          </i>
          <i class="sidenav-mini-icon"></i>
          <span class="item-name">Utilisateurs</span>
      </a>
  </li>
  <li class="nav-item">
     <a id="roles-list" class="nav-link " href="../../dashboard/roles/roles-list.html">
         <i class="icon">
           <svg width="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">                               
              <path fill-rule="evenodd" clip-rule="evenodd" d="M3 16.8701V9.25708H21V16.9311C21 20.0701 19.0241 22.0001 15.8628 22.0001H8.12733C4.99561 22.0001 3 20.0301 3 16.8701ZM7.95938 14.4101C7.50494 14.4311 7.12953 14.0701 7.10977 13.6111C7.10977 13.1511 7.46542 12.7711 7.91987 12.7501C8.36443 12.7501 8.72997 13.1011 8.73985 13.5501C8.7596 14.0111 8.40395 14.3911 7.95938 14.4101ZM12.0198 14.4101C11.5653 14.4311 11.1899 14.0701 11.1701 13.6111C11.1701 13.1511 11.5258 12.7711 11.9802 12.7501C12.4248 12.7501 12.7903 13.1011 12.8002 13.5501C12.82 14.0111 12.4643 14.3911 12.0198 14.4101ZM16.0505 18.0901C15.596 18.0801 15.2305 17.7001 15.2305 17.2401C15.2206 16.7801 15.5862 16.4011 16.0406 16.3911H16.0505C16.5148 16.3911 16.8902 16.7711 16.8902 17.2401C16.8902 17.7101 16.5148 18.0901 16.0505 18.0901ZM11.1701 17.2401C11.1899 17.7001 11.5653 18.0611 12.0198 18.0401C12.4643 18.0211 12.82 17.6411 12.8002 17.1811C12.7903 16.7311 12.4248 16.3801 11.9802 16.3801C11.5258 16.4011 11.1701 16.7801 11.1701 17.2401ZM7.09989 17.2401C7.11965 17.7001 7.49506 18.0611 7.94951 18.0401C8.39407 18.0211 8.74973 17.6411 8.72997 17.1811C8.72009 16.7311 8.35456 16.3801 7.90999 16.3801C7.45554 16.4011 7.09989 16.7801 7.09989 17.2401ZM15.2404 13.6011C15.2404 13.1411 15.596 12.7711 16.0505 12.7611C16.4951 12.7611 16.8507 13.1201 16.8705 13.5611C16.8804 14.0211 16.5247 14.4011 16.0801 14.4101C15.6257 14.4201 15.2503 14.0701 15.2404 13.6111V13.6011Z" fill="currentColor"></path>                                <path opacity="0.4" d="M3.00293 9.25699C3.01577 8.66999 3.06517 7.50499 3.15803 7.12999C3.63224 5.02099 5.24256 3.68099 7.54442 3.48999H16.4555C18.7376 3.69099 20.3677 5.03999 20.8419 7.12999C20.9338 7.49499 20.9832 8.66899 20.996 9.25699H3.00293Z" fill="currentColor"></path>                                <path d="M8.30465 6.59C8.73934 6.59 9.06535 6.261 9.06535 5.82V2.771C9.06535 2.33 8.73934 2 8.30465 2C7.86996 2 7.54395 2.33 7.54395 2.771V5.82C7.54395 6.261 7.86996 6.59 8.30465 6.59Z" fill="currentColor"></path>                                <path d="M15.6953 6.59C16.1201 6.59 16.456 6.261 16.456 5.82V2.771C16.456 2.33 16.1201 2 15.6953 2C15.2606 2 14.9346 2.33 14.9346 2.771V5.82C14.9346 6.261 15.2606 6.59 15.6953 6.59Z" fill="currentColor"></path>                                
           </svg>                                                                                                                        
         </i>
         <i class="sidenav-mini-icon"></i>
         <span class="item-name">Rôles</span>
     </a>
 </li>
  <li class="nav-item">
    <a id="products-list" class="nav-link" data-bs-toggle="collapse" href="#sidebar-user" role="button" aria-expanded="false" aria-controls="sidebar-user">
        <i class="icon">
            <svg width="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">                                
                <path opacity="0.4" d="M2 11.0786C2.05 13.4166 2.19 17.4156 2.21 17.8566C2.281 18.7996 2.642 19.7526 3.204 20.4246C3.986 21.3676 4.949 21.7886 6.292 21.7886C8.148 21.7986 10.194 21.7986 12.181 21.7986C14.176 21.7986 16.112 21.7986 17.747 21.7886C19.071 21.7886 20.064 21.3566 20.836 20.4246C21.398 19.7526 21.759 18.7896 21.81 17.8566C21.83 17.4856 21.93 13.1446 21.99 11.0786H2Z" fill="currentColor"></path>                                <path d="M11.2451 15.3843V16.6783C11.2451 17.0923 11.5811 17.4283 11.9951 17.4283C12.4091 17.4283 12.7451 17.0923 12.7451 16.6783V15.3843C12.7451 14.9703 12.4091 14.6343 11.9951 14.6343C11.5811 14.6343 11.2451 14.9703 11.2451 15.3843Z" fill="currentColor"></path>                                <path fill-rule="evenodd" clip-rule="evenodd" d="M10.211 14.5565C10.111 14.9195 9.762 15.1515 9.384 15.1015C6.833 14.7455 4.395 13.8405 2.337 12.4815C2.126 12.3435 2 12.1075 2 11.8555V8.38949C2 6.28949 3.712 4.58149 5.817 4.58149H7.784C7.972 3.12949 9.202 2.00049 10.704 2.00049H13.286C14.787 2.00049 16.018 3.12949 16.206 4.58149H18.183C20.282 4.58149 21.99 6.28949 21.99 8.38949V11.8555C21.99 12.1075 21.863 12.3425 21.654 12.4815C19.592 13.8465 17.144 14.7555 14.576 15.1105C14.541 15.1155 14.507 15.1175 14.473 15.1175C14.134 15.1175 13.831 14.8885 13.746 14.5525C13.544 13.7565 12.821 13.1995 11.99 13.1995C11.148 13.1995 10.433 13.7445 10.211 14.5565ZM13.286 3.50049H10.704C10.031 3.50049 9.469 3.96049 9.301 4.58149H14.688C14.52 3.96049 13.958 3.50049 13.286 3.50049Z" fill="currentColor">
                </path></svg> 
        </i>
        <span class="item-name">Boutique</span>
        <i class="right-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
        </i>
    </a>
    <ul class="sub-nav collapse" id="sidebar-user" data-bs-parent="#sidebar-menu">
    <li class="nav-item">
        <a id="ptero-products-list" class="nav-link" href="../../dashboard/products/ptero-products-list.html">
            <i class="icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" viewBox="0 0 24 24" fill="currentColor">
                    <g>
                    <circle cx="12" cy="12" r="8" fill="currentColor"></circle>
                    </g>
                </svg>
            </i>
            <i class="sidenav-mini-icon"> U </i>
            <span class="item-name">Produits Pterodactyl</span>
        </a>
        <a id="proxmox-products-list" class="nav-link" href="../../dashboard/products/proxmox-products-list.html">
          <i class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="10" viewBox="0 0 24 24" fill="currentColor">
                  <g>
                  <circle cx="12" cy="12" r="8" fill="currentColor"></circle>
                  </g>
              </svg>
          </i>
          <i class="sidenav-mini-icon"> U </i>
          <span class="item-name">Produits Proxmox</span>
        </a>
    </li>
</ul>
</li>
        `
        document.getElementById("admin_navbar").innerHTML = admin_navbar

      } else {
        if (permissions_array.includes("LISTUSERS")) {
          admin_navbar = admin_navbar + `
      <li class="nav-item">
        <a id="users-list" class="nav-link " href="../../dashboard/users/users-list.html">
            <i class="icon">
                  <svg width="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">                                
                    <path d="M11.9488 14.54C8.49884 14.54 5.58789 15.1038 5.58789 17.2795C5.58789 19.4562 8.51765 20.0001 11.9488 20.0001C15.3988 20.0001 18.3098 19.4364 18.3098 17.2606C18.3098 15.084 15.38 14.54 11.9488 14.54Z" fill="currentColor"></path>                                
                    <path opacity="0.4" d="M11.949 12.467C14.2851 12.467 16.1583 10.5831 16.1583 8.23351C16.1583 5.88306 14.2851 4 11.949 4C9.61293 4 7.73975 5.88306 7.73975 8.23351C7.73975 10.5831 9.61293 12.467 11.949 12.467Z" fill="currentColor"></path>                                
                    <path opacity="0.4" d="M21.0881 9.21923C21.6925 6.84176 19.9205 4.70654 17.664 4.70654C17.4187 4.70654 17.1841 4.73356 16.9549 4.77949C16.9244 4.78669 16.8904 4.802 16.8725 4.82902C16.8519 4.86324 16.8671 4.90917 16.8895 4.93889C17.5673 5.89528 17.9568 7.0597 17.9568 8.30967C17.9568 9.50741 17.5996 10.6241 16.9728 11.5508C16.9083 11.6462 16.9656 11.775 17.0793 11.7948C17.2369 11.8227 17.3981 11.8371 17.5629 11.8416C19.2059 11.8849 20.6807 10.8213 21.0881 9.21923Z" fill="currentColor"></path>                                
                    <path d="M22.8094 14.817C22.5086 14.1722 21.7824 13.73 20.6783 13.513C20.1572 13.3851 18.747 13.205 17.4352 13.2293C17.4155 13.232 17.4048 13.2455 17.403 13.2545C17.4003 13.2671 17.4057 13.2887 17.4316 13.3022C18.0378 13.6039 20.3811 14.916 20.0865 17.6834C20.074 17.8032 20.1698 17.9068 20.2888 17.8888C20.8655 17.8059 22.3492 17.4853 22.8094 16.4866C23.0637 15.9589 23.0637 15.3456 22.8094 14.817Z" fill="currentColor"></path>                                
                    <path opacity="0.4" d="M7.04459 4.77973C6.81626 4.7329 6.58077 4.70679 6.33543 4.70679C4.07901 4.70679 2.30701 6.84201 2.9123 9.21947C3.31882 10.8216 4.79355 11.8851 6.43661 11.8419C6.60136 11.8374 6.76343 11.8221 6.92013 11.7951C7.03384 11.7753 7.09115 11.6465 7.02668 11.551C6.3999 10.6234 6.04263 9.50765 6.04263 8.30991C6.04263 7.05904 6.43303 5.89462 7.11085 4.93913C7.13234 4.90941 7.14845 4.86348 7.12696 4.82926C7.10906 4.80135 7.07593 4.78694 7.04459 4.77973Z" fill="currentColor"></path>                                
                    <path d="M3.32156 13.5127C2.21752 13.7297 1.49225 14.1719 1.19139 14.8167C0.936203 15.3453 0.936203 15.9586 1.19139 16.4872C1.65163 17.4851 3.13531 17.8066 3.71195 17.8885C3.83104 17.9065 3.92595 17.8038 3.91342 17.6832C3.61883 14.9167 5.9621 13.6046 6.56918 13.3029C6.59425 13.2885 6.59962 13.2677 6.59694 13.2542C6.59515 13.2452 6.5853 13.2317 6.5656 13.2299C5.25294 13.2047 3.84358 13.3848 3.32156 13.5127Z" fill="currentColor"></path>                                
                  </svg>                                                                                               
            </i>
            <i class="sidenav-mini-icon"></i>
            <span class="item-name">Utilisateurs</span>
        </a>
    </li>
          `
        }
        if (permissions_array.includes("LISTROLES")) {
          admin_navbar = admin_navbar + `
          <li class="nav-item">
          <a id="roles-list" class="nav-link " href="../../dashboard/roles/roles-list.html">
              <i class="icon">
                <svg width="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">                               
                   <path fill-rule="evenodd" clip-rule="evenodd" d="M3 16.8701V9.25708H21V16.9311C21 20.0701 19.0241 22.0001 15.8628 22.0001H8.12733C4.99561 22.0001 3 20.0301 3 16.8701ZM7.95938 14.4101C7.50494 14.4311 7.12953 14.0701 7.10977 13.6111C7.10977 13.1511 7.46542 12.7711 7.91987 12.7501C8.36443 12.7501 8.72997 13.1011 8.73985 13.5501C8.7596 14.0111 8.40395 14.3911 7.95938 14.4101ZM12.0198 14.4101C11.5653 14.4311 11.1899 14.0701 11.1701 13.6111C11.1701 13.1511 11.5258 12.7711 11.9802 12.7501C12.4248 12.7501 12.7903 13.1011 12.8002 13.5501C12.82 14.0111 12.4643 14.3911 12.0198 14.4101ZM16.0505 18.0901C15.596 18.0801 15.2305 17.7001 15.2305 17.2401C15.2206 16.7801 15.5862 16.4011 16.0406 16.3911H16.0505C16.5148 16.3911 16.8902 16.7711 16.8902 17.2401C16.8902 17.7101 16.5148 18.0901 16.0505 18.0901ZM11.1701 17.2401C11.1899 17.7001 11.5653 18.0611 12.0198 18.0401C12.4643 18.0211 12.82 17.6411 12.8002 17.1811C12.7903 16.7311 12.4248 16.3801 11.9802 16.3801C11.5258 16.4011 11.1701 16.7801 11.1701 17.2401ZM7.09989 17.2401C7.11965 17.7001 7.49506 18.0611 7.94951 18.0401C8.39407 18.0211 8.74973 17.6411 8.72997 17.1811C8.72009 16.7311 8.35456 16.3801 7.90999 16.3801C7.45554 16.4011 7.09989 16.7801 7.09989 17.2401ZM15.2404 13.6011C15.2404 13.1411 15.596 12.7711 16.0505 12.7611C16.4951 12.7611 16.8507 13.1201 16.8705 13.5611C16.8804 14.0211 16.5247 14.4011 16.0801 14.4101C15.6257 14.4201 15.2503 14.0701 15.2404 13.6111V13.6011Z" fill="currentColor"></path>                                <path opacity="0.4" d="M3.00293 9.25699C3.01577 8.66999 3.06517 7.50499 3.15803 7.12999C3.63224 5.02099 5.24256 3.68099 7.54442 3.48999H16.4555C18.7376 3.69099 20.3677 5.03999 20.8419 7.12999C20.9338 7.49499 20.9832 8.66899 20.996 9.25699H3.00293Z" fill="currentColor"></path>                                <path d="M8.30465 6.59C8.73934 6.59 9.06535 6.261 9.06535 5.82V2.771C9.06535 2.33 8.73934 2 8.30465 2C7.86996 2 7.54395 2.33 7.54395 2.771V5.82C7.54395 6.261 7.86996 6.59 8.30465 6.59Z" fill="currentColor"></path>                                <path d="M15.6953 6.59C16.1201 6.59 16.456 6.261 16.456 5.82V2.771C16.456 2.33 16.1201 2 15.6953 2C15.2606 2 14.9346 2.33 14.9346 2.771V5.82C14.9346 6.261 15.2606 6.59 15.6953 6.59Z" fill="currentColor"></path>                                
                </svg>                                                                                                                        
              </i>
              <i class="sidenav-mini-icon"></i>
              <span class="item-name">Rôles</span>
          </a>
      </li>
          `
        }
        if (permissions_array.includes("LISTPRODUCTS")) {
          admin_navbar = admin_navbar + `
          <li class="nav-item">
          <a id="products-list" class="nav-link" data-bs-toggle="collapse" href="#sidebar-user" role="button" aria-expanded="false" aria-controls="sidebar-user">
              <i class="icon">
                  <svg width="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">                                
                      <path opacity="0.4" d="M2 11.0786C2.05 13.4166 2.19 17.4156 2.21 17.8566C2.281 18.7996 2.642 19.7526 3.204 20.4246C3.986 21.3676 4.949 21.7886 6.292 21.7886C8.148 21.7986 10.194 21.7986 12.181 21.7986C14.176 21.7986 16.112 21.7986 17.747 21.7886C19.071 21.7886 20.064 21.3566 20.836 20.4246C21.398 19.7526 21.759 18.7896 21.81 17.8566C21.83 17.4856 21.93 13.1446 21.99 11.0786H2Z" fill="currentColor"></path>                                <path d="M11.2451 15.3843V16.6783C11.2451 17.0923 11.5811 17.4283 11.9951 17.4283C12.4091 17.4283 12.7451 17.0923 12.7451 16.6783V15.3843C12.7451 14.9703 12.4091 14.6343 11.9951 14.6343C11.5811 14.6343 11.2451 14.9703 11.2451 15.3843Z" fill="currentColor"></path>                                <path fill-rule="evenodd" clip-rule="evenodd" d="M10.211 14.5565C10.111 14.9195 9.762 15.1515 9.384 15.1015C6.833 14.7455 4.395 13.8405 2.337 12.4815C2.126 12.3435 2 12.1075 2 11.8555V8.38949C2 6.28949 3.712 4.58149 5.817 4.58149H7.784C7.972 3.12949 9.202 2.00049 10.704 2.00049H13.286C14.787 2.00049 16.018 3.12949 16.206 4.58149H18.183C20.282 4.58149 21.99 6.28949 21.99 8.38949V11.8555C21.99 12.1075 21.863 12.3425 21.654 12.4815C19.592 13.8465 17.144 14.7555 14.576 15.1105C14.541 15.1155 14.507 15.1175 14.473 15.1175C14.134 15.1175 13.831 14.8885 13.746 14.5525C13.544 13.7565 12.821 13.1995 11.99 13.1995C11.148 13.1995 10.433 13.7445 10.211 14.5565ZM13.286 3.50049H10.704C10.031 3.50049 9.469 3.96049 9.301 4.58149H14.688C14.52 3.96049 13.958 3.50049 13.286 3.50049Z" fill="currentColor">
                      </path></svg> 
              </i>
              <span class="item-name">Boutique</span>
              <i class="right-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
              </i>
          </a>
          <ul class="sub-nav collapse" id="sidebar-user" data-bs-parent="#sidebar-menu">
              <li class="nav-item">
                  <a id="ptero-products-list" class="nav-link" href="../../dashboard/products/ptero-products-list.html">
                      <i class="icon">
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" viewBox="0 0 24 24" fill="currentColor">
                              <g>
                              <circle cx="12" cy="12" r="8" fill="currentColor"></circle>
                              </g>
                          </svg>
                      </i>
                      <i class="sidenav-mini-icon"> U </i>
                      <span class="item-name">Produits Pterodactyl</span>
                  </a>
                  <a id="proxmox-products-list" class="nav-link" href="../../dashboard/products/proxmox-products-list.html">
                    <i class="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" viewBox="0 0 24 24" fill="currentColor">
                            <g>
                            <circle cx="12" cy="12" r="8" fill="currentColor"></circle>
                            </g>
                        </svg>
                    </i>
                    <i class="sidenav-mini-icon"> U </i>
                    <span class="item-name">Produits Proxmox</span>
                  </a>
              </li>
          </ul>
      </li>
          `
        }
      }

      if (permissions_array.includes("VIEWADMINPANEL")) {
        document.getElementById("admin_navbar").innerHTML = admin_navbar
      }

      if (window.location.href.includes("users-list.html")) {
        if (permissions_array.includes("LISTUSERS") || permissions_array.includes("ADMIN")) {
          document.getElementById("users-list").classList.add("active")
        } else {
          window.location.replace("/dashboard/errors/error403.html")        
        }
      }
      if (window.location.href.includes("create-user.html")) {
        if (permissions_array.includes("CREATEUSER") || permissions_array.includes("ADMIN")) {
          document.getElementById("users-list").classList.add("active")
        } else {
          window.location.replace("/dashboard/errors/error403.html")        
        }      
      }
      if (window.location.href.includes("user-edit.html")) {
        if (permissions_array.includes("EDITUSER") || permissions_array.includes("ADMIN")) {
          document.getElementById("users-list").classList.add("active")
        } else {
          window.location.replace("/dashboard/errors/error403.html")        
        }      
      }

      if (window.location.href.includes("roles-list.html")) {
        if (permissions_array.includes("ROLESLIST") || permissions_array.includes("ADMIN")) {
          document.getElementById("roles-list").classList.add("active")
        } else {
          window.location.replace("/dashboard/errors/error403.html")        
        }      
      }
      if (window.location.href.includes("create-role.html")) {
        if (permissions_array.includes("CREATEROLE") || permissions_array.includes("ADMIN")) {
          document.getElementById("roles-list").classList.add("active")
        } else {
          window.location.replace("/dashboard/errors/error403.html")        
        }      
      }
      if (window.location.href.includes("role-edit.html")) {
        if (permissions_array.includes("EDITROLE") || permissions_array.includes("ADMIN")) {
          document.getElementById("roles-list").classList.add("active")
        } else {
          window.location.replace("/dashboard/errors/error403.html")        
        }      
      }

      if (window.location.href.includes("ptero-products-list.html")) {
        if (permissions_array.includes("LISTPRODUCTS") || permissions_array.includes("ADMIN")) {
          document.getElementById("ptero-products-list").classList.add("active")
        } else {
          window.location.replace("/dashboard/errors/error403.html")        
        }      
      }
      if (window.location.href.includes("proxmox-products-list.html")) {
        if (permissions_array.includes("LISTPRODUCTS") || permissions_array.includes("ADMIN")) {
          document.getElementById("proxmox-products-list").classList.add("active")
        } else {
          window.location.replace("/dashboard/errors/error403.html")        
        }      
      }

      document.getElementById("hello").innerHTML = "Bonjour " + json.username + " !"
      document.getElementById("username").innerHTML = json.username
      document.getElementById("solde").innerHTML = json.counters[0]
      document.getElementById("cost_per_monts").innerHTML = json.counters[1]
      document.getElementById("services").innerHTML = json.counters[2]
      document.getElementById("tickets").innerHTML = json.counters[3]
      document.getElementById("services_suspended").innerHTML = json.counters[4]
      document.getElementById("alerts").innerHTML = json.counters[5]
      var invoiced_table = ""
      var color = "#39EE30"
      for (let i = 0; i < json.invoices_table.length; i++) {
        if (json.invoices_table[i].status == "Terminé") {color = "#28B463"}
        if (json.invoices_table[i].status == "En Attente") {color = "#E67E22"}
        if (json.invoices_table[i].status == "Remboursé") {color = "#2874A6"}

        invoiced_table = invoiced_table + `
        <tr>
        <td>
           <div class="d-flex align-items-center">
              <img class="rounded bg-soft-primary img-fluid avatar-40 me-3" src="../assets/images/shapes/01.png" alt="profile">
              <h6>${json.invoices_table[i].name}</h6>
           </div>
        </td>
        <td>
           <p id="invoice_date">${json.invoices_table[i].date}</p>
        </td>
        <td>${json.invoices_table[i].price}€</td>
        <td>
           <div class="mb-2 d-flex align-items-center">
              <h6 style="color:${color};">${json.invoices_table[i].status}</h6>
           </div>
        </td>
     </tr>`    
      }
      document.getElementById("invoices_table").innerHTML = invoiced_table
      var activitys = ""
      for (let i = 0; i < json.activity.length; i++) {
        activitys = activitys + `
        <div class="mb-2  d-flex profile-media align-items-top">
            <div class="mt-1 profile-dots-pills border-primary"></div>
            <div class="ms-4">
              <h6 class="mb-1 ">${json.activity[i].name}</h6>
              <span class="mb-0">${json.activity[i].date}</span>
            </div>
        </div>`    
      }
  
      document.getElementById("activity_card").innerHTML = activitys
      cpu = json.stats_array.CPU
      ram = json.stats_array.RAM
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
    console.log(" [ERROR] API fetch error " + error)
    // window.location.replace("/dashboard/errors/error500.html")
  })

  console.log("%cCela ne se fait pas de fouiner partout =)", "color: white; font-style: bold; background-color: red;padding: 20px");
  console.log("%cSi tu veux aider le développement du panel envoie moi un mail:\ncontact@mercurycloud.fr ou Savalet#8888 sur Discord.", "color: cyan;padding: 10px");
})(jQuery)
