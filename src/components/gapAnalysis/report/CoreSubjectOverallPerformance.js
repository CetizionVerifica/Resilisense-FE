import React, { Component } from 'react'
import { Row, Col, Tag, List, Progress, Tooltip } from 'antd'
import { values, get, round, find } from 'lodash'
import clone from 'clone'
import ReactEcharts from 'echarts-for-react'
import TableWrapper from '../../styles/table.style'
import { coreSubjectNames } from '../../../common/coreSubjectNames'
import { issueChartColor } from '../../../common/enum/issueLevel'
import { levelColor } from '../../../common/utils'
import basicStyle from '../../../common/basicStyle'
import ExportImage from '../../utility/exportImage'
import { columnsCoreSubject } from './reportConfig'


class CoreSubjectOverallPerformance extends Component {
  state = {
    columns: this.createcolumns(clone(columnsCoreSubject)),
    issueOfInterest: null,
  }

  createcolumns(columns) {

    const gapAnalysisColumn = [{
      title: 'Company Performance Score',
      dataIndex: '1',
      render: (text, record, index) => {
        return <span>{round(get(record, 'revisedScore', 0) * 100, 2)} % </span>
      },
    }, {
      title: 'Relevance & Significance Score',
      dataIndex: '2',
      render: (text, record, index) => {
        return <span>{round(get(record, 'relevanceValue', 0) * 100, 2)} % </span>
      },
    }, {
      title: 'Weight',
      dataIndex: '3',
      render: (text, record, index) => {
        return <span>{round(get(record, 'relevanceWeightValue', 0) * 100, 2)} % </span>
      },
    },
    ]
    columns.push(...gapAnalysisColumn)
    return columns
  }

  getOption(coreSubjects) {
    return {
      tooltip: {
        trigger: 'item',
        formatter: function (obj) {
          const data = obj.data
          return `${data.name} <br/>	Weight : (${data.value}%), <br/>Performance : (${data.performance}%)`
        },
      },
      series: [
        {
          name: 'Weight',
          type: 'pie',
          radius: '55%',
          center: ['60%', '50%'],
          data: coreSubjects.map(coreSubject => {
            return {
              name: get(coreSubjectNames[coreSubject.coreSubject], 'label'),
              value: round(get(coreSubject, 'relevanceWeightValue', 0) * 100, 2),
              performance: round(get(coreSubject, 'revisedScore', 0) * 100, 2)
            }
          }),
          itemStyle: {
            borderWidth: 3,
            borderColor: 'rgba(0, 0, 0, 0.1)',
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },

          },
          color: coreSubjects.map(coreSubject => {
            const performance = round(get(coreSubject, 'revisedScore', 0) * 100, 2)
            const colorInt = levelColor(5, performance)
            return get(find(issueChartColor, { level: colorInt }), 'color')
          }),
        },
      ],
    }
  }

  onChartClick = (param, echarts) => {
    // console.log(param, echarts)

    this.setState({
      cnt: this.state.cnt + 1,
    })
  };

  onChartLegendselectchanged = (param, echart) => {
    // console.log(param, echart)

  };
  render() {
    const onEvents = {
      click: this.onChartClick,
      legendselectchanged: this.onChartLegendselectchanged,
    }
    const { gapAnalysis } = this.props
    const { rowStyle, colStyle, gutter } = basicStyle
    const { columns } = this.state
    const { coreSubjects } = gapAnalysis

    const companyOverAllPerformance = get(gapAnalysis, 'revisedWeightValue', 0)
    const companyOverAllRelevance = get(gapAnalysis, 'relevance', 0)
    return (
      <Row style={rowStyle} justify="space-between" gutter={gutter} >
      <Row style={rowStyle} justify="space-between" gutter={gutter} >
          {!this.props.noTable && <Col md={24} sm={24} xs={24} style={colStyle}>

            <TableWrapper
              size="small"
              columns={columns}
              onChange={this.onChange}
              dataSource={values(coreSubjects)}
              pagination={false}
              rowKey="coreSubject"
              title={() => (<div style={{ height: 19 }} />)}
            />
          </Col>
          }

          <Col md={21} sm={24} xs={24} style={colStyle}>

            <ReactEcharts
              option={this.getOption(coreSubjects)}
              style={{ height: this.props.height || 400, width: '100%' }}
              onChartReady={this.onChartReady}
              onEvents={onEvents}
            />
            <div style={{ marginTop: 5, textAlign: 'right' }} />

          </Col>
          <Col md={3} sm={24} xs={24} style={colStyle}>
             <div style={{ marginTop: 5 }}>
              <div style={{ marginBottom: 10, fontWeight: 600 }}>Overall Company Performance Score</div>
              <Tooltip placement="left" title="Overall Company Performance">
                <Progress
                  type="circle" percent={companyOverAllPerformance ? companyOverAllPerformance : 0 }
                  strokeWidth={8} width={100}
                />
              </Tooltip>
            </div>
            
            {companyOverAllRelevance && <div style={{ marginTop: 30 }}>
              <div style={{ marginBottom: 10, fontWeight: 600 }}>Overall Relevance & Significance Score</div>
              <Tooltip placement="left" title="Overall Relevance & Significance Score">
                <Progress
                  type="circle" percent={companyOverAllRelevance ? companyOverAllRelevance : 0}
                  strokeWidth={8} width={100}
                />
              </Tooltip>
            </div>
            }
          </Col>

        </Row>
        <Row>
          <Col md={24} sm={24} xs={24} style={colStyle}>
            <List
              itemLayout="horizontal"
              header="Performance Colour Grading"
              dataSource={values(issueChartColor)}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Tag color={get(item, 'color')} />}
                    title={<div style={{ fontSize: 12 }}>{get(item, 'label')}</div>}
                  />
                </List.Item>
              )}
            />
          </Col>

        </Row>
      </Row>
    )
  }
}

export default CoreSubjectOverallPerformance
