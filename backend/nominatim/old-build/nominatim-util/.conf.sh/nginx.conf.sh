tee /etc/nginx/sites-available/default << EOF_NGINX_CONF
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    root $APP_DIR/website;
    index search.php index.html;
    location / {
        try_files \$uri \$uri/ @php;
    }

    location @php {
        fastcgi_param SCRIPT_FILENAME "\$document_root\$uri.php";
        fastcgi_param PATH_TRANSLATED "\$document_root\$uri.php";
        fastcgi_param QUERY_STRING    \$args;
        fastcgi_pass unix:/var/run/php-fpm-nominatim.sock;
        fastcgi_index index.php;
        include fastcgi_params;
    }

    location ~ [^/]\.php(/|$) {
        fastcgi_split_path_info ^(.+?\.php)(/.*)$;
        if (!-f \$document_root\$fastcgi_script_name) {
            return 404;
        }
        fastcgi_pass unix:/var/run/php-fpm-nominatim.sock;
        fastcgi_index search.php;
        include fastcgi.conf;
    }
}
EOF_NGINX_CONF
