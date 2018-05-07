# README

This is the portal front-end for the RingRx Service.

Requirements:

Docker

Bash

To configure the Docker development image for the portal:
```
dev@machine:~/ringrx_portal$ cd docker
dev@machine:~/ringrx_portal/docker$ ./docker.make.sh
```

The development environment exposes ports 3000, 4200, and 7020 to the host computer.  These are for rails, ember serve, and ember live-reload, respectively. If you need to change these ports, edit the `docker.dev.sh` file. To start the development environment:
```
dev@machine:~/ringrx_portal$ ./docker.dev.sh
```

Once inside the environment, run the following to start the application:
```
root@c68a3d8a9c1f:~# cd /source
root@c68a3d8a9c1f:/source# bundle install
root@c68a3d8a9c1f:/source# rake ember:install
root@c68a3d8a9c1f:/source# cd frontend/
root@c68a3d8a9c1f:/source# npm install
root@c68a3d8a9c1f:/source# bower install
root@c68a3d8a9c1f:/source/frontend# ember build
root@c68a3d8a9c1f:/source/frontend# cd ..
root@c68a3d8a9c1f:/source# rails s -b 0.0.0.0
```

The ember.js application is located in the `frontend/` directory and will compile and build automatically when rails is running, as long as the development server for ember has been run at least once and the app has been built once.  However, it does not detect changes and rails must be restarted when any changes are made to the ember.js application code that requires re-compilation (which is most of them).

Token authentication is required to use the Rails API backend for this application and ember-simple-auth is used to automatically manage the token persistance and inclusion with API requests.  In order to authenticate a user in this application, credentials for a user in the ringrx_engine instance that the application is communicating with must be entered.