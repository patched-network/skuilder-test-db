#!/bin/bash

CONTAINER_NAME="skuilder-test-couch"
CONFIG_FILE="./local.ini"

case $1 in
  start)
    echo "Starting CouchDB..."
    if [ "$(docker ps -aq -f name=^/${CONTAINER_NAME}$)" ]; then
      if [ "$(docker ps -aq -f status=exited -f name=^/${CONTAINER_NAME}$)" ]; then
        echo "Removing stopped container..."
        docker start ${CONTAINER_NAME}
      else
        echo "${CONTAINER_NAME} is already running"
      fi
    else
      echo "Creating and starting new CouchDB container..."

      docker run -d \
        --name ${CONTAINER_NAME} \
        -p 5984:5984 \
        -e COUCHDB_USER=admin \
        -e COUCHDB_PASSWORD=password \
        -v $(pwd)/couchdb_data:/opt/couchdb/data \
        -v ${CONFIG_FILE}:/opt/couchdb/etc/local.ini \
        couchdb:2.3.1
    fi
    ;;
  stop)
    docker stop ${CONTAINER_NAME}
    ;;
  remove)
    docker stop ${CONTAINER_NAME} 2>/dev/null
    docker rm ${CONTAINER_NAME}
    ;;
  status)
    docker ps -a -f name=^/${CONTAINER_NAME}$
    ;;
  *)
    echo "Usage: $0 {start|stop|remove|status}"
    exit 1
    ;;
esac
