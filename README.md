# OVS-Mesh Script Generator

> OpenFlow playground with OVS: A homemade Mininet alternative

OVS-Mesh Script Generator was developed using [Vue.js](https://github.com/vuejs/vue) framework and [Vis.js](https://github.com/almende/vis) visualization library. 
- More details (Guide): https://laraget.com/blog/ovs-mesh-script-generator.
- DEMO: https://ovs-mesh.laraget.com/

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).

## Running locally with Docker

Use the following if you already have Docker installed on your desktop and wish to avoid npm installation:

``` bash
# this may take some time to complete...
sudo docker image build -t ovs-mesh .

# point your browser to http://localhost:8080/
sudo docker run -p 127.0.0.1:8080:8080 ovs-mesh
```
