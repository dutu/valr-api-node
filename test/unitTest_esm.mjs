import chai from 'chai'
const expect = chai.expect

import  Valr from '../dist/index.mjs'

describe('Unit Test - ESM', function () {
  describe("Constructor", function () {
    it('should create a new instance', function () {
      const valr = new Valr({key: process.env.APIKEY, secret: process.env.APISECRET})
      expect(valr).to.be.an.instanceOf(Valr)
    })
  })
})

