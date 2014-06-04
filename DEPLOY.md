# Deploying with Stagecoach
- http://justjs.com/posts/deploying-node-js-and-mongodb-in-production-with-stagecoach
- https://github.com/punkave/stagecoach
- https://github.com/jeffhaack/stagecoach (There is a fix that they haven't included yet in the repo)

## Remote Stagecoach Server Setup
First, set up an EC2 instance and an Elastic IP. Create an A record for domain pointing to Elastic IP.

Log in to server using .pem file and add ssh keys from local machine.

	cat id_rsa.pub >> ~/.ssh/authorized_keys
	chmod 600 ~/.ssh/authorized_keys
	rm id_rsa.pub 

Go as root and install git.

	sudo bash
	apt-get install git-core -y

Clone the stagecoach repo (stagecoach must go into /opt). I am using my fork here because a couple bugs are fixed.

	cd /opt
	git clone https://github.com/jeffhaack/stagecoach.git

Install node and mongodb correctly

	cd stagecoach
	sc-proxy/install-node-and-mongo-on-ubuntu.bash

Install forever module globally

	npm install forever -g

Edit stagecoach settings. Change the user to a non-root user who will be running the apps, USER=ubuntu in the EC2 case

	cp settings.example settings
	sed -i s/"USER=nodeapps"/"USER=ubuntu"/ settings

Create the app directory where your apps will reside

	mkdir -p /opt/stagecoach/apps
	chown ubuntu /opt/stagecoach/apps

Setup config for sc-proxy. Change the domain to the one pointing at the server.

	cd sc-proxy
	cp config-example.js config.js
	sed -i s/"mystagingdomain.com"/"kartulia.com"/ config.js

Install the packages for sc-proxy.

	npm install

(on Ubuntu), create an Upstart script that will start sc-proxy and our apps whenever the server boots

	cp upstart/stagecoach.conf /etc/init
	start stagecoach

## Application Setup on Server
For any application you plan to deploy to the server, you'll need to manually set up a couple of things.  First create a directory in /opt/stagecoach/apps for the project, as well as a data directory inside.

	mkdir -p /opt/stagecoach/apps/simplenodeapp/data

Add the relevant domains that this app should respond to in a hosts file, one per line

	echo "kartulia.com" > /opt/stagecoach/apps/simplenodeapp/data/hosts

Change owner of the directory to the user running the apps (not root)
	
	chown -R ubuntu /opt/stagecoach/apps/simplenodeapp

Create a config.json file in data directory. simplenodeapp uses it to run locally on port 3000 if there is no stagecoach hosts file present.

	echo "{ \"host\": \"kartulia.com\" }" > /opt/stagecoach/apps/simplenodeapp/data/config.json
	
Done! Should now be able to deploy updates from local machine.

## Local Installation of Stagecoach

Install Stagecoach locally, again into /opt

	cd /opt
	sudo git clone git://github.com/punkave/stagecoach.git

Make a symbolic link so sc-deploy is in the PATH

	sudo ln -s /opt/stagecoach/bin/sc-deploy /usr/local/bin/sc-deploy

In project directory, be sure that deployment directory is set up. Settings file should have your project name

Create settings.production file with user and host of server

	USER=ubuntu
	SERVER=kartulia.com

Deploy app (in app directory run:)
	
	sc-deploy production



	