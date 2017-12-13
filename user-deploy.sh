#!/bin/bash

# Zip the contents of this folder
# These are files that we want to include authentication-action.js package.json package-lock.json node_modules
# exclude all '.sh' files, all '.zip' and all '.md' files while zipping
zip -r user.zip * -x "*.zip" -x "*.sh" -x "*.md"

# Create package
wsk -i package update hobbylocale

# Create / Update action
wsk -i action update guest/hobbylocale/postUser user.zip --kind nodejs:6 --web true --param-file config.json --main=postUser

# Get the url for deployed action
wsk -i action get guest/hobbylocale/postUser --url


# #!/bin/bash

# zip -r persons-action.zip index.js actions/getPersons.js actions/getPersonById.js actions/putPersonById.js actions/postPersons.js actions/deletePerson.js helperMethods/arrayExtensions.js helperMethods/arrayFilters.js package.json package-lock.json node_modules

# wsk -i package update data

# wsk -i action update /guest/data/persons --kind nodejs:6 persons-action.zip --web true --param-file ../envVariables/envParameters_persons.json --main=getPersons
# wsk -i action update /guest/data/getperson --kind nodejs:6 persons-action.zip --web true --param-file ../envVariables/envParameters_persons.json --main=getPersonById
# wsk -i action update /guest/data/putperson --kind nodejs:6 persons-action.zip --web true --param-file ../envVariables/envParameters_persons.json --main=putPersonById
# wsk -i action update /guest/data/postperson --kind nodejs:6 persons-action.zip --web true --param-file ../envVariables/envParameters_persons.json --main=postPersons
# wsk -i action update /guest/data/deleteperson --kind nodejs:6 persons-action.zip --web true --param-file ../envVariables/envParameters_persons.json --main=deletePerson
