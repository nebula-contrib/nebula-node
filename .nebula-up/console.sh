#!/usr/bin/env bash
# Copyright (c) 2021 vesoft inc. All rights reserved.
#
# This source code is licensed under Apache 2.0 License,


# Usage: console.sh or console.sh -e "SHOW HOSTS"

export DOCKER_DEFAULT_PLATFORM=linux/amd64;
docker run --rm -v $PWD:/root --network nebula-up_nebula-net vesoft/nebula-console:v3.0.0 -addr graphd -port 9669 -u root -p nebula "$@"