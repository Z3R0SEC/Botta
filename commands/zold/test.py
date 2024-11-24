from requests import get, post

api = "https://raaj-api.x10.bz/ai"

req = get(api, params={ "user": "Msomi", "prompt": "Nothing Much Buddy Please Memorize This Code ill Ask forbit now: 3458"})

print(req.json())
