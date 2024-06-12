FROM debian:stable AS builder

# Update package lists and install dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    ca-certificates \
    make \
    git \
    zlib1g-dev \
    libssl-dev \
    gperf \
    php-cli \
    cmake \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Clone the repository and build tdlib
RUN git config --global http.sslVerify false && \
    git clone https://github.com/tdlib/td.git && \
    cd td && \
    rm -rf build && \
    mkdir build && \
    cd build && \
    cmake -DCMAKE_BUILD_TYPE=Release -DCMAKE_INSTALL_PREFIX:PATH=../tdlib .. && \
    cmake --build . --target install


# Intermediate stage to copy compiled tdjson.so to final image
FROM debian:stable

# Copy tdjson.so from the builder stage
COPY --from=builder /td/tdlib/lib/ /usr/local/lib/tdlib

ENV LD_LIBRARY_PATH=/usr/local/lib/tdlib

RUN apt-get update && \
    apt-get install -y \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*


WORKDIR /telegram-app

COPY package.json .
RUN npm install --only=prod

COPY . .

ENV APP_S_PORT 8080
EXPOSE 8080

CMD ["npm", "run", "start:prod"]
