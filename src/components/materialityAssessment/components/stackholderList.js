import React from 'react'
import {Tag, Tooltip} from 'antd'
import {find, get, round} from 'lodash'
import StackholderListtWrapper from './StackholderList.style'

const tags = [
  'Friend',
  'Family',
  'Colleague',
  'Teachers',
  'Students',
  'ClassMates',
]
const tagColor = [
  '#CD3131',
  '#74B49B',
  '#0962EA',
  '#141829',
  '#FFCD38',
  '#61105E',
]
const GroupClass = ['-', 'C', 'B', 'A']


export default function stackholderList(
  companyStakholders,
  materialityStakholders,
  selectedStakeholder,
  selectStakeholder,
  toggleListVisible
) {
  const renderSingleStackholder = (stakeholder, key) => {
    const stakeholderMateriality = find(materialityStakholders, (o) =>
      get(o.stakeholder, 'id') === get(stakeholder, 'id'))

    const onClick = () => {
      selectStakeholder(stakeholder.id)
      if (toggleListVisible) {
        toggleListVisible()
      }
    }

    const activeClass = stakeholder.id === selectedStakeholder ? 'activeMail' : ''
    const unreadClass = !stakeholder.read ? 'unreadMail' : ''
    const tagOption = stakeholder.tags ? tagColor[tags.findIndex(tags => tags === stakeholder.tags)]
      : 'transparent'
    const groupXFactor = get(stakeholderMateriality, 'groupXFactor', 0)

    return (
      <div
        key={`list${key}`}
        onClick={onClick}
        className={`${activeClass} ${unreadClass} isoMailList`}
      >
        <span
          className="isoLabelIndicator"
          style={{borderTopColor: tagOption}}
        />


        <div className="isoMailInfo">
          <div className="infoHead">
            <p className="isoRecipents">{stakeholder.name}</p>
            <span className="isoReceiveDate">
              {!stakeholder.isCompany && <Tooltip placement="top" title="Class ">
                <Tag color={stakeholder.prograss === 100 ? 'green' : 'blue'} >
                  {GroupClass[groupXFactor]}
                </Tag>
              </Tooltip>}
              <Tooltip placement="top" title="Credits">
                <Tag color={stakeholder.prograss === 100 ? 'green' : 'green'} >
                  {round(get(stakeholderMateriality, 'credits', 0), 2) }</Tag>
              </Tooltip>
              <Tooltip placement="top" title="Weight">
                <Tag color={stakeholder.prograss === 100 ? 'green' : 'green'} >
                  {round(get(stakeholderMateriality, 'weightValue', 0) * 100, 2) }
                 %</Tag>
              </Tooltip>


            </span>

          </div>
          <p className="isoSubject">{stakeholder.companyName}</p>
        </div>
      </div>
    )
  }
  return (
    <StackholderListtWrapper className="isoMailListWrapper">
      {companyStakholders.map((stakeholder, index) => renderSingleStackholder(stakeholder, index))}
    </StackholderListtWrapper>
  )
}
