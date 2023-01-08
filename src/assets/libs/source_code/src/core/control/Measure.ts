import BaseControl from 'src/core/template/BaseControl'
import Collection from 'src/core/common/Collection'
import GeoJSONSource from 'src/core/source/GeoJSONSource'
import MeasureType from 'src/type/enum/MeasureType'
import ICacheable from 'src/type/interface/ICacheable'
import IDrawable from 'src/type/interface/IDrawable'
import IMeasureProps from 'src/type/interface/props/control/IMeasureProps'

class Measure extends BaseControl implements IDrawable, ICacheable<GeoJSONSource> {
  private _type: MeasureType

  private _cacheStore: Collection<GeoJSONSource>

  constructor(props: IMeasureProps) {
    super(props)

    const { type } = props

    this._type = type
    this._cacheStore = new Collection<GeoJSONSource>()
  }

  startExecLogic(): void {
    console.log('start')
  }

  getCacheStore(): Collection<GeoJSONSource> {
    return this._cacheStore
  }

  getPointerType() {
    return this._type
  }

  clear() {
    console.log('clear')
  }
}

export default Measure
