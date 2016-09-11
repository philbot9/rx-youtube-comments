import cheerio from 'cheerio'
import requestImport from './request'
import { buildWatchFragmentsUrl } from './url-builder'

export default function (videoId, session, deps = {}) {
  if (!videoId) {
    return Promise.reject('Missing first parameter: videoId')
  }
  if (!session) {
    return Promise.reject('Missing second parameter: session')
  }

  const { request = requestImport } = deps
  return fetchCommentsFragment(videoId, session, request)
    .then(extractPageToken)
}

export function fetchCommentsFragment (videoId, session, request) {
  if (!videoId) {
    return Promise.reject('Missing first parameter: videoId')
  }
  if (!session) {
    return Promise.reject('Missing second parameter: session')
  }
  if (!request) {
    return Promise.reject('Missing third parameter: request')
  }

  const { sessionToken, commentsToken } = session
  if (!sessionToken) {
    return Promise.reject('Missing "sessionToken" in session parameter')
  }
  if (!commentsToken) {
    return Promise.reject('Missing "commentsToken" in session parameter')
  }

  const url = buildWatchFragmentsUrl(videoId, commentsToken)
  const form = { session_token: sessionToken }

  return request({
    method: 'POST',
    json: true,
    url,
    form
  })
}

export function extractPageToken (response) {
  if (!response) {
    throw new Error('Missing parameter: response')
  }

  const html = response['watch-discussion']
  if (!html) {
    throw new Error('Missing field in response: watch-discussion')
  }

  const $ = cheerio.load(html)
  const $btn = $('button[data-menu_name="newest-first"]')
  if (!$btn.length) {
    throw new Error('Cannot find page token button element.')
  }

  const pageToken = $btn.attr('data-token')
  if (!pageToken) {
    throw new Error('Button element is missing the data-token attribute.')
  }
  return pageToken
}