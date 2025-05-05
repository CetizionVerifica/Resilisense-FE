import React, {Component} from 'react'
import {Row, Col, Switch} from 'antd'
import clone from 'clone'
import {values, filter, get} from 'lodash'
import {graphql} from 'react-apollo'
import {connect} from 'react-redux'
import {breadcrumbUpdate} from '../../actions'
import fetchGapAnalysisQuery from '../../graphql/fetchGapAnalysis'
import {auditQuestions, auditQuestionsTitle} from '../../common/enum/auditQuestions'
import TableWrapper from '../styles/table.style'
import basicStyle from '../../common/basicStyle'
import PageHeader from '../utility/pageHeader'
import LayoutWrapper from '../utility/layoutWrapper'
import Box from '../utility/box'
import {sortColumns} from './AuditChecklistConfig'


const {rowStyle, colStyle, gutter} = basicStyle
class AuditQuestionsList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      columns: this.createcolumns(clone(sortColumns)),
      search: '',
      addVisible: false,
      editVisible: false,
      current: 0,
      selectedEmployee: '',
    }
  }
  createcolumns(columns) {
    const activeColumn = [{
      title: 'Active',
      key: 'active',
      width: 100,
      render: (text, record, index) =>
        (<Switch
          defaultChecked={record.active}
          key={record.id}
          onChange={() => {}}
        />),
    }]
    columns.push(...activeColumn)
    return columns
  }

  componentWillUpdate(nextprops) {
    const {data: {gapAnalysis}, breadcrumbUpdate} = nextprops
    if (gapAnalysis) {
      const breadcrumb = [{name: 'Home', link: '/'},
        {
          name: get(gapAnalysis.project, 'company.name'),
          link: `/company/${get(gapAnalysis.project, 'company.id')}`,
        },
        {
          name: get(gapAnalysis.project, 'title'),
          link: `/project/${get(gapAnalysis.project, 'id')}`,
        },
        {name: 'Gap Analysis'},
      ]
      breadcrumbUpdate(breadcrumb)
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.data.gapAnalysis !== this.props.data.gapAnalysis || nextState !== this.state) {
      return true
    } else {
      return false
    }
  }

  renderIssueOfInterest(auditQuestionsTitle) {
    const {columns} = this.state

    const auditQuestionsCurrent = filter(auditQuestions, {title: auditQuestionsTitle.key})

    // const issueOfI = find(issueOfInterests, {issueOfInterest: issue.key})
    return (
      <div style={{marginBottom: 10}} key={auditQuestionsTitle.key}>
        <TableWrapper
          title={() => auditQuestionsTitle.label}
          size="small"
          columns={columns}
          showHeader={false}
          rowKey="key"
          onChange={this.onChange}
          dataSource={values(auditQuestionsCurrent)}
          pagination={auditQuestionsCurrent.length > 10}
        />
      </div>
    )

  }

  render() {
    const {data: {gapAnalysis}} = this.props
    //const coreSubjects = get(gapAnalysis, 'coreSubjects')

    // if (!gapAnalysis) {
    //   return <div>ff</div>
    // }
    return (
      <LayoutWrapper>
        <PageHeader><span>{get(gapAnalysis, 'project.title')}
        ISO 26000 Audit Checklist</span> </PageHeader>
        <Row style={rowStyle} justify="space-between" gutter={gutter}>
          <Col md={24} sm={24} xs={24} style={colStyle}>
            <Box>
              {values(auditQuestionsTitle).map(item =>
                (<Col span={24} key={item.key} > {this.renderIssueOfInterest(item)}</Col>))}
            </Box>
          </Col>
        </Row>
      </LayoutWrapper>
    )
  }
}

const GapEditQL = graphql(fetchGapAnalysisQuery, {
  options: (props) => {return {variables: {id: props.match.params.id}}},
})(AuditQuestionsList)
export default connect(null, {breadcrumbUpdate})(GapEditQL)
