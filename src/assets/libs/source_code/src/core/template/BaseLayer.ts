import { nanoid } from 'nanoid'
import ILayerProps from 'src/type/interface/props/layer/ILayerPropsMap'
import IBaseLayer from 'src/type/interface/IBaseLayer'
import SourceTypeMap from 'src/type/interface/source/SourceTypeMap'
import { Nullable } from 'src/type/common'
import LayerType from 'src/type/enum/LayerType'

abstract class BaseLayer implements IBaseLayer {
  private _token: string
  id: string
  type: string
  source!: SourceTypeMap

  constructor(props: ILayerProps) {
    this._isValidProps(props)

    const { mapInstance, id, token } = props

    this._isValidId(id)

    this.id = id ?? nanoid()
    this.type = LayerType.RASTER
    this._token = token
  }

  private _isValidProps(props: ILayerProps): void {
    console.dir(props)
  }

  private _isValidId(id: string | undefined): void {
    // console.log(id)
  }

  getLayerId(): string {
    return this.id
  }

  getToken(): string {
    return this._token
  }

  getSource(): Nullable<SourceTypeMap> {
    return this.source
  }

  getSourceId(): string {
    if (!this.source) {
      throw new Error("not find layer's source")
    }

    return this.source.getSourceId()
  }
}

export default BaseLayer
