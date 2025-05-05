import React from 'react'
import {
  DateCell,
  DeleteCell,
  TagCell,
  LinkCell,
  IconCell,
  ImageCell,
  TextCell,
  ActionCell,
} from '../../common/helperCells';
import axios from 'axios';
import { Icon } from 'antd';

{/* <EditOutlined /> */}
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

const physicalAuditColumns = [
  {
    title: 'Email',
    key: 'companyEmail',
    render: object => renderCell(object, 'TextCell', 'companyEmail'),
  },
  {
    title: 'Company',
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

const supplierColumns = [
  {
    title: 'Email',
    key: 'companyEmail',
    render: object => renderCell(object, 'TextCell', 'companyEmail'),
  },
  {
    title: 'Company',
    key: 'companyName',
    render: object => renderCell(object, 'TextCell', 'partnerCompanyName'),
  },
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
    title: '',
    dataIndex: '',
    width: 50,
    render: (text, record, index) =>
      (<DeleteCell
        index={record.id}
        onDeleteCell={() => this.props.onDeleteCell(record.agencyId, record.supplierId, record.projectId, record.id)}
      />),
  }]

const sortSupplierColumns = [
  {...supplierColumns[0], sorter: false},
  {...supplierColumns[1], sorter: false},
  {...supplierColumns[2], sorter: false},
  {...supplierColumns[3], sorter: false},
  {...supplierColumns[4], sorter: false},
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

const externalSupplierColumns = showModal => [
  {
    title: 'Supplier Name',
    key: 'supplierName',
    render: object => renderCell(object, 'TextCell', 'supplierName'),
  },
  {
    title: 'Supplier Category',
    key: 'supplierCategory',
    render: object => renderCell(object, 'TextCell', 'supplierCategory'),
  },
  {
    title: 'Supplier Category Coverage',
    key: 'supplierCategoryCoverage',
    render: object => renderCell(object, 'TextCell', 'supplierCategoryCoverage'),
  },
  {
    title: 'Engagement Status',
    key: 'engagementStatus',
    render: object => renderCell(object, 'TextCell', 'engagementStatus'),
  },
  {
    title: 'Compliance',
    key: 'compliance',
    render: object => renderCell(object, 'TextCell', 'compliance'),
  },
  {
    title: '',
    key: '',
    render: object => <div onClick={() => showModal(true, object)}><a>Edit</a></div>,
  },
]

const physicalOtherAuditColumns = [
  {
    title: 'Supplier Name',
    key: 'supplierName',
    render: object => renderCell(object, 'TextCell', 'supplierName'),
  },
  {
    title: 'Supplier Category',
    key: 'supplierCategory',
    render: object => renderCell(object, 'TextCell', 'supplierCategory'),
  },
  {
    title: 'Supplier Category Coverage',
    key: 'supplierCategoryCoverage',
    render: object => renderCell(object, 'TextCell', 'supplierCategoryCoverage'),
  },
  {
    title: 'Engagement Status',
    key: 'engagementStatus',
    render: object => renderCell(object, 'TextCell', 'engagementStatus'),
  },
]

const sortExternalSupplierColumns = [
  {...externalSupplierColumns[0], sorter: false},
  {...externalSupplierColumns[1], sorter: false},
  {...externalSupplierColumns[2], sorter: false},
  {...externalSupplierColumns[3], sorter: false},
]


export {partnerColumns, physicalOtherAuditColumns, sortPartnerColumns, sortSupplierColumns, physicalAuditColumns, sortExternalSupplierColumns, externalSupplierColumns}
