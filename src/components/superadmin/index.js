import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import "./SuperAdmin.css"; // You'll need to create this CSS file
import { BREADCRUMB } from "../../actions/types";

class SuperAdmin extends Component {
  // ...existing code...
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      newUser: {
        name: "",
        email: "",
        password: "",
        role: "admin", // Default role
        companies: [],
        jobPosition: "",
        phone: "",
        extension: "",
        active: true,
        country: "",
        sector: "",
        type: "",
        totalCompaniesAllowed: 0, // Adding the new field with default value
      },
      loading: false,
      error: null,
      success: null,
    };
  }
  // ...existing code...

  // componentDidMount() {
  //   this.fetchUsers();
  //   // Set breadcrumb for SuperAdmin page
  //   this.props.setBreadcrumb([
  //     { name: "Home", link: "/" },
  //     { name: "Super Admin", link: "/super-admin" },
  //   ]);
  // }

  // // Handle breadcrumb navigation
  // handleBreadcrumbClick = (link) => {
  //   this.props.history.push(link);
  // };

  fetchUsers = async () => {
    this.setState({ loading: true });
    try {
      const response = await axios.get("/api/users");
      this.setState({ users: response.data, loading: false });
    } catch (error) {
      this.setState({
        error: "Failed to fetch users. Please try again later.",
        loading: false,
      });
      console.error("Error fetching users:", error);
    }
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      newUser: {
        ...prevState.newUser,
        [name]: value,
      },
    }));
  };

  validateForm = () => {
    const { name, email, password } = this.state.newUser;
    if (!name.trim()) return "Name is required";
    if (!email.trim()) return "Email is required";
    if (!email.includes("@")) return "Email is invalid";
    if (password.length < 8) return "Password must be at least 8 characters";
    return null;
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = this.validateForm();
    if (validationError) {
      this.setState({ error: validationError, success: null });
      return;
    }

    this.setState({ loading: true, error: null, success: null });

    try {
      // Use the new API endpoint that utilizes the userController
      await axios.post("/api/users", this.state.newUser);

      this.setState({
        success: "User created successfully!",
        loading: false,
        newUser: {
          name: "",
          email: "",
          password: "",
          role: "admin",
          companies: [],
          jobPosition: "",
          phone: "",
          extension: "",
          active: true,
          country: "",
          sector: "",
          type: "",
          totalCompaniesAllowed: 0,
        },
      });
      this.fetchUsers(); // Refresh user list
    } catch (error) {
      const errorMessage = error || "Failed to create user";
      this.setState({
        error: errorMessage,
        loading: false,
      });
      console.error("Error creating user:", error);
    }
  };

  render() {
    const { users, newUser, loading, error, success } = this.state;
    const { breadcrumb } = this.props;

    return (
      <div className="super-admin-container">
        {/* Breadcrumb navigation */}
        {/* <div className="breadcrumb-navigation">
          {breadcrumb &&
            breadcrumb.map((item, index) => (
              <span key={index}>
                <span
                  className="breadcrumb-item"
                  onClick={() => this.handleBreadcrumbClick(item.link)}
                >
                  {item.name}
                </span>
                {index < breadcrumb.length - 1 && <span> &gt; </span>}
              </span>
            ))}
        </div> */}

        <h1>SuperAdmin Dashboard</h1>

        <div className="create-user-section">
          <h2>Create New User</h2>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label>
                Name: <span className="required">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={newUser.name}
                onChange={this.handleInputChange}
                placeholder="Enter name"
                required
              />
            </div>

            <div className="form-group">
              <label>
                Email: <span className="required">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={newUser.email}
                onChange={this.handleInputChange}
                placeholder="Enter email"
                required
              />
            </div>

            <div className="form-group">
              <label>
                Password: <span className="required">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={newUser.password}
                onChange={this.handleInputChange}
                placeholder="Enter password"
                required
              />
            </div>

            <div className="form-group">
              <label>Role:</label>
              <select
                name="role"
                value={newUser.role}
                onChange={this.handleInputChange}
              >
                <option value="user">User</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <div className="form-group">
              <label>Total Companies Allowed:</label>
              <input
                type="number"
                name="totalCompaniesAllowed"
                value={newUser.totalCompaniesAllowed}
                onChange={this.handleInputChange}
                placeholder="Enter total companies allowed"
                min="0"
              />
            </div>
            <div className="form-group">
              <label>Job Position:</label>
              <input
                type="text"
                name="jobPosition"
                value={newUser.jobPosition}
                onChange={this.handleInputChange}
                placeholder="Enter job position"
              />
            </div>

            <div className="form-group">
              <label>Phone:</label>
              <input
                type="text"
                name="phone"
                value={newUser.phone}
                onChange={this.handleInputChange}
                placeholder="Enter phone number"
              />
            </div>

            <div className="form-group">
              <label>Country:</label>
              <input
                type="text"
                name="country"
                value={newUser.country}
                onChange={this.handleInputChange}
                placeholder="Enter country"
              />
            </div>

            <div className="form-group">
              <label>Sector:</label>
              <input
                type="text"
                name="sector"
                value={newUser.sector}
                onChange={this.handleInputChange}
                placeholder="Enter sector"
              />
            </div>

            <div className="form-group">
              <label>Type:</label>
              <input
                type="text"
                name="type"
                value={newUser.type}
                onChange={this.handleInputChange}
                placeholder="Enter type"
              />
            </div>

            <div className="form-group">
              <label>Status:</label>
              <select
                name="active"
                value={newUser.active}
                onChange={this.handleInputChange}
              >
                <option value={true}>Active</option>
                <option value={false}>Inactive</option>
              </select>
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create User"}
            </button>
          </form>
        </div>

        <div className="users-list-section">
          <h2>Existing Users</h2>
          {loading && <p>Loading users...</p>}

          {users.length > 0 ? (
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Country</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id || user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{user.active ? "Active" : "Inactive"}</td>
                    <td>{user.country || "Not specified"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No users found</p>
          )}
        </div>
      </div>
    );
  }
}

// const mapStateToProps = (state) => ({
//   breadcrumb: state.app.breadcrumb,
// });

// const mapDispatchToProps = (dispatch) => ({
//   setBreadcrumb: (breadcrumb) =>
//     dispatch({ type: BREADCRUMB, payload: breadcrumb }),
// });

export default connect()(withRouter(SuperAdmin));
