import React, {Component} from 'react'
import {Row, Col, Button, Switch, message, Icon} from 'antd'
import clone from 'clone'
import {withRouter} from 'react-router-dom'
import {graphql} from 'react-apollo'
import styled from 'styled-components'
import {connect} from 'react-redux'
import {companySorting, companySearch, breadcrumbUpdate} from '../../actions'
import fetchUsersQuery from '../../graphql/fetchUsers'
import PageHeader from '../utility/pageHeader'
import Box from '../utility/box'
import {DeleteCell, ActionCell} from '../../common/helperCells'
import TableWrapper from '../styles/table.style'
import LayoutWrapper from '../utility/layoutWrapper'
import {sortColumns} from './UserListConfig'
import {InputSearch} from '../utility/inputSearch'
import UserForm from './UserForm'


const ButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  margin: 0px 0 30px;
`


class UserList extends Component {
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
  componentWillUpdate(nextprops) {
    const {data: {users}, breadcrumbUpdate} = nextprops
    if (users !== this.props.data.users) {
      const breadcrumb = [{name: 'Home', link: '/'},
        {name: 'Users', link: '/users'},
      ]
      breadcrumbUpdate(breadcrumb)
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.data.users !== this.props.data.users || nextState !== this.state) {
      return true
    } else {
      return false
    }
  }
  showAddModal = () => this.setState({addVisible: true})

  hideAddModal = () => this.setState({addVisible: false})

  showEditModal = (employee) =>
    this.setState({editVisible: true, selectedEmployee: employee})

  hideEditModal = () => this.setState({editVisible: false})

  handleCancel = () => {
    this.setState({visible: false})
  };
  createcolumns(columns) {
    const activeColumn = [{
      title: 'Active',
      key: 'active',
      width: 50,
      render: (text, record, index) =>
        (<Switch
          defaultChecked={record.active}
          key={record.id}
          onChange={() => this.onActiveCell(record.id, !record.active)}
        />),
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
  render() {
    const {search, columns} = this.state
    const {data: {loading, users}, breadcrumbUpdate} = this.props
    if (!users) {
      return <div />
    }
    const breadcrumb = [
      {name: 'Home', link: '/'},
      {name: 'Users', link: '/users'},
    ]
    breadcrumbUpdate(breadcrumb)

    const suffix = search ? <Icon type="close-circle" onClick={this.emitEmpty} /> : null
    return (

      <Box >
        <Row>
          <Col span={12}><ButtonWrapper className="isoButtonWrapper">
            <Button type="primary" className="" onClick={this.showModal}>
             Add New User 
            </Button>
          </ButtonWrapper></Col>
          <Col span={12}><InputSearch
            placeholder="Search user"
            className="isoSearchNotes"
            value={search}
            prefix={<Icon type="search" style={{color: 'rgba(0,0,0,.25)'}} />}
            onSearch={() => this.onSearch()}
            enterButton
            suffix={suffix}
            onChange={(e) => this.setState({search: e.target.value})}
          /></Col>
        </Row>
        <TableWrapper
          size="small"
          columns={columns}
          onChange={this.onChange}
          dataSource={users}
          rowKey="_id"
          loading={loading}
          className="sortingTable"
        />
        <UserForm
          visible={this.state.visible}
          handleOk={this.handleOk}
          hideModal={this.hideAddModal}
          refetch={this.props.data.refetch}
        />
      </Box>

    )
  }
}

function mapStateToProps({company}) {
  const {sort, order, search, query} = company
  return {sortFild: sort, order, search, query}
}

const UserListQL =
  graphql(fetchUsersQuery, {
    options: (props) => {
      return {
        variables: {
          sort: props.sortFild,
          order: props.order,
          search: props.search,
          s: props.query,
        },
      }
    },
  })(withRouter(UserList))


export default connect(mapStateToProps, {companySorting, companySearch, breadcrumbUpdate})(UserListQL)
