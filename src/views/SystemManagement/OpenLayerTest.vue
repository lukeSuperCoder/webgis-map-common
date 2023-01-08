<template>
    <div id="map-container"></div>
</template>

<script>
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import {Map, View} from 'ol';
import {fromLonLat} from 'ol/proj';
import Modify from 'ol/interaction/Modify';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import sync from 'ol-hashed';
export default {
    data() {
        return {

        }
    },
    mounted() {
        this.getMap();
    },
    methods: {
        getMap() {
            const map = new Map({
                target: 'map-container',
                layers: [
                    new TileLayer({
                    source: new OSM(),
                    }),
                ],
                view: new View({
                    center: [0, 0],
                    zoom: 2,
                }),
            });
            sync(map);
            const source = new VectorSource();
            const layer = new VectorLayer({
                source: source,
            });
            map.addLayer(layer);
            map.addInteraction(
                new Modify({
                    source: source,
                })
            );
        }
    }
}
</script>

<style>
#map-container {
    margin: 0;
    height: 100%;
    width: 100%;
    font-family: sans-serif;
}
</style>
<style>
    @import "../../../node_modules/ol/ol.css";
</style>