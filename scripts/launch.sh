#!/bin/bash

if [ -z "$S3_CONFIG_BUCKET_NAME" ]
then
  echo "No s3 config bucket name provided!, proceeding with normal launch."
  npm start
else
  aws s3 cp "s3://$S3_CONFIG_BUCKET_NAME/appConfig.js" "public/appConfig.js"
  cat public/appConfig.js
  npm start
fi
