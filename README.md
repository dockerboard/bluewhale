
# bluewhale

The [Dockerboard][] Web Client.

[![badge](http://dockeri.co/image/dockerboard/bluewhale)](https://registry.hub.docker.com/u/dockerboard/bluewhare/)


## Screenshot

![Dockerboard Screenshot](https://github.com/dockerboard/bluewhale/blob/master/screenshots/dockerboard.gif?raw=true)

## Quickstart

Dockerboard Restful API Prefix: `http://localhost/api/`

### Prerequisites

* [Node.js][]
* [Bower][]
* [Gulp][]

```
npm install -g gulp
npm install
```

Or

```
docker build -t dockerboard/bluewhale github.com/dockerboard/bluewhale
docker build -t dockerboard/dockerboard github.com/dockerboard/dockerboard
docker run -d -v /bluewhale/dist --name bluewhale dockerboard/bluewhale
docker run -d -p 8001:8001 -v /var/run/docker.sock:/var/run/docker.sock --volumes-from bluewhale --name dockerboard  dockerboard/dockerboard
open 127.0.0.1:8001
```

### Development

```
gulp watch
```

### Production

```
gulp clean
gulp build
gulp publish
```


## Build With

- [Angular.js][] &mdash; Our front end is an Angular.js app that communicates with the [Dockerboard][] API.
- [Material Design][] &mdash; We use [Angular Material][] for UI.
- [D3.js][] &mdash; We use D3.js for drawing, bring data.


[Dockerboard]: https://github.com/dockerboard/dockerboard
[Node.js]: https://nodejs.org
[Gulp]: http://gulpjs.com
[Bower]: http://bower.io
[Angular.js]: https://www.angularjs.org/
[D3.js]: http://d3js.org/
[Material Design]: https://material.angularjs.org/
