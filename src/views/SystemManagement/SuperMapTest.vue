<template>
    <div class="main" id="map">
    </div>
</template>

<script>
// import Map from 'ol/Map';
// import View from 'ol/View';
// import TileLayer from 'ol/layer/Tile';
// import * as control from 'ol/control';                                            
// import { Logo, TileSuperMapRest } from '@supermap/iclient-ol';

export default {
    data() {
        return {
            
        }
    },
    mounted() {
        this.getSuperMap();
    },
    methods: {
        getSuperMap() {
            var url = "http://10.1.51.69:8090/iserver/services/map-world/rest/maps/%E4%B8%96%E7%95%8C%E5%9C%B0%E5%9B%BE_Day";
            var map = new Map({
            target: 'map',
            controls: control.defaults({attributionOptions: {collapsed: false}}).extend([new Logo()]),
            view: new View({
                center: [111.48, 31.42],
                zoom: 5,
                projection: 'EPSG:4326'
            })
            });
            var layer = new TileLayer({
                source: new TileSuperMapRest({
                    url: url,
                    wrapX: true
            }),
            projection: 'EPSG:4326'
            });
            map.addLayer(layer);
            var scaleControl = new control.ScaleLine();
            var overviewMap = new control.OverviewMap();
            map.addControl(scaleControl);
            map.addControl(overviewMap);
            console.log(map);
        }
    }
}
</script>

<style>
.main {
    height: 100%;
    width: 100%;
}
</style>