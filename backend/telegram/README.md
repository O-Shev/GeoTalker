if we not yet login to telegram we receive { '@type': 'authorizationStateReady' }, then we need send:


    {
        "@type": "checkAuthenticationCode",
        "code": "<code>"
    }

for example:
```http request
curl -X POST http://localhost:8084 -H "Content-Type: application/json" -d '{
    "@type": "checkAuthenticationCode",
    "code": "76543"
}'
```