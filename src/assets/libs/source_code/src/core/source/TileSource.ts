import { RasterSource } from 'mapbox-gl'
import BaseSource from 'src/core/template/BaseSource'
import SourceType from 'src/type/enum/SourceType'
import ITileSourceProps from 'src/type/interface/props/source/ITileSourceProps'

class TileSource extends BaseSource implements RasterSource {
  type: SourceType.RASTER
  tiles?: string[] | undefined
  tileSize?: number | undefined

  constructor(props: ITileSourceProps) {
    super(props)

    const { url } = props

    this.type = SourceType.RASTER

    this.tiles = [url]
    this.tileSize = 256
  }
}

export default TileSource
