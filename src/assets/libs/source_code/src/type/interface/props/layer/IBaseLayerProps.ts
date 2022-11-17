import { Map as MBGLMap } from 'mapbox-gl'
import { Nullable } from 'src/type/common'

interface IBaseLayerProps {
  mapInstance: Nullable<MBGLMap>
  id?: string
  sourceId?: string
}

export default IBaseLayerProps
