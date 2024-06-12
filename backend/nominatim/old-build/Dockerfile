FROM ubuntu:jammy AS build

ENV LANG=C.UTF-8
ENV LANGUAGE=C.UTF-8
ENV LC_ALL=C.UTF-8

WORKDIR /nominatim-build

RUN true \
    # Do not start daemons after installation.
    && echo '#!/bin/sh\nexit 101' > /usr/sbin/policy-rc.d \
    && chmod +x /usr/sbin/policy-rc.d \
    # Install all required packages.
    && apt-get update -qq && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    locales \
        build-essential \
        cmake \
        g++ \
        libboost-dev \
        libboost-system-dev \
        libboost-filesystem-dev \
        libexpat1-dev \
        zlib1g-dev \
        libbz2-dev \
        libpq-dev \
        liblua5.3-dev \
        lua5.3 \
        lua-dkjson \
        nlohmann-json3-dev \
        postgresql-14-postgis-3 \
        postgresql-contrib-14 \
        postgresql-14-postgis-3-scripts \
        php-cli \
        php-pgsql \
        php-intl \
        libicu-dev \
        python3-dotenv \
        python3-psycopg2 \
        python3-psutil \
        python3-jinja2 \
        python3-icu \
        python3-datrie \
        python3-sqlalchemy \
        python3-asyncpg \
        python3-yaml \
        nginx \
        php-fpm \
        curl \
        ca-certificates \
    && apt-get clean

#Installation Nominatim
RUN curl -o nominatim.tar.bz2 https://nominatim.org/release/Nominatim-4.3.1.tar.bz2 \
    && tar xf nominatim.tar.bz2 \
    && mkdir build \
    && cd build \
    && cmake ../Nominatim-4.3.1 \
    && make -j$(nproc) \
    && make install

RUN true \
    # Remove development and unused packages.
    && apt-get -y remove --purge \
        cpp-9 \
        gcc-9* \
        g++ \
        make \
        cmake* \
        llvm-10* \
        libc6-dev \
        linux-libc-dev \
        libclang-*-dev \
        build-essential \
        liblua*-dev \
        postgresql-server-dev-14 \
        nlohmann-json3-dev \
        curl \
    && apt-get clean \
    # Clear temporary files and directories.
    && rm -rf \
        /tmp/* \
        /var/tmp/* \
        /root/.cache \
        /var/lib/apt/lists/* 

# Create dedicated nominatim user
RUN useradd --no-create-home -s /bin/bash nominatim

#delete workdir with nominatim source and build directories
RUN rm -rf /nominatim-build

FROM scratch
COPY --from=build / /