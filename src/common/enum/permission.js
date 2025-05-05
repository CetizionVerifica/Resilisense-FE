import {generateKeys, generateLocalization} from '../utils'
const permission = generateLocalization('permission', generateKeys({
  admin: {
    value: 'admin',
    label: 'Admin',
    orderby: 0,
  },
  subsidiary: {
    value: 'subsidiary',
    label: 'View Only',
    orderby: 0,
  },
  // consultant: {
  //   value: 'consultant',
  //   label: 'Consultant',
  //   orderby: 1,
  // },
  // viewer: {
  //   value: 'viewer',
  //   label: 'Viewer',
  //   orderby: 0,
  // },
}))

export {permission}
