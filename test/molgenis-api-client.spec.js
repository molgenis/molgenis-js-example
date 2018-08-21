import 'isomorphic-fetch'
import api from '../src/molgenis-api-client'
import fetchMock from 'fetch-mock'
import { expect } from 'chai'

const assertEquals = (actual, expected) => {
  expect(actual).to.equal(expected)
}

const assertDeepEquals = (actual, expected) => {
  expect(actual).to.deep.equal(expected)
}

describe('Client Api', () => {
  describe('get', () => {
    afterEach(fetchMock.restore)

    it('should return the server response when content type is not json', done => {
      const response = {
        headers: {
          'content-type': 'my type'
        }
      }

      fetchMock.get('https://test.com/molgenis-test/get-something', response)
      const get = api.get('https://test.com/molgenis-test/get-something')

      get.then(res => assertEquals(res.status, 200)).then(done)
    })

    it('should return the server response json when content type is json', done => {
      const resultBody = {foo: 'bar'}
      const response = {
        headers: {
          'content-type': 'application/json"'
        },
        body: resultBody
      }

      fetchMock.get('https://test.com/molgenis-test/get-something', response)
      const get = api.get('https://test.com/molgenis-test/get-something')

      get.then(res => assertDeepEquals(res, resultBody)).then(done)
    })

    it('should return the server response json when content type is json with encoding', done => {
      const resultBody = {foo: 'bar'}
      const response = {
        headers: {
          'content-type': 'application/JSON; charset="utf-8"'
        },
        body: resultBody
      }

      fetchMock.get('https://test.com/molgenis-test/get-something', response)
      const get = api.get('https://test.com/molgenis-test/get-something')

      get.then(res => assertDeepEquals(res, resultBody)).then(done)
    })

    it('should return the server response json when content type is json with encoding and no white space before charset', done => {
      const resultBody = {foo: 'bar'}
      const response = {
        headers: {
          'content-type': 'application/json;charset=utf-8'
        },
        body: resultBody
      }

      fetchMock.get('https://test.com/molgenis-test/get-something', response)
      const get = api.get('https://test.com/molgenis-test/get-something')

      get.then(res => assertDeepEquals(res, resultBody)).then(done)
    })

    it('should reject the server response when response type is not json and not ok', done => {
      fetchMock.get('https://test.com/molgenis-test/get-something-not-ok', 400)
      const get = api.get('https://test.com/molgenis-test/get-something-not-ok')

      get.catch(res => assertEquals(res.status, 400)).then(done)
    })

    it('should reject the server response json and return the first error when content type is json but the request is not ok', done => {
      const resultBody = {
        errors: [{message: 'its an error'}]
      }

      const response = {
        status: 400,
        headers: {
          'content-type': 'application/json'
        },
        body: resultBody
      }

      fetchMock.get('https://test.com/molgenis-test/get-something-not-ok', response)
      const get = api.get('https://test.com/molgenis-test/get-something-not-ok')

      get.catch(res => assertDeepEquals(res, {errors: [{message: 'its an error'}]})).then(done)
    })
  })

  describe('post', () => {
    afterEach(fetchMock.restore)

    const data = {
      items: ['1', '2'],
      status: 'SUCCESS'
    }

    const options = {
      body: JSON.stringify(data)
    }

    it('should return server status OK when post is successful', done => {
      fetchMock.post('https://test.com/molgenis-test/post-something', 200)
      const post = api.post('https://test.com/molgenis-test/post-something', options)

      post.then(res => assertEquals(res.status, 200)).then(done)
    })

    it('should return an error when post failed', done => {
      const resultBody = {
        errors: [{message: 'its an error'}]
      }

      const response = {
        status: 400,
        headers: {
          'content-type': 'application/json'
        },
        body: resultBody
      }

      fetchMock.post('https://test.com/molgenis-test/post-something-not-ok', response)
      const post = api.post('https://test.com/molgenis-test/post-something-not-ok', 'test.txt')

      post.catch(res => assertDeepEquals(res, {errors: [{message: 'its an error'}]})).then(done)
    })
  })

  describe('put', () => {
    afterEach(fetchMock.restore)

    const data = {
      items: ['1', '2'],
      status: 'SUCCESS'
    }

    const options = {
      body: JSON.stringify(data)
    }

    it('should return server status OK when put is successful', done => {
      fetchMock.put('https://test.com/molgenis-test/put-something', 200)
      const put = api.put('https://test.com/molgenis-test/put-something', options)

      put.then(res => assertEquals(res.status, 200)).then(done)
    })

    it('should return an error when put failed', done => {
      const resultBody = {
        errors: [{message: 'its an error'}]
      }

      const response = {
        status: 400,
        headers: {
          'content-type': 'application/json'
        },
        body: resultBody
      }

      fetchMock.put('https://test.com/molgenis-test/put-something-not-ok', response)
      const put = api.put('https://test.com/molgenis-test/put-something-not-ok', options)

      put.catch(res => assertDeepEquals(res, {errors: [{message: 'its an error'}]})).then(done)
    })
  })

  describe('delete', () => {
    afterEach(fetchMock.restore)

    it('should return server status NO CONTENT when delete is successful', done => {
      fetchMock.delete('https://test.com/molgenis-test/delete-something', 204)
      const delete_ = api.delete_('https://test.com/molgenis-test/delete-something')

      delete_.then(res => assertEquals(res.status, 204)).then(done)
    })

    it('should return an error when delete failed', done => {
      const resultBody = {
        errors: [{message: 'its an error'}]
      }

      const response = {
        status: 400,
        headers: {
          'content-type': 'application/json'
        },
        body: resultBody
      }

      fetchMock.delete('https://test.com/molgenis-test/delete-something-not-ok', response)
      const delete_ = api.delete_('https://test.com/molgenis-test/delete-something-not-ok')

      delete_.catch(res => assertDeepEquals(res, {errors: [{message: 'its an error'}]})).then(done)
    })
  })

  describe('postFile', () => {
    afterEach(fetchMock.restore)

    it('should return a Job URL when post is successful', done => {
      const response = {
        headers: {
          'content-type': 'application/json'
        },
        body: {
          text: '/api/v2/job/test'
        }
      }

      fetchMock.post('https://test.com/molgenis-test/post-something', response)
      const post = api.postFile('https://test.com/molgenis-test/post-something', 'test.txt')

      post.then(res => assertEquals(res.text, '/api/v2/job/test')).then(done)
    })

    it('should return an error when post failed', done => {
      const resultBody = {
        errors: [{message: 'its an error'}]
      }

      const response = {
        status: 400,
        headers: {
          'content-type': 'application/json'
        },
        body: resultBody
      }

      fetchMock.post('https://test.com/molgenis-test/post-something-not-ok', response)
      const post = api.post('https://test.com/molgenis-test/post-something-not-ok', 'test.txt')

      post.catch(res => assertDeepEquals(res, {errors: [{message: 'its an error'}]})).then(done)
    })
  })
})
