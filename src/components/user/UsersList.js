import React, { Component } from "react";
import { Row, Col, Button, message } from "antd";
import clone from "clone";
import { graphql } from "react-apollo";
import styled from "styled-components";
import { connect } from "react-redux";
import { companySorting, companySearch, breadcrumbUpdate } from "../../actions";
import { removeUserFromAgency } from "../../graphql/agencyMutation";
import Box from "../utility/box";
import { DeleteCell } from "../../common/helperCells";
import TableWrapper from "../styles/table.style";
import { columns } from "./UserListConfig";
import UserForm from "./UserForm";

const ButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  margin: 0px 0 30px;
`;

class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: this.createcolumns(props.userRole, clone(columns)),
      search: "",
      visible: false,
      editVisible: false,
      current: 0,
      selectedEmployee: "",
    };
  }
  componentDidMount() {
    const { breadcrumbUpdate } = this.props;

    const breadcrumb = [
      { name: "Home", link: "/" },
      { name: "Users", link: "/users" },
    ];
    breadcrumbUpdate(breadcrumb);
  }
  showModal = () => this.setState({ visible: true });

  hideModal = () => this.setState({ visible: false });

  handleCancel = () => {
    this.setState({ visible: false });
  };
  createcolumns(userRole, columns) {
    const activeColumn = [
      {
        title: "",
        dataIndex: "",
        render: (text, record, index) =>
          userRole.includes("Admin") ? (
            <DeleteCell index={record._id} onDeleteCell={this.onDeleteCell} />
          ) : (
            ""
          ),
      },
    ];
    columns.push(...activeColumn);
    return columns;
  }

  onDeleteCell = (userId) => {
    // console.log(userId)
    this.setState({ loading: true });
    this.props
      .mutate({
        variables: {
          userId,
        },
        //refetchQueries: [{query: this.props.fetchEmployees, variables: {companyId}}],
      })
      .then(() => {
        message.success("Processing complete!");
        this.setState({ loading: false, visible: false });
      });
  };

  render() {
    const { columns } = this.state;
    const { users } = this.props;
    if (!users) {
      return <div />;
    }
    return (
      <Box>
        {/*  <Row>
          <Col span={12}><ButtonWrapper className="isoButtonWrapper">
            <Button type="primary" className="" onClick={this.showModal}>
             Add New User yy
            </Button>
          </ButtonWrapper></Col>
        </Row>*/}
        <TableWrapper
          size="small"
          columns={columns}
          onChange={this.onChange}
          dataSource={users}
          rowKey="_id"
          className="sortingTable"
        />
        <UserForm
          visible={this.state.visible}
          handleOk={this.handleOk}
          hideModal={this.hideModal}
        />
      </Box>
    );
  }
}

function mapStateToProps({ company, auth }) {
  const { sort, order, search, query } = company;
  return {
    sortFild: sort,
    order,
    search,
    query,
    userRole: auth.currentUser ? auth.currentUser.role.split("|") : [],
  };
}

const UserListQL = graphql(removeUserFromAgency)(UserList);

export default connect(mapStateToProps, {
  companySorting,
  companySearch,
  breadcrumbUpdate,
})(UserListQL);
