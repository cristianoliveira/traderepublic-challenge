#!/usr/bin/env bash
#
# Script to prepare and run an image from ECR in an AWS instance
#
# Since EKS and Fargate are not included in the free tier, this script is an
# way to run an image from ECR, so the deployment process is much simpler.
#

set -e # Exit on error

echo "Instance version ${version}"

sudo apt-get update
sudo apt-get install ca-certificates curl gnupg -y

sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"

# Install docker
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y

# Install aws cli for accessing ECR images
# sudo apt-get install unzip  -y
# unzip awscliv2.zip
# sudo ./aws/install

sudo chmod 666 /var/run/docker.sock

cd "$HOME"
echo "HEREIAM" > hereiam.txt

touch creadendial.txt
echo "ACCESS_KEY_ID=" > creadendial.txt
# cat < creadendial.txt | docker login --username demo --password-stdin
 
# Running the image
echo "PORT=3000" >> .env

echo "services:
  app:
    image: trdockercris/tradewishes:app-main
    environment:
      PORT: "7878"
    ports:
      - "80:7878"

  server:
    image: trdockercris/tradewishes:server-main
    ports:
      - "8080:8425"
    restart: on-failure
" > $HOME/docker-compose.yml

echo "#!/usr/bin/env bash
docker login
docker-compose up
" > $HOME/run.sh
