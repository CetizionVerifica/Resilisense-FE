import React from 'react'
import {DateCell, ImageCell, LinkCell, TextCell, ActionCell} from '../../common/helperCells'
import IntlMessages from '../utility/intlMessages'
import {companyInformation, contactPerson} from './companyFields'

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

// Internet Explorer 6-11
const isIE = /*@cc_on!@*/false || !!document.documentMode;

const columns = [
  {
    title: isIE ? companyInformation.name.label : <IntlMessages {...companyInformation.name.localization} />,
    key: 'name',
    width: 100,
    render: object => renderCell(object, 'TextCell', 'name'),
  },

  {
    title: isIE ? contactPerson.personName.label : <IntlMessages {...contactPerson.personName.localization} />,
    key: 'personName',
    width: 200,
    render: object => renderCell(object, 'TextCell', 'personName'),
  },
  {
    title: isIE ? contactPerson.personEmail.label : <IntlMessages {...contactPerson.personEmail.localization} />,
    key: 'personEmail',
    width: 200,
    render: object => renderCell(object, 'TextCell', 'personEmail'),
  },
  {
    title:  isIE ? contactPerson.personPhone.label : <IntlMessages {...contactPerson.personPhone.localization} />,
    key: 'personPhone',

    render: object => renderCell(object, 'TextCell', 'personPhone'),
  },
  {
    title:  isIE ? companyInformation.users.label : <IntlMessages {...companyInformation.users.localization} />,
    key: 'users',
    width: 100,
    render: object => renderCell(object, 'TextCell', 'users'),
  },

  {
    title:  isIE ? companyInformation.lisence.label : <IntlMessages {...companyInformation.lisence.localization} />,
    key: 'lisence',
    width: 100,
    render: object => renderCell(object, 'TextCell', 'Licence'),
  },
  {
    title: '',
    key: 'action',
    width: 100,
    render: object => ActionCell([
      {
        key: 'edit1',
        link: `/company/${object.id}`,
        icon: 'edit',
      },
    ]),
  },
]

const sortColumns = [
  {...columns[0]},
  {...columns[1], sorter: isIE ? false : true},
  {...columns[2], sorter: isIE ? false : true},
  {...columns[3], sorter: isIE ? false : true},
  {...columns[4], sorter: isIE ? false : true},
  {...columns[5], sorter: isIE ? false : true},
  {...columns[6], sorter: false},
]


export {columns, sortColumns}
