import React, {Component} from 'react'
import {Row, Col, Tabs} from 'antd'
import {filter, get} from 'lodash'
import clone from 'clone'
import {injectIntl} from 'react-intl'
import {ActionCell, TextCell} from '../../../common/helperCells'
import ExportImage from '../../utility/exportImage'
import TableWrapper from '../../styles/table.style'
import {sortColumns} from './suppliersRankingConfig'
import {getConformingProjects} from './_helper'
import SupplierRankingSummary from './SupplierRankingSummary'

const TabPane = Tabs.TabPane

class Ranking extends Component {
  constructor(props) {
    super(props)
    this.state = {
      columns: this.createcolumns(clone(sortColumns)),
      physicalAuditColumns: this.createcolumns(clone(sortColumns), true),
    }
  }

  createcolumns(columns, isPhysicalAudit) {
    const activeColumn = [
      {
        title: 'Impact',
        key: 'impact',
        render: object => {console.log("Impact;", object.impact); return TextCell(object.impact)},
      },
      {
        title: 'High Concern',
        dataIndex: '',
        width: 30,
        render: record => {
          const hasPhysicalAudit = get(record, 'physicalAudit')
          return ActionCell([
            {
              key: 'physicalAudit',
              onClick: () => {this.props.onSupplierPhysicalAudit(record.projectId, record.supplierId, !hasPhysicalAudit)},
              link: '#',
              icon: 'exception',
              iconColor: hasPhysicalAudit ? '#52c41a' : '#08c',
            },
          ])
        },
      }]

    if (!isPhysicalAudit) {
      columns.push(...activeColumn)
    }

    return columns
  }

  onChange = () => {}

  render() {

    const projects = getConformingProjects(this.props)
    console.log("Projects:", projects);

    return (
      <Row type="flex" justify="space-between" >
        <Col span={24}>
          <Tabs animated={false} defaultActiveKey="1">
            <TabPane tab="Overview" key="1">
              <ExportImage id="SupplierRanking">
                <TableWrapper
                  size="small"
                  columns={this.state.columns}
                  onChange={this.onChange}
                  dataSource={projects}
                  expandedRowRender={record => (
                    <SupplierRankingSummary record={record} totalSuppliers={projects} />
                  )}
                  rowKey="projectId"
                  pagination={false}
                  className="sortingTable"
                  title={() => (<div >
                    <span style={{color: '#888'}}>Overview</span>
                  </div>)}
                />
              </ExportImage>
            </TabPane>
            <TabPane tab="Conforming" key="2">
              <ExportImage id="Conforming">
                <TableWrapper
                  size="small"
                  columns={this.state.columns}
                  onChange={this.onChange}
                  dataSource={filter(projects, {conforming: true})}
                  expandedRowRender={record => (
                    <SupplierRankingSummary record={record} totalSuppliers={projects} />
                  )}
                  rowKey="projectId"
                  pagination={false}
                  className="sortingTable"
                  title={() => (<div >
                    <span style={{color: '#888'}}>Conforming</span>
                  </div>)}
                />
              </ExportImage>
            </TabPane>
            <TabPane tab="Non Conforming" key="3">
              <ExportImage id="NonConforming">
                <TableWrapper
                  size="small"
                  columns={this.state.columns}
                  onChange={this.onChange}
                  dataSource={filter(projects, {conforming: false})}
                  expandedRowRender={record => (
                    <SupplierRankingSummary record={record} totalSuppliers={projects} />
                  )}
                  rowKey="projectId"
                  pagination={false}
                  className="sortingTable"
                  title={() => (<div >
                    <span style={{color: '#888'}}>Non Conforming</span>
                  </div>)}
                />
              </ExportImage>
            </TabPane>
            <TabPane tab="High Concern" key="4">
              <ExportImage id="SupplierPhysicalAudit">
                <TableWrapper
                  size="small"
                  columns={this.state.physicalAuditColumns}
                  onChange={this.onChange}
                  dataSource={filter(projects, {physicalAudit: true})}
                  expandedRowRender={record => (
                    <SupplierRankingSummary record={record} totalSuppliers={projects} />
                  )}
                  rowKey="projectId"
                  pagination={false}
                  className="sortingTable"
                  title={() => (<div >
                    <span style={{color: '#888'}}>High Concern</span>
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

export default injectIntl(Ranking)
