#!/bin/bash

# Zip the contents of this folder
# These are files that we want to include authentication-action.js package.json package-lock.json node_modules
# exclude all '.sh' files and all '.zip' files while zipping
zip -r user.zip * -x "*.zip" -x "*.sh" -x "*.md"


# Create package
wsk -i package update hobbylocale

# Create / Update action
wsk -i action update guest/hobbylocale/user user.zip --kind nodejs:6 --web true --param-file config.json --main=addPayment

wsk -i action update guest/hobbylocale/postUser user.zip --kind nodejs:6 --web true --param-file config.json --main=postUser

# Get url of actions
wsk -i action get guest/hobbylocale/user --url
wsk -i action get guest/hobbylocale/postUser --url