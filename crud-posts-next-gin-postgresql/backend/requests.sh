# Create an user
curl -X POST http://localhost:3001/users \
-H "Content-Type: applications/json" \
-H "Accept: applications/json" \
-d '{"username": "mary", "password": "123"}'

# Find an user by id
curl -X GET http://localhost:3001/users/eeac3c2a-8dc3-4186-b34f-4ab28d9fd6c6 \
-H "Accept: applications/json"

# Create a post
curl -X POST http://localhost:3001/posts \
-H "Content-Type: applications/json" \
-H "Accept: applications/json" \
-d '{"description": "Hello World!", "userId": "eeac3c2a-8dc3-4186-b34f-4ab28d9fd6c6"}'

# Find posts
curl -X GET http://localhost:3001/posts?page=0&size=10&query=hello \
-H "Accept: applications/json"

# Auth sigin
curl -X POST http://localhost:3001/auth/signin \
-H "Content-Type: applications/json" \
-H "Accept: applications/json" \
-d '{"username": "mary", "password": "123"}'

