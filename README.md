
# bluewhale

The [Dockerboard][] Web Client.

  [![NPM version][npm-image]][npm-url]

[![badge](http://dockeri.co/image/dockerboard/bluewhale)](https://registry.hub.docker.com/u/dockerboard/bluewhale/)


## Screenshot

![Dockerboard Hosts Screenshot](https://raw.githubusercontent.com/dockerboard/bluewhale/master/screenshots/hosts.gif)

![Dockerboard Screenshot](https://raw.githubusercontent.com/dockerboard/bluewhale/master/screenshots/dockerboard.gif)

## Quickstart

Dockerboard Restful API Prefix: `http://localhost/api/`

### Prerequisites

* [Node.js][]
* [Bower][]
* [Gulp][]

```
npm install -g gulp
npm install -g bower
npm install
bower install
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
[Angular Material]: https://material.angularjs.org/

[npm-image]: https://img.shields.io/npm/v/bluewhale.svg?style=flat-square
[npm-url]: https://npmjs.org/package/bluewhale
