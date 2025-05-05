import {orderBy, maxBy, minBy, filter, find, get, round, meanBy, groupBy, uniq} from 'lodash'
import {companySectors, companyTypes} from '../../../common/enum/companySectors'
import {projectStatuses} from '../../../common/enum/projectStatuses'
import {countries} from '../../../common/enum/countries'
import {getlevelOfImpact, between} from '../../../common/rankingUtils'

const rankSupplier = suppliers => {
  if (suppliers.length === 0) {
    return []
  }

  const maxRelevance = maxBy(suppliers, 'gapAnalysis.relevance') || {gapAnalysis: {relevance: 0}}
  const minRelevance = minBy(suppliers, 'gapAnalysis.relevance') || {gapAnalysis: {relevance: 0}}

  const avg = getlevelOfImpact(
    maxRelevance.gapAnalysis.relevance,
    minRelevance.gapAnalysis.relevance)

  const suppliersImpact = suppliers.map(project => {
    const pro = {...project}

    if (pro.status !== 'FirstAssessmentCompleted' || pro.status !== 'Completed') {
      pro.impact = '-'
    } else if (between(project.gapAnalysis.relevance, avg[0], avg[1])) {
      pro.impact = 'Low'
    } else if (between(project.gapAnalysis.relevance, avg[1], avg[2])) {
      pro.impact = 'Medium'
    } else {
      pro.impact = 'High'
    }
    return pro
  })

  return orderBy(suppliersImpact, ['gapAnalysis.weightedPerformance'], ['asc'])
}

const filterSuppliers = (suppliers, country, year, industry, impact, selectedRegion) => {
  let filteredSuppliers = [...suppliers]

  if (selectedRegion) {
    filteredSuppliers = filter(filteredSuppliers, sup => {
      const supplierCountry = find(countries, {value: sup.country})
      return supplierCountry && supplierCountry.region === selectedRegion
    })
  }

  if (country) {
    filteredSuppliers = filter(filteredSuppliers, {country: country})
  }

  if (year) {
    filteredSuppliers = filter(filteredSuppliers, {requestedYear: Number(year)})
  }

  if (industry) {
    filteredSuppliers = filter(filteredSuppliers, {companyType: industry})
  }

  if (impact) {
    filteredSuppliers = filter(filteredSuppliers, {impact: impact})
  }

  return filteredSuppliers
}

const getSuppliers = (companyId, suppliers, formatMessage, forceshowResults = false) => {
  const dataSource = suppliers || []
  const resultSuppliers = []

  dataSource.forEach(supplier => {
    const partnerRequestedProjects = supplier.projects.map(project => {

      const coreSubjects = get(project.gapAnalysis, 'coreSubjects')
      let overallPerformance = 0
      let overallRelevance = 0
      let showResults = false

      if (project.status === projectStatuses.firstAssessmentCompleted.value || project.status === projectStatuses.completed.value) {
        overallPerformance = get(project.gapAnalysis, 'weightedPerformance')
        overallRelevance = get(project.gapAnalysis, 'relevance')
        showResults = true
      } 
      else if (forceshowResults) {
        // CSR-98
        overallPerformance = get(project.gapAnalysis, 'weightedPerformance')
        overallRelevance = get(project.gapAnalysis, 'relevance')  
        showResults = true
        ///////////////////////
      }

      let industry = '-'

      if (project.company.sector && project.company.type) {
        industry = `${formatMessage(companySectors[project.company.sector].localization)} / ${formatMessage(companyTypes[project.company.type].localization)}`
      }

      const supplierProperties = find(project.supplierProperties, {supplier: supplier.id})

      return {
        id: companyId,
        companyId: project.company.id,
        gapAnalysis: project.gapAnalysis,
        agencyName: supplier.agency.name,
        agencyId: supplier.agency.id,
        partnerCompanyName: project.company.name,
        requestedYear: project.year,
        project: project.title,
        status: project.status,
        showResults: showResults,
        country: project.company.country || '-',
        sector: project.company.sector,
        companyType: project.company.type,
        industry: industry,
        projectId: project.id,
        fullAccessToResults: get(supplierProperties, 'fullAccessToResults'),
        physicalAudit: get(supplierProperties, 'physicalAudit'),
        supplierId: supplier.id,
        coreSubjects: coreSubjects || [],
        overallPerformanceValue: overallPerformance,
        overallRelevanceValue: overallRelevance,
        overallPerformance: typeof overallPerformance === 'number' ? `${overallPerformance}%` : '-',
        overallRelevance: typeof overallRelevance === 'number' ? `${overallRelevance}%` : '-',
        contactName: project.company.personName,
        contactPosition: project.company.jobPosition,
        contactEmail: project.company.personEmail,
      }
    })

    resultSuppliers.push(...partnerRequestedProjects)
  })

  return resultSuppliers
}

const getGraphOption = (totalSuppliers, property, yAxisName, seriesName, title) => {
  const years = uniq(totalSuppliers.map(s => {return s.requestedYear})).sort()
  const groupedTotalSuppliers = groupBy(totalSuppliers, 'requestedYear')

  const data = years.map(key => round(meanBy(groupedTotalSuppliers[key], property) || 0, 1))

  return {
    title: {
      subtext: title,
      x: 'center',
    },
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      data: years.map(y => `${y} (${groupedTotalSuppliers[y].length} suppliers)`),
      type: 'category',
      boundaryGap: false,
      name: 'Year',
      nameLocation: 'center',
    },
    yAxis: {
      max: 100,
      name: yAxisName,
      nameLocation: 'middle',
      nameTextStyle: {
        padding: 30,
      },
    },
    series: {
      name: seriesName,
      type: 'line',
      data,
    },
  }
}

const getConformingProjects = options => {
  const {
    suppliers,
    coreSubject,
    issueOfInterest,
    scoreFilter,
    scorePercentMin,
    scorePercentMax,
  } = options

  // console.log("Confirming projects:", suppliers);

  return suppliers.map(supplier => {
    const pro = {...supplier, conforming: true}

    if (scoreFilter === 'overall') {
      const supplierPerformance = get(pro, 'overallPerformanceValue', 0)
      pro.conforming = supplierPerformance <= scorePercentMax && supplierPerformance >= scorePercentMin
    } else if (coreSubject && scoreFilter === 'coreSubject') {
      const subject = find(pro.coreSubjects, {coreSubject: coreSubject})
      const coreSubjectPerformance = get(subject, 'performanceValue', 0) * 100
      pro.conforming = coreSubjectPerformance <= scorePercentMax && coreSubjectPerformance >= scorePercentMin
    } else if (issueOfInterest && issueOfInterest.length > 0 && scoreFilter === 'coreSubject') {
      const subject = find(pro.coreSubjects, {coreSubject: issueOfInterest[0]})
      let issueOfInterestPerformance = 0

      if (subject) {
        const issue = find(subject.issueOfInterests, {issueOfInterest: issueOfInterest[1]})
        issueOfInterestPerformance = get(issue, 'performanceValue', 0) * 100
      }

      pro.conforming = pro.conforming && (issueOfInterestPerformance <= scorePercentMax && issueOfInterestPerformance >= scorePercentMin)
    }

    return pro
  })
}

const filterConformingProjects = options => {

  const suppliers = getConformingProjects(options)

  return filter(suppliers, {conforming: true})
}

export {rankSupplier, filterSuppliers, getSuppliers, getGraphOption, getConformingProjects, filterConformingProjects}
