<template>
    <div id="leaflet-map" class="main">
        <div class="div_btn">
            <input id="btn_haitu" type="button" value="海图" />
            <input id="btn_ditu" type="button" value="地图" />
            <input id="btn_weixing" type="button" value="卫星" />
        </div>
    </div>
</template>

<script>
    export default {
        data() {

        },
        mounted() {
            this.initMap()
        },
        methods: {
            initMap() {
                var map = L.map('leaflet-map', {
                    crs: L.CRS.EPSG3857,
                    zoom: 5,
                    // gratings: {isShow: true}
                }).setView([31.213, 121.445], 5);
                L.tileLayer(
                    "https://m12.shipxy.com/tile.c?l=Na&m=o&x={x}&y={y}&z={z}"
                ).addTo(map);
                // 自定义按钮-海图
                document.getElementById("btn_haitu").addEventListener("click", function (e) {
                    e.stopPropagation();
                    let gaoDeLayer1 = L.tileLayer(
                        "https://m12.shipxy.com/tile.c?l=Na&m=o&x={x}&y={y}&z={z}"
                    ).addTo(map);
                });
                // 自定义按钮-天地图
                document.getElementById("btn_ditu").addEventListener("click", function (e) {
                    e.stopPropagation();
                    let gaoDeLayer1 = L.tileLayer(
                        "http://t0.tianditu.com/vec_c/wmts?layer=vec&style=default&tilematrixset=c&Service=WMTS&Request=GetTile&Version=1.0.0&Format=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}&tk=9254b8157f0ff0a6331196e4afc27cb6",
                    ).addTo(map);
                });
                // 自定义按钮-卫星
                document.getElementById("btn_weixing").addEventListener("click", function (e) {
                    let gaoDeLayer1 = L.tileLayer(
                        "https://g1.shipxy.com/tile.g?m=1&x={x}&y={y}&z={z}", {
                            layers: 'nexrad-n0r-900913',
                            format: 'image/png',
                            transparent: true,
                            attribution: "Weather data © 2012 IEM Nexrad"
                        }
                    ).addTo(map);
                });
                var marker = L.marker([51.5, -0.09]).addTo(map);
                var circle = L.circle([51.508, -0.11], {
                    color: 'red',
                    fillColor: '#f03',
                    fillOpacity: 0.5,
                    radius: 500
                }).addTo(map);
                // let gaoDeLayer = L.tileLayer(
                //     "https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg"
                // ).addTo(map);
                var url = 'http://r-g.shipxy.com/r/sp.dll?cmd=112&scode=11111111&x={x}&y={y}&z={z}';
                var errorTileUrl = 'https://m.shipxy.com/img/erroshipxy.png';
                var tileLayer = L.tileLayer(url, {
                    attribution: 'Elane Inc.',
                    crs: L.CRS.EPSG3857,
                    maxZoom: 18,
                    minZoom: 2,
                    label: '自定义地图',
                    id: 'diy_tileLayer_001',
                    _name: 'diy_tileLayer_001',
                    // crossOrigin: true,
                    errorTileUrl: errorTileUrl,
                    // detectRetina: true,
                    // tileFunction: function (view) {
                    //     var url = 'http://r-g.shipxy.com/r/sp.dll?cmd=112&scode=11111111&x={x}&y={y}&z={z}';
                    //     var _url = url
                    //             .replace('{x}', view.tile.column)
                    //             .replace('{y}', view.tile.row)
                    //             .replace('{z}', view.zoom);
                    //     return _url;
                    // },
                });
                tileLayer.addTo(map);
                // tileLayer.removeFrom(map);
                console.log(tileLayer);
                var bj = L.marker([39.92, 116.46],{
                    minZoom: 12,
                    show: false
                }).bindPopup('这里是北京');
                var sh = L.marker([31.213, 121.445]).bindPopup('这里是上海');
                var gz = L.marker([23.16, 113.23]).bindPopup('这里是广州');
                var cities = L.layerGroup([bj, sh, gz]).addTo(map);
                let data = {
                    "type": "FeatureCollection",
                    "features": [{
                        "type": "Feature",
                        "properties": {
                            "color": "red",
                            "description": "123"
                        },
                        "geometry": {
                            "type": "Polygon",
                            "coordinates": [
                                [
                                    [116.332409, 39.844124],
                                    [116.332409, 39.978476],
                                    [116.511945, 39.978476],
                                    [116.511945, 39.844124],
                                    [116.332409, 39.844124]
                                ]
                            ]
                        }
                    }]
                }

                L.geoJSON(data, {
                    style: function (feature) {
                        return {
                            color: feature.properties.color
                        };
                    }
                }).bindPopup(function (layer) {
                    return layer.feature.properties.description;
                }).addTo(map);
                var nexrad = L.tileLayer.wms("http://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi", {
                    layers: 'nexrad-n0r-900913',
                    format: 'image/png',
                    transparent: true,
                    attribution: "Weather data © 2012 IEM Nexrad"
                });
                nexrad.addTo(map);
                bj.on('click', (params) => {
                    console.log(params);
                    //自适应定位
                    // let polygon = map.fitBounds([
                    //     [39.92,116.46],
                    //     [40.774, 117.125]
                    // ]);
                    map.flyTo([39.92, 116.46])

                })
                map.on('click', (e) => {
                    map.eachLayer(function (layer) {
                        if (layer.options.layers) {
                            console.log(layer);
                            // map.removeLayer(layer);
                            layer.removeFrom(map);
                            // layer.hide();
                        }
                    });
                    // console.log(e);
                })
                var nexrad = L.tileLayer.wms("http://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi", {
                    layers: 'nexrad-n0r-900913',
                    format: 'image/png',
                    transparent: true,
                    attribution: "Weather data © 2012 IEM Nexrad"
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .main {
        width: 100%;
        height: 100%;

        .div_btn {
            position: relative;
            top: 10px;
            left: 80px;
            z-index: 888;
        }

        .div_btn input[type="button"] {
            cursor: pointer;
        }
    }
</style>