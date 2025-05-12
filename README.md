# directus-extension-auth-custom

Auth with username

# Using username

```
curl -X POST http://your-directus-url/auth-custom/login \
 -H "Content-Type: application/json" \
 -d '{"username": "your_username", "password": "your_password"}'
```

# Using email

```
curl -X POST http://your-directus-url/auth-custom/login \
 -H "Content-Type: application/json" \
 -d '{"email": "your_email", "password": "your_password"}'
```
