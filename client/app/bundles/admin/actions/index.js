import 'babel-polyfill'

import { createAction } from 'redux-actions'
import { SubmissionError, getFormValues } from 'redux-form'
import { push } from 'react-router-redux'
import Notifications from 'react-notification-system-redux'

import notificationOptions from './notificationOptions'
import messages from '../constants/messages'
import * as api from '../api'
import * as utils from '../utils'

const rootPath = "/admin"

// ============================================= Simple Actions
export const loading  = createAction('LOADING')
export const complete = createAction('COMPLETE')
export const addTag   = createAction('ADD_TAG')
export const changeFilteringWords      = createAction('CHANGE_FILTERING_WORDS')
export const changeFilteringStatus     = createAction('CHANGE_FILTERING_STATUS')
export const addFilteringCategories    = createAction('ADD_FILTERING_CATEGORIES')
export const deleteFilteringCategories = createAction('DELETE_FILTERING_CATEGORIES')
export const clearFilters              = createAction('CLEAR_FILTERS')

// ============================================= Notifications
export const clearInitialNotification = createAction('CLEAR_INITIAL_NOTIFICATION')
export const setNotifications = (customOptions) => (dispatch) => {
  const options = notificationOptions(customOptions)
  const notificationsByLevel = {
    success: Notifications.success(options),
    info: Notifications.info(options),
    warning: Notifications.warning(options),
    error: Notifications.error(options)
  }
  dispatch(notificationsByLevel[options.level])
}

// ============================================= GET
export const getAllWorks = createAction('GET_ALL_WORKS', api.getAllWorks)
export const getAllWorksAsync = (target) => async (dispatch) => {
  dispatch(loading(target))
  await dispatch(getAllWorks())
  dispatch(complete(target))
}

// ============================================= UPDATE
export const updateAdminRequest = createAction('UPDATE_ADMIN_REQUEST', api.updateAdminRequest)
export const updateAdminSubmit = () => async (dispatch, getState) => {
  const formData = getFormValues('admin')(getState()) || {}
  const loadingTarget = 'updateAdmin'

  dispatch(loading(loadingTarget))
  await dispatch(updateAdminRequest(formData))
  dispatch(complete(loadingTarget))

  const errors = getState().main.errors
  if (errors === '') {
    dispatch(setNotifications(messages.updateAdmin.success()))
  } else {
    dispatch(setNotifications(messages.updateAdmin.error()))
    throw new SubmissionError(errors)
  }
}

export const updateWorkRequest = createAction('UPDATE_WORK_REQUEST', api.updateWorkRequest)
export const updateWorkSubmit = () => async (dispatch, getState) => {
  const state = getState()
  const formData = getFormValues('work')(state) || {}
  const id = utils.getId(state.routing.locationBeforeTransitions.pathname)
  const loadingTarget = 'updateWork'

  dispatch(loading(loadingTarget))
  await dispatch(updateWorkRequest(formData, id))
  dispatch(complete(loadingTarget))

  const errors = getState().main.errors
  if (errors === '') {
    dispatch(setNotifications(messages.updateWork.success(formData.title)))
    dispatch(push(rootPath))
  } else {
    dispatch(setNotifications(messages.updateWork.error(formData.title)))
    throw new SubmissionError(errors)
  }
}

// ============================================= CREATE
export const createWorkRequest = createAction('CREATE_WORK_REQUEST', api.createWorkRequest)
export const createWorkSubmit = () => async (dispatch, getState) => {
  const state = getState()
  const formData = getFormValues('work')(state) || {}
  const loadingTarget = 'createWork'

  dispatch(loading(loadingTarget))
  await dispatch(createWorkRequest(formData))
  dispatch(complete(loadingTarget))

  const errors = getState().main.errors
  if (errors === '') {
    dispatch(setNotifications(messages.createWork.success(formData.title)))
    dispatch(push(rootPath))
  } else {
    dispatch(setNotifications(messages.createWork.error(formData.title)))
    throw new SubmissionError(errors)
  }
}
