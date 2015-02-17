var moment = require('moment')
var test = require('tape')
var CachedRequest = require('../')

test('old requests expire', function(t) {
	var now = new Date()
	var previousRequestDate = dateMillisAgo(now, 1000)
	var cacheLengthInMillis = 500
	t.ok(CachedRequest.hasExpired(previousRequestDate, now, cacheLengthInMillis), 'the request should have expired')
	t.end()
})

test('good requests do not expire', function(t) {
	var now = new Date()
	var previousRequestDate = dateMillisAgo(now, 1000)
	var cacheLengthInMillis = 1500
	t.notOk(CachedRequest.hasExpired(previousRequestDate, now, cacheLengthInMillis), 'the request should not have expired')
	t.end()
})

test('requests on the exact time do not expire', function(t) {
	var now = new Date()
	var previousRequestDate = dateMillisAgo(now, 1000)
	var cacheLengthInMillis = 1000
	t.notOk(CachedRequest.hasExpired(previousRequestDate, now, cacheLengthInMillis), 'the request should not have expired')
	t.end()
})

test('when cache length is LT 0 requests never expire', function(t) {
	var now = new Date()
	var previousRequestDate = dateMillisAgo(now, 1000)
	var cacheLengthInMillis = -1
	t.notOk(CachedRequest.hasExpired(previousRequestDate, now, cacheLengthInMillis), 'the request should not have expired')
	t.end()
})

function dateMillisAgo(now, millis) {
	return new Date(now.getTime() - millis)
}
