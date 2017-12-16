#!/bin/bash

# Zip the contents of this folder
# These are files that we want to include authentication-action.js package.json package-lock.json node_modules
# exclude all '.sh' files and all '.zip' files while zipping
zip -r user.zip * -x "*.zip" -x "*.sh" -x "*.md"


# Create package
wsk -i package update hobbylocale

# Create / Update action
wsk -i action update ichalkaranje.m@husky.neu.edu_dev/hobbylocale/user user.zip --kind nodejs:6 --web true --param-file config.json --main=addPayment

wsk -i action update ichalkaranje.m@husky.neu.edu_dev/hobbylocale/postUser user.zip --kind nodejs:6 --web true --param-file config.json --main=postUser

wsk -i action update ichalkaranje.m@husky.neu.edu_dev/hobbylocale/editUser user.zip --kind nodejs:6 --web true --param-file config.json --main=editUser

# Get url of actions
wsk -i action get ichalkaranje.m@husky.neu.edu_dev/hobbylocale/user --url
wsk -i action get ichalkaranje.m@husky.neu.edu_dev/hobbylocale/postUser --url
wsk -i action get ichalkaranje.m@husky.neu.edu_dev/hobbylocale/editUser --url