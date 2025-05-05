import React, { Component } from "react";
import { Row, Col, Button, Icon } from "antd";
import { withRouter } from "react-router-dom";
import { graphql } from "react-apollo";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { projectsMessages } from "../../messages";
import { fetchProjects } from "../../graphql/fetchProjects";
import { projectSorting, projectSearch } from "../../actions";
import TableWrapper from "../styles/table.style";
import { sortColumns, columns } from "./ProjectsListConfig";
import { InputSearch } from "../utility/inputSearch";

class ProjectsList extends Component {
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
      data: { loading, projects },
      hideSearch,
      intl: { formatMessage },
      userRole,
      currentUser,
    } = this.props;
    //Need to fix this and get the current Role
    //  const userRole = this.props.userRole ? this.props.userRole : ['Client']
    if (!projects) {
      return <div />;
    }
    let filteredProjects = projects;
    if (currentUser && userRole.includes("Reseller" || "Admin")) {
      filteredProjects = projects.filter(
        (project) =>
          project.reseller === currentUser._id ||
          project.createdBy === currentUser._id
      );
    }
    const suffix = search ? (
      <Icon type="close-circle" onClick={this.emitEmpty} />
    ) : null;
    return (
      <div style={{ marginRight: 30 }}>
        {!hideSearch && (
          <Row style={{ marginBottom: 15 }}>
            {this.props.userRole.length !== 0 &&
              (this.props.userRole.includes("Admin") ||
                this.props.userRole.includes("Reseller")) && (
                <Col span={12}>
                  <Button
                    type="primary"
                    className=""
                    onClick={() =>
                      this.props.history.push(
                        `/projectnew/${this.props.companyId}`
                      )
                    }
                  >
                    {formatMessage(projectsMessages.btnAddNewProject)}
                  </Button>
                </Col>
              )}
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
              columns={!hideSearch ? sortColumns : columns}
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

function mapStateToProps({ project, auth }) {
  const { sort, order, search, query } = project;
  return {
    sortFild: sort,
    order,
    search,
    query,
    userRole: auth.currentUser ? auth.currentUser.role.split("|") : [],
  };
}

const ProjectsListQL = graphql(fetchProjects, {
  options: (props) => {
    return {
      variables: {
        companyId: props.companyId,
        sort: props.sortFild,
        order: props.order,
        search: props.search,
        s: props.query,
      },
      fetchPolicy: "network-only",
    };
  },
})(withRouter(ProjectsList));
export default connect(mapStateToProps, { projectSearch, projectSorting })(
  injectIntl(ProjectsListQL)
);
