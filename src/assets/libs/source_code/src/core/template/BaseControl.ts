import { Map as MBGLMap } from 'mapbox-gl'
import IControlProps from 'src/type/interface/props/control/IControlPropsMap'
import { Nullable } from 'src/type/common'

abstract class BaseControl {
  mapInstance: Nullable<MBGLMap>
  element: HTMLElement

  constructor(props: IControlProps) {
    this._isValidProps(props)

    const { mapInstance, element } = props

    this.mapInstance = mapInstance
    this.element = element

    // 点击事件
    this.element.onclick = this.startExecLogic.bind(this)
  }

  abstract startExecLogic(): void

  private _isValidProps(props: IControlProps) {
    const { mapInstance, element } = props

    if (!mapInstance) {
      throw new Error('control with no mapInstance')
    }

    if (!element) {
      throw new Error('control with no dom element')
    }
  }

  /**
   * 点击按钮时即清除之前的鼠标交互事件
   */
  clearInteractions() {
    // console.log('clear')
  }
}

export default BaseControl
