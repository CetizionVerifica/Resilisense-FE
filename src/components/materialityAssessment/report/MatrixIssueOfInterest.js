import React, {Component} from 'react'
import {Row, Col} from 'antd'
import {orderBy, get} from 'lodash'
import ReactEcharts from 'echarts-for-react'
import TableWrapper from '../../styles/table.style'
import basicStyle from '../../../common/basicStyle'
import {coreSubjectNames} from '../../../common/coreSubjectNames'
import {issueOfInterest} from '../../../common/issueOfInterest'
import ExportImage from '../../utility/exportImage'
import {columnsIssueOfInterest} from '../issueOfIterestsListConfig'

const color = ['#db4040', '#2581ce', '#9e5fdd', '#32aa87', '#e77a3c', '#abb034']
class MatrixIssueOfInterest extends Component {
  constructor(props) {
    super(props)
    const {materiality} = props
    this.state = {
      columns: null,
      SelectedCoreSubject: null,
      coreSubjects: orderBy(materiality.coreSubjects, ['weightValue'], ['desc']).slice(0, 4),
    }
  }
  getOption(issueOfInterests) {
    const {materiality: {project}} = this.props
    return {
      title: {
        text: 'Materiality Matrix - Issues Of Interest',
        subtext: `${get(project, 'title')} [${get(project, 'year')}]`,
        left: 'center',
      },
      grid: {
        top: 120,
      },
      tooltip: {
        formatter: function(obj) {
          const data = obj.data
          return ` Core Subject: ${get(coreSubjectNames[data[3]], 'label')} <br/>
          Issue of Interest: ${get(issueOfInterest[data[2]], 'label')}<br/>
          Relevance to Internal Stakeholders: ${data[0]} <br/>
          Relevance to External Stakeholders: ${data[1]}`
        },
      },
      xAxis: {
        splitLine: {
          lineStyle: {
            type: 'dashed',
          },
        },
        max: 100,
        interval: 34,
        name: 'Relevance to Internal Stakeholders',
        nameLocation: 'center',
        nameTextStyle: {
          padding: 30,
        },
      },

      yAxis: {
        splitLine: {
          lineStyle: {
            type: 'dashed',
          },
        },
        max: 100,
        interval: 34,
        name: 'Relevance to External Stakeholders',
        nameLocation: 'middle',
        nameTextStyle: {
          padding: 30,
        },
      },
      series: [{
        symbolSize: 20,
        data: issueOfInterests.map(issueOfInterest =>
          [issueOfInterest.relevanceCompanyValue,
            issueOfInterest.relevanceStakeholdersValue,
            issueOfInterest.issueOfInterest,
            issueOfInterest.coreSubject, issueOfInterest.c]),
        type: 'scatter',
        itemStyle: {
          normal: {
            shadowBlur: 10,
            shadowColor: 'rgba(120, 36, 50, 0.5)',
            shadowOffsetY: 5,
            color: color[0],
          },
        },
        label: {
          show: true,
          formatter: function(params) {
            return params.data[4]
          },
          backgroundColor: color[0],
          width: '100px',
        },
      }],
    }
  }

  onChange(value, selectedOptions) {
    this.setState({
      SelectedCoreSubject: value})
  }

  render() {
    const {rowStyle, colStyle, gutter} = basicStyle
    //const {materiality} = this.props
    const issueOfInterests = []
    this.state.coreSubjects.map(coreSubject => {
      return coreSubject.issueOfInterests.map(issue => {
        return issueOfInterests.push({
          ...issue,
          coreSubject: coreSubject.coreSubject,
          c: `${get(coreSubjectNames[coreSubject.coreSubject], 'orderby')}.${
            get(issueOfInterest[issue.issueOfInterest], 'orderby') + 1}`,
        })
      })
    })

    return (
      <Row style={rowStyle} justify="space-between" gutter={gutter}>

        <Col md={24} sm={24} xs={24} style={colStyle}>

          <ExportImage id="matrixIssueOfInterest">
            <Row style={rowStyle} justify="space-between" gutter={gutter} >
              <Col md={24} sm={24} xs={24} style={colStyle}>

                <TableWrapper
                  size="small"
                  columns={columnsIssueOfInterest}
                  onChange={this.onChange}
                  dataSource={orderBy(issueOfInterests, ['weightValue'], ['desc'])}
                  className="sortingTable"
                  rowKey="issueOfInterest"
                  pagination={false}
                  title={() => (<div >
                    <span style={{color: '#888'}}> Issue of Interest </span>
                    <span> {this.state.issueOfInterest} </span>
                  </div>)}
                />

              </Col>
              <Col md={24} sm={24} xs={24} style={colStyle}>

                <ReactEcharts
                  option={this.getOption(issueOfInterests)}
                  style={{height: 500}}
                  onChartReady={this.onChartReady}
                />
                <div style={{marginTop: 20, textAlign: 'right'}} />

              </Col>
            </Row>
          </ExportImage>
          <div style={{marginTop: 20, textAlign: 'right'}} />
        </Col>
      </Row>

    )
  }
}


export default MatrixIssueOfInterest

