import React, {Component} from 'react'
import {values, filter, get} from 'lodash'
import {Select, Row, Col, message, Avatar, notification} from 'antd'
import {connect} from 'react-redux'
import {graphql, compose} from 'react-apollo'
import {
  mUpdateStakeHolderGroup,
  materialityIssueOfInterest,
  removeMaterialityIssueOfInterest} from '../../graphql/materialityMutation'
import {selectStakeholder} from '../../actions'
import {materialityGroup} from '../../common/enum/materialityGroup'
import {issueOfInterest} from '../../common/issueOfInterest'
import TableWrapper from '../styles/table.style'
import CoreSubjectsRating from './components/CoreSubjectsRating'
const Option = Select.Option
const newLocal = 10
class MaterialityForm extends Component {

  isuueOfInterestsWeightCell(record, value) {
    const {materiality, materialityStackholder} = this.props
    const isuueOfInterests = {
      id: get(materiality, 'id'),
      groupXFactor: value,
      stackholderId: get(materialityStackholder, 'id'),
    }
    this.props.mUpdateStakeHolderGroup({
      variables: {
        ...isuueOfInterests,
      },
    }).then(() => {
      message.success('Processing complete!')
    })
  }

  handleStackholderGroup(groupXFactor, stakeholderid) {
    const {
      refetch,
      materialityId,
      setStakeHolderGroup} = this.props
    setStakeHolderGroup({
      variables: {
        id: materialityId,
        stakeholderId: stakeholderid,
        groupXFactor: groupXFactor,
      },
    }).then(() => {
      message.success('Processing complete!a')
      refetch()
    }).catch(({message, locations, path}) => {
      this.setState({loading: false})
      return notification.warning({
        message: 'Set Stakeholder Group',
        description: message,
      })
    })

  }
  renderIssueOfInterest(coreSubject) {
    return (
      <div style={{margin: 20, marginBottom: 20}} >
        <Row type="flex" justify="space-between" >
          <Col span={24}>
            <TableWrapper
              size="small"
              columns={this.state.materialityColumns}
              onChange={this.onChange}
              dataSource={filter(values(issueOfInterest), {coreSubject: coreSubject})}
              className="sortingTable"
              pagination={false}
            />
          </Col>
        </Row>
      </div>
    )
  }

  renderStackholderGroupSelector(stakeholder, type) {
    const stakeholderId = type === 'company' ? get(stakeholder, 'id') :
      get(stakeholder, 'stakeholder.id')
    return (<div className="weightSelector">
      <label>Class:</label>
      <Select
        style={{width: 400}}
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

  render() {
    const {stakeholder, companyStakeholder, selectedStakeholder, materialityId, refetch} = this.props
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
          {!stakeholder.isCompany && this.renderStackholderGroupSelector(stakeholder)}
        </div>
        <Row type="flex" justify="space-between" >
          <Col span={24}>
            <CoreSubjectsRating
              materialityId={materialityId}
              stakeholderId={get(stakeholder, 'stakeholder.id')}
              coreSubjects={get(stakeholder, 'coreSubjects')}
              refetch={refetch}
            />
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
)(MaterialityForm)

export default connect(null, {selectStakeholder})(MaterialityFormWithMutations)

