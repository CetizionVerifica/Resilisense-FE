import React, {Component} from 'react'
import {Row, Col, Tabs} from 'antd'
import {round, filter} from 'lodash'
import {injectIntl} from 'react-intl'
import ExportImage from '../utility/exportImage'
import TableWrapper from '../styles/table.style'
import {companySectors} from '../../common/enum/companySectors'
import {columnsPerfornce} from './RankingListConfig'
const TabPane = Tabs.TabPane
class Industry extends Component {
    onChange = () => {}
    render() {
      const {industry, projects, intl: {formatMessage}, avg} = this.props
      return (
        <Row type="flex" justify="space-between" >
          <Col span={24}>
            <h3 >
              <span style={{color: '#888'}}>
                {formatMessage(companySectors[industry.sector].localization)} /
              </span>
              <span style={{color: '#888'}}> {formatMessage(industry.localization)} </span>
            </h3>
            <Tabs animated={false} defaultActiveKey="1">
              <TabPane tab="Overview" key="1">
                <ExportImage id={industry.key}>
                  <TableWrapper
                    size="small"
                    columns={columnsPerfornce}
                    onChange={this.onChange}
                    dataSource={projects}
                    pagination={false}
                    rowKey="id"
                    title={() => (<div >
                      <span style={{color: '#888'}}>
                      Relevance & Significance Score Range: [{round(avg[0])} - {round(avg[3])}]
                      </span>

                    </div>)}
                  />
                </ExportImage>
              </TabPane>
              <TabPane tab="Low Impact" key="2">

                <ExportImage id={`${industry.key}Low`}>
                  <TableWrapper
                    size="small"
                    columns={columnsPerfornce}
                    onChange={this.onChange}
                    dataSource={filter(projects, {impact: 'Low'})}
                    pagination={false}
                    rowKey="id"
                    title={() => (<div >
                      <span style={{color: '#888'}}>
                        Relevance & Significance Score Range: [{round(avg[0])} -  {round(avg[1])}]
                      </span>

                    </div>)}
                  />
                </ExportImage>
              </TabPane>
              <TabPane tab="Medium Impact" key="3">
                <ExportImage id={`${industry.key}Medium`}>
                  <TableWrapper
                    size="small"
                    columns={columnsPerfornce}
                    onChange={this.onChange}
                    dataSource={filter(projects, {impact: 'Medium'})}
                    pagination={false}
                    rowKey="id"
                    title={() => (<div >
                      <span style={{color: '#888'}}>
                        Relevance & Significance Score Range: [{round(avg[1])} -  {round(avg[2])}]
                      </span>

                    </div>)}
                  />
                </ExportImage>
              </TabPane>
              <TabPane tab="High Impact" key="4">
                <ExportImage id={`${industry.key}High`}>
                  <TableWrapper
                    size="small"
                    columns={columnsPerfornce}
                    onChange={this.onChange}
                    dataSource={filter(projects, {impact: 'High'})}
                    pagination={false}
                    rowKey="id"
                    title={() => (<div >
                      <span style={{color: '#888'}}>
                        Relevance & Significance Score Range: [{round(avg[2])} -  {round(avg[3])}]
                      </span>
                    </div>)}
                  />
                </ExportImage>
              </TabPane>
            </Tabs>

          </Col>
        </Row>
      )
    }
}

export default injectIntl(Industry)
