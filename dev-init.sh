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
    echo -e "${BRed}${FMark}${Black} Node.js version is 17 or less.${NC} \n"
    exit 2
fi



# ....| Install Modules and Container Images |.... #
echo -e "\n ${BCyan}...Installing Modules and Container Images...${NC} \n"

# get last commit
git pull > /dev/null 2> git_error.log
if [ $? -eq 0 ]; then
    echo -e "${BGreen}${CMark}${BBlack} git pulled from main ${NC}"
else
    echo -e "${BRed}${FMark} git unable to pull from main. ${Black}Check the git_error.log file for more details. \n"
    exit 3
fi
# install node modules and log error if error
npm install > /dev/null 2> npm_error.log
if [ $? -eq 0 ]; then
    echo -e "${BGreen}${CMark}${BBlack} Installed Node Modules ${NC}"
else
    echo -e "${BRed}${FMark} npm install encountered an error. ${Black}Check the npm_error.log file for more details. \n"
    exit 4
fi
# install docker images
docker pull redis:6.2-alpine > /dev/null 2>> docker_pull_errors.log
docker pull node:18 > /dev/null 2>> docker_pull_errors.log
if [ $? -eq 0 ]; then
    echo -e "${BGreen}${CMark}${BBlack} Node and Redis Images Pulled. ${NC}"
else
    echo -e "${BRed}${FMark} One or more docker pull commands encountered an error. ${Black}Check the docker_pull_errors.log for more details. \n"
    exit 5
fi
# build server image from source
echo -e "\n${BCyan}...Building Web Container Image...\n"
docker build . -t game:dev



# ....| Launch Dev Server |.... #
echo -e "\n${BCyan}...Launching Dev Server...${NC} \n"

# run containers
docker compose up -d
# echo url
echo -e "\n${BWhite}Hold ctrl and click this link ${BCyan}'http://localhost:8000'${NC}"