import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";
import { message } from "antd";
import { signoutUser } from "../../actions";

export default function (ComposedComponent, roles = []) {
  class Authentication extends Component {
    static contextTypes = {
      router: PropTypes.object,
    };

    componentWillMount() {
      const { authenticated } = this.props;
      if (this.props.userRole) {
        // const roleList = roles || [];
        // console.log("admin", this.props.userRole);
        // console.log(roleList);

        const roleList = Array.isArray(roles) ? roles : [roles];
        console.log("User roles:", this.props.userRole);
        console.log("Required roles:", roleList);

        let valid = false;

        for (let i = 0; i < roleList.length; i++) {
          switch (roleList[i]) {
            case "reseller":
              if (this.props.userRole.includes("Reseller")) {
                valid = true;
              }
              break;

            case "admin":
              if (this.props.userRole.includes("Admin")) {
                valid = true;
              }
              break;

            case "Client":
              if (this.props.userRole.includes("Client")) {
                valid = true;
              }
              break;
            case "User":
              if (this.props.userRole.includes("user")) {
                valid = true;
              }

              break;

            case "ranking":
              if (!this.props.userRole.includes("Ranking")) {
                valid = true;
              }
              break;

            default:
              break;
          }
        }

        if (!valid && roleList.length > 0) {
          this.context.router.history.push("/");
        }

        if (!authenticated) {
          this.context.router.history.push("/signin");
          message.error("Your session has expired! Please sign in again");
        }
      }
    }

    componentWillUpdate(nextProps) {
      const { authenticated, userRole } = nextProps;
      if (userRole) {
        // const roleList = roles || [];

        const roleList = Array.isArray(roles) ? roles : [roles];

        let valid = false;
        for (let i = 0; i < roleList.length; i++) {
          switch (roleList[i]) {
            case "admin":
              if (userRole.includes("Admin")) {
                valid = true;
              }
              break;
            case "Client":
              if (userRole.includes("Client")) {
                valid = true;
              }
              break;
            case "User":
              if (userRole.includes("user")) {
                valid = true;
              }
              break;

            case "ranking":
              if (userRole !== null && userRole.includes("Ranking")) {
                valid = true;
              }
              break;

            default:
              break;
          }
        }

        if (!valid && roleList.length > 0) {
          this.context.router.history.push("/");
        }

        if (!authenticated) {
          this.context.router.history.push("/signin");
        }
      }
    }

    async componentDidMount() {
      try {
        await axios.get("/api/check_authentication");
      } catch (error) {
        this.props.signoutUser();
      }
    }

    render() {
      return <ComposedComponent {...this.props} />;
    }
  }

  function mapStateToProps({ auth }) {
    return {
      authenticated: auth.authenticated,
      userRole: auth.currentUser
        ? auth.currentUser.role
          ? auth.currentUser.role.split("|")
          : []
        : [],
    };
  }

  return connect(mapStateToProps, { signoutUser })(Authentication);
}
