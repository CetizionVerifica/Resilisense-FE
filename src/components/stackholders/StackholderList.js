import React, {Component} from 'react'
import {filter, values} from 'lodash'
import {Button, Row, Col, Switch, message, Icon, Upload, Tooltip, notification} from 'antd'
import clone from 'clone'
import {connect} from 'react-redux'
import {graphql, compose} from 'react-apollo'
import {injectIntl} from 'react-intl'
import {companiesMessages, commonMessages} from '../../messages'
import fetchStackholdersQuery from '../../graphql/fetchStakeholders'
import {removeStakeholder, activeStakeholder, addStakeholdersToCompany} from '../../graphql/stakeholderMutation'
import {stakeholderSorting, stakeholderSearch} from '../../actions'
import {DeleteCell, ActionCell} from '../../common/helperCells'
import TableWrapper from '../styles/table.style'
import Box from '../utility/box'
import {sortColumns} from './StackholderListConfig'
import {InputSearch} from '../utility/inputSearch'
import StackholderForm from './StackholderForm'
import StakeholderEdit from './StakeholderEdit'
import {stackholderFields} from './stackholderFields'
import CsvParse from '../utility/CsvParrse'
import stakeholdersCsv from '../../images/stakeholders.csv'
const upldadKeys = values(stackholderFields).map(emp => emp.key)
class StakeholderList extends Component {
  constructor(props) {
    super(props)
    this.onChange = this.onChange.bind(this)
    this.state = {
      columns: this.createcolumns(clone(sortColumns)),
      search: '',
      addVisible: false,
      editVisible: false,
      current: 0,
      selectedStakeholder: '',
    }
  }
  showAddModal = () => this.setState({addVisible: true})

  hideAddModal = () => this.setState({addVisible: false})

  showEditModal = (stakeholder) =>
    this.setState({editVisible: true, selectedStakeholder: stakeholder})

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
          onClick: () => this.showEditModal(record),
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
    this.props.removeStakeholder({
      variables: {
        id,
      },
      //refetchQueries: [{query: this.props.fetchEmployees, variables: {companyId}}],
    }).then(() => {
      message.success('Processing complete!')
      this.props.fetchStakeholders.refetch()
      this.setState({loading: false, visible: false})

    })
  };
  onActiveCell = (id, active) => {
    this.setState({loading: true})
    this.props.activeStakeholder({
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
        this.props.stakeholderSorting(sorter.columnKey, 'asc')
      } else {
        this.props.stakeholderSorting(sorter.columnKey, 'desc')
      }
      //this.setState({dataList: dataList.getAll()})
    }
  }

  onSearch() {
    this.props.stakeholderSearch('name', this.state.search)
  }
  emitEmpty = () => {
    //this.userNameInput.focus()
    this.setState({search: ''})
    this.props.stakeholderSearch('name', '')
  }
  handleData = data => {
    this.setState({loading: true})
    const {companyId, fetchStakeholders} = this.props
    this.props.addStakeholdersToCompany({
      variables: {
        companyId,
        data,
      },
    }).then(() => {
      message.success('Processing complete!')
      this.setState({loading: false, visible: false})
      fetchStakeholders.refetch()
    }).catch(({message, locations, path}) => {
      this.setState({loading: false})
      return notification.warning({
        message: 'Update Stakeholders',
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
    const {search, columns, selectedStakeholder} = this.state
    const {companyId, fetchStakeholders: {stakeholders, loading}, intl: {formatMessage}} = this.props
    if (!stakeholders) {
      return <div />
    }
    const suffix = search ? <Icon type="close-circle" onClick={this.emitEmpty} /> : null
    return (
      <div style={{marginRight: 30}}>
        <Box style={{margin: 0}}>
          <Row style={{marginBottom: 15}}>
            <Col span={12}>
              <Button type="primary" className="" style={{marginRight: 15}} onClick={this.showAddModal}>
                {formatMessage(companiesMessages.btnAddNewStakeholder)}
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
                        {formatMessage(companiesMessages.btnImportStakeholderList)}
                      </Button>
                    </Upload>)
                }}
              />
              <Tooltip placement="top" title="Downlad Sample">
                <a href={stakeholdersCsv} download="stakeholders_template">
                  <Icon type="cloud-download" style={{fontSize: 28, marginRight: 10, marginLeft: 10}} />
                </a>
              </Tooltip>
            </Col>
            <Col span={12}><InputSearch
              placeholder={formatMessage(companiesMessages.searchStakeholder)}
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
                onChange={this.onChange}
                dataSource={filter(stakeholders, {isCompany: false})}
                loading={loading}
                rowKey="id"
                className="sortingTable"
                pagination={stakeholders.length > 10}
              />
            </Col>
          </Row>
          <StackholderForm
            visible={this.state.addVisible}
            refetch={this.props.fetchStakeholders.refetch}
            handleOk={this.handleOk}
            hideModal={this.hideAddModal}
            companyId={companyId}
          />
          <StakeholderEdit
            visible={this.state.editVisible}
            handleOk={this.handleOk}
            hideModal={this.hideEditModal}
            companyId={companyId}
            stakeholder={selectedStakeholder}
          />
        </Box>
      </div>
    )
  }
}

function mapStateToProps({stakeholder}) {
  const {sort, order, search, query} = stakeholder
  return {sortFild: sort, order, search, query}
}
const StakeholderListQL = compose(
  graphql(removeStakeholder, {
    name: 'removeStakeholder',
  }),
  graphql(activeStakeholder, {
    name: 'activeStakeholder',
  }),
  graphql(addStakeholdersToCompany, {
    name: 'addStakeholdersToCompany',
  }),
  graphql(fetchStackholdersQuery, {
    name: 'fetchStakeholders',
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
  }),
)(injectIntl(StakeholderList))

export default connect(mapStateToProps, {stakeholderSorting, stakeholderSearch})(StakeholderListQL)

