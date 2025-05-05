import React, {Component} from 'react'
import {connect} from 'react-redux'
import {values, uniq, some, get} from 'lodash'
import clone from 'clone'
import {Form, Modal, message, Button} from 'antd'
import {reduxForm, Field, initialize, formValueSelector} from 'redux-form'
import {graphql, compose} from 'react-apollo'
import {injectIntl} from 'react-intl'
import {commonMessages} from '../../../messages'
import fetchCompaniesWithProjects from '../../../graphql/fetchCompaniesWithProjectsQuery'
import fetchUserByEmail from '../../../graphql/fetchUserByEmail'
import {requestSupplierMutation} from '../../../graphql/companyMutation'
import {addSupplierRequest} from '../../../graphql/supplierRequestMutation'
import ModalStyle from '../../styles/modal.style'
import WithDirection from '../../../common/withDirection'
import {otherSupplierFields} from './otherSupplierFields';
import {Row, Col, Tabs} from 'antd'
import axios from 'axios';

const isoModal = ModalStyle(Modal)
const Modals = WithDirection(isoModal)

const loadData = (data) => ({
  type: 'LOAD',
  data: data,
});

class ExternalSupplier extends Component {

  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      initialValues: null,
      supplierid: null,
    }
  }

  updateSupplier(fields, onEndCallback) {
    const {data: {companies}, refetch, currentAgency, reset} = this.props;
    this.setState({loading: true});
    // console.log("Request body:", fields);
    // /api/supplier/external/:supplierid([0-9a-f]{24})
    axios.put(`/api/supplier/external/${this.state.supplierid}`, {
      ...fields,
    }, {
      headers: {authorization: localStorage.getItem('token')},
    }).then(result => {
      // console.log("Result:", result);
      message.success('Processing complete!');
    }).catch(error => {
      message.error('Error!');
    }).finally(() => {
      // refetch(currentAgency)
      // reset();
      // this.setState({loading: false, visible: false})  
      onEndCallback();
    });
  }

  addSupplier(fields, onEndCallback) {
    const {data: {companies}, refetch, currentAgency, reset} = this.props;
    this.setState({loading: true});
    axios.post('/api/supplier/external', {
      ...fields,
      companyID: companies[0].id,
    }, {
      headers: {authorization: localStorage.getItem('token')},
    }).then(result => {
      // console.log("Result:", result);
      message.success('Processing complete!');
    }).catch(error => {
      message.error('Error!');
    }).finally(() => {
      onEndCallback();
      // this.props.refetchExternal();
      // refetch(currentAgency)
      // reset()
      // this.setState({loading: false, visible: false})  
    });
  }

  handleFormSubmit(fields) {
    const {refetch, currentAgency, reset} = this.props;
    const add = Object.keys(this.state.initialValues || {}).length === 0;
    const callback = () => {
      refetch(currentAgency);
      reset();
      this.setState({loading: false, visible: false})  
    };
    if (add) {
      this.addSupplier(fields, callback)
    } else {
      this.updateSupplier(fields, callback);
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.visible && !nextState.visible) {
      // console.log("Init:", nextProps.initialValues);
      // console.log("Init:", nextProps.initialValues);
      this.props.dispatch(initialize('externalsupplier', nextProps.initialValues || {}));
      this.setState({visible: true, initialValues: nextProps.initialValues, supplierid: get(nextProps, 'initialValues._id', null)});
    }
    if (!nextState.visible) {
      this.props.hideModal();
    }
  }

  showModal = () => {
    this.setState({
      visible: true,
    })
    this.props.showModal(this.state.visible)
  }

  handleCancel = () => {
    this.setState({visible: false, initialValues: null, supplierid: null})
  }

  renderFields(group, companies, projects, years) {
    const {intl: {formatMessage}} = this.props

    return (
      <Row>
        {
          values(group).map((field, i) => {

            let options = field.options

            if (field.key === 'companyName') {
              options = companies
            }

            if (field.key === 'projectName') {
              options = projects
            }

            if (field.key === 'projectYear') {
              options = years
            }

            return (
              <Col span={field.sizeHalf ? 12 : 24} key={i} style={{paddingLeft: 5, paddingRight: 5}}>
              <Field
                key={field.key}
                {...field}
                addonBefore={field.addonBefore}
                name={field.value}
                options={options}
                label={formatMessage(field.localization)}
                component={field.component}
                placeholder={formatMessage(field.localization)}
              />
              </Col>
            )
          })
        }
      </Row>
    )
  }
  
  renderOtherSupplierFields(group, companies, projects, years) {
    const {intl: {formatMessage}} = this.props;

    return values(group).map(field => {

      // if (field.type === 'title') {
      //   return <div key={field.key}> {field.component()} </ div>;
      // }

      return (
        <Field
          key={field.key}
          {...field}      
          addonBefore={field.addonBefore}
          name={field.value}
          label={formatMessage(field.localization)}
          component={field.component}
          placeholder={formatMessage(field.localization)}
        />
      )
    })
  }

  render() {
    const {handleSubmit, intl: {formatMessage}, data: {loading, companies}, companyId, reset} = this.props
    if (loading) {
      return <div />
    }
    const companiesOptions = companies.map(company => ({label: company.name, value: company.id}))

    const selectedCompany = companies.length === 1 ? companies[0] : companies.find(x => x.id === companyId) || {projects: []}

    const projectOptions = selectedCompany.projects.map(project => ({
      label: project.title, value: project.year,
    }))

    const years = uniq(selectedCompany.projects.map(p => p.year)).sort()

    const yearOptions = years.map(year => ({label: year, value: year}))

    const _otherSupplierFields = clone(otherSupplierFields);

    return (
      <div style={{marginRight: 30}}>
        <Form className="login-form">            
          <Modals
            visible={this.state.visible}
            title={Object.keys(this.state.initialValues || {}).length === 0 ? "Add Supplier to Company" : "Edit External Supplier"}
            onCancel={this.handleCancel}
            footer={[
              <Button key="back" onClick={this.handleCancel}>
                {formatMessage(commonMessages.commonCancel)}
              </Button>,
              <Button
                key="submit"
                type="primary"
                loading={this.state.loading}
                onClick={handleSubmit(this.handleFormSubmit.bind(this))}
              >
                {formatMessage(commonMessages.commonSave)}
              </Button>,
            ]}
          >
              <div>
                {this.renderFields(_otherSupplierFields, companiesOptions, projectOptions, yearOptions)}
              </div> 
          </Modals>
        </Form>
      </div>
    )
  }
}

const SupplierForm = reduxForm({
  form: 'externalsupplier',
  destroyOnUnmount: false
  // enableReinitialize : true, // you need to add this property
  // keepDirtyOnReinitialize : true,
})(ExternalSupplier)

// Decorate with connect to read form values
const selector = formValueSelector('externalsupplier') // <-- same as form name

const mapStateToProps = state => {
  // can select values individually
  const supplierEmail = selector(state, 'supplierEmail')
  const {currentUser} = state.auth
  const currentAgency = currentUser ? currentUser.currentAgency : ''
  // const initialValues = state.initialValues;

  // console.log("DDATA:", state.initialValues);
  return {
    supplierEmail,
    currentAgency,
    // initialValues: state.initFormValues || {"phone": 1234556}
  }
}

const SupplierFormListQL = compose(
  graphql(fetchCompaniesWithProjects),
  graphql(requestSupplierMutation, {
    name: 'requestSupplierMutation',
  }),
  graphql(addSupplierRequest, {
    name: 'addSupplierRequestMutation',
  }),
  graphql(fetchUserByEmail, {
    name: 'fetchUserByEmail',
    skip: ({supplierEmail}) => !supplierEmail,
    options: ({supplierEmail}) => {
      return {
        variables: {
          email: supplierEmail,
        },
      }
    },
  }),
)(SupplierForm)

export default connect(mapStateToProps)(injectIntl(SupplierFormListQL))
