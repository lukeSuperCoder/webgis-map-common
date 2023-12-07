import { Map as MBGLMap } from 'mapbox-gl'
import { Nullable } from 'src/type/common'

interface IBaseControlProps {
  mapInstance: Nullable<MBGLMap>
  element: HTMLElement
}

export default IBaseControlProps
