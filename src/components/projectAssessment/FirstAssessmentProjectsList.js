import React, { Component } from "react";
import { Row, Col, Icon } from "antd";
import { withRouter } from "react-router-dom";
import { graphql } from "react-apollo";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { projectsMessages } from "../../messages";
import { fetchProjectsByStatus } from "../../graphql/fetchProjects";
import { firstAssessmentSorting, firstAssessmentSearch } from "../../actions";
import TableWrapper from "../styles/table.style";
import { sortColumnsWithoutReport, columns } from "./ProjectsListConfig";
import { InputSearch } from "../utility/inputSearch";

class FirstAssessmentProjectsList extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.state = {
      dataList: this.props.data,
      search: "",
      visible: false,
      current: 0,
    };
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  };
  handleOk = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false, visible: false });
    }, 2000);
  };
  handleCancel = () => {
    this.setState({ visible: false });
  };
  onChange(pagination, filters, sorter) {
    if (sorter && sorter.columnKey && sorter.order) {
      if (sorter.order === "ascend") {
        this.props.projectSorting(sorter.columnKey, "asc");
      } else {
        this.props.projectSorting(sorter.columnKey, "desc");
      }
      //this.setState({dataList: dataList.getAll()})
    }
  }

  onSearch() {
    this.props.projectSearch("title", this.state.search);
  }
  emitEmpty = () => {
    //this.userNameInput.focus()
    this.setState({ search: "" });
    this.props.projectSearch("title", "");
  };
  render() {
    const { search, dataList } = this.state;
    const {
      data: { loading, projectsByStatus },
      hideSearch,
      intl: { formatMessage },
      currentUser,
    } = this.props;

    // Logging the projects data
    console.log("Projects in FirstAssessmentProjectsList:", projectsByStatus);

    if (!projectsByStatus) {
      return <div />;
    }

    // Filter projects based on reseller and currentUser ID
    let filteredProjects = projectsByStatus;
    if (currentUser && currentUser._id) {
      filteredProjects = projectsByStatus.filter(
        (project) => project.reseller === currentUser._id
      );
    }

    const suffix = search ? (
      <Icon type="close-circle" onClick={this.emitEmpty} />
    ) : null;
    return (
      <div style={{ marginRight: 30 }}>
        {!hideSearch && (
          <Row style={{ marginBottom: 15 }}>
            <Col span={12}>First Assessment</Col>
            <Col span={12}>
              <InputSearch
                placeholder={formatMessage(projectsMessages.searchProject)}
                className="isoSearchNotes"
                value={search}
                prefix={
                  <Icon type="search" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                onSearch={() => this.onSearch()}
                enterButton
                suffix={suffix}
                onChange={(e) => this.setState({ search: e.target.value })}
              />
            </Col>
          </Row>
        )}
        <Row>
          <Col span={24}>
            <TableWrapper
              size="small"
              columns={!hideSearch ? sortColumnsWithoutReport : columns}
              onChange={this.onChange}
              dataSource={filteredProjects}
              loading={loading}
              rowKey="id"
              className="sortingTable"
              pagination={dataList.length > 10}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

function mapStateToProps({ firstAssessment, auth }) {
  const status = "FirstAssessmentRequest";
  const { sort, order, search, query } = firstAssessment;
  const { currentUser } = auth;

  return {
    sortFild: sort,
    order,
    search,
    query,
    status,
    currentUser,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    // dispatching plain actions
    projectSearch: (searchField, query) =>
      dispatch(firstAssessmentSearch(searchField, query)),
    projectSorting: (sortField, order) =>
      dispatch(firstAssessmentSorting(sortField, order)),
  };
}

const FirstAssessmentProjectsListQL = graphql(fetchProjectsByStatus, {
  options: (props) => {
    return {
      variables: {
        status: props.status,
        sort: props.sortFild,
        order: props.order,
        search: props.search,
        s: props.query,
      },
      fetchPolicy: "network-only",
    };
  },
})(withRouter(FirstAssessmentProjectsList));
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(FirstAssessmentProjectsListQL));
