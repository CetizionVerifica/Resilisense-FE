import React, {Component} from 'react'
import {Row, Col} from 'antd'
import {get, orderBy} from 'lodash'
//import echarts from 'echarts'
import ReactEcharts from 'echarts-for-react'
import TableWrapper from '../../styles/table.style'
import {coreSubjectNames} from '../../../common/coreSubjectNames'
import basicStyle from '../../../common/basicStyle'
import ExportImage from '../../utility/exportImage'
import {columnsCoreSubject} from '../issueOfIterestsListConfig'


class MatrixCoreSubjects extends Component {
   state = {
     issueOfInterest: null,
   }


   getOption(coreSubjects) {
     const {materiality: {project}} = this.props
     const data = coreSubjects.map(coreSubject =>
       [coreSubject.relevanceCompanyValue,
         coreSubject.relevanceStakeholdersValue,
         coreSubject.coreSubject,
       ])
     return {
       //  graphic: echarts.util.map(data, (item, dataIndex) => {
       //    return {
       //      type: 'circle',
       //      //position: myChart.convertToPixel('grid', item),
       //      shape: {
       //        cx: 0,
       //        cy: 0,
       //       // r: symbolSize / 2,
       //      },
       //      invisible: true,
       //      draggable: true,
       //      //ondrag: echarts.util.curry(onPointDragging, dataIndex),
       //      //onmousemove: echarts.util.curry(showTooltip, dataIndex),
       //      //onmouseout: echarts.util.curry(hideTooltip, dataIndex),
       //      z: 100,
       //    }
       //  }),
       title: {
         text: 'Materiality Matrix - Core Subjects',
         subtext: `${get(project, 'title')} [${get(project, 'year')}]`,
         left: 'center',
       },
       grid: {
         top: 120,
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
         symbolSize: 100,
         data: data,
         type: 'scatter',
         draggable: true,
         label: {
           show: true,
           formatter: function(params) {
             return get(coreSubjectNames[params.data[2]], 'labela')
           },
           width: '100px',

         },
       }],
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

          const {materiality: {coreSubjects}} = this.props
          const {rowStyle, colStyle, gutter} = basicStyle
          return (
            <ExportImage id="matrixCoreSubjects">
              <Row style={rowStyle} justify="space-between" gutter={gutter} >
                {!this.props.noTable && <Col md={24} sm={24} xs={24} style={colStyle}>

                  <TableWrapper
                    size="small"
                    columns={columnsCoreSubject}
                    onChange={this.onChange}
                    dataSource={orderBy(coreSubjects, ['weightValue'], ['desc'])}
                    className="sortingTable"
                    rowKey="coreSubject"
                    pagination={false}
                    title={() => (<div >
                      <span style={{color: '#888'}}> Issue of Interest: </span>
                      <span> {this.state.issueOfInterest} </span>
                    </div>)}
                  />

                </Col>
                }
                <Col md={24} sm={24} xs={24} style={colStyle}>

                  <ReactEcharts
                    option={this.getOption(coreSubjects)}
                    style={{height: this.props.height || 600}}
                    onChartReady={this.onChartReady}
                    onEvents={onEvents}
                  />
                  <div style={{marginTop: 20, textAlign: 'right'}} />

                </Col>
              </Row>
            </ExportImage>
          )
        }
}

export default MatrixCoreSubjects
