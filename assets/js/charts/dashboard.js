
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
         <svg width="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">                            <path fill-rule="evenodd" clip-rule="evenodd" d="M8.9 2H15.07C17.78 2 19.97 3.07 20 5.79V20.97C20 21.14 19.96 21.31 19.88 21.46C19.75 21.7 19.53 21.88 19.26 21.96C19 22.04 18.71 22 18.47 21.86L11.99 18.62L5.5 21.86C5.351 21.939 5.18 21.99 5.01 21.99C4.45 21.99 4 21.53 4 20.97V5.79C4 3.07 6.2 2 8.9 2ZM8.22 9.62H15.75C16.18 9.62 16.53 9.269 16.53 8.83C16.53 8.39 16.18 8.04 15.75 8.04H8.22C7.79 8.04 7.44 8.39 7.44 8.83C7.44 9.269 7.79 9.62 8.22 9.62Z" fill="currentColor"></path>                            </svg>                                                                                                                                                
         </i>
         <i class="sidenav-mini-icon"></i>
         <span class="item-name">Rôles</span>
     </a>
 </li>
 <li class="nav-item">
 <a id="services-list" class="nav-link " href="../../dashboard/services/services-list.html">
     <i class="icon">
     <svg width="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">                                <path opacity="0.4" d="M16.191 2H7.81C4.77 2 3 3.78 3 6.83V17.16C3 20.26 4.77 22 7.81 22H16.191C19.28 22 21 20.26 21 17.16V6.83C21 3.78 19.28 2 16.191 2Z" fill="currentColor"></path>                                <path fill-rule="evenodd" clip-rule="evenodd" d="M8.07996 6.6499V6.6599C7.64896 6.6599 7.29996 7.0099 7.29996 7.4399C7.29996 7.8699 7.64896 8.2199 8.07996 8.2199H11.069C11.5 8.2199 11.85 7.8699 11.85 7.4289C11.85 6.9999 11.5 6.6499 11.069 6.6499H8.07996ZM15.92 12.7399H8.07996C7.64896 12.7399 7.29996 12.3899 7.29996 11.9599C7.29996 11.5299 7.64896 11.1789 8.07996 11.1789H15.92C16.35 11.1789 16.7 11.5299 16.7 11.9599C16.7 12.3899 16.35 12.7399 15.92 12.7399ZM15.92 17.3099H8.07996C7.77996 17.3499 7.48996 17.1999 7.32996 16.9499C7.16996 16.6899 7.16996 16.3599 7.32996 16.1099C7.48996 15.8499 7.77996 15.7099 8.07996 15.7399H15.92C16.319 15.7799 16.62 16.1199 16.62 16.5299C16.62 16.9289 16.319 17.2699 15.92 17.3099Z" fill="currentColor"></path>                                </svg>                                                                                                                                                
     </i>
     <i class="sidenav-mini-icon"></i>
     <span class="item-name">Services</span>
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
              <svg width="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">                            <path fill-rule="evenodd" clip-rule="evenodd" d="M8.9 2H15.07C17.78 2 19.97 3.07 20 5.79V20.97C20 21.14 19.96 21.31 19.88 21.46C19.75 21.7 19.53 21.88 19.26 21.96C19 22.04 18.71 22 18.47 21.86L11.99 18.62L5.5 21.86C5.351 21.939 5.18 21.99 5.01 21.99C4.45 21.99 4 21.53 4 20.97V5.79C4 3.07 6.2 2 8.9 2ZM8.22 9.62H15.75C16.18 9.62 16.53 9.269 16.53 8.83C16.53 8.39 16.18 8.04 15.75 8.04H8.22C7.79 8.04 7.44 8.39 7.44 8.83C7.44 9.269 7.79 9.62 8.22 9.62Z" fill="currentColor"></path>                            </svg>                                                                                                                                                
                                                                                                                        
              </i>
              <i class="sidenav-mini-icon"></i>
              <span class="item-name">Rôles</span>
          </a>
      </li>
          `
          }
          if (permissions_array.includes("LISTSERVICES")) {
            admin_navbar = admin_navbar + `
          <li class="nav-item">
          <a id="services-list" class="nav-link " href="../../dashboard/services/services-list.html">
              <i class="icon">
              <svg width="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">                                <path opacity="0.4" d="M16.191 2H7.81C4.77 2 3 3.78 3 6.83V17.16C3 20.26 4.77 22 7.81 22H16.191C19.28 22 21 20.26 21 17.16V6.83C21 3.78 19.28 2 16.191 2Z" fill="currentColor"></path>                                <path fill-rule="evenodd" clip-rule="evenodd" d="M8.07996 6.6499V6.6599C7.64896 6.6599 7.29996 7.0099 7.29996 7.4399C7.29996 7.8699 7.64896 8.2199 8.07996 8.2199H11.069C11.5 8.2199 11.85 7.8699 11.85 7.4289C11.85 6.9999 11.5 6.6499 11.069 6.6499H8.07996ZM15.92 12.7399H8.07996C7.64896 12.7399 7.29996 12.3899 7.29996 11.9599C7.29996 11.5299 7.64896 11.1789 8.07996 11.1789H15.92C16.35 11.1789 16.7 11.5299 16.7 11.9599C16.7 12.3899 16.35 12.7399 15.92 12.7399ZM15.92 17.3099H8.07996C7.77996 17.3499 7.48996 17.1999 7.32996 16.9499C7.16996 16.6899 7.16996 16.3599 7.32996 16.1099C7.48996 15.8499 7.77996 15.7099 8.07996 15.7399H15.92C16.319 15.7799 16.62 16.1199 16.62 16.5299C16.62 16.9289 16.319 17.2699 15.92 17.3099Z" fill="currentColor"></path>                                </svg>                                                                                                                                                
              </i>
              <i class="sidenav-mini-icon"></i>
              <span class="item-name">Services</span>
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
          if (permissions_array.includes("LISTROLES") || permissions_array.includes("ADMIN")) {
            document.getElementById("roles-list").classList.add("active")
          } else {
            window.location.replace("/dashboard/errors/error403.html")
          }
        }
        if (window.location.href.includes("services-list.html")) {
          if (permissions_array.includes("LISTSERVICES") || permissions_array.includes("ADMIN")) {
            document.getElementById("services-list").classList.add("active")
          } else {
            window.location.replace("/dashboard/errors/error403.html")
          }
        }
        if (window.location.href.includes("service-edit.html")) {
          if (permissions_array.includes("EDITSERVICE") || permissions_array.includes("ADMIN")) {
            document.getElementById("services-list").classList.add("active")
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
          if (json.invoices_table[i].status == "Terminé") { color = "#28B463" }
          if (json.invoices_table[i].status == "En Attente") { color = "#E67E22" }
          if (json.invoices_table[i].status == "Remboursé") { color = "#2874A6" }

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
                minHeight: 22,
                maxHeight: 22,
                show: true,
                style: {
                  colors: "#8A92A6",
                },
              },
              lines: {
                show: false  //or just here to disable only x axis grids
              },
              categories: ["00h", "01h", "02h", "03h", "04h", "05h", "06h", "07h", "08h", "09h", "10h", "11h", "12h", "13h", "14h", "15h", "16h", "17h", "18h", "19h", "20h", "21h", "22h", "23h"]
            },
            grid: {
              show: true,
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
            autoplay: false,
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
          let swiper = new Swiper('.d-slider1', options);

          document.addEventListener('ChangeMode', (e) => {
            if (e.detail.rtl === 'rtl' || e.detail.rtl === 'ltr') {
              swiper.destroy(true, true)
              setTimeout(() => {
                swiper = new Swiper('.d-slider1', options);
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
      // if (toString(error).includes("Cannot set properties of null (setting 'innerHTML')")) {console.log(" [ERROR] API fetch error " + error)}
      // window.location.replace("/dashboard/errors/error500.html")
    })

  console.log("%cHého que fais tu là ?", "color: white; font-style: bold; background-color: red;padding: 20px");
  console.log("%cSi tu veux aider le développement du panel envoie moi un mail:\ncontact@mercurycloud.fr ou Savalet#8888 sur Discord.", "color: cyan;padding: 10px");
})(jQuery)
