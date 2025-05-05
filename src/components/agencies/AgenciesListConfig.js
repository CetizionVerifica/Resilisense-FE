import React from "react";
import {
  DateCell,
  ImageCell,
  LinkCell,
  TextCell,
  ActionCell,
} from "../../common/helperCells";
import IntlMessages from "../utility/intlMessages";
import { agencyFields } from "./agenciesField";
const renderCell = (object, type, key) => {
  const value = object[key];
  switch (type) {
    case "ImageCell":
      return ImageCell(value);
    case "DateCell":
      return DateCell(value);
    case "LinkCell":
      return LinkCell(value);
    default:
      return TextCell(value);
  }
};

const isIE = /*@cc_on!@*/false || !!document.documentMode;

const columns = [
  {
    title: isIE ? 'Email' : <IntlMessages {...agencyFields.email.localization} />,
    key: "email",
    width: 300,
    render: (object) => renderCell(object, "TextCell", "email"),
  },
  {
    title: isIE ? 'Name' : <IntlMessages {...agencyFields.name.localization} />,
    key: "name",
    width: 200,
    render: (object) => renderCell(object, "TextCell", "name"),
  },
  {
    title: isIE ? 'Date' : <IntlMessages {...agencyFields.date.localization} />,
    key: "date",
    width: 200,
    render: (object) => renderCell(object, "DateCell", "date"),
  },
  {
    title: isIE ? 'Number of user' : <IntlMessages {...agencyFields.numberOfUser.localization} />,
    key: "numberOfUser",
    width: 300,
    render: (object) => renderCell(object, "TextCell", "numberOfUser"),
  },
  {
    title: isIE ? 'Number of project' : <IntlMessages {...agencyFields.numberOfProject.localization} />,
    key: "numberOfProject",
    width: 300,
    render: (object) => renderCell(object, "TextCell", "numberOfProject"),
  },
  {
    title: isIE ? 'Number of company' :  <IntlMessages {...agencyFields.numberOfCompany.localization} />,
    key: "numberOfCompany",
    width: 300,
    render: (object) => renderCell(object, "TextCell", "numberOfCompany"),
  },
  {
    title: isIE ? 'Updated by' : <IntlMessages {...agencyFields.updatedBy.localization} />,
    key: "updatedBy",
    width: 200,
    render: (object) => renderCell(object, "TextCell", "updatedBy"),
  },
  {
    title: '',
    key: 'action',
    width: 100,
    render: object => {
      return ActionCell([
        {
          key: 'edit1',
          link: `/agency/${object.id}`,
          icon: 'edit',
        },
      ])
    },
  },
];

const sortColumns = [
  { ...columns[0], sorter: isIE ? false : true },
  { ...columns[1], sorter: isIE ? false : true },
  { ...columns[2], sorter: isIE ? false : true },
  { ...columns[3], sorter: isIE ? false : true },
  { ...columns[4], sorter: isIE ? false : true },
  { ...columns[5], sorter: isIE ? false : true },
  { ...columns[6], sorter: isIE ? false : true },
  { ...columns[7], sorter: isIE ? false : false },
];

export { columns, sortColumns };
