import React from 'react'
import {connect} from 'react-redux'
import UserLicenseModal from './UserLicenseModal'
import RemainingSettingsModal from './RemainingSettingsModal'
import PartnerDisclaimerModal from './PartnerDisclaimerModal'
import IncorporateSurveyResultsModal from './IncorporateSurveyResultsModal'
import SupplierRequestDisclaimerModal from './SupplierRequestDisclaimerModal'
import SurveyPreviewModal from './SurveyPreviewModal'


const modalLookup = {
  UserLicenseModal,
  RemainingSettingsModal,
  PartnerDisclaimerModal,
  IncorporateSurveyResultsModal,
  SupplierRequestDisclaimerModal,
  SurveyPreviewModal,
}

const mapState = (state) => ({
  currentModal: state.modals,
})

const ModalManager = ({currentModal}) => {
  let renderedModal

  if (currentModal) {
    const {modalType, modalProps} = currentModal
    const ModalComponent = modalLookup[modalType]

    renderedModal = <ModalComponent {...modalProps} />
  }
  return <span>{renderedModal}</span>
}

export default connect(mapState)(ModalManager)
