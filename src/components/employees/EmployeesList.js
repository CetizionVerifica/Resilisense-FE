import React, {Component} from 'react'
import {Button, Row, Col, Icon, Switch, message, Upload, notification, Tooltip} from 'antd'
import {values} from 'lodash'
import clone from 'clone'
import {connect} from 'react-redux'
import {graphql, compose} from 'react-apollo'
import {injectIntl} from 'react-intl'
import {companiesMessages, commonMessages} from '../../messages'
import fetchEmployeesQuery from '../../graphql/fetchEmployees'
import {removeEmployee, activeEmployee, addEmployeesToCompany} from '../../graphql/employeeMutation'
import {employeeSorting, employeeSearch} from '../../actions'
import TableWrapper from '../styles/table.style'
import Box from '../utility/box'
import {sortColumns} from './EmployeesListConfig'
import {InputSearch} from '../utility/inputSearch'
import EmployeeForm from './EmployeeForm'
import EmployeeEdit from './EmployeeEdit'
import {employeeFields} from './employeeFields'
import {DeleteCell, ActionCell} from '../../common/helperCells'
import CsvParse from '../utility/CsvParrse'
import employeeCsv from '../../images/employee.csv'

const upldadKeys = values(employeeFields).map(emp => emp.key)

class EmployeesList extends Component {
  constructor(props) {
    super(props)
    this.onChange = this.onChange.bind(this)
    this.state = {
      columns: this.createcolumns(clone(sortColumns)),
      search: '',
      addVisible: false,
      editVisible: false,
      current: 0,
      selectedEmployee: '',
    }
  }
  showAddModal = () => {this.setState({addVisible: true})}

  hideAddModal = () => this.setState({addVisible: false})

  showEditModal = (employee) =>
    this.setState({editVisible: true, selectedEmployee: employee})

  hideEditModal = () => this.setState({editVisible: false})

  handleCancel = () => {
    this.setState({visible: false})
  };
  createcolumns(columns) {
    const {intl: {formatMessage}} = this.props
    const activeColumn = [{
      title: formatMessage(commonMessages.commonActive),
      key: 'active',
      render: (text, record, index) =>
        (<Switch
          defaultChecked={record.active}
          key={record.id}
          onChange={() => this.onActiveCell(record.id, !record.active)}
        />),
    },
    {
      title: '',
      key: 'action',
      width: 50,
      render: (text, record, index) => ActionCell([
        {
          key: 'edit',
          link: '#',
          onClick: () => {
            // console.log(text, record, index);
            this.showEditModal(record);
          },
          icon: 'edit',
        },
      ]),
    },
    {
      title: '',
      dataIndex: '',
      render: (text, record, index) =>
        <DeleteCell index={record.id} onDeleteCell={this.onDeleteCell} />,
    }]
    columns.push(...activeColumn)
    return columns
  }

  onDeleteCell = id => {
    this.setState({loading: true})
    this.props.removeEmployee({
      variables: {
        id,
      },
      //refetchQueries: [{query: this.props.fetchEmployees, variables: {companyId}}],
    }).then(() => {
      message.success('Processing complete!')
      this.props.fetchEmployees.refetch()
      this.setState({loading: false, visible: false})

    })
  };
  onActiveCell = (id, active) => {
    this.setState({loading: true})
    this.props.activeEmployee({
      variables: {
        id,
        active,
      },
      //refetchQueries: [{query: fetchCompanyQuery, variables: {id: companyId}}],
    }).then(() => {
      message.success('Processing complete!')
      this.setState({loading: false, visible: false})

    })
  };
  onChange(pagination, filters, sorter) {
    if (sorter && sorter.columnKey && sorter.order) {
      if (sorter.order === 'ascend') {
        this.props.employeeSorting(sorter.columnKey, 'asc')
      } else {
        this.props.employeeSorting(sorter.columnKey, 'desc')
      }
      //this.setState({dataList: dataList.getAll()})
    }
  }

  onSearch() {
    this.props.employeeSearch('name', this.state.search)
  }
  emitEmpty = () => {
    //this.userNameInput.focus()
    this.setState({search: ''})
    this.props.employeeSearch('name', '')
  }
  handleData = data => {
    this.setState({loading: true})
    const {companyId, fetchEmployees} = this.props
    this.props.addEmployeesToCompany({
      variables: {
        companyId,
        data,
      },
      refetchQueries: [{query: fetchEmployeesQuery, variables: {companyId: companyId}}],
    }).then(() => {
      message.success('Processing complete!')
      this.setState({loading: false, visible: false})
      fetchEmployees.refetch()
    }).catch(({message, locations, path}) => {
      this.setState({loading: false})
      return notification.warning({
        message: 'Update Employees',
        description: message,
      })
    })
  }
  handleError = error => {
    this.setState({loading: false})
    return notification.error({
      message: 'Errors in file!',
      description: error,
    })
}
  render() {
    const {search, columns, selectedEmployee} = this.state
    const {companyId, fetchEmployees: {employees, loading}, intl: {formatMessage}} = this.props

    if (!employees) {
      return <div />
    }
    const suffix = search ? <Icon type="close-circle" onClick={this.emitEmpty} /> : null
    return (
      <div style={{marginRight: 30}}>
        <Box style={{margin: 0}}>
          <Row style={{marginBottom: 15}}>
            <Col span={12}>
              <Button
                type="primary"
                className=""
                style={{marginRight: 15}}
                onClick={this.showAddModal}
              >
                {formatMessage(companiesMessages.btnAddNewEmployee)}
              </Button>
              <CsvParse
                keys={upldadKeys}
                onDataUploaded={this.handleData}
                onError={this.handleError}
                render={onChange => {
                  return (
                    <Upload
                      name="file"
                      headers={{authorization: 'authorization-text'}}
                      action="/"
                      customRequest={(e, w) => {
                        onChange(e.file)
                      }}
                      showUploadList={false}
                    >
                      <Button type="primary">
                        <Icon type="upload" />
                        {formatMessage(companiesMessages.btnImportEmployeesList)}
                      </Button>
                    </Upload>)
                }}
              />
              <Tooltip placement="top" title="Downlad Sample">
                <a href={employeeCsv} download="employees_template">
                  <Icon type="cloud-download" style={{fontSize: 28, marginRight: 10, marginLeft: 10}} />
                </a>
              </Tooltip>


            </Col>
            <Col span={12}><InputSearch
              placeholder={formatMessage(companiesMessages.searchEmployee)}
              className="isoSearchNotes"
              value={search}
              prefix={<Icon type="search" style={{color: 'rgba(0,0,0,.25)'}} />}
              onSearch={() => this.onSearch()}
              enterButton
              suffix={suffix}
              onChange={(e) => this.setState({search: e.target.value})}
            /></Col>
          </Row>
          <Row >
            <Col span={24}>
              <TableWrapper
                size="small"
                columns={columns}
                rowKey="id"
                onChange={this.onChange}
                dataSource={employees}
                loading={loading}
                className="sortingTable"
                pagination={employees.length > 10}
              />
            </Col>
          </Row>
          <EmployeeForm
            visible={this.state.addVisible}
            refetch={this.props.fetchEmployees.refetch}
            handleOk={this.handleOk}
            hideModal={this.hideAddModal}
            companyId={companyId}
          />
          <EmployeeEdit
            visible={this.state.editVisible}
            handleOk={this.handleOk}
            hideModal={this.hideEditModal}
            companyId={companyId}
            employee={selectedEmployee}
          />
        </Box>
      </div>
    )
  }
}

function mapStateToProps({employee}) {
  const {sort, order, search, query} = employee
  return {sortFild: sort, order, search, query}
}
const EmployeesListQL = compose(
  graphql(removeEmployee, {
    name: 'removeEmployee',
  }),
  graphql(activeEmployee, {
    name: 'activeEmployee',
  }),
  graphql(addEmployeesToCompany, {
    name: 'addEmployeesToCompany',

  }),
  graphql(fetchEmployeesQuery, {
    name: 'fetchEmployees',
    options: (props) => {
      return {
        variables: {
          companyId: props.companyId,
          sort: props.sortFild,
          order: props.order,
          search: props.search,
          s: props.query,
        },
      }
    },
    fetchPolicy: 'network-only',
  }),
)(EmployeesList)

export default connect(mapStateToProps, {employeeSorting, employeeSearch})(injectIntl(EmployeesListQL))

