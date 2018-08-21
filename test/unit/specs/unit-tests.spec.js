import exampleLibrary from '../../../src/molgenis-js-library-example'
import { expect } from 'chai'

describe('Unit test', () => {
  describe('sum', () => {

    it('should count the total numbers', done => {
      const result = exampleLibrary.exampleMethod()
      expect(result).to.equal(3)
      done()
    })
  })
})
