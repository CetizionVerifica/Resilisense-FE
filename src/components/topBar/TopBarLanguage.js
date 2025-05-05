import React, {Component} from 'react'
//import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {values} from 'lodash'
import {Popover, Avatar, message} from 'antd'
import {graphql} from 'react-apollo'
import {languageUser} from '../../graphql/userMutation'
//import IntlMessages from '../utility/intlMessages'
import {languages} from '../../common/enum'
import {localeSwitch} from '../../actions'
import TopbarDropdownWrapper from './topbarDropdown.style'

class TopBarLanguage extends Component {
  constructor(props) {
    super(props)
    this.handleVisibleChange = this.handleVisibleChange.bind(this)
    this.hide = this.hide.bind(this)
    this.state = {
      visible: false,
    }
  }
  hide() {
    this.setState({visible: false})
  }
  handleVisibleChange() {
    this.setState({visible: !this.state.visible})
  }
  setLocale = (lang) => {
    const {currentUser, localeSwitch} = this.props
    this.setState({loading: true})
    this.props.mutate({
      variables: {
        id: currentUser._id,
        lang,
      },
    }).then(({data}) => {
      message.success('Processing complete!')
      localeSwitch(data.updateLanguageUser.lang)
      this.setState({loading: false, visible: false})

    })
  };
  render() {
    const {locale} = this.props
    const content = (
      <TopbarDropdownWrapper className="isoUserDropdown">
        {values(languages).map(lang => {
          return (
            <a className="isoDropdownLink"
              key={lang.key} onClick={() => this.setLocale(lang.key)}
            >
              <img
                src={`../images/flags/${lang.key}.svg`}
                style={{width: 20, height: 20, marginRight: 10}}
                alt={lang.label}
              />
              {lang.native}
            </a>)
        })}
      </TopbarDropdownWrapper>
    )

    return (
      <Popover
        content={content}
        trigger="click"
        visible={this.state.visible}
        onVisibleChange={this.handleVisibleChange}
        arrowPointAtCenter
        placement="bottomLeft"
      >
        <div className="isoImgWrapper">
          <Avatar
            size="small"
            src={`../images/flags/${locale || 'en'}.svg`}
          />
        </div>
      </Popover>
    )
  }
}

const TopBarLanguageQL = graphql(languageUser)(TopBarLanguage)


export default connect(null, {localeSwitch})(TopBarLanguageQL)
