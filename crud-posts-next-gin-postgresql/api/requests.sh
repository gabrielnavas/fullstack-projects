# Create an user
curl -X POST http://localhost:3001/users \
-H "Content-Type: applications/json" \
-H "Accept: applications/json" \
-d '{"username": "John"}'

# Get an user by id
curl -X GET http://localhost:3001/users/eeac3c2a-8dc3-4186-b34f-4ab28d9fd6c6 \
-H "Accept: applications/json"