cd /vagrant

sudo apt-get install -y curl

# Add PPAs
# ========

# Node.js
curl -sL https://deb.nodesource.com/setup | sudo bash -


# MongoDB
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
sudo echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list

sudo apt-get update

# Install packages
# ================

sudo apt-get install -y mongodb-org nodejs fontconfig

# Install node global packages
sudo npm install -g bower karma mocha gulp phantomjs

# Install dependencies
sudo npm install
