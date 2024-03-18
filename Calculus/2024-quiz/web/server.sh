#!/bin/bash

# get directory
script_dir=$(cd "$(dirname "$0")" && pwd)

# change directory
cd "$script_dir"

# open local host
open http://localhost:8080

# python server
python3 -m http.server 8080


