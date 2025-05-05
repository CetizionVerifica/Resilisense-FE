import {DateCell, ImageCell, LinkCell, TextCell} from '../../../common/helperCells'

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
    title: 'Rank',
    key: 'rank',
    render: (text, record, index) => index + 1,
  },
  // {
  //   title: 'Organization Name',
  //   key: 'organization',
  //   render: object => renderCell(object, 'TextCell', 'agencyName'),
  // },
  {
    title: 'Name',
    key: 'companyName',
    render: object => renderCell(object, 'TextCell', 'partnerCompanyName'),
  },
  // {
  //   title: 'Country',
  //   key: 'companyCountry',
  //   render: object => renderCell(object, 'TextCell', 'country'),
  // },
  // {
  //   title: 'Sector / Industry',
  //   key: 'companyIndustry',
  //   render: object => renderCell(object, 'TextCell', 'industry'),
  // },
  {
    title: 'Project',
    key: 'projectTitle',
    render: object => {

      if (object.fullAccessToResults) {
        return LinkCell(object.project, `/supplier-gap/${object.gapAnalysis.id}`)
      }

      return renderCell(object, 'TextCell', 'project')
    },
  },
  {
    title: 'Year',
    key: 'requestedYear',
    render: object => renderCell(object, 'TextCell', 'requestedYear'),
  },
  {
    title: 'Overall Performance',
    key: 'overAllPerformance',
    render: object => renderCell(object, 'TextCell', 'overallPerformance'),
  },
  {
    title: 'Overall Relevance',
    key: 'overallRelevance',
    render: object => renderCell(object, 'TextCell', 'overallRelevance'),
  },
]

const sortColumns = [
  {...columns[0], sorter: false},
  {...columns[1], sorter: false},
  {...columns[2], sorter: false},
  {...columns[3], sorter: false},
  {...columns[4], sorter: false},
  {...columns[5], sorter: false},
  {...columns[6], sorter: false},
  // {...columns[7], sorter: false},
]

const partnerColumns = [
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

const sortPartnerColumns = [
  {...partnerColumns[0], sorter: false},
  {...partnerColumns[1], sorter: false},
  {...partnerColumns[2], sorter: false},
  {...partnerColumns[3], sorter: false},
]


export {columns, sortColumns, partnerColumns, sortPartnerColumns}
