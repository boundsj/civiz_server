What is this?
-------------
Real time tweet vizualation for Chicago. It is a bit contrived in that instead of doing everything in say, node.js, it uses several processes to capture streaming tweets for geobounded areas and pass those tweets via redis pub/sub to other processes that, in turn, push them to connected browsers. The real purpose of creating this application is to explore and demonstrate the potential and power of [polyglot](http://en.wikipedia.org/wiki/Polyglot_(computing) application stacks running on [Paas](http://en.wikipedia.org/wiki/Platform_as_a_service) vendors like Heroku. So, if you install this application you will have:

1 Python process running as a distinct heroku app that captures tweets and pushes them to redis pub/sub
1 Node.js process running on another distinct heroku app that subscribes to the (shared) pub/sub
The Node server will collect and push all tweets from the redis pub/sub to browsers that connect to it with Socket.io.
Those browsers will show the tweets as pins on a map.
The map tiles were generated with [TileMill](http://mapbox.com/tilemill/) and are hosted on [MapBox](http://mapbox.com/).
[Leaflet](http://leaflet.cloudmade.com/) / [Wax](http://mapbox.com/wax/) are used to render the map and the tweet points.

Currently, the application is Chicago specific but there is no reason why it cannot be extended to cover other locations!

Installation Instructions
-------------------------
Prerequisite: Unless you just want to see a boring map, you'll need to install [civiz_tractor](https://github.com/boundsj/civiz_tractor), the python application that listens to twitter and pushes all captured tweets to redis pub/sub. After you work through the install instructions for civiztractor come back here and continue.

These instructions assume that you have got git (and GitHub), [NPM](http://npmjs.org/), and [Node](http://nodejs.org/) installed. Install them on your development environment if you have not done so already before continuing. For reference, this application works and was tested with the following software versions:
npm 1.1.2
node 0.6.6
redis 2.4.9

First, create a working directory for the project and cd into it. Then, clone this repo:

    $ git@github.com:boundsj/civiz_server.git 
    $ cd civiz_server

Now set up the node app by installing it's required packages with npm. There is a packages.json file so you only need to run npm install:

    $ npm install 

It's worth nothing that, like civiztractor, this application uses environment settings, too (just the way heroku likes). They are in development-settings.json and probably don't need to be touched. But, knowing that they are there is good so if you need to do something like change the redis port you can do it.

Running Locally
---------------
To run the server app locally, all you need to to is start the node process, like this:

    $ node server.js

This will start the web server portion of the application. You can now connect your browser to http://localhost:3000 and you should see something that looks like a map of chicago.
To see tweets on the map, you need to start the python program you set up in [civiz_tractor](https://github.com/boundsj/civiz_tractor). Follow the instructions from tractor and start the python app. You should now have something that looks like the [hosted version of civiz](http://civiz.herokuapp.com/). 

Deploy to Heroku
----------------
heroku config:add `heroku config -a civiz-tractor -s | grep REDISTOGO_URL`

If you haven't [signed up for Heroku](https://api.heroku.com/signup), go
ahead and do that. You should then be able to [add your SSH key to
Heroku](http://devcenter.heroku.com/articles/quickstart), and also
`heroku login` from the commandline.

Now, to upload your application, you'll first need to do the
following -- and obviously change `app_name` to the name of your
application:

    $ heroku create app_name -s cedar

Next, you need to tell this server app about the redis pub/sub that is available on the tractor app on heroku.
To do this, you use the heroku config command you installed when setting up tractor and set the environment
variable for REDISTOGO to be the same in server as it is in tractor:

    $ heroku config:add `heroku config -a YOUR_HEROKU_CIVIZ_TRACTOR_APP_NAME -s | grep REDISTOGO_URL` 

Now you can push your application up to Heroku.

    $ git push heroku master
    $ heroku scale worker=1

Finally, we can make sure the application is up and running.

    $ heroku ps

Now, we can also view the application logs.

    $ heroku logs

Finally, go to app_name.herokuapp.com and check out your app on heroku! Have fun!

