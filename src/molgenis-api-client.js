import 'isomorphic-fetch'
import { merge } from 'lodash'
import FormData from 'form-data'

const defaultOptions = {
  'headers': {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  'credentials': 'same-origin'
}

const isJsonResponse = (response) => {
  const contentType = response.headers.get('content-type')
  if (!contentType) {
    return false
  }
  // Ignore case, whitespace and double quotes around charset as per http spec (https://tools.ietf.org/html/rfc7231#section-3.1.1.5)
  const normalizedContentType = contentType.toLowerCase().split(' ').join('').split('"').join('')
  return normalizedContentType === 'application/json' || normalizedContentType === 'application/json;charset=utf-8'
}

/**
 * Handle the JSON response from the server.
 *
 * When an error occurs a default ErrorResponse from the server is returned.
 * This ErrorResponse returns an array of errors and error-codes
 *
 * Example errorResponse
 * @example
 * {"errors":
 *   [
 *     {
 *       "message":"Group name 'test' is not a available, please choose a different group name.",
 *       "code":"DS16"
 *     }
 *   ]
 * }
 *
 * note: there could be more than one error
 *
 */
const handleResponse = (response) => {
  if (isJsonResponse(response)) {
    return response.json().then(json => response.ok ? json : Promise.reject(json))
  } else {
    return response.ok ? response : Promise.reject(response)
  }
}

const mergeOptions = (method, options) => {
  return merge({method: method}, defaultOptions, options)
}

/**
 * Get a JSON object from the server
 * Uses your session ID to authenticate
 *
 * @example <caption>Example of how to use the get method</caption>
 * // Handle a promise from calling /api/v2/EntityType
 * get('/api/v2/EntityType').then(response => {...}, error => {...}))
 *
 * @example <caption>Example of how to use the get method with an added option</caption>
 * // Handle a promise from calling /api/v2/EntityType with different content type
 * get('/api/v2/EntityType', { headers: { 'Content-type': 'text' } }).then(response => {...}, error => {...})
 *
 * @param url The URL to post to e.g. /api/v2/my_data_set
 * @param options_ An object containing additional options like headers or body
 */
const get = (url, options_) => {
  const options = mergeOptions('GET', options_)
  return fetch(url, options).then(handleResponse).then(response => response)
}

/**
 * Post a body of data to the server
 * Uses your session ID to authenticate
 *
 * @example <caption>Example of how to use the post method</caption>
 * // Post a data object and handle the response
 * const data = {
 *  items: ['1', '2'],
 *  id: 'example'
 * }
 *
 * const options = {
 *  body: data
 * }
 *
 * post('api/v2/PostData', options).then(response => {...}, error => {...})
 *
 * @param url
 * @param options_
 */
const post = (url, options_) => {
  const options = mergeOptions('POST', options_)
  return fetch(url, options).then(handleResponse).then(response => response)
}

/**
 * Put a body of data to the server
 * Uses your session ID to authenticate
 *
 * @example <caption>Example of how to use the post method</caption>
 * // Put a data object and handle the response
 * const data = {
 *  items: ['1', '2'],
 *  id: 'example'
 * }
 *
 * const options = {
 *  body: data
 * }
 *
 * put('api/v2/PostData', options).then(response => {...}, error => {...})
 *
 * @param url
 * @param options_
 */
const put = (url, options_) => {
  const options = mergeOptions('PUT', options_)
  return fetch(url, options).then(handleResponse).then(response => response)
}

/**
 * Call a delete method on the server
 * Uses your session ID to authenticate
 *
 * @example <caption>Example of how to use the delete_ method</caption>
 * // Handle the response from calling DELETE on /api/v2/deleteById/1
 * delete_('/api/v2/deleteById/1').then(response => {...}, error => {...})
 *
 * @param url
 * @param options_
 */
const delete_ = (url, options_) => {
  const options = mergeOptions('DELETE', options_)
  return fetch(url, options).then(handleResponse).then(response => response)
}

/**
 * Post a file to the server
 * FormData is created with a 'file' parameter. A POST is then automatically created.
 * Uses your session ID to authenticate
 *
 * Expects the response from the server to contain a Job URL
 *
 * @example <caption>Example of how the use the postFile method</caption>
 * // Post a file and handle the response
 * postFile('/plugin/one-click-importer/upload', myAwesomeFile).then(response => {...}, error => {...})
 *
 * @param url
 * @param file
 */
const postFile = (url, file) => {
  const form = new FormData()
  form.append('file', file)

  const options = {
    body: form,
    method: 'POST',
    credentials: 'same-origin'
  }

  return fetch(url, options).then(handleResponse).then(response => response)
}

export default {get, post, put, delete_, postFile}
