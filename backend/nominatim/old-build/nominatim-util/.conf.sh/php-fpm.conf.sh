tee /etc/php/8.1/fpm/pool.d/www.conf << EOF_PHP_FPM_CONF
[www]
; Replace the tcp listener and add the unix socket
listen = /var/run/php-fpm-nominatim.sock

; Ensure that the daemon runs as the correct user
listen.owner = www-data
listen.group = www-data
listen.mode = 0666

; Unix user of FPM processes
user = www-data
group = www-data

; Choose process manager type (static, dynamic, ondemand)
pm = ondemand
pm.max_children = 5
EOF_PHP_FPM_CONF