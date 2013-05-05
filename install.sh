#!/bin/bash

# Install Node.js for development, the modern way

read -p "Install latest stable Node.js? (y/n) " RESP
echo "Your wish is my command."
if [ "$RESP" = "y" ]; then
	curl https://raw.github.com/isaacs/nave/v0.4.3/nave.sh > lib/nave.sh
	chmod +x lib/nave.sh
	#lib/nave.sh use stable
fi
