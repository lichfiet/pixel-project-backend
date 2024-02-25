#!/bin/bash

# Colors
BBlack='\033[1;30m'       # Black
BRed='\033[1;31m'         # Red
BGreen='\033[1;32m'       # Green
BBlue='\033[1;34m'        # Blue
BCyan='\033[1;36m'        # Cyan
BWhite='\033[1;37m'       # White
NC='\033[0m'              # No Color

#Symbols
CMark='\u2713'            # Check Mark
FMark='\u2717'            # Fail Mark

# ....| Check for Dependencies and Version |.... #
echo -e "\n ${BCyan}...Checking Dependencies...${NC} \n"

# Docker
if command -v docker &> /dev/null; then
    echo -e "${BGreen}${CMark}${BBlack} Docker is installed.${NC}"
else
    echo "${BRed}${FMark}${Black} Docker is not installed. Please install Docker before running this script. \n"
    exit 1
fi
# Node and npm version
version=$(node -v | awk -F'v' '{print $2}')
if (( $(echo "$version" | awk -F'.' '{print $1}') >= 18 )); then
    echo -e "${BGreen}${CMark}${BBlack} Node.js version is >= 18${NC}"
else
    echo -e "${BRed}${FMark}${Black} Node.js version is 17 or less, trying to use NVM.${NC} \n"

    export NVM_DIR=$HOME/.nvm;
    source $NVM_DIR/nvm.sh;

    nvm install 18
    nvm use 18

    version=$(node -v | awk -F'v' '{print $2}')
    if (( $(echo "$version" | awk -F'.' '{print $1}') >= 18 )); then
        echo -e "\n ${BGreen}${CMark}${BBlack} Node.js version 18 installed and selected successfully.${NC}"
    else
        echo -e "${BRed}${FMark}${Black} Node.js version is 17 or less and NVM failed or is not installed.${NC} \n"
        exit 2
fi

fi



# ....| Install Modules and Container Images |.... #
echo -e "\n ${BCyan}...Installing Modules and Container Images...${NC} \n"

# install node modules and log error if error
npm install
if [ $? -eq 0 ]; then
    echo -e "\n${BGreen}${CMark}${BBlack} Installed Node Modules ${NC}"
else
    echo -e "${BRed}${FMark} npm install encountered an error. ${NC}${BBlack} NPM Error Log:\n"
    exit 4
fi

# install docker images
docker pull redis:6.2-alpine
if [ $? -eq 0 ]; then
    echo -e "${BGreen}${CMark}${BBlack} Redis Image Pulled. ${NC}"
else
    echo -e "${BRed}${FMark} One or more docker pull commands encountered an error\n"
    exit 5
fi
docker pull node:18
if [ $? -eq 0 ]; then
    echo -e "${BGreen}${CMark}${BBlack} Node Image Pulled. ${NC}"
else
    echo -e "${BRed}${FMark} One or more docker pull commands encountered an error.\n"
    exit 5
fi

# build server image from source
rm -f error.log

# ....| Launch Dev Server |.... #

