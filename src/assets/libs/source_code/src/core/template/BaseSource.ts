import { nanoid } from 'nanoid'
import { Nullable } from 'src/type/common'
import SourceType from 'src/type/enum/SourceType'
import IBaseSource from 'src/type/interface/IBaseSource'
import IBaseSourceProps from 'src/type/interface/props/IBaseSourceProps'

abstract class BaseSource implements IBaseSource {
  private _sourceId: string

  public type: SourceType

  constructor(props: IBaseSourceProps) {
    const { sourceId } = props

    this._sourceId = sourceId ?? nanoid()
    this.type = SourceType.RASTER
  }
  getSourceId(): string {
    return this._sourceId
  }
}

export default BaseSource
