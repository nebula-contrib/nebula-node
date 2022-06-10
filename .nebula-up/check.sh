#!/usr/bin/env bash

retries=0

while :
do
  retries=$((retries+1))

  echo "#${retries} - Starting checking nebula graphd..."
  if curl -sL --fail http://127.0.0.1:19669;
    then 
      echo "Result: Successfully"
      exit 0
  fi

  echo "Result: Failed"

  if [ $retries -gt 120 ];
    then 
      echo "Max retry limitation exceeded"
      exit 1
  fi

  docker-compose ps

  echo "Sleep 10s"  
  
  sleep 10
done

exit 0