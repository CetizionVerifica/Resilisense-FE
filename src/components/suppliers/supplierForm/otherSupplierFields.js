import React from 'react';
import {generateKeys, generateLocalization} from '../../../common/utils'
import {TextField, SelectField} from 'redux-form-antd'
import FormInputNumber from '../../../common/FormInputNumber';
import MDatePicker from '../../../common/MdatePicker';

const otherSupplierFields = generateLocalization('otherSupplierFields', generateKeys({
    supplierName: {
        value: 'supplierName',
        label: 'Supplier Name',
        sizeHalf: true,    
        component: TextField,
        validate: v => {
          if (!v) {
            return 'Required'
          }
          return ''
        },
      },   
    supplierCategory: {
        value: 'supplierCategory',
        label: 'Supplier Category',
        sizeHalf: true,    
        component: TextField,
        validate: v => {
          if (!v) {
            return 'Required'
          }
          return ''
        },
      }, 
    supplierCategoryCoverage: {
        value: 'supplierCategoryCoverage',
        label: 'Supplier Category Coverage',
        sizeHalf: true, 
        format: (value, previousValue) => value ?  `${value}` : '%',
        component: TextField, 
        validate: v => {
          if (!v) {
            return 'Required'
          }
          return ''
        },
    },
    engagementStatus: {
      value: 'engagementStatus',
      label: 'Engagement Status',
      options: [
        {
          label: 'Not Engaged',
          value: 'Not Engaged',
        },
        {
          label: 'Engaged - Assessment pending',
          value: 'Engaged - Assessment pending',
        },
        {
          label: 'Engaged - Assessment provided',
          value: 'Engaged - Assessment provided',
        },
      ],
      sizeHalf: true,    
      component: SelectField,
      showSearch: true,
      notFoundContent: 'Not Found',
      // enterButton: 'Search',
      warn: v => (v && v.length > 2 ? '' : 'too short'),
      validate: v => (v ? '' : 'Required'),
    },
    name: {
        value: 'name',
        label: 'Name',
        sizeHalf: true,    
        component: TextField,
        validate: v => {
          if (!v) {
            return 'Required'
          }
          return ''
        },
      },                              
    supplierEmail: {
        value: 'supplierEmail',
        label: 'e-mail',
        sizeHalf: true,    
        component: TextField,
        validate: v => {
        if (!v) {
            return 'Required'
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(v)) {
            return 'Invalid email address'
        }
        return ''
        },
    },
    assesmentPlatformMethod: {
        value: 'assesmentPlatformMethod',
        label: 'Assesment Platform/Method / Used',
        sizeHalf: true,    
        component: TextField,
        validate: v => {
          if (!v) {
            return 'Required'
          }
          return ''
        },
    }, 
    phone: {
        value: 'phone',
        label: 'Phone',
        sizeHalf: true,    
        component: TextField,
        validate: v => {
          if (!v) {
            return 'Required'
          }
          return ''
        },
    },          
    assesmentResult: {
        value: 'assesmentResult',
        label: 'Assesment Result',
        sizeHalf: true,    
        component: TextField,
        validate: v => {
          if (!v) {
            return 'Required'
          }
          return ''
        },
    },
    compliance: {
      value: 'compliance',
      label: 'Compliance',
      options: [
        {
          label: 'Pending',
          value: 'Pending',
        },
        {
          label: 'Compliant',
          value: 'Compliant',
        },
        {
          label: 'Noncompliant',
          value: 'Noncompliant',
        },
      ],
      sizeHalf: true,    
      component: SelectField,
      showSearch: true,
      notFoundContent: 'Not Found',
      enterButton: 'Search',
      warn: v => (v && v.length > 2 ? '' : 'too short'),
      validate: v => (v ? '' : 'Required'),
    }, 
    assesmentDate: {
        label: 'Assesment Date:',
        value: 'date',
        sizeHalf: false,    
        component: MDatePicker,
    },             
}));

// const normalizePersentage = (value, previousValue, allValues) => {
//   if (value > 100 || value < 0) {
//     value = previousValue;
//   }
//   console.log("Value", value);
//   return `${value} %`;
// }

export {otherSupplierFields}


  