import { Nullable } from '../common'
import SourceTypeMap from './source/SourceTypeMap'

interface IBaseLayer {
  getLayerId: () => string
  getToken: () => string
  getSource: () => Nullable<SourceTypeMap>

  getSourceId: () => string
}

export default IBaseLayer
