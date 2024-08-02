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
    import * as turf from '@turf/turf'
    import {
        getAreaInfo,
        getWfsInfo
    } from '../../utils/request'
    import geojsonvt from 'geojson-vt';
    import proj4 from 'proj4';
    export default {
        data() {
            return {
                map: null,
                layerGroup: null,
                canvas_markers: [],
                markersCanvas: null
            }
        },
        mounted() {
            this.initMap();
            // this.getMvtLayer();
            // this.getWfsByBbox();
            // this.getArea();
            // this.getTest();
            // this.getGeoJsonByfile();
            // this.getGeoJsonByfileVt();
            this.loadCanvasMarker();
            // let timer = this.getCircleLight();
            // setTimeout(() => {
            //     this.getCircleLight();
            // }, 1000);
        },
        methods: {
            initMap() {
                // 自定义 TileLayer 类以拦截瓦片加载
                L.TileLayer.Intercept = L.TileLayer.extend({
                    createTile: function (coords, done) {
                        var tile = document.createElement('img');

                        L.DomEvent.on(tile, 'load', function () {
                            // 瓦片加载成功
                            console.log('Tile loaded:', tile.src);
                            done(null, tile); // 调用 done 回调，无错误
                        });

                        L.DomEvent.on(tile, 'error', function () {
                            // 瓦片加载失败
                            console.log('Tile failed to load:', tile.src);
                            done(null, tile); // 调用 done 回调，无错误
                        });

                        // 构造瓦片 URL
                        tile.src = this.getTileUrl(coords);

                        return tile;
                    }
                });
                let that = this;
                var map = L.map('leaflet-map', {
                    crs: L.CRS.EPSG3857,
                    zoom: 3,
                    minZoom: 3,
                    // gratings: {isShow: true}
                }).setView([31.213, 121.445], 5);
                //mapbox custom layer url
                //"https://api.mapbox.com/styles/v1/luchang666/clsd0b1bg00jc01pvcqfz9f7t/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibHVjaGFuZzY2NiIsImEiOiJjbDAyMDh4aWgwejE4M2txY3NzazlkYW5hIn0.WuT5g-2YeZr3tB0llkZfOA"
                L.tileLayer(
                    "https://g1.shipxy.com/tile.g?m=1&x={x}&y={y}&z={z}",
                ).addTo(map);

                // 添加自定义瓦片图层
                // L.tileLayer.intercept = function (url, options) {
                //     return new L.TileLayer.Intercept(url, options);
                // };

                var tileLayer = L.tileLayer.intercept('https://g1.shipxy.com/tile.g?m=1&x={x}&y={y}&z={z}', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                });
                tileLayer.addTo(map);

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
                    let gaoDeLayer2 = L.tileLayer(
                        "http://t0.tianditu.com/ibo_c/wmts?layer=ibo&style=default&tilematrixset=c&Service=WMTS&Request=GetTile&Version=1.0.0&Format=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}&tk=9254b8157f0ff0a6331196e4afc27cb6",
                    ).addTo(map);
                });
                // 自定义按钮-卫星
                document.getElementById("btn_weixing").addEventListener("click", function (e) {
                    e.stopPropagation();
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
                //tileLayer.addTo(map);
                // tileLayer.removeFrom(map);
                // console.log(tileLayer);
                var bj = L.marker([39.92, 116.46]).bindPopup('这里是北京');
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

                // L.geoJSON(data, {
                //     style: function (feature) {
                //         return {
                //             color: feature.properties.color
                //         };
                //     }
                // }).bindPopup(function (layer) {
                //     return layer.feature.properties.description;
                // }).addTo(map);
                // var nexrad = L.tileLayer("http://api.elanedata.com/geo/coverage/wmts?layer=dicarea%3Aarea_eez_v12&style=&tilematrixset=EPSG%3A3857&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix=EPSG%3A3857%3A{z}&TileCol={x}&TileRow={y}", {
                //     // layers: 'nexrad-n0r-900913',
                //     // format: 'image/png',
                //     transparent: true,
                //     // attribution: "Weather data © 2012 IEM Nexrad"
                // }).addTo(map);
                this.layerGroup = L.layerGroup().addTo(map);
                bj.on('click', (params) => {
                    console.log(params);
                    //自适应定位
                    // let polygon = map.fitBounds([
                    //     [39.92,116.46],
                    //     [40.774, 117.125]
                    // ]);
                    map.flyTo([39.92, 116.46])

                })
                map.on('moveend', (e) => {
                    // that.markersCanvas.removeMarkers(that.canvas_markers,true);
                    // that.loadCanvasMarker();
                    // that.markersCanvas.redraw();
                    // setTimeout(() => {
                    // }, 1000);
                    // that.getWfsByBbox();
                })
                map.on('zoomstart', (e) => {
                    // that.markersCanvas.removeMarkers(that.canvas_markers,true);
                    // that.markersCanvas.redraw();
                    // that.loadCanvasMarker();
                    // that.getWfsByBbox();
                })
                map.on('movestart', (e) => {
                    // that.markersCanvas.removeMarkers(that.canvas_markers,true);
                })
                this.map = map;
            },
            getArea() {
                // 定义AMap投影参数
                proj4.defs("AMap", '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs');

                // 定义EPSG:3857投影参数
                proj4.defs("EPSG:3857",
                    '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs +over'
                    );
                let params = {
                    args: [{
                        "keywords": "海南省"
                    }]
                }
                getAreaInfo(params).then(res => {
                    // console.log(res.locres.poi_list[0].coords);
                    //@代表多面分割标识
                    let data = res.locres.poi_list[0].coords.split('@')
                    //转换成geojson格式
                    let geojson = {
                        "type": "FeatureCollection",
                        "features": []
                    }
                    data.forEach(element => {
                        let coords = element.split(';')
                        //数组去重
                        let points = []
                        for (let i = 0; i < coords.length; i = i + 2) {
                            var lnglat = [parseFloat(coords[i]), parseFloat(coords[i +
                            1])]; // 高德坐标系经纬度数组，例如 [120.12345, 30.67890]
                            points.push(lnglat)
                        }
                        let feature = {
                            "type": "Feature",
                            "properties": {},
                            "geometry": {
                                "type": "Polygon",
                                "coordinates": [
                                    points
                                ]
                            }
                        }
                        geojson.features.push(feature)
                    });
                    console.log(geojson)
                    L.geoJSON(geojson, {
                        style: function (feature) {
                            return {
                                color: 'blue'
                            };
                        }
                    }).bindPopup(function (layer) {
                        return layer.feature.properties.description;
                    }).addTo(this.map);
                })
            },
            getTest() {
                //3857坐标系下获取经纬度对应瓦片坐标
                var lat = 31.213;
                var lon = 121.445;
                var z = 17;
                // 经纬度转为左上角为原点，x轴向右，y轴向下的坐标系中的点
                var mer_lat = (180 - Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360)) * 180 / Math.PI) /
                360; // 计算纬度在墨卡托投影下的x轴像素值
                var mer_lon = (180 + lon) / 360; // 计算经度在墨卡托投影下的y轴像素值
                var x = Math.floor(Math.pow(2, z) * mer_lon); // 计算x轴像素坐标
                var y = Math.floor(Math.pow(2, z) * mer_lat); // 计算y轴像素坐标
                console.log(x, y, z);
                let url = `http://gac-geo.googlecnapps.cn/maps/vt?lyrs=s&x=${x}&y=${y}&z=${z}`; //高德瓦片
                console.log(url, '---gd');
                this.map.setView([lat, lon], z);
                let url2 =
                    `https://t0.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL=${x}&TILEROW=${y}&TILEMATRIX=${z}&tk=9254b8157f0ff0a6331196e4afc27cb6`; //天地图瓦片
                console.log(url2, '---tdt');
            },
            getGeoJsonByfile() {
                //leaflet添加geojson文件图层
                let data = require('../../assets/data/ezz_geojson_low.json');
                // console.log(data);
                let layer = L.geoJSON(data, {
                    onEachFeature: function (feature, layer) {
                        layer.on('mouseover', function (e) {
                            // 在点击时获取对应的数据
                            console.log(feature.properties.LINE_CNAME);
                            layer.setStyle({
                                color: 'red'
                            });
                        });
                        layer.on('mouseout', function (e) {
                            // 在点击时获取对应的数据
                            console.log(feature.properties.LINE_CNAME);
                            layer.setStyle({
                                color: 'blue'
                            });
                        });
                    },
                    style: function (feature) {
                        return {
                            color: 'blue'
                        };
                    }
                }).addTo(this.map);
                // this.map.setView([39.92, 116.46], 17);
            },
            getGeoJsonByfileVt() {
                //leaflet添加geojson文件图层
                let data = require('../../assets/data/ezz_geojson_low.json');
                var options = {
                    maxZoom: 16,
                    tolerance: 3,
                    debug: 0,
                    interactive: true,
                    style: {
                        color: 'blue',
                        fill: false,
                        fillOpacity: 0.2,
                    },
                    onEachFeature: function (feature, layer) {
                        layer.on('mouseover', function (e) {
                            // 在点击时获取对应的数据
                            console.log(feature.properties.LINE_CNAME);
                            layer.setStyle({
                                color: 'red'
                            });
                        });
                        layer.on('mouseout', function (e) {
                            // 在点击时获取对应的数据
                            console.log(feature.properties.LINE_CNAME);
                            layer.setStyle({
                                color: 'blue'
                            });
                        });
                    },
                };
                var vtLayer = L.geoJson.vt(data, options).bindPopup(function (layer) {
                    return layer.feature.properties.LINE_CNAME;
                })
                console.log(vtLayer);
                vtLayer.on('click', function (e) {
                    console.log(e.layer.feature.properties.LINE_CNAME);
                })
                vtLayer.addTo(this.map);
            },
            //生成闪烁的圆圈
            getCircleLight() {
                // 定义水滴的位置和半径
                var center = L.latLng(39.92, 116.46);
                var initialRadius = 0; // 初始半径为0
                var initialOpacity = 0.9;

                // 创建多个圆并添加到地图上
                var circles = [];
                var circle = L.circle(center, {
                    color: 'red',
                    fillColor: 'red',
                    fillOpacity: initialOpacity,
                    opacity: initialOpacity,
                    radius: initialRadius
                }).addTo(this.map);
                circles.push(circle);

                // 定义扩散速度和最大半径
                var speed = 25; // 扩散速度（毫秒）
                var maxRadius = 1000; // 最大半径

                // 定时器函数，每隔一段时间更新所有圆的半径和样式
                function expandCircles() {
                    for (var i = 0; i < circles.length; i++) {
                        var circle = circles[i];
                        var currentRadius = circle.getRadius();

                        if (currentRadius < maxRadius) {
                            // 更新圆的半径
                            circle.setRadius(currentRadius + 10);

                            // 使用 Leaflet 的动画库平滑更新圆的大小
                            circle.setStyle({
                                radius: currentRadius + 10
                            });

                            // 根据当前半径调整圆的不透明度
                            var fillOpacity = (1 - currentRadius / maxRadius) * 0.9;
                            circle.setStyle({
                                fillOpacity: fillOpacity,
                                opacity: fillOpacity
                            });
                        } else {
                            // 更新圆的半径
                            circle.setRadius(0);
                            // 使用 Leaflet 的动画库平滑更新圆的大小
                            circle.setStyle({
                                fillOpacity: 0.9,
                                opacity: 0.9,
                                radius: 0
                            });
                        }
                    }

                    // 检查是否所有圆都达到最大半径，是则清除定时器
                    if (circles.every(function (circle) {
                            return circle.getRadius() >= maxRadius;
                        })) {
                        // clearInterval(intervalId);
                    }
                }

                // 每隔一段时间调用一次定时器函数，实现水滴扩散动画
                var intervalId = setInterval(expandCircles, speed);
                return intervalId;
            },
            getWfsByBbox() {
                let url = 'http://localhost:5555/api/geo/coverage/dicarea/ows'
                let that = this;
                let bounds = this.map.getBounds();
                let bbox = bounds._southWest.lng + ',' + bounds._southWest.lat + ',' + bounds._northEast.lng + ',' +
                    bounds._northEast.lat;
                this.layerGroup.clearLayers();
                let params = {
                    service: 'WFS',
                    version: '1.0.0',
                    request: 'GetFeature',
                    typeName: 'dicarea:eez_v12',
                    // maxFeatures: 5,
                    outputFormat: 'application/json',
                    bbox: bbox
                }
                let tooltip = L.tooltip({
                    sticky: true,
                    permanent: true,
                    direction: 'right'
                });
                getWfsInfo(params).then((res) => {
                    res.features.forEach((item) => {
                        let layer = L.geoJSON(item, {
                            onEachFeature: function (feature, layer) {
                                layer.on('mousemove', function (e) {
                                    // 在点击时获取对应的数据
                                    console.log(e.target.feature.properties
                                        .geocname);
                                    tooltip.setLatLng(e.latlng).setContent(e.target
                                        .feature.properties.geocname).addTo(that
                                        .map);
                                    layer.setStyle({
                                        color: 'red'
                                    });
                                });
                                layer.on('mouseout', function (e) {
                                    // 在点击时获取对应的数据
                                    console.log(e.target.feature.properties
                                        .geocname);
                                    tooltip.remove();
                                    layer.setStyle({
                                        color: 'blue'
                                    });
                                });
                            },
                            style: function (feature) {
                                return {
                                    color: 'blue'
                                };
                            }
                        })
                        this.layerGroup.addLayer(layer);
                    })
                })
            },
            getMvtLayer() {
                var mapboxUrl = 'http://127.0.0.1:8094/getMvtByArea/?x={x}&y={y}&z={z}';
                var mapboxVectorTileOptions = {
                    rendererFactory: L.canvas.tile,
                    // maxNativeZoom: 14,
                    // maxZoom: 24,
                    interactive: true,
                    vectorTileLayerStyles: {
                        // 'layer': {
                        //     icon: new L.Icon(
                        //         {
                        //             iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAiCAYAAABFlhkzAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzIwMzlDREFDODc3MTFFOUJEQjBENTkxMDVGNzVERDkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzIwMzlDREJDODc3MTFFOUJEQjBENTkxMDVGNzVERDkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDMjAzOUNEOEM4NzcxMUU5QkRCMEQ1OTEwNUY3NUREOSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDMjAzOUNEOUM4NzcxMUU5QkRCMEQ1OTEwNUY3NUREOSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PhKXihUAAAUQSURBVHjarFZbSBxnFD47M4mr28aNS1O166VGY1QMRdKHvohW6YMiWCJNTcit9EHbh4IPpi1BaNKHgn3oS9uklRBNglqVFgTxSQWtGCI+JCBequjqrpd0q7Ho6mZ2pt+ZnVncm25KDpydmf/yfec/t39NS8nJFE1mJSkdj4+h70MLoG9AvVAndBE6CG0vXVpyRMMwRSIAcCoe3wlEta8rimRRVYqDihhUobLJRC/w3MbzX0GQFZDg80sQuQ4lAPgHJqLO44pihZJABwvAaUMQWLdA/glIeqISAPxTieh2is8nmlVVG+PNW2wxVDU2QY9g/hiUjWDZxfyKKKoy0WcguR1GAPAPAd6TJssmST/+qihSfE4OpdTWkq20lMzp6X4wh4Pcg4O00t5OntlZSvb5iN0IcFqSJCY5B5LfAwQAT4ZVk3af7zhbvgmr3QkJlN3URKkXLpBJFCO6RwWw8/59mrt5k2x7e2TFafgky6K4gdPmg2TVcPG3iYqigbPl7rg4OnP3Lr116RL91t1NTSAypKWlJfDNxParV6mwtVXbw3sZg7EYU1szYLengGUhU5aPsp1zkkQnb93SNrLU1NRoz4WFhaiBbgWBdXyc/rpxg07KMvl4vSR5EZ1Mdvd5+E8D54DGnzqlWc4yPz+vAY+MjNDY2BhNTEyEgVdXV1NWVhapp0+Ts62NNqamtMC/pihHtwThPLuozKJnAmcLB9TweWNjI2VmZpLZbKaBgQHa3NykoqKigI6OjpLD4Qi4i/cyBovFn4VlfIJCs24Np6KtpER77+zs1KxnAkP6+vpocnIy8M3zFosl8M1753SCOP9QIROckPSc518jFZ1OJ9XV1VF/fz8NDQ1pYxUVFUHuyc/Pp97eXrLb7ZSSkkLmjIxAreiYbzJBcA7qFjQ0NASA2fdut5uKi4vDYtDc3ExVVVUager1hk4LTLCG3pLGlcnQu4uLlJCdHbQqNzdX83dXV1cYAbvQZrP5CxCnNunjst/QdSZ45CFKO6Ifyw2rQwkqKyspLy+PPB4P7ezsUH19vZaaLElJSZr1WlsZHjZcQx7/1jEm6EQ61RxDVXJvWenoIPu1a2HVy6nIwpnEUlBQEFbVLrSORJ0AmFqu8O8fHpNpmqswCenqmZ4m14MHEQuKK7i8vDwoswxxPXyo7eUaYCxgzjC20YtKcJSBDDQ6Dzc55P0ZFE382bPkcrmCrGc3GS4x5B+45umVK5S8u0vxOMGiv+GVoRcNaufIkeUhDNxZh1u4QLhxPYGb3Ajq2/ustVqtQeAqrF2+d08D5z289xkwgPUrg4e26wQ8/jyhKO8k6sc02nXqxYuUhCKKR54rSMXd5WUtoJpb9rXr5/D7uiA8Ac57INiJdOHkILkeo20nvuyFs4f5JVHkW+1dgM8cdGWeQzy60hEPkWIT7p4AV2HERwDvDqq00MWIRw98+P2aGCs8KhVrAf5DKHhEAl2+RgwebQrCoeDsd6x9jNfrkeYjIuAUfL1e/lsQtr0mU1RwnnsmCBzMy7D+RcwEOskMAta4dsApkDEc+OsAn4q25jAf/IxLfHQrAgmPoSiH8frjQQAHEuAUnJlfwFWKLyRrMMZu/BzWq/+bQCcZB2Dbxr5T8DvGWjD39LD9QoyZ+BWyZdunW//cH9hvYtkYEwEsXUW9/qL/B+X/o3d47JURGLcjLPey8nusm6RYF8LiFbSRDuP9lRPo8tNLrqf/BBgAMtRT4KIOceoAAAAASUVORK5CYII=',
                        //             iconSize: [20, 30],
                        //         }
                        //     ),
                        //     radius: 5,  // 设置圆点的半径
                        //     fill: false,
                        //     fillColor: "red",  // 设置内部填充色为红色
                        //     color: "red",  // 设置边框颜色为黑色
                        //     weight: 1,  // 设置边框粗细
                        //     opacity: 1,  // 设置边框透明度
                        //     fillOpacity: 1  // 设置填充色透明度，
                        // },
                        'layer': function (properties, zoom) {
                            var style = {};
                            if (properties.type === 'line') {
                                style = {
                                    color: 'red',
                                    weight: 2
                                };
                            } else if (properties.type === 'point') {
                                style = {
                                    radius: 5,
                                    fillColor: 'blue',
                                    // fillOpacity: 0.5,
                                    stroke: false,
                                    // renderer: L.canvas.tile,
                                    // opacity: zoom<10?0:1,
                                    icon: new L.Icon({
                                        iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAiCAYAAABFlhkzAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzIwMzlDREFDODc3MTFFOUJEQjBENTkxMDVGNzVERDkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzIwMzlDREJDODc3MTFFOUJEQjBENTkxMDVGNzVERDkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDMjAzOUNEOEM4NzcxMUU5QkRCMEQ1OTEwNUY3NUREOSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDMjAzOUNEOUM4NzcxMUU5QkRCMEQ1OTEwNUY3NUREOSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PhKXihUAAAUQSURBVHjarFZbSBxnFD47M4mr28aNS1O166VGY1QMRdKHvohW6YMiWCJNTcit9EHbh4IPpi1BaNKHgn3oS9uklRBNglqVFgTxSQWtGCI+JCBequjqrpd0q7Ho6mZ2pt+ZnVncm25KDpydmf/yfec/t39NS8nJFE1mJSkdj4+h70MLoG9AvVAndBE6CG0vXVpyRMMwRSIAcCoe3wlEta8rimRRVYqDihhUobLJRC/w3MbzX0GQFZDg80sQuQ4lAPgHJqLO44pihZJABwvAaUMQWLdA/glIeqISAPxTieh2is8nmlVVG+PNW2wxVDU2QY9g/hiUjWDZxfyKKKoy0WcguR1GAPAPAd6TJssmST/+qihSfE4OpdTWkq20lMzp6X4wh4Pcg4O00t5OntlZSvb5iN0IcFqSJCY5B5LfAwQAT4ZVk3af7zhbvgmr3QkJlN3URKkXLpBJFCO6RwWw8/59mrt5k2x7e2TFafgky6K4gdPmg2TVcPG3iYqigbPl7rg4OnP3Lr116RL91t1NTSAypKWlJfDNxParV6mwtVXbw3sZg7EYU1szYLengGUhU5aPsp1zkkQnb93SNrLU1NRoz4WFhaiBbgWBdXyc/rpxg07KMvl4vSR5EZ1Mdvd5+E8D54DGnzqlWc4yPz+vAY+MjNDY2BhNTEyEgVdXV1NWVhapp0+Ts62NNqamtMC/pihHtwThPLuozKJnAmcLB9TweWNjI2VmZpLZbKaBgQHa3NykoqKigI6OjpLD4Qi4i/cyBovFn4VlfIJCs24Np6KtpER77+zs1KxnAkP6+vpocnIy8M3zFosl8M1753SCOP9QIROckPSc518jFZ1OJ9XV1VF/fz8NDQ1pYxUVFUHuyc/Pp97eXrLb7ZSSkkLmjIxAreiYbzJBcA7qFjQ0NASA2fdut5uKi4vDYtDc3ExVVVUager1hk4LTLCG3pLGlcnQu4uLlJCdHbQqNzdX83dXV1cYAbvQZrP5CxCnNunjst/QdSZ45CFKO6Ifyw2rQwkqKyspLy+PPB4P7ezsUH19vZaaLElJSZr1WlsZHjZcQx7/1jEm6EQ61RxDVXJvWenoIPu1a2HVy6nIwpnEUlBQEFbVLrSORJ0AmFqu8O8fHpNpmqswCenqmZ4m14MHEQuKK7i8vDwoswxxPXyo7eUaYCxgzjC20YtKcJSBDDQ6Dzc55P0ZFE382bPkcrmCrGc3GS4x5B+45umVK5S8u0vxOMGiv+GVoRcNaufIkeUhDNxZh1u4QLhxPYGb3Ajq2/ustVqtQeAqrF2+d08D5z289xkwgPUrg4e26wQ8/jyhKO8k6sc02nXqxYuUhCKKR54rSMXd5WUtoJpb9rXr5/D7uiA8Ac57INiJdOHkILkeo20nvuyFs4f5JVHkW+1dgM8cdGWeQzy60hEPkWIT7p4AV2HERwDvDqq00MWIRw98+P2aGCs8KhVrAf5DKHhEAl2+RgwebQrCoeDsd6x9jNfrkeYjIuAUfL1e/lsQtr0mU1RwnnsmCBzMy7D+RcwEOskMAta4dsApkDEc+OsAn4q25jAf/IxLfHQrAgmPoSiH8frjQQAHEuAUnJlfwFWKLyRrMMZu/BzWq/+bQCcZB2Dbxr5T8DvGWjD39LD9QoyZ+BWyZdunW//cH9hvYtkYEwEsXUW9/qL/B+X/o3d47JURGLcjLPey8nusm6RYF8LiFbSRDuP9lRPo8tNLrqf/BBgAMtRT4KIOceoAAAAASUVORK5CYII=',
                                        iconSize: [20, 30],
                                    }),
                                };
                            }
                            return style;
                        }
                    },
                };

                var mapboxPbfLayer = L.vectorGrid.protobuf(mapboxUrl, mapboxVectorTileOptions).on('click', function (
                e) { // The .on method attaches an event handler
                    L.popup()
                        .setContent(e.layer.properties.name || e.layer.properties.type)
                        .setLatLng(e.latlng)
                        .openOn(map);

                    L.DomEvent.stop(e);
                }).addTo(this.map);
                console.log(mapboxPbfLayer);
            },
            loadCanvasMarker() {
                let that = this;
                if (!this.markersCanvas) {
                    this.markersCanvas = new L.MarkersCanvas();
                    this.markersCanvas.addTo(this.map);
                }
                that.markersCanvas.removeMarkers(that.canvas_markers, true);
                var icon = L.icon({
                    iconUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAiCAYAAABFlhkzAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzIwMzlDREFDODc3MTFFOUJEQjBENTkxMDVGNzVERDkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzIwMzlDREJDODc3MTFFOUJEQjBENTkxMDVGNzVERDkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDMjAzOUNEOEM4NzcxMUU5QkRCMEQ1OTEwNUY3NUREOSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDMjAzOUNEOUM4NzcxMUU5QkRCMEQ1OTEwNUY3NUREOSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PhKXihUAAAUQSURBVHjarFZbSBxnFD47M4mr28aNS1O166VGY1QMRdKHvohW6YMiWCJNTcit9EHbh4IPpi1BaNKHgn3oS9uklRBNglqVFgTxSQWtGCI+JCBequjqrpd0q7Ho6mZ2pt+ZnVncm25KDpydmf/yfec/t39NS8nJFE1mJSkdj4+h70MLoG9AvVAndBE6CG0vXVpyRMMwRSIAcCoe3wlEta8rimRRVYqDihhUobLJRC/w3MbzX0GQFZDg80sQuQ4lAPgHJqLO44pihZJABwvAaUMQWLdA/glIeqISAPxTieh2is8nmlVVG+PNW2wxVDU2QY9g/hiUjWDZxfyKKKoy0WcguR1GAPAPAd6TJssmST/+qihSfE4OpdTWkq20lMzp6X4wh4Pcg4O00t5OntlZSvb5iN0IcFqSJCY5B5LfAwQAT4ZVk3af7zhbvgmr3QkJlN3URKkXLpBJFCO6RwWw8/59mrt5k2x7e2TFafgky6K4gdPmg2TVcPG3iYqigbPl7rg4OnP3Lr116RL91t1NTSAypKWlJfDNxParV6mwtVXbw3sZg7EYU1szYLengGUhU5aPsp1zkkQnb93SNrLU1NRoz4WFhaiBbgWBdXyc/rpxg07KMvl4vSR5EZ1Mdvd5+E8D54DGnzqlWc4yPz+vAY+MjNDY2BhNTEyEgVdXV1NWVhapp0+Ts62NNqamtMC/pihHtwThPLuozKJnAmcLB9TweWNjI2VmZpLZbKaBgQHa3NykoqKigI6OjpLD4Qi4i/cyBovFn4VlfIJCs24Np6KtpER77+zs1KxnAkP6+vpocnIy8M3zFosl8M1753SCOP9QIROckPSc518jFZ1OJ9XV1VF/fz8NDQ1pYxUVFUHuyc/Pp97eXrLb7ZSSkkLmjIxAreiYbzJBcA7qFjQ0NASA2fdut5uKi4vDYtDc3ExVVVUager1hk4LTLCG3pLGlcnQu4uLlJCdHbQqNzdX83dXV1cYAbvQZrP5CxCnNunjst/QdSZ45CFKO6Ifyw2rQwkqKyspLy+PPB4P7ezsUH19vZaaLElJSZr1WlsZHjZcQx7/1jEm6EQ61RxDVXJvWenoIPu1a2HVy6nIwpnEUlBQEFbVLrSORJ0AmFqu8O8fHpNpmqswCenqmZ4m14MHEQuKK7i8vDwoswxxPXyo7eUaYCxgzjC20YtKcJSBDDQ6Dzc55P0ZFE382bPkcrmCrGc3GS4x5B+45umVK5S8u0vxOMGiv+GVoRcNaufIkeUhDNxZh1u4QLhxPYGb3Ajq2/ustVqtQeAqrF2+d08D5z289xkwgPUrg4e26wQ8/jyhKO8k6sc02nXqxYuUhCKKR54rSMXd5WUtoJpb9rXr5/D7uiA8Ac57INiJdOHkILkeo20nvuyFs4f5JVHkW+1dgM8cdGWeQzy60hEPkWIT7p4AV2HERwDvDqq00MWIRw98+P2aGCs8KhVrAf5DKHhEAl2+RgwebQrCoeDsd6x9jNfrkeYjIuAUfL1e/lsQtr0mU1RwnnsmCBzMy7D+RcwEOskMAta4dsApkDEc+OsAn4q25jAf/IxLfHQrAgmPoSiH8frjQQAHEuAUnJlfwFWKLyRrMMZu/BzWq/+bQCcZB2Dbxr5T8DvGWjD39LD9QoyZ+BWyZdunW//cH9hvYtkYEwEsXUW9/qL/B+X/o3d47JURGLcjLPey8nusm6RYF8LiFbSRDuP9lRPo8tNLrqf/BBgAMtRT4KIOceoAAAAASUVORK5CYII=",
                    iconSize: [20, 32],
                    iconAnchor: [10, 0],
                });

                this.canvas_markers = [];

                for (var i = 0; i < 10000; i++) {
                    var marker = L.marker(
                            [35.5578 + Math.random() * 1.8, 116.0087 + Math.random() * 3.6], {
                                icon
                            }
                        )
                        .bindPopup("I Am " + i)
                        .on({
                            mouseover(e) {
                                this.openPopup();
                            },
                            mouseout(e) {
                                this.closePopup();
                            },
                        });

                    this.canvas_markers.push(marker);
                }

                this.markersCanvas.addMarkers(this.canvas_markers);
            },
            // 将图片转换为 base64 格式的函数
            convertImageToBase64(url) {
                return new Promise((resolve, reject) => {
                    var img = new Image();
                    img.crossOrigin = 'Anonymous'; // 允许跨域加载图片
                    img.onload = function () {
                    var canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    var ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    var dataURL = canvas.toDataURL('image/png');
                    resolve(dataURL);
                    };
                    img.onerror = function () {
                    reject('Failed to convert image to base64');
                    };
                    img.src = url;
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