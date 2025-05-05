import React, { useState, useEffect } from "react";
import { Row, Col, Button, message, Icon } from "antd";
import clone from "clone";
import _ from "lodash";
import { withRouter } from "react-router-dom";
import { graphql, withApollo } from "react-apollo";
import styled from "styled-components";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { companySorting, companySearch, breadcrumbUpdate } from "../../actions";
import fetchCompaniesQuery from "../../graphql/fetchCompaniesQuery";
import fetchCompaniesByUserQuery from "../../graphql/fetchCompaniesByUserQuery";

import PageHeader from "../utility/pageHeader";
import Box from "../utility/box";
import { companiesMessages } from "../../messages";
import TableWrapper from "../styles/table.style";
import LayoutWrapper from "../utility/layoutWrapper";
import { sortColumns } from "./CompaniesListConfig";
import { InputSearch } from "../utility/inputSearch";
import CompanyFormModal from "./companyFormModal";

const ButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  margin: 0px 0 30px;
`;

function CompaniesList(props) {
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([]);

  const [columns, setColumns] = useState(clone(sortColumns));
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState([]);
  const { currentUser } = props;
  console.log("currentUser", currentUser);
  useEffect(() => {
    const { breadcrumbUpdate } = props;

    const breadcrumb = [
      { name: "Home", link: "/" },
      { name: "Companies", link: "/companies", indicator: "companies" },
    ];
    breadcrumbUpdate(breadcrumb);
    // console.log("Render???????")
    // if (nextState.search !== this.state.search
    //   && nextState.search === '') {
    //   this.emitEmpty()
    // }
  }, []);

  useEffect(() => {
    props.client
      .query({
        query: fetchCompaniesQuery,
        variables: {
          sort: props.sortFild,
          order: props.order,
          search: props.search,
          s: props.query,
        },
      })
      .then((result) => {
        if (result.data && result.data.companies) {
          const companyData = result.data.companies.map((item) => {
            return {
              ...item,
              lisence: item.lisence.join(","),
              users: item.users.map((item) => item.name).join(","),
            };
          });

          // Filter companies where reseller ID matches current user ID
          const filteredData = companyData.filter((item) => {
            // Check if currentUser exists and has an _id property
            if (currentUser && currentUser._id) {
              // Return true if the reseller ID matches the current user ID
              return item.reseller === currentUser._id;
            }
            return false; // If no current user, don't show any companies
          });

          setLoading(result.data.loading);
          setCompanies(filteredData);
          setCurrent(filteredData);
        }
      })
      .catch((error) => {
        console.error("Error fetching companies:", error);
        setLoading(false);
      });
  }, [props.currentUser]);

  // constructor(props) {
  //   super(props)
  //   this.onChange = this.onChange.bind(this)
  //   this.state = {
  //     columns: clone(sortColumns),
  //     search: '',
  //     visible: false,
  //     current: 0,
  //   }
  // }

  // componentWillUpdate(nextProps, nextState) {
  //   const {data: {companies}, breadcrumbUpdate} = nextProps
  //   if (companies) {
  //     const breadcrumb = [{name: 'Home', link: '/'},
  //       {name: 'Companies'},
  //     ]
  //     breadcrumbUpdate(breadcrumb)
  //   }
  //   if (nextState.search !== this.state.search
  //     && nextState.search === '') {
  //     this.emitEmpty()
  //   }
  // }
  // shouldComponentUpdate(nextProps, nextState) {
  //   if (nextProps.data.companies === this.props.data.companies && nextState.visible === this.state.visible) {
  //     return false
  //   } else {
  //     return true
  //   }
  //   // return nextProps.data.companies !== this.props.data.companies
  // }
  const showModal = () => {
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
  };

  const handleOk = (id) => {
    // this.setState({loading: true})
    message.success("Processing complete!");
    props.history.push(`/company/${id}`);
  };

  function onChange(pagination, filters, sorter) {
    if (sorter && sorter.columnKey && sorter.order) {
      if (sorter.order === "ascend") {
        const sorted = _.sortBy(companies, sorter.columnKey);
        setCompanies(sorted);
        // props.companySorting(sorter.columnKey, 'asc')
      } else {
        const sorted = _.reverse(_.sortBy(companies, sorter.columnKey));
        setCompanies(sorted);
        // props.companySorting(sorter.columnKey, 'desc')
      }
    }
  }

  function onSearch() {
    // props.companySearch('name', search)
    if (search !== "") {
      const searched = current.filter((company) => {
        if (!company.name) {
          return false;
        } else {
          return company.name.includes(search);
        }
      });
      setCompanies(searched);
    } else {
      setCompanies(current);
    }
  }
  const emitEmpty = () => {
    setSearch("");

    props.companySearch("name", "");
  };

  const onDeleteCell = (id) => {
    // this.setState({loading: true})
    props
      .mutate({
        variables: {
          id,
        },
      })
      .then(() => {
        return (
          props.data.refetch(),
          // this.setState({loading: false, visible: false})
          setVisible(false)
        );
      });
  };

  const {
    intl: { formatMessage },
  } = props;
  const suffix = search ? (
    <Icon type="close-circle" onClick={emitEmpty} />
  ) : null;
  return (
    <LayoutWrapper>
      <PageHeader>
        {formatMessage(companiesMessages.titleCompaniesList)}
      </PageHeader>
      <Box>
        <Row>
          {props.userRole.length !== 0 &&
            (props.userRole.includes("Admin") ||
              props.userRole.includes("Reseller")) &&
            companies.length !== props.currentUser.totalCompaniesAllowed && (
              <Col span={12}>
                <ButtonWrapper className="isoButtonWrapper">
                  <Button type="primary" className="" onClick={showModal}>
                    {formatMessage(companiesMessages.btnAddNewCompany)}
                  </Button>
                </ButtonWrapper>
              </Col>
            )}
          <Col span={12}>
            <InputSearch
              placeholder={formatMessage(companiesMessages.searchCompany)}
              className="isoSearchNotes"
              value={search}
              prefix={
                <Icon type="search" style={{ color: "rgba(0,0,0,.25)" }} />
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
          columns={columns}
          onChange={onChange}
          dataSource={companies}
          rowKey="id"
          loading={loading}
          className="sortingTable"
        />
        <CompanyFormModal
          visible={visible}
          handleOk={handleOk}
          hideModal={hideModal}
          refetch={props.data.refetch}
          currentUser={props.currentUser}
        />
      </Box>
    </LayoutWrapper>
  );
}

function mapStateToProps({ company, auth }) {
  const { sort, order, search, query } = company;
  return {
    sortFild: sort,
    order,
    search,
    query,
    userRole: auth.currentUser ? auth.currentUser.role.split("|") : [],
    currentUser: auth.currentUser ? auth.currentUser : null,
  };
}

const CompaniesListQL = graphql(fetchCompaniesQuery, {
  options: (props) => {
    return {
      variables: {
        sort: props.sortFild,
        order: props.order,
        search: props.search,
        s: props.query,
      },
      fetchPolicy: "network-only",
    };
  },
})(withRouter(withApollo(CompaniesList)));

export default connect(mapStateToProps, {
  companySorting,
  companySearch,
  breadcrumbUpdate,
})(injectIntl(CompaniesListQL));
