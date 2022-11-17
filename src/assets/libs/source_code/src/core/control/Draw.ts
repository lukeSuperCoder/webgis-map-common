import BaseControl from 'src/core/template/BaseControl'
import Collection from 'src/core/common/Collection'
import GeoJSONSource from 'src/core/source/GeoJSONSource'
import ICacheable from 'src/type/interface/ICacheable'
import IDrawable from 'src/type/interface/IDrawable'
import IDrawProps from 'src/type/interface/props/control/IDrawProps'
import DRAWTYPE from 'src/type/enum/DrawType'

class Draw extends BaseControl implements IDrawable, ICacheable<GeoJSONSource> {
  private _cacheStore: Collection<GeoJSONSource>
  private _type: DRAWTYPE

  constructor(props: IDrawProps) {
    super(props)

    const { type } = props

    this._cacheStore = new Collection<GeoJSONSource>()
    this._type = type
  }

  getCacheStore(): Collection<GeoJSONSource> {
    return this._cacheStore
  }

  getPointerType(): DRAWTYPE {
    return this._type
  }

  startExecLogic(): void {
    console.log('start')
  }

  clear(): void {
    this._cacheStore.clear()
  }
}

export default Draw
