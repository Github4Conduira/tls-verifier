# Copyright 2018 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

FROM golang:1.19.0-alpine3.16

RUN apk add --no-cache curl git ca-certificates && \
  rm -rf /var/lib/apt/lists/*

ARG VERSION=1.3.1

RUN GOPATH=~/go; export GOPATH
RUN git clone https://github.com/improbable-eng/grpc-web.git $GOPATH/src/github.com/improbable-eng/grpc-web
RUN cd $GOPATH/src/github.com/improbable-eng/grpc-web && go install ./go/grpcwebproxy

# ADD ./etc/localhost.crt /etc
# ADD ./etc/localhost.key /etc

CMD ["/bin/sh", "-c", "exec /go/bin/grpcwebproxy --backend_addr=node-server:8001 --run_tls_server=false --allow_all_origins --server_http_max_write_timeout 1h"]