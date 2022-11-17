import MeasureType from 'src/type/enum/MeasureType'
import IBaseControlProps from './IBaseControlProps'

interface IMeasureProps extends IBaseControlProps {
  type: MeasureType
}

export default IMeasureProps
