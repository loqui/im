#!/bin/bash

SCHEMA="com.canonical.qtmir"
KEY="lifecycle-exempt-appids"

STATUS=$(gsettings get ${SCHEMA} ${KEY})

if [[ $STATUS == *"'loquiim.nfsprodriver'"* ]]; then
	echo "LoquiIM is already in the list of apps being able to run in background!"
  else
    gsettings set ${SCHEMA} ${KEY} "${STATUS%]*}, 'loquiim.nfsprodriver']"
	echo "Added LoquiIM to the list of apps being able to run in background."
fi