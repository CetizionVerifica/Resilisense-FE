import {DateCell, ImageCell, LinkCell, TextCell} from '../../common/helperCells'

const renderCell = (object, type, key) => {
  const value = object[key]
  switch (type) {
    case 'ImageCell':
      return ImageCell(value)
    case 'DateCell':
      return DateCell(value)
    case 'LinkCell':
      return LinkCell(value)
    default:
      return TextCell(value)
  }
}

const columns = [

  {
    title: 'Name',
    key: 'name',
    render: object => renderCell(object, 'TextCell', 'label'),
  },
]

const sortColumns = [
  {...columns[0], sorter: true},
]


export {columns, sortColumns}
