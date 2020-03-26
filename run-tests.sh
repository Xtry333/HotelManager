#!/bin/bash

# Run tests on server
(cd server && npm install && npm run test)
server_tests=$?

if [ $server_tests -ne 0 ]
then
    exit $server_tests
fi

# # Run tests on client
# (cd client-react && npm install && npm run test)
# client_tests=$?

# if [ $client_tests -ne 0 ]
# then
#     exit $client_tests
# fi