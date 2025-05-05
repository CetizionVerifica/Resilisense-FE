import React, {Component} from 'react'
import {Button, Row, Col, message, Icon} from 'antd'
import clone from 'clone'
import {connect} from 'react-redux'
import ReactEcharts from 'echarts-for-react'
import {graphql, compose} from 'react-apollo'
import fetchActionsAndKPI from '../../graphql/fetchActionsAndKPI'
import {removeActionAndKPI,
  updateActionAndKPI} from '../../graphql/actionsAndKPIsMutation'
import {actionAndKPISorting, actionAndKPISearch} from '../../actions'
import TableWrapper from '../styles/table.style'
import Box from '../utility/box'
import {sortColumns} from './ActionAndKPIListConfig'
import {InputSearch} from '../utility/inputSearch'
import {DeleteCell, ActionCell} from '../../common/helperCells'
import ActionAndKPIEdit from './CompanyActionAndKPIEdit'
import {openModal} from '../modals/modalActions'
import FinishedActionAndKpiModal from '../modals/finishedActionAndKpi'

class ComapnyActionsAndKPIsList extends Component {
  constructor(props) {
    super(props)
    this.onChange = this.onChange.bind(this)
    this.state = {
      columns: this.createcolumns(clone(sortColumns)),
      search: '',
      addVisible: false,
      editVisible: false,
      visible: false,
      current: 0,
      selectedActionAndKPI: '',
    }
  }
  showAddModal = () => this.setState({visible: true})

  hideAddModal = () => this.setState({visible: false})

  showEditModal = (actionAndKPI) =>
    this.setState({editVisible: true, selectedActionAndKPI: actionAndKPI})

  hideEditModal = () => this.setState({editVisible: false})

  handleCancel = () => {
    this.setState({visible: false})
  };
  createcolumns(columns) {
    const activeColumn = [
      {
        title: '',
        key: 'edit',
        width: 50,
        render: (text, record, index) => null
        // ActionCell([
        //   {
        //     key: 'edit',
        //     link: '#',
        //     onClick: () => this.showEditModal(record),
        //     icon: 'edit',
        //   },
        // ]),
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
    this.props.removeActionAndKPI({
      variables: {
        id,
      },
      //refetchQueries: [{query: this.props.fetchEmployees, variables: {companyId}}],
    }).then(() => {
      message.success('Processing complete!')
      this.props.fetchActionsAndKPI.refetch()
      this.setState({loading: false, visible: false})

    })
  }

  onChange(pagination, filters, sorter) {
    if (sorter && sorter.columnKey && sorter.order) {
      if (sorter.order === 'ascend') {
        this.props.actionAndKPISorting(sorter.columnKey, 'asc')
      } else {
        this.props.actionAndKPISorting(sorter.columnKey, 'desc')
      }
      //this.setState({dataList: dataList.getAll()})
    }
  }

  onSearch() {
    this.props.actionAndKPISearch('name', this.state.search)
  }
  emitEmpty = () => {
    //this.userNameInput.focus()
    this.setState({search: ''})
    this.props.actionAndKPISearch('name', '')
  }
  getOption(projectPerformance) {
    const rowLen = projectPerformance.length
    const xAxisData = []
    const serieData = []
    const tragetPerformace = []
    projectPerformance.map((project, index) => {
      xAxisData.push(String(project.year))
      if (rowLen === index + 1) {
        xAxisData.push(String(project.year + 1))
      }
      serieData.push(project.performance)
      tragetPerformace.push([
        {coord: [index, project.performance]},
        {coord: [index + 1, project.targetPerformance],
        }])
    })


    // console.log(xAxisData, serieData, tragetPerformace)
    return {
      title: {
        text: 'Yearly Project Perfomance',
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['year', 'year'],
      },
      // toolbox: {
      //   show: true,
      //   feature: {
      //     dataZoom: {
      //       yAxisIndex: 'none',
      //     },
      //     dataView: {readOnly: false},
      //     magicType: {type: ['line', 'bar']},
      //     restore: {},
      //     saveAsImage: {},
      //   },
      // },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xAxisData,
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value} ',
        },
      },
      series: {
        type: 'line',
        data: serieData,
        markLine: {
          symbol: 'circle',
          data: tragetPerformace,
        },
      },
    }
  }
  render() {
    const onEvents = {
      click: this.onChartClick,
      legendselectchanged: this.onChartLegendselectchanged,
    }
    const {search, columns, selectedActionAndKPI} = this.state
    const {companyId, fetchActionsAndKPI: {actionsAndKPIs, loading}} = this.props
    if (!actionsAndKPIs) {
      return <div />
    }
    const suffix = search ? <Icon type="close-circle" onClick={this.emitEmpty} /> : null
    return (
      <div style={{marginRight: 30}}>
        <Box style={{margin: 0}}>
          <Row style={{marginBottom: 15}}>
          
            <Col span={12}><InputSearch
              placeholder="Search Issue of Interest"
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
                loading={loading}
                onChange={this.onChange}
                dataSource={actionsAndKPIs}
                className="sortingTable"
                expandedRowRender={({projectPerformance}) => (
                  <ReactEcharts
                    option={this.getOption(projectPerformance)}
                    style={{height: 300}}
                    onChartReady={this.onChartReady}
                    onEvents={onEvents}
                  />)}
                pagination={actionsAndKPIs.length > 10}
              />
            </Col>
          </Row>
          <ActionAndKPIEdit
            visible={this.state.editVisible}
            handleOk={this.handleOk}
            hideModal={this.hideEditModal}
            companyId={companyId}
            actionAndKPI={selectedActionAndKPI}
          />
          {/* <FinishedActionAndKpiModal
            visible={this.state.visible}
            handleOk={this.handleOk}
            hideModal={this.hideAddModal}
            companyId={companyId}
          /> */}
        </Box>
      </div>
    )
  }
}

function mapStateToProps({actionsAndKPIs}) {
  const {sort, order, search, query} = actionsAndKPIs
  return {sortFild: sort, order, search, query}
}
const ActionsAndKPIsListQL = compose(
  graphql(removeActionAndKPI, {
    name: 'removeActionAndKPI',
  }),
  graphql(updateActionAndKPI, {
    name: 'updateActionAndKPI',
  }),
  graphql(fetchActionsAndKPI, {
    name: 'fetchActionsAndKPI',
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
)(ComapnyActionsAndKPIsList)

export default connect(mapStateToProps,
  {actionAndKPISorting, actionAndKPISearch})(ActionsAndKPIsListQL)


