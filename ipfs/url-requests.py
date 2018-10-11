#!/usr/bin/python

import sys
import requests
import os

_url = 'https://api.random.org/json-rpc/1/invoke'
_api_key = '11c0c31c-2e26-4b94-943a-702dee93ef88';

# parse env args
arg = [ os.environ['ARG0'], os.environ['ARG1'], os.environ['ARG2'] ]

# payload

_payload = {'jsonrpc': '2.0', 'method': 'generateSignedIntegers', 'params': {'apiKey': _api_key, 'n': arg[0], 'min': arg[1], 'max': arg[2], 'replacement': true, 'base': 10}, 'id': 14215 }

# attempt the request
req = requests.post(_url, data=_payload)

# print text result on single line
# print(json.loads(req.text))
print(req.text.replace('\n',''))
