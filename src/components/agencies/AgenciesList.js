import React, { useState, useEffect } from "react";
import { Row, Col, Button, message, Icon } from "antd";
import clone from "clone";
import _ from "lodash";
import { withRouter } from "react-router-dom";
import { withApollo } from "react-apollo";
import styled from "styled-components";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { breadcrumbUpdate } from "../../actions";
import fetchAgencies from "../../graphql/fetchAgencies";
import { sortColumns } from "./AgenciesListConfig";
import PageHeader from "../utility/pageHeader";
import Box from "../utility/box";
import { agencyMessages } from "../../messages";
import TableWrapper from "../styles/table.style";
import LayoutWrapper from "../utility/layoutWrapper";
// import { sortColumns } from "./CompaniesListConfig";
import { InputSearch } from "../utility/inputSearch";
// import CompanyFormModal from "./companyFormModal";

const ButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  margin: 0px 0 30px;
`;

function UserList(props) {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  //   const [columns, setColumns] = useState(clone(sortColumns));
  const [columns, setColumns] = useState(clone(sortColumns));

  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState([]);

  useEffect(() => {
    const { breadcrumbUpdate } = props;
    const breadcrumb = [
      { name: "Home", link: "/" },
      { name: "Users", link: "/agencies", indicator: "agencies" },
    ];
    breadcrumbUpdate(breadcrumb);
    // console.log("Render???????")
    // if (nextState.search !== this.state.search
    //   && nextState.search === '') {
    //   this.emitEmpty()
    // }
  }, []);
  console.log("props", props.currentUser);
  useEffect(() => {
    props.client
      .query({
        query: fetchAgencies,
        variables: {
          sort: props.sortFild,
          order: props.order,
          search: props.search,
          s: props.query,
        },
      })
      .then((result) => {
        console.log("result", result);
        if (result.data) {
          const usersData = result.data.agencies.map((agency) => {
            return {
              ...agency,
              numberOfUser: agency.users.length || 0,
              numberOfProject: agency.projects.length || 0,
              numberOfCompany: agency.companies.length || 0,
              updatedBy: agency.updatedBy ? agency.updatedBy.name : null,
            };
          });
          const filteredData = usersData.filter((item) => {
            // Check if currentUser exists and has an _id property
            if (props.currentUser && props.currentUser._id) {
              // Return true if the reseller ID matches the current user ID
              return item.reseller === props.currentUser._id;
            }
            return false; // If no current user, don't show any companies
          });

          setUsers(filteredData);
          setCurrent(usersData);
          setLoading(result.data.loading);

          //   setCompanies(companyData);
          //   setCurrent(companyData);
        }
      });
  }, [props.currentUser]);

  //   const handleOk = (id) => {
  //     // this.setState({loading: true})
  //     message.success("Processing complete!");
  //     props.history.push(`/company/${id}`);
  //   };

  function onChange(pagination, filters, sorter) {
    if (sorter && sorter.columnKey && sorter.order) {
      if (sorter.order === "ascend") {
        const sorted = _.sortBy(users, sorter.columnKey);
        setUsers(sorted);
        // props.companySorting(sorter.columnKey, 'asc')
      } else {
        const sorted = _.reverse(_.sortBy(users, sorter.columnKey));
        setUsers(sorted);
        // props.companySorting(sorter.columnKey, 'desc')
      }
    }
  }

  function onSearch() {
    // props.companySearch('name', search)
    if (search !== "") {
      const searched = current.filter((user) => {
        if (!user.name && !user.email) {
          return false;
        } else {
          const searchString = user.email + user.name;
          return searchString.toLowerCase().includes(search.toLowerCase());
        }
      });
      setUsers(searched);
    } else {
      setUsers(current);
    }
  }
  const emitEmpty = () => {
    setSearch("");
    setUsers(current);
  };

  const {
    intl: { formatMessage },
  } = props;
  const suffix = search ? (
    <Icon type="close-circle" onClick={emitEmpty} />
  ) : null;
  return (
    <LayoutWrapper>
      <PageHeader>{formatMessage(agencyMessages.titleAgencyList)}</PageHeader>
      <Box>
        <Row>
          <Col span={12}>
            <InputSearch
              placeholder={formatMessage(agencyMessages.searchAgency)}
              className="isoSearchNotes"
              value={search}
              prefix={
                <Icon
                  // key="search"
                  type="search"
                  style={{ color: "rgba(0,0,0,.25)" }}
                />
              }
              onSearch={() => onSearch()}
              enterButton
              suffix={suffix}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Col>
        </Row>
        <TableWrapper
          size="small"
          //   onRow={(record) => ({
          //     onClick: () => props.history.push(`/user/${record.id}`)
          //   })}
          columns={columns}
          onChange={onChange}
          dataSource={users}
          rowKey="id"
          loading={loading}
          className="sortingTable"
        />
      </Box>
    </LayoutWrapper>
  );
}

function mapStateToProps({ auth }) {
  return {
    userRole: auth.currentUser ? auth.currentUser.role.split("|") : [],
    currentUser: auth.currentUser ? auth.currentUser : null,
  };
}

// const CompaniesListQL = graphql(fetchCompaniesQuery, {
//   options: (props) => {
//     return {
//       variables: {
//         sort: props.sortFild,
//         order: props.order,
//         search: props.search,
//         s: props.query,
//       },
//       fetchPolicy: "network-only",
//     };
//   },
// })();

export default connect(mapStateToProps, {
  breadcrumbUpdate,
})(injectIntl(withRouter(withApollo(UserList))));
