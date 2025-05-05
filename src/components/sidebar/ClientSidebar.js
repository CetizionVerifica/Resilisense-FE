import React, { Component } from "react";
import { Link } from "react-router-dom";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { graphql, compose } from "react-apollo";
import { sumBy } from "lodash";
import { Layout, Menu, Badge, Icon } from "antd";
import fetchSupplierRequestsQuery from "../../graphql/fetchSupplierRequests";
import fetchPartnerRequestsQuery from "../../graphql/fetchPartnerRequests";
import { menusMessages } from "../../messages";
import SidebarWrapper from "./sidebar.style";
import Logo from "../utility/logo";
import { rtl } from "../../common/withDirection";
import {
  setPendingSupplierRequest,
  setPendingPartnerRequest,
  setSelectedMenu,
} from "../../actions";

const { Sider } = Layout;

class ClientSidebar extends Component {
  componentWillUpdate(nextProps) {
    const {
      fetchPartnerRequests: { pendingPartnerRequests },
      fetchSupplierRequests: { pendingSupplierRequests },
      setPendingSupplierRequest,
      setPendingPartnerRequest,
    } = nextProps;
    const total = pendingSupplierRequests
      ? sumBy(pendingSupplierRequests, (req) => req.requestedYears.length)
      : 0;
    const totalPartnerRequest = pendingPartnerRequests
      ? sumBy(
          pendingPartnerRequests,
          (req) => req.partnerRequestedProjects.length
        )
      : 0;
    setPendingSupplierRequest(total);
    setPendingPartnerRequest(totalPartnerRequest);
  }

  renderView({ style, ...props }) {
    const viewStyle = {
      marginRight: rtl === "rtl" ? "0" : "-17px",
      paddingRight: rtl === "rtl" ? "0" : "9px",
      marginLeft: rtl === "rtl" ? "-17px" : "0",
      paddingLeft: rtl === "rtl" ? "9px" : "0",
    };
    return (
      <div className="box" style={{ ...style, ...viewStyle }} {...props} />
    );
  }

  render() {
    const {
      fetchPartnerRequests: { pendingPartnerRequests },
      fetchSupplierRequests: { pendingSupplierRequests },
      intl: { formatMessage },
      setSelectedMenu,
    } = this.props;
    const userRole = this.props.userRole ? this.props.userRole : ["Client"];

    const total = pendingSupplierRequests
      ? sumBy(pendingSupplierRequests, (req) => req.requestedYears.length)
      : 0;
    const totalPartnerRequest = pendingPartnerRequests
      ? sumBy(
          pendingPartnerRequests,
          (req) => req.partnerRequestedProjects.length
        )
      : 0;

    return (
      <SidebarWrapper>
        <Sider
          trigger={null}
          collapsible
          width="200"
          className="isomorphicSidebar"
        >
          <Logo collapsed />
          {userRole && (
            <Menu
              onClick={this.handleClick}
              theme="dark"
              defaultSelectedKeys={this.props.selectedMenu}
              selectedKeys={this.props.selectedMenu}
              onOpenChange={this.onOpenChange}
              className="isoDashboardMenu"
            >
              {/*}  <Menu.Item key="dashboard">
              <Link to={'/'}>
                <span className="isoMenuHolder" >
                  <Icon type="home" />
                  <span className="nav-text">
                    {formatMessage(menusMessages.menuDshboard)}
                  </span>
                </span>
              </Link>
            </Menu.Item>*/}
              {userRole.includes("Client") && (
                <Menu.Item key="performance">
                  <Link
                    onClick={() => setSelectedMenu(["performance"])}
                    to={"/"}
                  >
                    <span className="isoMenuHolder">
                      <Icon type="profile" />
                      <span className="nav-text">
                        {formatMessage(menusMessages.performance)}
                      </span>
                    </span>
                  </Link>
                </Menu.Item>
              )}
              {userRole.includes("Admin") && (
                <Menu.Item key="users">
                  <Link
                    onClick={() => setSelectedMenu(["users"])}
                    to={"/users"}
                  >
                    <span className="isoMenuHolder">
                      <Icon type="user" />
                      <span className="nav-text">
                        {formatMessage(menusMessages.menuUsers)}
                      </span>
                    </span>
                  </Link>
                </Menu.Item>
              )}
              {userRole.includes("Admin") && (
                <Menu.Item key="agencies">
                  <Link
                    onClick={() => setSelectedMenu(["agencies"])}
                    to={"/agencies"}
                  >
                    <span className="isoMenuHolder">
                      <Icon type="user" />
                      <span className="nav-text">
                        {formatMessage(menusMessages.menuAgencies)}
                      </span>
                    </span>
                  </Link>
                </Menu.Item>
              )}
              {(userRole.includes("Admin") ||
                userRole.includes("Reseller") ||
                userRole.includes("Client")) && (
                <Menu.Item key="companies">
                  <Link
                    onClick={() => setSelectedMenu(["companies"])}
                    to={"/companies"}
                  >
                    <span className="isoMenuHolder">
                      <Icon type="solution" />
                      <span className="nav-text">
                        {formatMessage(menusMessages.menuCompanies)}
                      </span>
                    </span>
                  </Link>
                </Menu.Item>
              )}
              {(userRole.includes("Client") ||
                userRole.includes("Reseller")) && (
                <Menu.Item key="projects">
                  <Link
                    onClick={() => setSelectedMenu(["projects"])}
                    to={"/projects"}
                  >
                    <span className="isoMenuHolder">
                      <Icon type="exception" />
                      <span className="nav-text">
                        {formatMessage(menusMessages.menuProjects)}
                      </span>
                    </span>
                  </Link>
                </Menu.Item>
              )}
              {userRole.includes("Client") && (
                <Menu.Item key="suppliers">
                  <Link
                    onClick={() => setSelectedMenu(["suppliers"])}
                    to={"/suppliers"}
                  >
                    <span className="isoMenuHolder">
                      <Icon type="exception" />
                      <span className="nav-text">
                        {formatMessage(menusMessages.menuSuppliers)}
                      </span>
                      <Badge
                        title={`${totalPartnerRequest} pending partner requests`}
                        count={totalPartnerRequest}
                        offset={[0, 6]}
                      />
                    </span>
                  </Link>
                </Menu.Item>
              )}
              {userRole.includes("Client") && (
                <Menu.Item key="partners">
                  <Link
                    onClick={() => setSelectedMenu(["partners"])}
                    to={"/partners"}
                  >
                    <span className="isoMenuHolder">
                      <Icon type="exception" />
                      <span className="nav-text">
                        {formatMessage(menusMessages.menuPartners)}
                      </span>
                      <Badge
                        title={`${total} pending supplier requests`}
                        count={total}
                        offset={[0, 6]}
                      />
                    </span>
                  </Link>
                </Menu.Item>
              )}
              {userRole.includes("Client") && (
                <Menu.Item key="surveys">
                  <Link
                    onClick={() => setSelectedMenu(["surveys"])}
                    to={"/surveys"}
                  >
                    <span className="isoMenuHolder">
                      <Icon type="profile" />
                      <span className="nav-text">
                        {formatMessage(menusMessages.surveys)}
                      </span>
                    </span>
                  </Link>
                </Menu.Item>
              )}

              {/* {userRole.includes("Admin") && (
                <Menu.Item key="newProject">
                  <Link
                    onClick={() => setSelectedMenu(["newProject"])}
                    to={"/projectnew"}
                  >
                    <span className="isoMenuHolder">
                      <Icon type="plus" />
                      <span className="nav-text">
                        {formatMessage(menusMessages.menuNewProject)}
                      </span>
                    </span>
                  </Link>
                </Menu.Item>
              )} */}
              {userRole.includes("Admin") && (
                <Menu.Item key="surveysmanagement">
                  <Link
                    onClick={() => setSelectedMenu(["surveysmanagement"])}
                    to={"/surveys-management"}
                  >
                    <span className="isoMenuHolder">
                      <Icon type="profile" />
                      <span className="nav-text">
                        {formatMessage(menusMessages.surveysmanagement)}
                      </span>
                    </span>
                  </Link>
                </Menu.Item>
              )}
              {userRole.includes("Admin") && (
                <Menu.Item key="projectassestment">
                  <Link
                    onClick={() => setSelectedMenu(["projectassestment"])}
                    to={"/projects-assessment"}
                  >
                    <span className="isoMenuHolder">
                      <Icon type="profile" />
                      <span className="nav-text">
                        {formatMessage(menusMessages.projectassestment)}
                      </span>
                    </span>
                  </Link>
                </Menu.Item>
              )}
              {userRole.includes("Ranking") && (
                <Menu.Item key="rankingsystem">
                  <Link
                    onClick={() => setSelectedMenu(["rankingsystem"])}
                    to={"/rankingsystem"}
                  >
                    <span className="isoMenuHolder">
                      <Icon type="exception" />
                      <span className="nav-text">
                        {formatMessage(menusMessages.menuRankingsystem)}
                      </span>
                    </span>
                  </Link>
                </Menu.Item>
              )}
            </Menu>
          )}
        </Sider>
      </SidebarWrapper>
    );
  }
}

const ClientSidebarQL = compose(
  graphql(fetchSupplierRequestsQuery, {
    name: "fetchSupplierRequests",
    options: (props) => {
      return {
        fetchPolicy: "network-only",
      };
    },
  }),
  graphql(fetchPartnerRequestsQuery, {
    name: "fetchPartnerRequests",
    options: (props) => {
      return {
        fetchPolicy: "network-only",
      };
    },
  })
)(ClientSidebar);
function mapStateToProps({ auth, app }) {
  return {
    userRole: auth.currentUser ? auth.currentUser.role : null,
    selectedMenu: app.selectedMenu ? app.selectedMenu : ["performance"],
  };
}

export default connect(mapStateToProps, {
  setSelectedMenu,
  setPendingSupplierRequest,
  setPendingPartnerRequest,
})(injectIntl(ClientSidebarQL));
