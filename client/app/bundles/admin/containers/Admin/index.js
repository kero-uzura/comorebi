import React, { Component } from 'react'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import Notifications from 'react-notification-system-redux'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { bindActionCreators } from 'redux'

import Header from '../../components/common/Header'
import Footer from '../../components/common/Footer'
import TabMenu from '../../components/common/TabMenu'
import pageTitle from '../../constants/pageTitle'
import menuItems from '../../constants/menuItems'
import * as Actions from '../../actions'
import setNotifications from '../../actions/setNotifications'

class Admin extends Component {
  componentDidMount() {
    const { actions, initialNotification } = this.props
    if (initialNotification.message) {
      actions.setNotifications(Object.assign({ noTitle: true }, initialNotification))
      actions.clearInitialNotification()
    }
  }
  render() {
    const { children, path, currentAdmin, notifications } = this.props
    return (
      <div className="hero is-fullheight">
        <Helmet title={pageTitle(path)} />
        <Notifications notifications={notifications} />

        <Header admin={currentAdmin} />
        <section className="section" style={{ flexGrow: 1 }}>
          <div className="container">
            <TabMenu
              path={path}
              menuItems={menuItems}
            />
            <ReactCSSTransitionGroup
              component="div"
              className="transition-container"
              transitionName="admin"
              transitionEnterTimeout={300}
              transitionLeaveTimeout={300}
            >
              {children && React.cloneElement(children, { key: path })}
            </ReactCSSTransitionGroup>
          </div>
        </section>
        <Footer />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  path: state.routing.locationBeforeTransitions.pathname,
  currentAdmin: state.main.currentAdmin,
  initialNotification: state.main.initialNotification,
  notifications: state.notifications
})

const mapDispatchToProps = (dispatch) => ({
  actions: {
    ...bindActionCreators(Actions, dispatch),
    setNotifications: bindActionCreators(setNotifications, dispatch)
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Admin)
