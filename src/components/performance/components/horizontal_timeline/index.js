import React, { useRef, useLayoutEffect, useState } from "react";
import ReactTooltip from "react-tooltip";
import {projectStatuses} from '../../../../common/enum/projectStatuses'

const HorizontalTimeline = ({projectStatus, hasGabAnalysis, hasMateriality, hasTargetActions}) => {

	// override temporary
	// projectStatus = projectStatuses.new.value;
	// hasMateriality = true;
	// hasTargetActions=true;

	if (!(hasGabAnalysis != null || hasMateriality != null || hasTargetActions != null)) return null;

	const _items = generateTimeline(projectStatus, hasGabAnalysis, hasMateriality, hasTargetActions);
	var counterRef = 0;
	return (
		<div style={{justifyContent: 'center', margin:100}}>
			<div style={{display: 'flex', justifyContent:'space-around', alignItems:'center', backgroundColor: 'rgb(4, 6, 112)', height: 1.5, margin:0, borderRadius: 8}}>
				{	
					_items.map(({sub, description, title, statusCompleted}, i) => {
						counterRef = sub ? 0 : counterRef + 1
						return (
							<Dot lineHeight={10 * (counterRef + 1)} expand={true} sub={sub} description={description} completed={statusCompleted} title={title} />
						)
					})
				}
				<ReactTooltip />
			</div>	
		</div>
	)
}

const Dot = ({sub, description, title, completed, expand, lineHeight}) => {
	return (
		<div style={{flex:1, backgroundColor: completed ? 'rgb(0, 198, 224)' : 'rgb(4, 6, 112)', height: completed ? 8 : 2, }} >
			{sub ? <p data-tip={description}
			style={{
				width: 20,
				height: 20,
				borderRadius: 10,
				marginTop: completed ? -7 : -9,
				marginLeft: '86%',
				backgroundColor: completed ? 'rgb(0, 198, 224)' : 'rgb(4, 6, 112)',
			}} /> : <div
			style={{marginBottom: 5, ...{
				width: completed ? 8 : 2,
				height: lineHeight,
				marginLeft: '90%',
				backgroundColor: completed ? 'rgb(0, 198, 224)' : 'rgb(4, 6, 112)',
			}}} />}		
			<div style={{width: '100%', paddingLeft: 10, textAlign: 'right', marginTop: 12, fontWeight: sub ? 'bold' : 'inherit', fontSize: sub ? 15 : 12}}>
				{title}
			</div>
		</div>
	)
}

const generateTimeline = (projectStatus, hasGabAnalysis, hasMateriality, hasTargetActions) => {
	const array = [];
	const buildObj = ({title, description, sub, statusCompleted}) => {
		return {
			title: title,
			description: description,
			sub: sub,
			statusCompleted: statusCompleted,
		}
	}

	const {firstAssessmentRequest, firstAssessmentCompleted, secondAssessmentRequest, completed, meterialitysendsurvey, materialitycompleted, finished} = projectStatuses;

	if (hasGabAnalysis) {
		array.push(buildObj({
			title: 'Data input',
			description: projectStatuses.new.label,
			sub: false,
			statusCompleted: [
				projectStatuses.new.value,
				firstAssessmentRequest.value,
				firstAssessmentCompleted.value,
				secondAssessmentRequest.value,
				completed.value,
				meterialitysendsurvey.value,
				materialitycompleted.value,
				finished.value
			].includes(projectStatus),
		}));	
		
		array.push(buildObj({
			title: '1st Documentation Assessment',
			description: firstAssessmentRequest.label,
			sub: false,
			statusCompleted: [
				firstAssessmentRequest.value,
				firstAssessmentCompleted.value,
				secondAssessmentRequest.value,
				completed.value,
				meterialitysendsurvey.value,
				materialitycompleted.value,
				finished.value
			].includes(projectStatus),
		}));

		array.push(buildObj({
			title: '2st Documentation Assessment',
			description: secondAssessmentRequest.label,
			sub: false,
			statusCompleted: [
				secondAssessmentRequest.value,
				completed.value,
				meterialitysendsurvey.value,
				materialitycompleted.value,
				finished.value
			].includes(projectStatus),
		}));
		array.push(buildObj({
			title: 'Gap Analysis COMPLETED',
			description: 'Gap Analysis COMPLETED',
			sub: true,
			statusCompleted: [
				completed.value,
				meterialitysendsurvey.value,
				materialitycompleted.value,
				finished.value
			].includes(projectStatus),
		}));						
	}
	
	if (hasMateriality) {
		array.push(buildObj({
			title: 'Circulation of Stakeholder Survey',
			description: meterialitysendsurvey.label,
			sub: false,
			statusCompleted: [
				meterialitysendsurvey.value,
				materialitycompleted.value,
				finished.value
			].includes(projectStatus),
		}));
		array.push(buildObj({
			title: 'Materiality Assessment COMPLETED',
			description: 'Materiality Assessment COMPLETED',
			sub: true,
			statusCompleted: [
				materialitycompleted.value,
				finished.value
			].includes(projectStatus),
		}));				
	}

	if (hasTargetActions) {
		
		array.push(buildObj({
			title: 'Actions & KPIs COMPLETED',
			description: 'Actions & KPIs COMPLETED',
			sub: true,
			statusCompleted: [
				finished.value
			].includes(projectStatus),
		}));
	}

	return array;
}

export default HorizontalTimeline;
