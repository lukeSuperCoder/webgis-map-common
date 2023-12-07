import { RasterLayer} from 'mapbox-gl'
import BaseLayer from 'src/core/template/BaseLayer'
import LayerType from 'src/type/enum/LayerType'
import ITDTTileLayerProps from 'src/type/interface/props/layer/ITDTTileLayerProps'
import TileSource from '../source/TileSource'

class TDTTileLayer extends BaseLayer implements RasterLayer {
  type: LayerType.RASTER

  constructor(props: ITDTTileLayerProps) {
    super(props)

    const { url, sourceId } = props

    this.source = new TileSource({ url, sourceId })

    this.type = LayerType.RASTER
  }
}

export default TDTTileLayer
