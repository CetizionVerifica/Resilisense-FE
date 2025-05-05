import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { BrowserRouter, Route } from "react-router-dom";
import { Layout, LocaleProvider } from "antd";
import { get } from "lodash";
import { ThemeProvider } from "styled-components";
import { fetchUser } from "../actions";
import ModalManager from "./modals/ModalManager";
import { languages } from "../common/enum";
import AppHelper from "./styles/app.style";
import Layouts from "./styles/layout.style";
import Sidebar from "./sidebar/Sidebar";
import theme from "../common/theme";
import TopBar from "./topBar/TopBar";
import Dashboard from "./Dashboard";
import Signin from "./auth/Signin";
import ForgotPassword from "./auth/ForgotPassword";
import Signup from "./auth/Signup";
import Signout from "./auth/Signout";
import CompaniesList from "./company/companiesList";
import CompanyForm from "./company/companyEdit";
import ProjectsListMain from "./project/ProjectsListMain";
import AssessmentProjectsListMain from "./projectAssessment/AssessmentProjectsListMain";
import ProjectAssessment from "./projectAssessment/ProjectAssessment";
import SurveysList from "./surveys/SurveysList";
import Surveys from "./surveys/Surveys";
import SendProjectSurveyForm from "./surveys/SendProjectSurveyForm";
import ViewProjectSurvey from "./surveys/ViewProjectSurvey";
import ProjectNew from "./project/ProjectNew";
import ProjectDashBoard from "./project/ProjectDashBoard";
import AgencyDashBoard from "./user/AgencyDashBoard";
import NewUser from "./user/NewUser";
import ChangePassword from "./user/ForgotPassword";
import NewAgency from "./user/NewAgency";
import UserDashBoard from "./user/UserDashBoard";
import Users from "./user/Users";
import UserDetail from "./user/UserDetail";
import AgenciesList from "./agencies/AgenciesList";
import AgencyDetail from "./agencies/AgencyDetail";
import EmployeesList from "./employees/EmployeesList";
import EmployeeForm from "./employees/EmployeeForm";
import StackholderList from "./stackholders/StackholderList";
import StackholderForm from "./stackholders/StackholderForm";
import GapEdit from "./gapAnalysis/GapEdit";
import SupplierGap from "./gapAnalysis/SupplierGap";
import GapResult from "./gapAnalysis/GapResult";
import DocAssessmentReport from "./gapAnalysis/DocAssessmentReport";
import MaterialityEdit from "./materialityAssessment/MaterialityEdit";
import MaterialityEditIOI from "./materialityAssessment/MaterialityEditIOI";
import MaterialityResult from "./materialityAssessment/MaterialityResult";
import AnnualReviewlist from "./annualReviewlist/AnnualReviewlist";
import AuditChecklist from "./auditChecklist/AuditChecklist";
import SuppliersRanking from "./rankingSystem/supplierRanking/SuppliersRanking";
import SuppliersRankingReport from "./rankingSystem/supplierReport/SuppliersRankingReport";
import Suppliers from "./suppliers/Suppliers";
import Partners from "./partners/Partners";
import Survey from "./survey";
import Performance from "./performance";
import Helps from "./Helps";
import requireAuth from "./auth/requireAuth";
import WithDirection from "../common/withDirection";
import { matchPath } from "react-router-dom";
// import SurveyTemplate from './surveys/template/SurveyTemplate'
import SurveyForm from "./surveys/template/SurveyForm";
// import ActivityLog from "./company/ActivityLog";
import superadmin from "./superadmin";
import ResetPassword from "./user/resetPassword";

//const Layouts =
const LayoutWthderaction = WithDirection(Layouts(Layout));

const { Content } = Layout;

const EXTERNAL_ROUTES = {
  SURVEY_FORM: "/survey/:id",
};

function App(props) {
  useEffect(() => {
    if (props.authenticated) {
      props.fetchUser();
    }
  }, [props.authenticated]);

  const { authenticated, locale } = props;

  return (
    <LocaleProvider locale={get(languages[locale], "ant")}>
      <AppHelper dir={locale === "ar" ? "rtl" : ""}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <div>
              {authenticated && !isExternalRoute() && <Sidebar url />}

              <LayoutWthderaction
                style={
                  !authenticated || isExternalRoute()
                    ? { left: 0, background: "#e6e9ec" }
                    : { background: "#e6e9ec" }
                }
              >
                {authenticated && !isExternalRoute() && <TopBar />}
                {authenticated && !isExternalRoute() && <ModalManager />}
                <Content
                  style={{
                    overflow: "auto",
                    top: 0,
                    bottom: 50,
                    position: "relative",
                    height: "100%",
                  }}
                >
                  <Route
                    exact
                    path="/dashboard"
                    component={requireAuth(Dashboard)}
                  />
                  <Route exact path="/signin" component={Signin} />
                  <Route exact path="/signup" component={Signup} />
                  <Route exact path="/signout" component={Signout} />
                  <Route
                    exact
                    path="/companies"
                    component={requireAuth(CompaniesList)}
                  />
                  <Route
                    path="/company/:id"
                    component={requireAuth(CompanyForm)}
                  />
                  <Route
                    exact
                    path="/projects"
                    component={requireAuth(ProjectsListMain)}
                  />
                  <Route
                    exact
                    path="/projects-assessment"
                    component={requireAuth(AssessmentProjectsListMain, [
                      "admin",
                    ])}
                  />
                  <Route
                    exact
                    path="/project-assessment/:id"
                    component={requireAuth(ProjectAssessment, ["admin"])}
                  />
                  <Route
                    exact
                    path="/surveys-management"
                    component={requireAuth(SurveysList, ["admin"])}
                  />
                  <Route
                    exact
                    path="/users"
                    component={requireAuth(Users, ["admin", "Client", "user"])}
                  />
                  <Route
                    exact
                    path="/user/:id"
                    component={requireAuth(UserDetail, [
                      "admin",
                      "Client",
                      "user",
                    ])}
                  />
                  <Route
                    exact
                    path="/agencies"
                    component={requireAuth(AgenciesList, ["admin"])}
                  />
                  <Route
                    exact
                    path="/agency/:id"
                    component={requireAuth(AgencyDetail, ["admin"])}
                  />
                  <Route
                    exact
                    path="/surveys"
                    component={requireAuth(Surveys)}
                  />
                  {/* <Route
                    exact
                    path="/activitylog/:id"
                    component={requireAuth(ActivityLog, ["Client"])}
                  /> */}
                  <Route
                    exact
                    path="/send-survey/:id"
                    component={requireAuth(SendProjectSurveyForm)}
                  />
                  <Route
                    exact
                    path="/surveys/:id"
                    component={requireAuth(ViewProjectSurvey)}
                  />
                  <Route
                    exact
                    path="/projectnew/:companyId"
                    component={requireAuth(ProjectNew, ["admin", "reseller"])}
                  />
                  <Route
                    exact
                    path="/project/:id"
                    component={requireAuth(ProjectDashBoard)}
                  />
                  <Route
                    exact
                    path="/my-organization"
                    component={requireAuth(AgencyDashBoard)}
                  />
                  <Route
                    exact
                    path="/new-organization"
                    component={requireAuth(NewAgency, ["admin"])}
                  />
                  <Route
                    exact
                    path="/my-profile"
                    component={requireAuth(UserDashBoard)}
                  />
                  <Route
                    exact
                    path="/company/employees"
                    component={requireAuth(EmployeesList)}
                  />
                  <Route
                    exact
                    path="/company/employee/new"
                    component={requireAuth(EmployeeForm)}
                  />
                  <Route
                    exact
                    path="/company/stackholders"
                    component={requireAuth(StackholderList)}
                  />
                  <Route
                    exact
                    path="/company/Stackholder/new"
                    component={requireAuth(StackholderForm)}
                  />
                  <Route
                    exact
                    path="/gap/:id"
                    component={requireAuth(GapEdit)}
                  />
                  <Route
                    exact
                    path="/supplier-gap/:id"
                    component={requireAuth(SupplierGap)}
                  />
                  <Route
                    exact
                    path="/gapresult/:id"
                    component={requireAuth(GapResult)}
                  />
                  <Route
                    exact
                    path="/doc-assessment-report/:id"
                    component={requireAuth(DocAssessmentReport)}
                  />
                  <Route
                    exact
                    path="/materiality/:id"
                    component={requireAuth(MaterialityEdit)}
                  />
                  <Route
                    exact
                    path="/materialityioi/:id"
                    component={requireAuth(MaterialityEditIOI)}
                  />
                  <Route
                    exact
                    path="/materialityresult/:id"
                    component={requireAuth(MaterialityResult)}
                  />
                  <Route
                    exact
                    path="/isochecklist/:id"
                    component={requireAuth(AuditChecklist)}
                  />
                  <Route
                    exact
                    path="/annualreview/:id"
                    component={requireAuth(AnnualReviewlist)}
                  />
                  <Route exact path="/helps" component={requireAuth(Helps)} />
                  <Route
                    exact
                    path="/rankingsystem"
                    component={requireAuth(SuppliersRanking)}
                  />
                  <Route
                    exact
                    path="/suppliers-report"
                    component={requireAuth(SuppliersRankingReport)}
                  />
                  <Route
                    exact
                    path="/suppliers"
                    component={requireAuth(Suppliers)}
                  />
                  <Route
                    exact
                    path="/partners"
                    component={requireAuth(Partners)}
                  />

                  <Route exact path="/" component={requireAuth(Performance)} />

                  <Route exact path="/survey-form" component={Survey} />
                  <Route exact path="/super-admin" component={superadmin} />
                  <Route
                    exact
                    path="/forgot-password"
                    component={ForgotPassword}
                  />
                  <Route
                    exact
                    path="/reset-password"
                    component={ResetPassword}
                  />

                  <Route exact path="/newuser" component={NewUser} />
                  <Route
                    exact
                    path="/change-password"
                    component={ChangePassword}
                  />

                  <Route
                    exact
                    path={EXTERNAL_ROUTES.SURVEY_FORM}
                    component={SurveyForm}
                  />
                </Content>
              </LayoutWthderaction>
            </div>
          </BrowserRouter>
        </ThemeProvider>
      </AppHelper>
    </LocaleProvider>
  );
}

function mapStateToProps({ auth, app }) {
  const { locale, messages } = app;
  return {
    authenticated: auth.authenticated,
    currentUser: auth.currentUser,
    locale: locale, // use 'nb' beacuse intl has locale data for nb instead of no
    messages: messages[locale],
    defaultLocale: "en",
  };
}

const isExternalRoute = () => {
  const keys = Object.keys(EXTERNAL_ROUTES);
  for (var key of keys) {
    const match = matchPath(window.location.pathname, {
      path: EXTERNAL_ROUTES[key],
      exact: true,
      strict: false,
    });
    if (match) return true;
  }
  return false;
};

//const AppQL = graphql(fetchUserQuery)(App)
export default connect(mapStateToProps, { fetchUser })(App);
