import Control from "src/core/template/BaseControl";

class LayerManage extends Control {

  private _layers: Collection

  constructor (props) {
    super(props)

    this._layers = new Collection()
  }
}

export default LayerManage