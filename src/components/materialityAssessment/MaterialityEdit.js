import React, {Component} from 'react'
import {find, get} from 'lodash'
import {Button} from 'antd'
import {Scrollbars} from 'react-custom-scrollbars'
import {graphql} from 'react-apollo'
import {connect} from 'react-redux'
import {injectIntl} from 'react-intl'
import fetchMaterialityQuery from '../../graphql/fetchMateriality'
import {selectStakeholder, breadcrumbUpdate} from '../../actions'
import {companiesMessages} from '../../messages'
import StackholderForm from '../stackholders/StackholderForm'
import {InputSearch} from '../utility/inputSearch'
import stackholderList from './components/stackholderList'
import MaterialityStyle from './Materiality.style'
import MaterialityForm from './MaterialityForm'

class MaterialityEdit extends Component {
  state={
    addVisible: false,
  }

  componentWillUpdate(nextprops) {
    const {data: {materiality}, breadcrumbUpdate} = nextprops
    if (materiality) {
      const breadcrumb = [{name: 'Home', link: '/'},
        {
          name: get(materiality.project, 'company.name'),
          link: `/company/${get(materiality.project, 'company.id')}`,
        },
        {
          name: get(materiality.project, 'title'),
          link: `/project/${get(materiality.project, 'id')}`,
        },
        {name: 'Materiality Core Subjects'},
      ]
      breadcrumbUpdate(breadcrumb)
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.data.materiality !== this.props.data.materiality || nextState.addVisible !== this.state.addVisible) {
      return true
    } else {
      return false
    }
  }

  showAddModal = () => this.setState({addVisible: true})
  hideAddModal = () => this.setState({addVisible: false})
  render() {
    const {
      data: {materiality},
      intl: {formatMessage},
      selectedStakeholder,
      selectStakeholder,
    } = this.props
    if (!materiality) {
      return <div />
    }
    const {stakeholders, project} = materiality
    const companyId = get(project, 'company.id')
    const stakeholder = find(stakeholders, (o) =>
      get(o.stakeholder, 'id') === selectedStakeholder)
    const companyStakeholder =
    find(get(project, 'company.stakeholders'), {id: selectedStakeholder})
    return (
      <MaterialityStyle className="isomorphicMailBox">
        <div className="isoMiddleWrapper">
          <div className="isoBucketLabel">

            <h3>Materiality Assessment - Core Subjects</h3>
            <Button
              type="primary"
              onClick={this.showAddModal}
            >
              {formatMessage(companiesMessages.btnAddNewStakeholder)}
            </Button>
          </div>
          <div className="isoSearchMailWrapper">
            <InputSearch
              placeholder="Search Stakeholder"
              //value={search}
              className="isoSearchEmail"
              onChange={event =>
                this.setState({search: event.target.value})}
              //onSearch={value => changeSearchString(value)}
            />
          </div>
          <Scrollbars >
            {stackholderList(get(materiality.project, 'company.stakeholders', []),
              get(materiality, 'stakeholders'),
              selectedStakeholder,
              selectStakeholder)}
          </Scrollbars>
        </div>

        <MaterialityForm
          stakeholder={stakeholder}
          companyStakeholder={companyStakeholder}
          selectedStakeholder={selectedStakeholder}
          materialityId={get(materiality, 'id')}
          refetch={() => this.props.data.refetch()}
        />
        <StackholderForm
          visible={this.state.addVisible}
          refetch={this.props.data.refetch}
          handleOk={this.handleOk}
          hideModal={this.hideAddModal}
          companyId={companyId}
        />
      </MaterialityStyle>
    )
  }
}


const graphqlMaterialityEdit = graphql(fetchMaterialityQuery, {
  options: (props) => {return {variables: {id: props.match.params.id}}},
})(MaterialityEdit)

function mapStateToProps({materiality}) {
  const {selectedStakeholder} = materiality
  return {selectedStakeholder}
}


export default connect(mapStateToProps,
  {selectStakeholder, breadcrumbUpdate})(injectIntl(graphqlMaterialityEdit))
