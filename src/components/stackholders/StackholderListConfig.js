import React from 'react'
import {DateCell, ImageCell, LinkCell, TextCell} from '../../common/helperCells'
import IntlMessages from '../utility/intlMessages'
import {stackholderFields} from './stackholderFields'

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
    title: <IntlMessages {...stackholderFields.companyName.localization} />,
    key: 'companyName',
    width: 200,
    render: object => renderCell(object, 'TextCell', 'companyName'),
  },
  {
    title: <IntlMessages {...stackholderFields.name.localization} />,
    key: 'name',
    width: 200,
    render: object => renderCell(object, 'TextCell', 'name'),
  },
  {
    title: <IntlMessages {...stackholderFields.jobPosition.localization} />,
    key: 'jobPosition',

    render: object => renderCell(object, 'TextCell', 'jobPosition'),
  },
  {
    title: <IntlMessages {...stackholderFields.email.localization} />,
    key: 'email',
    width: 100,
    render: object => renderCell(object, 'TextCell', 'email'),
  },
  {
    title: <IntlMessages {...stackholderFields.phone.localization} />,
    key: 'phone',
    render: object => renderCell(object, 'TextCell', 'phone'),
  },
]

const sortColumns = [
  {...columns[0], sorter: true},
  {...columns[1], sorter: true},
  {...columns[2], sorter: true},
  {...columns[3], sorter: true},
  {...columns[4], sorter: true},
]


export {columns, sortColumns}
