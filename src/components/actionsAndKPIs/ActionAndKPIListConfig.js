import {get} from 'lodash'
import {DateCell, ImageCell, LinkCell, TextCell} from '../../common/helperCells'
import {issueOfInterest} from '../../common/issueOfInterest'

const renderCell = (object, type, key) => {
  const value = object[key]
  switch (type) {
    case 'ImageCell':
      return ImageCell(value)
    case 'DateCell':
      return DateCell(value)
    case 'LinkCell':
      return LinkCell(value)
    case 'issueOfInterestCell':
      return TextCell(get(issueOfInterest[value], 'label', ''))
    default:
      return TextCell(value)
  }
}

const columns = [

  {
    title: 'Issue of Interest',
    key: 'issueOfInterest',
    render: object =>
      renderCell(object, 'issueOfInterestCell', 'issueOfInterest'),
  },
  {
    title: 'Action',
    key: 'action',
    render: object => renderCell(object, 'TextCell', 'action'),
  },
  {
    title: 'KPI',
    key: 'kpi',
    render: object => renderCell(object, 'TextCell', 'kpi'),
  },
  // {
  //   title: 'Baseline',
  //   width: 50,
  //   key: 'baselinePerformance',
  //   render: object => renderCell(object, 'TextCell', 'baselinePerformance'),
  // },


]

const sortColumns = [
  {...columns[0], sorter: true},
  {...columns[1], sorter: true},
  {...columns[2], sorter: true},
  //{...columns[3], sorter: true},
]


export {columns, sortColumns}
