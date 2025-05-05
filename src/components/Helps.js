/* eslint-disable max-len */
import React, {Component} from 'react'
import {Row, Col, Collapse, Tooltip, Icon} from 'antd'
import {connect} from 'react-redux'
import {breadcrumbUpdate} from '../actions'
import basicStyle from '../common/basicStyle'
import PageHeader from './utility/pageHeader'
import Box from './utility/box'
import LayoutWrapper from './utility/layoutWrapper'
import handbookPDF from '../images/csr_analytics_pro_toolkit_handbook.pdf'
const Panel = Collapse.Panel

class Helps extends Component {
  constructor(props) {
    // console.log("help render..")
    super(props)
    this.state = {
      search: '',
      visible: false,
      current: 0,
    }
  }
  showModal = () => {
    this.setState({
      visible: true,
    })
  }
  handleOk = (e) => {
    this.setState({
      visible: false,
    })
  }
  handleCancel = (e) => {
    this.setState({
      visible: false,
    })
  }
  rende
  onChange(date, dateString) {
    // console.log(date, dateString)
  }
  render() {
    const {rowStyle, colStyle, gutter} = basicStyle
    // const {
    //   breadcrumbUpdate,
    // } = this.props
    // const breadcrumb = [{name: 'Home'}]
    // breadcrumbUpdate(breadcrumb)

    // return (<div>TEST</div>);

    return (

      <LayoutWrapper>
        <PageHeader>
        FAQs
        </PageHeader>

        <Row style={rowStyle} justify="space-between" gutter={gutter}>
          <Col md={24} sm={24} xs={24} style={{...colStyle, textAlign: 'right'}}>
            <a
              href={handbookPDF}
              className="ant-btn ant-btn-primary"
              download="CSR_Analytics_Pro_Toolkit_Handbook"
            >
              <span style={{position: 'relative', top: '-4px'}}>Downlad User Handbook</span>
              <Icon type="cloud-download" style={{fontSize: 28, marginRight: 10, marginLeft: 10}} />
            </a>
          </Col>
          <Col md={24} sm={24} xs={24} style={colStyle}>
            <Tooltip placement="top" title="Downlad User Handbook" />
            <Box title="Dashboard">
              <Collapse defaultActiveKey={['1']}>
                <Panel header="How can I access the latest project I have worked on?" key="1">
                All recent projects are displayed on and accessible from the ‘Dashboard’ tab. Clicking the blue
                pencil icon on the right-hand side will gain you access to the project.
                </Panel>
                <Panel header="How can I search for existing projects?" key="2">
                You can search for projects on the ‘Dashboard’ tab using the search box on the right-hand side.
                You can enter any key words you would like to search for, and/or select the relevant ‘From’ and
                ‘To’ dates, and/or select the name of the user on the account from the drop-down menu.
                </Panel>
                <Panel header="How can I make changes to an existing project?" key="3">
                The same way you would access a project you’ve previously worked on, by clicking the blue pencil
                icon on the right-hand side of the project you wish to make changes to on the ‘Dashboard’ tab or
                the ‘Projects’ tab, to gain you access to the project. Please note that if you’re project does not
                appear under ‘Latest projects’ o the ‘Dashboard’ tab, it can be found on the ‘Projects’ tab by
                clicking on the ‘Projects’ button on the left-hand side once on the ‘Dashboard’ tab.
                </Panel>
                <Panel header="How can I save any information I enter on the toolkit?" key="4">
                When inputting information e.g. registering a new
                company/project/employees/stakeholders/details it can be saved by
                completing the process typically done by selecting the blue button in the
                bottom right corner of the page. The button may have different titles e.g.
                save/ submit/ create …, depending on what it is that you are registering.
                When working on a project, on any of the project’s stages e.g. gap
                analysis/ materiality assessment/
                actions & KPIs/ review & audit, any progress made is automatically saved and
                is marked by the pop-up ‘Processing complete!’ notification that appears on
                the top center point of the page. This does not only indicate that your
                progress has been saved but that the software has automatically processed
                the information and generated the corresponding results.

                </Panel>
              </Collapse>
            </Box>
          </Col>
          <Col md={24} sm={24} xs={24} style={colStyle}>
            <Box title="Companies">
              <Collapse defaultActiveKey={['1']}>
                <Panel header="How can I add a new company?" key="1">
                You can add a new company by selecting the ‘Add new company’
                button under the ‘Companies’ page.
                </Panel>
                <Panel header="How can I delete an existing company?" key="2">
                You can delete an existing company by accessing the company’s page
                (select blue pencil icon under ‘Companies’ page), and then under the
                ‘Settings’ tab select the ‘Delete Company’ button.
                </Panel>
                <Panel header="How can I make changes to an existing company’s details?" key="3">
                Under the ‘Companies’ tab you will find a list of all the registered companies in
                your account. Clicking the blue pencil icon on the right-hand side of the company
                you’re looking to edit will gain you access to the company’s details,
                including information relating to the contact person, the company’s projects,
                its employees, its stakeholders, relevant actions and KPIs and the settings for
                your account
                </Panel>
              </Collapse>
            </Box>
          </Col>
          <Col md={24} sm={24} xs={24} style={colStyle}>
            <Box title="Employees">
              <Collapse>
                <Panel header="How can I add a new employee?" key="1">
            You add a new employee and their relevant contact details by clicking on the ‘Add New Employee’ button.
            You should add all employees who were involved with the sustainability project the first time you use
            the 7 Toolkit.
                </Panel>
                <Panel header="How can I delete an existing employee?" key="2">
            To delete an existing employee, click on the trash can icon on the
            right-hand side of the employee you wish to delete.
                </Panel>
              </Collapse>
            </Box>
          </Col>
          <Col md={24} sm={24} xs={24} style={colStyle}>
            <Box title="Stakeholders">
              <Collapse>
                <Panel header="How can I access the Stakeholders tab?" key="1">
            You must first access the company’s page by selecting the blue pencil icon found next to it on the companies list (on the
            ‘Companies’ page). The stakeholders tab is the fourth tab found on the company’s page.
                </Panel>
                <Panel header="How can I add a new stakeholder?" key="2">
            You add a new stakeholder and their relevant contact details by clicking on the ‘Add New Stakeholder’ button. You should
            add all stakeholders who were involved with the sustainability project the first time you use the CSR Analytics
            Pro toolkit. Stakeholders can also be added by clicking the ‘Add new stakeholder’ button on the ‘Materiality
            Assessment’ tab (this is explained further in the Materiality Assessment section).
                </Panel>
                <Panel header="How can I edit the details of an existing stakeholder?" key="3">
            To edit the details of an existing stakeholder, click the blue pencil icon on the right-hand side of the stakeholder you’re
            looking to edit, to gain access to the stakeholder’s details.
                </Panel>
                <Panel header="How can I delete an existing stakeholder?" key="4">
            To delete an existing stakeholder, click on the trash can icon on the right-hand side of the stakeholder you’re looking to
            delete.
                </Panel>
              </Collapse>
            </Box>
          </Col>
          <Col md={24} sm={24} xs={24} style={colStyle}>
            <Box title="New Project">
              <Collapse>
                <Panel header="How can I create a new project?" key="1">
            If it is a project of an existing (already registered) company, then you can select the ‘+ New Project’ tab and proceed with
            filling in the information needed on that page. If the project is of a new company then you should first add
            a new company by clicking ‘+ Add New Company’ button and then proceed to the ‘+ New Project’ tab, as described
            above.
                </Panel>
              </Collapse>
            </Box>
          </Col>
          <Col md={24} sm={24} xs={24} style={colStyle}>
            <Box title="Projects">
              <Collapse>
                <Panel header="How do I begin working on a project in order to be able to develop a CSR/sustainability strategy?" key="1">
            First you must select the project you wish to work on from the existing ‘Project List’ under the ‘Projects’ tab by clicking
            on the blue pencil icon on the right-hand side. This will gain you access to the project you wish to work on.
            Projects follow a linear sequence, meaning that the stages of work to be carried out appear in a successive order,
            starting from the ‘Gap Analysis’ to the ‘Materiality Assessment’, the ‘Actions & KPIs’ and finally the ‘Review
            & Audit’ stage.
                </Panel>
                <Panel header="How do I delete an existing project?" key="2">
            You must select the ‘Delete Project’ button under the ‘Settings’ tab found when accessing a project.
                </Panel>
              </Collapse>
            </Box>
          </Col>
          <Col md={24} sm={24} xs={24} style={colStyle}>
            <Box title="Gap Analysis Edit">
              <Collapse>
                <Panel header="How does the Gap Analysis work?" key="1">
            To begin working on the Gap Analysis and inputting the Company Performance and Relevance & Significance scores, click on
            the ‘Edit’ button on the ‘Developing a CSR/Sustainability Strategy’ page under the ‘Gap Analysis’ tab. The 313
            Key Considerations can then be found under each of the 7 Core Subjects and their corresponding Issues of Interest
            on the Gap Analysis page.
                  <br /> When all scores have been assigned for all 7 Core Subjects, this will be indicated by ‘100%’ on the green
            progress bars for each Core Subject and for the Total bar in the ‘Developing a CSR/Sustainability Strategy’ page
                  <br /> To view the results of the Gap Analysis, click on the ‘Results‘ button. To understand the different Gap
            Analysis Results, please refer to the relevant question below.
                </Panel>
                <Panel header="What do the different ‘Weight’ scores displayed on the Gap Analysis page mean?" key="2">
            A weight score is calculated automatically by the software at every level i.e. Key Consideration (on the right-hand side
            of the Key Consideration), Issue of Interest (below each Issue of Interest), and Core Subject (below each Core
            Subject). The weight is directly proportional to the Relevance & Significance score which is assigned to each
            Key Consideration. The average weight of all Key Considerations under an Issue of Interest is the weight assigned
            to that Issue of Interest. Similarly, the average weight of all Issues of Interest under a Core Subject, is the
            weight assigned to that Core Subject
                </Panel>
                <Panel header="What is the W. P. score and why is it important?" key="3">
            W. P. stands for Weighted Performance is obtained by multiplying a key consideration’s/issue of interest’s/core subject’s
            weight score by its performance score. Adding all the weighted performance scores of a group of key considerations/
            issues of interest/ core subjects will give the higher level’s performance score. For example, adding the weighted
            performance scores of all key considerations under the ‘Discrimination and vulnerable groups’ issue of interest
            will give the performance score of that issue of interest. Then, adding the weighted performance scores of that
            issue of interest along with those of the remaining issues of interest under the same core subject will give
            the performance score of the ‘Human Rights’ core subject. The adding all the weighted performance scores of all
            the core subjects will give the performance score of the company overall.
                </Panel>
              </Collapse>
            </Box>
          </Col>
          <Col md={24} sm={24} xs={24} style={colStyle}>
            <Box title="Gap Analysis Results">
              <Collapse>
                <Panel header="What do the ‘Gap analysis tables’ demonstrate?" key="1">
            These tables simply present what has been inputted by the user in the Gap Analysis page i.e. the evaluation scores for the
            Company performance and Relevance & Significance.
                  <br /> To display the table you wish to view, select the relevant Core Subject and Issue of Interest from the drop-down
            menu. You can also sort the Key Considerations you view in the table for each Issue of Interest by selecting
            the relevant Company Performance e.g. ‘All’, ‘0-2’, ‘3’ and ‘5-7’.
                  <br /> You can export a table and save it on your computer for inputting into reports/presentations/etc., by clicking
            on the ‘Export’ button.
                </Panel>
                <Panel header="What do the ‘Performance vs. Relevance’ tables demonstrate?" key="2">
            These tables present how major or minor each Key Consideration is for the company, with respect to being socially responsible
            according to ISO 26000. Hovering over the Major/Minor result in the ‘Issue Level’ column will reveal the ‘Performance
            vs. Relevance Matrix’ for that Key Consideration, illustrating how critical that consideration is in further
            detail, based on the company’s performance with regard to that consideration and the consideration’s relevance
            to the company.
                  <br /> To display the table you wish to view, select the relevant Core Subject and Issue of Interest from the drop-down
            menu.
                  <br /> You can export a table and save it on your computer for inputting into reports/presentations/etc., by clicking
            on the ‘Export’ button.
                </Panel>
                <Panel header="What do the ‘Performance vs. Relevance by Core subject’ tables demonstrate?" key="3">
            These tables group Key Considerations and Issues of Interest by Core Subject and sort all Key Considerations by Issue Level
            in descending order of criticality i.e. ‘most’ Major through to ‘most’ Minor. Hovering over the Major/Minor result
            in the ‘Issue Level’ column will reveal the ‘Performance vs. Relevance Matrix’ for that Key Consideration, illustrating
            how critical that consideration is in further detail, based on the company’s performance with regard to that
            consideration and the consideration’s relevance to the company.
                  <br /> To display the table you wish to view, select the relevant Core Subject from the drop-down menu.
                  <br /> You can export a table and save it on your computer for inputting into reports/presentations/etc., by clicking
            on the ‘Export’ button.
                </Panel>
                <Panel header="What does the ‘Performance vs. Relevance Status Report’ demonstrate?" key="4">
            This status report groups together all Key Considerations which have been classified as Major Issues or Minor Issues under
            a specific Issue of Interest under a specific Core Subject.
                  <br /> To display the table you wish to view, select the relevant Core Subject and Issue of Interest from the drop-down
            menu.
                  <br /> You can export a table and save it on your computer for inputting into reports/presentations/etc., by clicking
            on the ‘Export’ button.
                </Panel>
                <Panel header="What does the ‘Overall Company Performance by Core Subject’ illustrate?" key="5">
            The pie chart at the end presents visually the overall performance and total weight of each Core Subject for the company.
            Each piece of the pie represents a Core Subject. The colour of each piece of the pie indicates the company’s
            overall performance for that Core Subject, as per the ‘Performance Colour Grading’ legend on the left-hand side.
            The size of each piece of the pie represents that Core Subject’s total weight. Hovering over a piece of the pie
            will reveal the name of the Core Subject and the exact percentage values for each Core Subject’s weight and performance
            score.
                </Panel>
              </Collapse>
            </Box>
          </Col>
          <Col md={24} sm={24} xs={24} style={colStyle}>
            <Box title="Materiality Assessment Edit">
              <Collapse>
                <Panel header="What are the ‘Edit Core Subjects’ and ‘Edit Issues of Interest’ buttons for?" key="1">
            The <strong>‘Edit Core Subjects’</strong> button is used to enter new stakeholders, select the stakeholders’
            class and re-arrange in descending order of importance the Core Subjects as indicated by the numbering of 1-7
            on the right-hand side (where 1 is the most important and 7 is the least important), which allocates a Relevance
            & Significance score to each Core Subject. When all fields are completed, the ‘Core Subject Materiality Matrix’
            will automatically be produced. The Materiality Matrix for Core Subjects will help the company visualise and
            select the Core Subjects of highest concern for addressing in its CSR/Sustainability Strategy.
                  <br /> The <strong>‘Edit Issues of Interest’</strong> button is used to re-arrange in descending order of importance
            the Issues of Interest for each of the four most important Core Subjects, as indicated by the numbering on the
            right-hand side (where 1 is the most important). The four most important Core Subjects are determined by their
            overall relevance & significance score calculated through mechanisms taking into account both the internal and
            external stakeholders’ views. When all fields are completed the ‘Issue of Interest Materiality Matrix’ will automatically
            be produced. The Materiality Matrix for Issues of Interest will help the company visualise and select the Issues
            of Interest of highest concern for addressing in its CSR/Sustainability Strategy.
                </Panel>
              </Collapse>
            </Box>
          </Col>
          <Col md={24} sm={24} xs={24} style={colStyle}>
            <Box title="Materiality Assessment Results">
              <Collapse>
                <Panel header="Where can I see the Materiality Matrices?" key="1">
            Click on the ‘Results’ button under the Materiality Assessment tab. A tab for each materiality matrix (i.e. Core Subjects
            and Issues of Interest) is available.
                  <br /> You can export each Materiality Matrix and save it on your computer for inputting into reports/presentations/etc.,
            by clicking on the ‘Export’ button.
                </Panel>
                <Panel header="What is a Materiality Matrix – Core Subjects?" key="2">
            A Materiality Matrix – Core Subjects illustrates the relevance of each core subject displayed with respect to the company
            and to the stakeholders. The horizontal axis, ‘Relevance to Company’, represents how relevant the company believes
            the core subject is to its operations, and the vertical axis, ‘Relevance to Stakeholders’ represents how relevant
            the stakeholders believe the core subject is to their operations.
                </Panel>
                <Panel header="What is a Materiality Matrix – Issues of Interest?" key="3">
            A Materiality Matrix – Issues of Interest illustrates the relevance of issue of interest displayed with respect to the company
            and to the stakeholders. The horizontal axis, ‘Relevance to Company’, represents how relevant the company believes
            the issue of interest is to its operations, and the vertical axis, ‘Relevance to Stakeholders’ represents how
            relevant the stakeholders believe the issue of interest is to their operations.
                </Panel>
              </Collapse>
            </Box>
          </Col>
          <Col md={24} sm={24} xs={24} style={colStyle}>
            <Box title="Actions & KPIs">
              <Collapse>
                <Panel header="How can you add Actions & KPIs?" key="1">
            To enter Actions & KPIs, select the ‘Actions and KPIs’ tab from the the ‘Developing a CSR/Sustainability Strategy’ page.
            You then need to click on ‘Add Issue of Interest’ and select the Issue of Interest you wish to add Actions and
            KPIs for using the drop-down menu. You then need to type in the relevant boxes, action(s) and KPI(s). You can
            use the ‘Materiality Matrix – Issues of Interest’ graph on the right-hand side to view the Issues of Interest
            which need addressing. You can hover over each of the Issues of Interest in the Materiality Matrix, displayed
            using unique numbering, to see which Issue of Interest it is.
                  <br /> The ‘Baseline Performance’ will need to be inputted by the user for the first year of the CSR/sustainability
            project but will appear automatically for all subsequent years. Please add as many Actions and KPIs for as many
            Issues of Interest as you would like.
                </Panel>
              </Collapse>
            </Box>
          </Col>
          <Col md={24} sm={24} xs={24} style={colStyle}>
            <Box title="Review & Audit">
              <Collapse>
                <Panel header="What is the ISO 26000 Audit Checklist and how can I use it?" key="1">
            The checklist consists of a set of questions which address all the stages and activities that should be carried out in a
            ‘developing a CSR/Sustainability Strategy’ project. If you are in a position to tick all the checkboxes, then
            this means that you have successfully carried out this project
                </Panel>
                <Panel header="What is the UN Global Compact Annual Review Checklist and how can I use it?" key="2">
            The UN Global Compact is based on 10 principles addressing five principal elements of corporate sustainability such as human
            rights, labour, environment and anti-corruption. You can use the UN Global Compact Annual Review Checklist to
            test your company's performance on all ten UN Global Compact principles and how well these issues are managed.
                </Panel>
              </Collapse>
            </Box>
          </Col>
          <Col md={24} sm={24} xs={24} style={colStyle}>
            <Box title="Settings">
              <Collapse>
                <Panel header="How can I access the Settings tabs?" key="1">
            There are 3 separate settings tabs available on the toolkit; for the Account as a whole;
            for a specific Company; and for
            a specific Project. The Account settings can be accessed from
            the drop-down menu displayed when clicking the
            icon on the top right corner of the page. On how to access Company and
            Project settings please refer to Company
            and Project sections above.
                </Panel>
              </Collapse>
            </Box>
          </Col>
          <Col md={24} sm={24} xs={24} style={colStyle}>
            <Box title="Account Settings">
              <Collapse>
                <Panel header="How can I edit/view my account profile?" key="1">
            Selecting the icon on the top right corner of the page will display a drop-down menu.
            Selecting the ‘My profile’ link will
            direct you to your account profile where you can edit your details.
                </Panel>
                <Panel header="How can I edit/view my company details?" key="2">
            Selecting the icon on the top right corner of the page will display a drop-down menu.
            Selecting the ‘My company’ link will
            direct you to your company profile where you can edit your details.
                </Panel>
                <Panel header="How can I logout of my account?" key="3">
            Selecting the icon on the top right corner of the page will display a drop-down menu.
            The last option on the list to logout.
                </Panel>
                <Panel header="What languages are available on the toolkit?" key="4">
            The languages currently available on the toolkit are Arabic, German, English, French and Romanian.
                </Panel>
              </Collapse>
            </Box>
          </Col>
        </Row>
      </LayoutWrapper>
    )
  }
}


function mapStateToProps({intl}) {
  const {messages, locale} = intl
  return {messages, locale}
}
export default connect(mapStateToProps, {breadcrumbUpdate})(Helps)
