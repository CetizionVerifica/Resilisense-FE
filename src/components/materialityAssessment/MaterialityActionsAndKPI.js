import React, {Component} from 'react'
import {graphql} from 'react-apollo'
import {Row, Col, Button} from 'antd'
import {orderBy} from 'lodash'
import fetchMateriality from '../../graphql/fetchMateriality'
import TableWrapper from '../styles/table.style'
import basicStyle from '../../common/basicStyle'
import PageHeader from '../utility/pageHeader'
import LayoutWrapper from '../utility/layoutWrapper'
import Box from '../utility/box'
import {columnsIssueOfInterest} from './issueOfIterestsListConfig'


class MaterialityActionsAndKPI extends Component {
  constructor(props) {
    super(props)
    this.state = {
      columns: null,
      SelectedCoreSubject: null,
    }
  }

  rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
    },
    getCheckboxProps: record => ({
      name: record.name,
    }),
  }

  onChange(value, selectedOptions) {
    this.setState({
      SelectedCoreSubject: value})
  }

  render() {
    const {rowStyle, colStyle, gutter} = basicStyle
    const {data: {materiality}} = this.props
    if (!materiality) {
      return <div />
    }
    const issueOfInterests = []
    materiality.coreSubjects.map(coreSubject => {
      coreSubject.issueOfInterests.map(issueOfInterest => {
        issueOfInterests.push({
          ...issueOfInterest,
          coreSubject: coreSubject.coreSubject,
        })
      })
    })

    return (
      <LayoutWrapper>
        <PageHeader><span>Materiality Assessment Action and KPI</span> </PageHeader>
        <Box>


          <Row style={rowStyle} justify="space-between" gutter={gutter} >
            <Col md={24} sm={24} xs={24} style={colStyle}>

              <TableWrapper
                size="small"
                columns={columnsIssueOfInterest}
                onChange={this.onChange}
                dataSource={orderBy(issueOfInterests, ['weightValue'], ['desc'])}
                className="sortingTable"
                rowKey="issueOfInterest"
                rowSelection={this.rowSelection}
                pagination={false}
                title={() => (<div >

                  <Button
                    type="primary"
                    className=""
                    style={{marginRight: 20}}
                    onClick={() => this.props.history.push(`/materiality/${materiality.id}`)}
                  >
              Save
                  </Button>
                </div>)}
              />

            </Col>

          </Row>

          <div style={{marginTop: 20, textAlign: 'right'}} />
        </Box>
      </LayoutWrapper>
    )
  }
}


export default graphql(fetchMateriality, {
  options: (props) => {return {variables: {id: props.match.params.id}}},
})(MaterialityActionsAndKPI)

