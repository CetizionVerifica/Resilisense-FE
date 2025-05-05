import {TextCell} from '../../common/helperCells'

const renderCell = (object, type, key) => {
  const value = object[key]
  return TextCell(value)
}

const columns = [
  {
    title: 'Project title',
    key: 'title',
    render: object => renderCell(object, 'TextCell', 'title'),
  },
]

const sortColumns = [
  {...columns[0], sorter: false},
]


export {columns, sortColumns}
