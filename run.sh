#!/bin/bash
mkdir -p output
echo "Scrape html page into json"
node index.js
echo "json to cvs and merge"
python3 mergeCsv.py
echo "Done!"
