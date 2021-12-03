#!/bin/bash

if [[ "$VERCEL_GIT_COMMIT_REF" == "hermes-layer-apollo" || "$VERCEL_GIT_COMMIT_REF" == "main" || "$VERCEL_GIT_COMMIT_REF" == "hermes-layer-1" ]] ; then
  echo ">> Proceeding with deploy."
  exit 1; 
else
  echo ">> Skipping deploy!"
  exit 0;
fi