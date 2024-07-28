#!/usr/bin/env bash
#
# Script to prepare and run an image from ECR in an AWS instance
#
# Since EKS and Fargate are not included in the free tier, this script is an
# way to run an image from ECR, so the deployment process is much simpler.
#

set -e # Exit on error

echo "Instance version ${app_image_tag}"

sudo apt-get update
sudo apt-get install ca-certificates curl gnupg -y

sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install docker
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y

sudo chmod 666 /var/run/docker.sock

# Running the image
echo "PORT=3000" >> .env

echo "
name: tradewishes
services:
  app:
    image: trdockercris/tradewishes:app-${app_image_tag}
    environment:
      PORT: \"7878\"
    ports:
      - \"80:7878\"

  server:
    image: trdockercris/tradewishes:server-${app_image_tag}
    ports:
      - \"8080:8425\"
    restart: on-failure
" > "$HOME"/docker-compose.yml

echo "#!/usr/bin/env bash

echo \"Logging in to ECR\"
docker login

echo \"Running the images\"
docker compose up
" > "$HOME"/run.sh

chmod +x "$HOME"/run.sh
