What is this?
-------------
Real time tweet vizualation for several major urban areas. It is a bit contrived in that instead of doing everything in say, node.js, it uses several python processes to capture streaming tweets for geobounded areas and passes those tweets via redis pub/sub to a node.js process that, in turn, pushes them to connected browsers. As such, it is an interesting, non-trivial application to attempt to run on a platform service like Heroku (for which instructions are supplied below) 

Installation Instructions
-------------------------
These instructions assume that you have got git (and GitHub), Python (2.6 or 2.7), [virtualenvwrapper](http://www.doughellmann.com/projects/virtualenvwrapper/), [Redis](http://redis.io/), [NPM](http://npmjs.org/), and [Node](http://nodejs.org/) installed. Install them on your development environment if you have not done so already before continuing.

For hosting on Heroku (described later), please check the Heroku website for instructions related to setting up an account and installing the development tools on your machine.

First, using virtualenvwrapper, create a working directory with mkvirtualenv and cdvirtualenv into it. Then, clone this repo:

    $ git@github.com:boundsj/civiz.git
    $ cd civiz

Civiz uses the tweetstreamwrapper submodule to handle pushing tweets from the python process that captures them to a node.js process via redis. Install and load the submodule now:

    $ git submodule init
    $ git submodule update

Next, you need to create a user_info.py file and add a valid twitter username and password to it:

    $ OLD="'username': ''"; NEW="'username': 'YOUR_TWITTER_USERNAME'";
          sed -e "s/$OLD/$NEW/g" user_info_rename.py > user_info2.py;
          OLD="'password': ''"; NEW="'password': 'YOUR_TWITTER_PASSWORD'";
          sed -e "s/$OLD/$NEW/g" user_info2.py > user_info.py;
          rm user_info2.py;
(or simply cp the file, open it and add your user info / password for twitter)

Now set up the node app by installing it's required packages with npm. There is a packages.json file so you only need to run npm install:

    $ cd node
    $ npm install 

TODO: set up environment variables in .env file TWITTER USER & PASS, REDIS
TODO: note that node's env variables are in development-settings.json, probably don't need to be touched

Running Locally
---------------



Deploy to Heroku
----------------
heroku create YOUR_APP_NAME -s cedar
heroku plugins:install git://github.com/ddollar/heroku-config.git
heroku config:add `heroku config -a civiz-tractor -s | grep REDISTOGO_URL`
