import _Promise from 'babel-runtime/core-js/promise';
import 'isomorphic-fetch';
import { merge } from 'lodash';
import FormData from 'form-data';

var defaultOptions = {
  'headers': {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  'credentials': 'same-origin'
};

var isJsonResponse = function isJsonResponse(response) {
  var contentType = response.headers.get('content-type');
  if (!contentType) {
    return false;
  }
  // Ignore case, whitespace and double quotes around charset as per http spec (https://tools.ietf.org/html/rfc7231#section-3.1.1.5)
  var normalizedContentType = contentType.toLowerCase().split(' ').join('').split('"').join('');
  return normalizedContentType === 'application/json' || normalizedContentType === 'application/json;charset=utf-8';
};

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
var handleResponse = function handleResponse(response) {
  if (isJsonResponse(response)) {
    return response.json().then(function (json) {
      return response.ok ? json : _Promise.reject(json);
    });
  } else {
    return response.ok ? response : _Promise.reject(response);
  }
};

var mergeOptions = function mergeOptions(method, options) {
  return merge({ method: method }, defaultOptions, options);
};

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
var get = function get(url, options_) {
  var options = mergeOptions('GET', options_);
  return fetch(url, options).then(handleResponse).then(function (response) {
    return response;
  });
};

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
var post = function post(url, options_) {
  var options = mergeOptions('POST', options_);
  return fetch(url, options).then(handleResponse).then(function (response) {
    return response;
  });
};

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
var put = function put(url, options_) {
  var options = mergeOptions('PUT', options_);
  return fetch(url, options).then(handleResponse).then(function (response) {
    return response;
  });
};

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
var delete_ = function delete_(url, options_) {
  var options = mergeOptions('DELETE', options_);
  return fetch(url, options).then(handleResponse).then(function (response) {
    return response;
  });
};

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
var postFile = function postFile(url, file) {
  var form = new FormData();
  form.append('file', file);

  var options = {
    body: form,
    method: 'POST',
    credentials: 'same-origin'
  };

  return fetch(url, options).then(handleResponse).then(function (response) {
    return response;
  });
};

var molgenisApiClient = { get: get, post: post, put: put, delete_: delete_, postFile: postFile };

export default molgenisApiClient;
//# sourceMappingURL=molgenis-api-client.es.js.map
