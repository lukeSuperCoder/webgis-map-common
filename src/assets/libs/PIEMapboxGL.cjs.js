"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("@mapbox/mapbox-gl-draw");require("@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css"),require("@turf/turf");var t=require("nanoid");function r(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}var s=r(e);class o extends s.default{constructor(e){super(e)}}class n extends s.default{constructor(e){super(e)}onAdd(e){e.on("draw:create",this.drawUpdateHandle),e.on("draw:delete",this.drawUpdateHandle),e.on("draw:update",this.drawUpdateHandle)}drawUpdateHandle(e){console.log(e);const t=this.getAll();console.log(t)}}var a,d={Draw:o,Measure:n};!function(e){e.VECTOR="vector",e.GEOJSON="geojson",e.RASTER="raster"}(a||(a={}));var i,u=a;!function(e){e.RASTER="raster"}(i||(i={}));var c=i;class l extends class{constructor(e){const{sourceId:r}=e;this._sourceId=null!=r?r:t.nanoid(),this.id=null!=r?r:t.nanoid(),this.type=c.RASTER}getSourceId(){return this._sourceId}}{constructor(e){super(e);const{url:t}=e;this.type=c.RASTER,this.tiles=[t],this.tileSize=256}}var p={TDTTileLayer:class extends class{constructor(e){this._isValidProps(e);const{mapInstance:r,id:s,token:o}=e;this._isValidId(s),this.id=null!=s?s:t.nanoid(),this.type=u.RASTER,this._token=o}_isValidProps(e){}_isValidId(e){}getLayerId(){return this.id}getToken(){return this._token}getSource(){return this.source}getSourceId(){if(!this.source)throw new Error("not find layer's source");return this.source.getSourceId()}}{constructor(e){super(e);const{url:t,sourceId:r}=e;this.source=new l({url:t,sourceId:r}),this.type=u.RASTER}}};exports.Control=d,exports.Layer=p;
