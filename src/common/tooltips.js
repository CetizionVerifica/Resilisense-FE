import React from 'react'

const progressBar = (
  <div style={{width: 500}}>
    <p><strong>Progress bars</strong> show the percentage of data input that has been completed per subject matter
(i.e. core subject). Completion refers to the allocation of two scores (performance and
relevance) per parameter (i.e. key consideration). The progress bar will show 100% or the "&#10004;"
icon only when all requested data has been successfully inputted for all key considerations.</p>
    <p>Progress lower than 100% means that there are still key consideration(s) under the specific core
subject for which data input is incomplete. Click on ‘Data input’ and on the relevant Core subject
tab to input the outstanding data; a red flag can be found on the right-hand side of the page
indicating the key consideration for which data input must still be completed.</p>
    <p>A progress bar can also be seen for the entirety of the Gap Analysis stage, across all seven
subject matters.</p>
  </div>
)

const overallPerformanceRelevance = (
  <div style={{width: 500}}>
    <p><strong>Overall company performance and relevance &amp; significance scores</strong> for the
organisation are automatically calculated at the core subject level, according to the overall
scores that are calculated at the issue of interest level.</p>
  </div>
)

const gapEdit = (
  <div style={{width: 500}}>
    <p>Each tab comprises of one of the seven core subjects of the toolkit (i.e.
Organisational Governance, Human Rights, Labour Practices, etc.). By clicking on each tab you
can view the issues of interest and subsequent key considerations that fall under that specific
core subject. For a valid evaluation to be performed, the two scores i.e. 1) company
performance score and 2) relevance &amp; significance score, must be allocated to all key
considerations individually.</p>
  </div>
)

const kpiTooltip = (
  <div style={{width: 500}}>
    <p>On this page you can use the Materiality Matrix to determine which Issues of
Interest you would like to address and then <strong>set a new Action and KPI for that Issue of
Interest</strong>, using the fields on the left-hand side of the page. Hovering over the numbered circles
on the matrix will reveal a pop-up display of the details of the specific Issue of Interest to help
the user.</p>
    <p>You can select the Issue of Interest you’d like to address using the drop-down menu on the
‘Issue of Interest’ field on the left-hand side of the page.</p>
    <p>In the ‘Action’ field you can set the action you require for the selected Issue of Interest.
      In the ‘KPI’ field, you must select a Key Performance Indicator with which performance of the
action for this specific Issue of Interest will be measured. A KPI can be any type of unit you
deem appropriate for measuring the performance of the Action you choose. For example, if the
Action is ‘Increase gender equity’, the an appropriate KPI would be ‘Percentage (%) of female
employees in the workforce’.</p>
    <p>You then have to set the ‘Current Performance’, meaning the organisation’s performance in the
current project’s year e.g. 2019, and the ‘Target Performance’, meaning the performance you
would like to set as a target for the following year e.g. 2020.</p>
    <p>Having filled all the fields on the left-hand side of the page, the new Action and KPI can be
submitted using the ‘Submit’ button on the bottom right corner of the page.</p>
  </div>
)

const kpiMajorIssuesTooltip = (
  <div style={{width: 500}}>
    <p>The table given is an exact representation of the gaps identified through the Gap Analysis performed earlier in
      the project for the Issue of Interest selected above. All key considerations whose Company Performance score is insufficient
      relative to their Relevance & Significance score are considered major issues for an organisation and are therefore brought
      forward to be addressed at an organisation’s discretion by setting Actions & KPIs. In the case where no major issues were
      identified through the Gap Analysis, it is at the organisation’s discretion to set Actions & KPIs to further improve its
      performance on the specific issue of interest</p>
  </div>
)

const newKpi = (
  <div style={{width: 500}}>
    <p>After adding a new Action and KPI using the ‘Set new Action and KPI’ button on
the left-hand side of the page, the new entry will be displayed on the Actions and KPIs list found
below. In the case where projects were carried out in previous years, Actions and KPIs set
previously will be carried over to current projects, for which current and target performance will
have to be entered by pressing on the edit (pencil) icon.</p>
    <p><strong>Baseline Performance</strong> refers to the first recorded performance of the organisation on the
specific Action and KPI. The year for which the Baseline Performance was recorded is
displayed in brackets next to the performance figure. For example, an Action and KPI set during
a project that was carried out in 2016 will have ‘[2016]’ displayed next to the performance figure
that was recorded.</p>
    <p><strong>Current Performance</strong> refers to the performance that is recorded for the organisation for the
current running project. The current year will consequently be displayed in brackets next to the
performance figure.</p>
    <p><strong>Target Performance</strong> refers to the performance set to be achieved for the subsequent year of the
current project’s year. For example, say the current project takes place in year 2019. The Target
Performance will be set for year 2020, therefore ‘[2020]’ will be displayed next to the Target
Performance figure that is set.</p>
  </div>
)

const gapAnalysisTooltip = (
  <div style={{width: 500}}>
    <p><strong>The Gap Analysis Tables result</strong> provide the user with the final pair of company
performance and relevance &amp; significance scores for the organisation, for each key
consideration. These include the relevance &amp; significance score that was inputted by the user
for the specific key consideration, and the final company performance score following any
revisions through the documentation assessment procedure.</p>
  </div>
)

const performanceTooltip = (
  <div style={{width: 500}}>
    <p><strong>The Performance vs. Relevance</strong> result classifies key considerations into major
and minor risks with the colour grading provided, based on data input and the documentation
assessment at the Gap Analysis stage. Hovering over a specific risk will reveal a pop-up
window, showing the risk matrix that is used to determine how major or minor a key consideration is,
and where the specific key consideration is positioned on the risk matrix, based
on the pair of scores (company performance and relevance &amp; significance) achieved.</p>
  </div>
)

const performanceByCoreSubjectTooltip = (
  <div style={{width: 500}}>
    <p><strong>The Performance vs. Relevance by Core Subject</strong> result classifies key
considerations into major and minor risks with the colour grading provided based on data input
and the documentation assessment at the Gap Analysis stage. Hovering over a specific risk will
reveal a pop-up window, showing the risk matrix that is used to determine how major or minor a
key consideration is, and where the specific key consideration is positioned on the risk matrix,
based on the pair of scores (company performance and relevance &amp; significance) achieved.</p>
  </div>
)

const performanceStatusTooltip = (
  <div style={{width: 500}}>
    <p><strong>The Performance vs. Relevance Status Report</strong> result classifies key
considerations into two tables: a) major risks and b) minor risks, and provides a report of the
pair of scores (company performance and relevance &amp; significance) that were achieved for each
key consideration, based on data input and the documentation assessment at the Gap Analysis
stage.</p>
  </div>
)

const overallPerformanceTooltip = (
  <div style={{width: 500}}>
    <p><strong>The Overall Company Performance by Core Subject</strong> result is a table with the
final Overall Company Performance score, as well as the final Overall Relevance &amp; Significance
score and the corresponding weight of each Core Subject for the organisation, by core subject.
These figures are then graphically represented by the pie chart found below, where there is a
piece of the pie for each of the seven Core Subjects. The size of the pie piece is proportional to
its weight and therefore represents the corresponding Core Subject’s final Overall Relevance &amp; Significance score.
The colour of the pie piece represents the corresponding Core Subject’s
final Overall Company Performance score and follows the Performance Colour Grading legend
given on the left of the page. The scores are based on data input and the documentation
assessment at the Gap Analysis stage.’</p>
  </div>
)

const issueOfIntPerformance = (
  <div style={{width: 500}}>
    <p><strong>Overall company performance and relevance &amp; significance scores
calculated automatically at the issue of interest level</strong> are based on the company
performance and relevance &amp; significance scores that are allocated by the user to the relevant
key considerations.</p>
  </div>
)

const companyPerformanceTooltip = (
  <div style={{width: 500}}>
    <p>The <strong>Company Performance score</strong> represents how well the organisation is
currently performing on the specific key consideration. The five score levels available are given
below along with general guidance on what each level signifies:</p>
    <p><strong>0 – Very poor:</strong> Nothing is currently being done by the organisation to address this specific
key consideration.</p>
    <p><strong>1 – Poor:</strong> Little is currently being done by the organisation to address this specific key
consideration.</p>
    <p><strong>2 – Acceptable:</strong> The organisation is only adequately addressing this specific key
consideration.</p>
    <p><strong>3 – Good:</strong> The organisation is addressing this specific key consideration sufficiently.</p>
    <p><strong>4 – Very good:</strong> The organisation is addressing this specific key consideration perfectly. No
further action or resources are required.</p>
  </div>
)

const companyRelevanceTooltip = (
  <div style={{width: 500}}>
    <p>The <strong>Relevance &amp; Significance score</strong> represents the extent to which the specific
key consideration in question is applicable to the organisation. The six score levels available
are given below along with general guidance on what each level signifies:</p>
    <p><strong>0 – N/A:</strong> The key consideration does not apply to the organisation at all.</p>
    <p><strong>1 – Very low:</strong> The key consideration has very low applicability to the organisation.</p>
    <p><strong>2 – Low:</strong> The key consideration has low applicability to the organisation.</p>
    <p><strong>3 – Average:</strong> The key consideration has average applicability to the organisation.</p>
    <p><strong>4 – High:</strong> The key consideration has high applicability to the organisation.</p>
    <p><strong>5 – Very High:</strong> The key consideration has very high applicability to the organisation.</p>
  </div>
)

const noteTooltip = (
  <div style={{width: 500}}>
    <p>The <strong>Note function</strong> can be used for sharing information between multiple users of
the toolkit. These can include details regarding the key consideration and the scores being
allocated on performance and on relevance &amp; significance e.g. performance has been allocated
as ‘good’ because the company has a code of conduct in place.</p>
  </div>
)

const fileTooltip = (
  <div style={{width: 500}}>
    <p><strong>Documentation has to be uploaded</strong> by the user for the majority of key
considerations. The documentation will act as supporting evidence of the performance score
that is allocated by the user for the specific key consideration. A user has the option to a) upload
a new document or b) link to an existing document that has already been uploaded.</p>
    <p>The documentation will be assessed according to four criteria that include i) the authenticity of
the document, ii) how up to date it is, iii) how well communicated the document is, iv) and how
appropriate it is i.e. if it covers the key consideration(s) it has been linked to by the user</p>
  </div>
)

const exportTooltip = (
  <div style={{width: 500}}>
    <p>The <strong>Export function</strong> allows users to download the corresponding result or feature
in PNG format. The downloaded file can then be added to documents such as reports, teasers,
strategies, presentations and other material, as needed.</p>
  </div>
)

const assessmentReportKcTooltip = (
  <div style={{width: 500}}>
    <p>You can revise your documentation before submitting for the second documentation assessment in the
      Data Input page of the Gap Analysis. Please be advised that you should avoid revising existing documentation
      by incorporating assessment feedback, as this is considered untruthful and is identifiable by the assessment
      criteria that are used by the 7 Toolkit. Any such documentation will be rejected.</p>
  </div>
)

export {
  progressBar,
  overallPerformanceRelevance,
  gapEdit,
  kpiTooltip,
  kpiMajorIssuesTooltip,
  newKpi,
  gapAnalysisTooltip,
  performanceTooltip,
  performanceByCoreSubjectTooltip,
  performanceStatusTooltip,
  overallPerformanceTooltip,
  issueOfIntPerformance,
  companyPerformanceTooltip,
  companyRelevanceTooltip,
  noteTooltip,
  fileTooltip,
  exportTooltip,
  assessmentReportKcTooltip,
}
