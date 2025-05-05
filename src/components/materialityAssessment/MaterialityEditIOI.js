import React, {Component} from 'react'
import {find, get} from 'lodash'
import {Scrollbars} from 'react-custom-scrollbars'
import {graphql} from 'react-apollo'
import {connect} from 'react-redux'
import fetchMaterialityQuery from '../../graphql/fetchMateriality'
import {selectStakeholder, breadcrumbUpdate} from '../../actions'
import {InputSearch} from '../utility/inputSearch'
import stackholderList from './components/stackholderList'
import MaterialityStyle from './Materiality.style'
import MaterialityFormIOI from './MaterialityFormIOI'

class MaterialityEditIOI extends Component {
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
        {name: 'Materiality Issue Of Interests'},
      ]
      breadcrumbUpdate(breadcrumb)
    }
  }
  shouldComponentUpdate(nextProps) {
    return !(nextProps.data.materiality === this.props.data.materiality)
  }

  render() {
    const {data: {materiality}, selectedStakeholder, selectStakeholder} = this.props
    if (!materiality) {
      return <div />
    }
    const {stakeholders, project, coreSubjects} = materiality
    const stakeholder = find(stakeholders, (o) => get(o.stakeholder, 'id') === selectedStakeholder)
    const companyStakeholder = find(get(project, 'company.stakeholders'), {id: selectedStakeholder})
    return (
      <MaterialityStyle className="isomorphicMailBox">
        <div className="isoMiddleWrapper">
          <div className="isoBucketLabel">
            <h3>Materiality Assessment - Issue Of Interests </h3>

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

        <MaterialityFormIOI
          stakeholder={stakeholder}
          companyStakeholder={companyStakeholder}
          selectedStakeholder={selectedStakeholder}
          materialityId={get(materiality, 'id')}
          coreSubjects={coreSubjects}
          refetch={() => this.props.data.refetch()}
        />
      </MaterialityStyle>
    )
  }
}


const graphqlMaterialityEdit = graphql(fetchMaterialityQuery, {
  options: (props) => {return {variables: {id: props.match.params.id}}},
})(MaterialityEditIOI)

function mapStateToProps({materiality}) {
  const {selectedStakeholder} = materiality
  return {selectedStakeholder}
}


export default connect(mapStateToProps, {selectStakeholder, breadcrumbUpdate})(graphqlMaterialityEdit)

