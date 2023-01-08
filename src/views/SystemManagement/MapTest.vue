<template>
  <div>
      <div class="map-main">
          <sm-web-map
            server-url="https://iportal.supermap.io/iportal/"
            map-id="801571284"
            :map-options="mapOptions"
            @load="getMapElement"
          >
            <sm-identify :layers="['民航数据']" :fields="['机场','同比增速%','2017旅客吞吐量（人次）']"></sm-identify>
            <sm-search
                position="top-left"
                :openSearchSuggestion="true"
            ></sm-search>
            <sm-coordinate-conversion></sm-coordinate-conversion>
            <sm-layer-manager position="top-right" :layers="layers"></sm-layer-manager>
            <sm-legend :layer-names="['RANGE-民航数据CSV-0']" position="bottom-left"></sm-legend>
          </sm-web-map>
          <!-- <sm-web-scene sceneUrl="https://iserver.supermap.io/iserver/services/3D-CBD/rest/realspace"></sm-web-scene> -->
      </div>
  </div>
</template>

<script>
export default {
 data() {
    return {
      mapOptions: {
        container: 'map', // container id
        style: {
          version: 8,
          sources: {
            'raster-tiles': {
              type: 'raster',
              tiles: [
                'https://iserver.supermap.io/iserver/services/map-china400/rest/maps/China/zxyTileImage.png?z={z}&x={x}&y={y}'
              ],
              tileSize: 256
            }
          },
          layers: [
            {
              id: 'simple-tiles',
              type: 'raster',
              source: 'raster-tiles',
              minzoom: 0,
              maxzoom: 22
            }
          ]
        },
        center: [116.588918, 40.07108], // starting position
        zoom: 6 // starting zoom
      },
      layers: [
        {
          title: '直辖市',
          children: [
            {
              title: '上海',
              mapInfo: {
                serverUrl: 'https://www.supermapol.com/',
                mapId: 394538195,
                layerFilter: function(layer) {
                    console.log('layer', layer);
                  if (layer.name === '上海_县级行政区划图@公众数据') {
                    return true;
                  }
                  return false;
                }
              }
            }
          ]
        }
      ]
    };
  },
  mounted() {

  },
  methods: {
      getMapElement(data) {
          let map = data.map;
          console.log(map);
          map.on('click', (e) => {
            console.log('current position is', e.point.x, e.point.y, e);
          });
          const marker = new mapboxgl.Marker();
          console.log('mark', marker);
          marker.setLngLat([116.588918, 40.07108])
          marker.setPopup(new mapboxgl.Popup().setHTML("<h1> x:"+marker._lngLat.lat+"  y: "+marker._lngLat.lng+"</h1>")) // add popup
          marker.addTo(map);
      }
  }
}
</script>

<style>
.map-main {
    width: 1700px;
    height: 870px;
}
</style>