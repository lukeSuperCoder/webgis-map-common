import DRAWTYPE from '../enum/DrawType'
import MeasureType from '../enum/MeasureType'

interface IDrawable {
  getPointerType: () => DRAWTYPE | MeasureType

  clear: () => void
}

export default IDrawable
