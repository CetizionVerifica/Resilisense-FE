import {Input} from 'antd'
import {InputSearchWrapper} from './inputSearch.style'
import WithDirection from '../../common/withDirection'

const {Search} = Input


const WDInputSearch = InputSearchWrapper(Search)
const InputSearch = WithDirection(WDInputSearch)


//export default StyledInput
export {InputSearch}
