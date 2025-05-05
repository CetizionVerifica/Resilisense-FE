import React, {Component} from 'react'
import {values, find, get, orderBy} from 'lodash'
import {Tabs, Select, Row, Col, Avatar} from 'antd'
import {connect} from 'react-redux'
import {graphql, compose} from 'react-apollo'
import {
  mUpdateStakeHolderGroup,
  materialityIssueOfInterest,
  removeMaterialityIssueOfInterest} from '../../graphql/materialityMutation'
import {selectStakeholder} from '../../actions'
import {materialityGroup} from '../../common/enum/materialityGroup'
import {coreSubjectNames} from '../../common/coreSubjectNames'
import IssueOfInterestsRating from './components/IssueOfInterestsRating'
const TabPane = Tabs.TabPane
const Option = Select.Option
const newLocal = 10
class MaterialityFormIOI extends Component {

  constructor(props) {
    super(props)
    this.state = {
      coreSubjects: orderBy(props.coreSubjects, ['weightValue'], ['desc']).slice(0, 4) || values(coreSubjectNames),
      loading: false,
    }
  }
  renderStackholderGroupSelector(stakeholder, type) {
    const stakeholderId = type === 'company' ? get(stakeholder, 'id') :
      get(stakeholder, 'stakeholder.id')
    return (<div className="weightSelector">
      <label>Class:</label>
      <Select
        style={{width: 200}}
        placeholder="Select"
        value={stakeholder.groupXFactor}
        disabled={get(stakeholder, 'isCompany')}
        onChange={value => this.handleStackholderGroup(value, stakeholderId)}
      >
        {values(materialityGroup).map(item =>
          <Option value={item.value} key={item.key}>{item.label}</Option>)}
      </Select>
    </div>)
  }

  getIssueOfinterest(stakeholder, coreSubject) {
    const coreSupjects = get(stakeholder, 'coreSubjects')
    const currentCoreSubject = find(coreSupjects, {coreSubject: coreSubject})
    if (currentCoreSubject) {
      return currentCoreSubject.issueOfInterests
    } else {
      return []
    }
  }

  render() {
    const {stakeholder, companyStakeholder, selectedStakeholder, materialityId} = this.props
    if (!selectedStakeholder) {
      return (
        <div className="isoSingleMailWrapper">
          <p className="isoNoMailMsg">
            Please Select Stakeholder
          </p>
        </div>
      )
    }
    if (!stakeholder) {
      return (
        <div className="isoSingleMailWrapper">
          <div className="isoNoMailMsg">
            <h2>{get(companyStakeholder, 'name')}</h2>
            {this.renderStackholderGroupSelector(companyStakeholder, 'company')}
          </div>
        </div>
      )
    }
    return (
      <div className="isoSingleMailWrapper">
        <div className="stackeholderName">
          <h2> <Avatar style={{backgroundColor: '#7265e6', verticalAlign: 'middle',
            marginRight: newLocal}} size="large"
          >
            {get(stakeholder, 'stakeholder.name', 'no name').substring(0, 2).toUpperCase()}
          </Avatar>{get(stakeholder, 'stakeholder.name')}</h2>
        </div>
        <Row type="flex" justify="space-between" >
          <Col span={24}>
            <Tabs animated={false} defaultActiveKey="1">
              {this.state.coreSubjects.map(item => {
                return (<TabPane
                  tab={get(coreSubjectNames[item.coreSubject], 'label', item.label)}
                  key={item.key || item.coreSubject}
                >
                  <IssueOfInterestsRating
                    materialityId={materialityId}
                    stakeholderId={get(stakeholder, 'stakeholder.id')}
                    coreSubject={item.key || item.coreSubject}
                    issueOfInterests={this.getIssueOfinterest(stakeholder, item.coreSubject)}
                  />
                </TabPane>)
              })}

            </Tabs>
          </Col>
        </Row>
      </div>
    )
  }
}

const MaterialityFormWithMutations = compose(
  graphql(mUpdateStakeHolderGroup, {
    name: 'setStakeHolderGroup',
  }),
  graphql(materialityIssueOfInterest, {
    name: 'materialityIssueOfInterest',
  }),
  graphql(removeMaterialityIssueOfInterest, {
    name: 'removeMaterialityIssueOfInterest',
  })
)(MaterialityFormIOI)

export default connect(null, {selectStakeholder})(MaterialityFormWithMutations)

