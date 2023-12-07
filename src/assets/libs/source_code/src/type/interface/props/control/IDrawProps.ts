import DRAWTYPE from 'src/type/enum/DrawType'
import IBaseControlProps from './IBaseControlProps'

interface IDrawProps extends IBaseControlProps {
  type: DRAWTYPE
}

export default IDrawProps
