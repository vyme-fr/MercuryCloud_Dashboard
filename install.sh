#!/bin/sh
clear
normal=`echo "\033[m"`
menu=`echo "\033[34m"`
option=`echo "\033[36m"`
bgred=`echo "\033[41m"`
fgred=`echo "\033[31m"`
fgreen=`echo "\033[32m"`
printf "\n${menu}*-*-*-* MercuryCloud Dashboard Installer *-*-*-*${normal}\n"
OS_NAME=$(grep 'PRETTY_NAME' /etc/os-release | sed 's/PRETTY_NAME="//' | sed 's/"//')
printf "${menu}*- OS Name : ${option}${OS_NAME} ${normal}\n"
printf "${menu}*- Hostname : ${option}${HOSTNAME} ${normal}\n"
IP=$(dig @resolver4.opendns.com myip.opendns.com +short -4)
printf "${menu}*- Host IP : ${option}${IP} ${normal}\n"
printf "${menu}*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*${normal}\n"
if [[ ! $EUID -eq 0 ]]; then
    printf "${fgred}Please run the installer with root user!\n${normal}";
    printf "${fgred}Use 'sudo -i' or 'su -'\n${normal}"
    exit 1
fi
[[ -z $OS ]] && OS=$(uname -s)
if [[ $OS =~ ^[^Ll][^Ii][^Nn][^Uu][^Xx] ]]; then
    printf "${fgred}We do not currently support Installation on non-Linux Operating Systems\n${normal}"
    exit 2 
fi
printf "${menu}Continue ? (y/n) : ${normal}"

continue() {
    read opt
    case $opt in
        y)
            printf "${menu}Checking OS... ${normal}";
            if [[ $OS_NAME == *"Debian"* ]]; then
                printf "${fgreen}done\n${normal}"
                printf "${menu}Mail address for SSL certificate (ex: ssl@${HOSTNAME}) : ${normal}"
                read ssl_mail
                printf "${menu}Dashboard URL (ex: dash.${HOSTNAME}) : ${normal}"
                read dashboard_url
                printf "${menu}API URL (ex: api.${HOSTNAME}) : ${normal}"
                read api_url
                printf "${menu}MySQL Host IP (ex: ${IP}) : ${normal}"
                read mysql_host
                printf "${menu}MySQL Database Name (ex: dashboard_data) : ${normal}"
                read mysql_db
                printf "${menu}MySQL User Name (ex: dashboard_user) : ${normal}"
                read mysql_usr
                example_passwd=$(LC_ALL=C tr -dc 'A-Za-z0-9!#&'\''()*+,-./:;<=>?@[\]^_`{|}~' </dev/urandom | head -c 10)
                printf "${menu}MySQL User Password (ex: ${example_passwd}) : ${normal}"
                read -s mysql_passwd
                install_debian_based
            elif [[ $OS_NAME == *"Ubuntu"* ]]; then
                printf "${fgreen}done\n${normal}"
                printf "${menu}Mail address for SSL certificate (ex: ssl@${HOSTNAME}) : ${normal}"
                read ssl_mail
                printf "${menu}Dashboard URL (ex: dash.${HOSTNAME}) : ${normal}"
                read dashboard_url
                printf "${menu}API URL (ex: api.${HOSTNAME}) : ${normal}"
                read api_url
                printf "${menu}MySQL Host IP (ex: ${IP}) : ${normal}"
                read mysql_host
                printf "${menu}MySQL Database Name (ex: dashboard_data) : ${normal}"
                read mysql_db
                printf "${menu}MySQL User Name (ex: dashboard_user) : ${normal}"
                read mysql_usr
                example_passwd=$(LC_ALL=C tr -dc 'A-Za-z0-9!"#$%&'\''()*+,-./:;<=>?@[\]^_`{|}~' </dev/urandom | head -c 13)
                printf "${menu}MySQL User Password (ex: ${example_passwd}) : ${normal}"
                read -s mysql_passwd
                install_debian_based
            else
                printf "\n${fgred}The operating system is not supported by the MercuryCloud Dashboard installer!${normal}\n";
                printf "${fgred}Supported operating systems are Debian or Ubuntu!${normal}\n";
                exit
            fi
        ;;
        n)  exit;
        ;;
        Y)
            printf "sudo service apache2 restart";
        ;;
        N)  exit;
        ;;
        *) 
            printf "${fgred}Chose valid option!${normal}\n";
            printf "${menu}Continue ? (y/n)${normal} "
            continue;
        ;;
    esac
}

install_debian_based() {
    printf "\n${menu}Running apt-get update...${normal} "
    if apt-get update >/dev/null; then
        printf "${fgreen}done\n${normal}"
    else
        printf "${fgred}apt-get update failed! Stopping the installation.\n${normal}"
        exit
    fi

    printf "${menu}Installing cURL...${normal} "
    if apt-get install curl >/dev/null; then
        printf "${fgreen}done\n${normal}"
    else
        printf "${fgred}cURL installation failed! Stopping the installation.\n${normal}"
        exit
    fi

    printf "${menu}Getting NodeJS v16.x...${normal} "
    if curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash - >/dev/null; then
        printf "${fgreen}done\n${normal}"
    else
        printf "${fgred}NodeJS getting failed! Stopping the installation.\n${normal}"
        exit
    fi

    printf "${menu}Installing NodeJS v16.x...${normal} "
    if sudo apt-get install nodejs >/dev/null; then
        printf "${fgreen}done\n${normal}"
    else
        printf "${fgred}NodeJS installation failed! Stopping the installation.\n${normal}"
        exit
    fi

    printf "${menu}Installing apache2...${normal} "
    if apt-get install apache2 >/dev/null; then
        printf "${fgreen}done\n${normal}"
    else
        printf "${fgred}Apache2 installation failed! Stopping the installation.\n${normal}"
        exit
    fi
        
    printf "${menu}Installing unzip...${normal} "
    if apt-get install unzip >/dev/null; then
        printf "${fgreen}done\n${normal}"
    else
        printf "${fgred}Unzip installation failed! Stopping the installation.\n${normal}"
        exit
    fi

    printf "${menu}Creating /var/www/dashboard folder...${normal} "
    if mkdir -p /var/www/dashboard >/dev/null; then
        printf "${fgreen}done\n${normal}"
    else
        printf "${fgred}/var/www/dashboard creation failed! Stopping the installation.\n${normal}"
        exit
    fi
    
    printf "${menu}Retrieving dashboard files...${normal} "
    if wget -q -O /var/www/dashboard/mercurycloud-dashboard.zip https://url.mercurycloud.fr/installzip >/dev/null; then
        printf "${fgreen}done\n${normal}"
    else
        printf "${fgred}Dashboard files retrieving failed! Stopping the installation.\n${normal}"
        exit
    fi
        
    printf "${menu}Unzipping dashboard files...${normal} "
    if unzip -qq -o /var/www/dashboard/mercurycloud-dashboard.zip -d /var/www/dashboard >/dev/null; then
        printf "${fgreen}done\n${normal}"
    else
        printf "${fgred}Dashboard files unzipping failed! Stopping the installation.\n${normal}"
        exit
    fi

    printf "${menu}Installing NPM depencies...${normal} "
    if npm install --silent --no-progress --prefix /var/www/dashboard/api >/dev/null; then
        printf "${fgreen}done\n${normal}"
    else
        printf "${fgred}NPM depencies installation failed! Stopping the installation.\n${normal}"
        exit
    fi
    
    printf "${menu}Creating API service file...${normal} "
    if echo "[Unit]
                Description=MercuryCloud Dashboard API Service
                Documentation=https://mercurycloud.fr
                After=network.target

            [Service]
                Type=simple
                User=root
                ExecStart=/usr/bin/node /var/www/dashboard/api/server.js
                Restart=on-failure

            [Install]
                WantedBy=multi-user.target" > /lib/systemd/system/mercurycloud-dashboard-api.service; then
        printf "${fgreen}done\n${normal}"
    else
        printf "${fgred}API service file creation failed! Stopping the installation.\n${normal}"
        exit
    fi

    printf "${menu}Creating Config file...${normal} "
    if echo "{
        'api_url': '${api_url}',
        'pterodactyl_url': '',
        'pterodactyl_api_key': '',
        'proxmox_url': '',
        'proxmox_user': '',
        'proxmox_passwd': '',
        'mysql_host': '${mysql_host}',
        'mysql_db': '${mysql_db}',
        'mysql_usr': '${mysql_usr}',
        'mysql_passwd': '${mysql_passwd}',
        'smtp_host': '',
        'smtp_port': 465,
        'smtp_ssl': true,
        'smtp_username': '',
        'smtp_pswd': '',
        'rate_limit_time': 60,
        'rate_limit_max_rate': 60
    }" > /var/www/dashboard/api/config.json; then
        printf "${fgreen}done\n${normal}"
    else
        printf "${fgred}Config file creation failed! Stopping the installation.\n${normal}"
        exit
    fi
  
    printf "${menu}Retrieving MySQL dump file...${normal} "
    if wget -q -O /var/www/dashboard/mysql_dump.sql https://url.mercurycloud.fr/mysqldump >/dev/null; then
        printf "${fgreen}done\n${normal}"
    else
        printf "${fgred}MySQL dump file retrieving failed! Stopping the installation.\n${normal}"
        exit
    fi

    printf "${menu}Create an populate MySQL tables...${normal} "
    if mysql --host="${mysql_host}" --user="${mysql_usr}" --password="${mysql_passwd}" --database="${mysql_db}" < /var/www/dashboard/mysql_dump.sql >/dev/null; then
        printf "${fgreen}done\n${normal}"
    else
        printf "${fgred}MySQL tables creation an population failed! Stopping the installation.\n${normal}"
        exit
    fi
  
    printf "${menu}Stopping Apache2...${normal} "
    if systemctl stop apache2 >/dev/null; then
        printf "${fgreen}done\n${normal}"
    else
        printf "${fgred}Apache2 stopping failed! Stopping the installation.\n${normal}"
        exit
    fi
    
    printf "${menu}Installing snapd...${normal} "
    if apt-get install snapd >/dev/null; then
        printf "${fgreen}done\n${normal}"
    else
        printf "${fgred}snapd installation failed! Stopping the installation.\n${normal}"
        exit
    fi
    
    printf "${menu}Installing certbot...${normal} "
    if snap install --classic certbot >/dev/null; then
        printf "${fgreen}done\n${normal}"
    else
        printf "${fgred}mod_ssl Apache2 module installation failed! Stopping the installation.\n${normal}"
        exit
    fi

    printf "${menu}Creating API SSL certificate...${normal} "
    if /snap/bin/certbot certonly --quiet --agree-tos --standalone -n -m "${ssl_mail}" -d "${api_url}" >/dev/null; then
        printf "${fgreen}done\n${normal}"
    else
        printf "${fgred}API SSL certificate creation failed! Stopping the installation.\n${normal}"
        exit
    fi
       
    printf "${menu}Creating dashboard SSL certificate...${normal} "
    if /snap/bin/certbot certonly --quiet --agree-tos --standalone -n -m "${ssl_mail}" -d "${dashboard_url}" >/dev/null; then
        printf "${fgreen}done\n${normal}"
    else
        printf "${fgred}Dashboard SSL certificate creation failed! Stopping the installation.\n${normal}"
        exit
    fi

    printf "${menu}Installing mod_ssl Apache2 module...${normal} "
    if a2enmod ssl >/dev/null; then
        printf "${fgreen}done\n${normal}"
    else
        printf "${fgred}mod_ssl Apache2 module installation failed! Stopping the installation.\n${normal}"
        exit
    fi
    
    printf "${menu}Creating Apache2 API configuration file...${normal} "
    if echo "<VirtualHost *:443>
        ServerName ${api_url}
        SSLEngine on
        SSLCertificateFile /etc/letsencrypt/live/${api_url}/fullchain.pem
        SSLCertificateKeyFile /etc/letsencrypt/live/${api_url}/privkey.pem
        ProxyPass / http://127.0.0.1:400/
        ProxyPassReverse / http://127.0.0.1:400/
        ErrorDocument 503 '<head>    <title>Mercury Cloud API | Error 503</title></head><body>    <h1>Mercury Cloud API | Error 503</h1>    <h3>Sorry the Mercury Cloud Aloud API is currently unavailable</h3></body> Error code : 503 <br> Error message : Service unavailable'
   </VirtualHost>" > /etc/apache2/sites-enabled/mercurycloud-dashboard-api.conf; then
        printf "${fgreen}done\n${normal}"
    else
        printf "${fgred}Apache2 API configuration file creation failed! Stopping the installation.\n${normal}"
        exit
    fi
        
    printf "${menu}Creating Apache2 Dashboard configuration file...${normal} "
    if echo "<IfModule mod_ssl.c>
                <VirtualHost *:443>
                    ServerName ${dashboard_url}
                    DocumentRoot /var/www/dashboard/
                    RemoteIPHeader CF-Connecting-IP
                    SSLCertificateFile /etc/letsencrypt/live/${dashboard_url}/fullchain.pem
                    SSLCertificateKeyFile /etc/letsencrypt/live/${dashboard_url}/privkey.pem
                    Include /etc/letsencrypt/options-ssl-apache.conf
                </VirtualHost>
            </IfModule>" > /etc/apache2/sites-enabled/mercurycloud-dashboard.conf; then
        printf "${fgreen}done\n${normal}"
    else
        printf "${fgred}Apache2 Dashboard configuration file creation failed! Stopping the installation.\n${normal}"
        exit
    fi
  
    printf "${menu}Set files permissions for Apache2...${normal} "
    if chown -R www-data:www-data /var/www/dashboard; then
        printf "${fgreen}done\n${normal}"
    else
        printf "${fgred}Files permssions setting failled! Stopping the installation.\n${normal}"
        exit
    fi
    
    printf "${menu}Starting Apache2...${normal} "
    if systemctl restart apache2 >/dev/null; then
        printf "${fgreen}done\n${normal}"
    else
        printf "${fgred}Apache2 starting failed! Stopping the installation.\n${normal}"
        exit
    fi
            
    printf "${menu}SystemCTL daemon reloading...${normal} "
    if systemctl daemon-reload >/dev/null; then
        printf "${fgreen}done\n${normal}"
    else
        printf "${fgred}SystemCTL daemon reloading failed! Stopping the installation.\n${normal}"
        exit
    fi
        
    printf "${menu}Starting API service...${normal} "
    if systemctl start mercurycloud-dashboard-api.service >/dev/null; then
        printf "${fgreen}done\n${normal}"
    else
        printf "${fgred}Apache2 restarting failed! Stopping the installation.\n${normal}"
        exit
    fi
    printf "\n${menu}*-*-*-* Installation Finished ! *-*-*-*${normal}\n"
    printf "${menu}*- Go on : ${option}https://${HOSTNAME} or https://${IP} ${normal}\n"
    printf "${menu}*- And continue installing your MercuryCloud Dashboard ${normal}\n"
    printf "${menu}*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*${normal}\n"
}

continue