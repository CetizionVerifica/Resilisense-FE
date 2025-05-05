import {connect} from 'react-redux'
import {IntlProvider} from 'react-intl-redux'

function mapStateToProps({app}) {
  const {locale, messages} = app
  return {
    locale: locale, // use 'nb' beacuse intl has locale data for nb instead of no
    messages: messages[locale],
    defaultLocale: 'en',
  }
}

export default connect(mapStateToProps)(IntlProvider)
