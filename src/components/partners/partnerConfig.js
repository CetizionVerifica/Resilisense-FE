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
    title: 'Organization Name',
    key: 'organization',
    render: object => renderCell(object, 'TextCell', 'agencyName'),
  },
  {
    title: 'Company Name',
    key: 'companyName',
    render: object => renderCell(object, 'TextCell', 'partnerCompanyName'),
  },
  {
    title: 'Project',
    key: 'projectTitle',
    render: object => renderCell(object, 'TextCell', 'project'),
  },
  {
    title: 'Year',
    key: 'requestedYear',
    render: object => renderCell(object, 'TextCell', 'requestedYear'),
  },
]

const sortColumns = [
  {...columns[0], sorter: false},
  {...columns[1], sorter: false},
  {...columns[2], sorter: false},
  {...columns[3], sorter: false},
]


export {columns, sortColumns}
