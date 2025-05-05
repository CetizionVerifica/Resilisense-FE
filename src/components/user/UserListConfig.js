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
    title: 'User name',
    key: 'name',
    render: object => renderCell(object, 'TextCell', 'name'),
  },
  {
    title: 'Email',
    key: 'personName',
    render: object => renderCell(object, 'TextCell', 'email'),
  },
  {
    title: 'Phone',
    key: 'phone',
    render: object => renderCell(object, 'TextCell', 'phone'),
  },
  {
    title: 'Date created',
    key: 'date',
    width: 100,
    render: object => renderCell(object, 'DateCell', 'date'),
  },

]

const sortColumns = [
  {...columns[0], sorter: true},
  {...columns[1], sorter: true},
  {...columns[2], sorter: true},
  {...columns[3], sorter: true},
]


export {columns, sortColumns}
