var test = require('tape')
var Promise = require('promise')
var CachedRequest = require('../')

test('request with no previous requests makes new request', function(t) {
	var request = new CachedRequest({
		cacheMillis: 500,
		request: function(params) {
			return Promise.resolve('result')
		}
	})
	request({ key: 'value' }).then(function(data) {
		t.equal(data, 'result', 'the response should have the correct data')
		t.end()
	})
})

test('request with unexpired previous request returns old data', function(t) {
	var requestCounter = 0
	var request = new CachedRequest({
		cacheMillis: 1000,
		request: function(params) {
			return new Promise(function(resolve) {
				requestCounter++
				resolve(requestCounter)
			})
		}
	})
	request({ key: 'value' }).then(function(data) {
		t.equal(data, 1, 'the first request increments the counter')
		request({ key: 'value' }).then(function(data) {
			t.equal(data, 1, 'the second request is cached so it does not')
			request({ key: 'value' }).then(function(data) {
				t.equal(data, 1, 'just to be clear, the third request is also cached')
				t.end()
			})
		})
	})
})

test('request with expired previous request makes new request', function(t) {
	var requestCounter = 0
	var request = new CachedRequest({
		cacheMillis: 0,
		request: function(params) {
			return new Promise(function(resolve) {
				requestCounter++
				resolve(requestCounter)
			})
		}
	})
	request({ key: 'value' }).then(function(data) {
		t.equal(data, 1, 'the first request increments the counter')
		setTimeout(function() {
			request({ key: 'value' }).then(function(data) {
				t.equal(data, 2, 'the second request is not cached so it also increments')
				setTimeout(function() {
					request({ key: 'value' }).then(function(data) {
						t.equal(data, 3, 'and so on for the third')
						t.end()
					})
				}, 20)
			})
		}, 20)
	})
})

test('request with unexpired and then expired requests', function(t) {
	var requestCounter = 0
	var request = new CachedRequest({
		cacheMillis: 20,
		request: function(params) {
			return new Promise(function(resolve) {
				requestCounter++
				resolve(requestCounter)
			})
		}
	})
	request({ key: 'value' }).then(function(data) {
		t.equal(data, 1, 'the first request increments the counter')
		request({ key: 'value' }).then(function(data) {
			t.equal(data, 1, 'the second request is cached so it does not increment')
			setTimeout(function() {
				request({ key: 'value' }).then(function(data) {
					t.equal(data, 2, 'the third request is expired so it increments')
					t.end()
				})
			}, 40)
		})
	})
})

test('request when cached forever', function(t) {
	var requestCounter = 0
	var request = new CachedRequest({
		cacheMillis: -1,
		request: function(params) {
			return new Promise(function(resolve) {
				requestCounter++
				resolve(requestCounter)
			})
		}
	})
	request({ key: 'value' }).then(function(data) {
		t.equal(data, 1, 'the first request increments the counter')
		request({ key: 'value' }).then(function(data) {
			t.equal(data, 1, 'the second request is cached so it does not increment')
			setTimeout(function() {
				request({ key: 'value' }).then(function(data) {
					t.equal(data, 1, 'the third request is still cached')
					t.end()
				})
			}, 40)
		})
	})
})

test('request with unexpired previous request that had been rejected', function(t) {
	var requestCounter = 0
	var request = new CachedRequest({
		cacheMillis: 1000,
		request: function(params) {
			return new Promise(function(resolve, reject) {
				requestCounter++
				reject(requestCounter)
			})
		}
	})
	request({ key: 'value' }).then(function success(){}, function(count) {
		t.equal(count, 1, 'the counter should be incremented')
		setTimeout(function() {
			request({ key: 'value' }).then(function success(){}, function(count) {
				t.equal(count, 2, 'the counter should be incremented because the request should not be cached')
				t.end()
			})
		})
	})
})
