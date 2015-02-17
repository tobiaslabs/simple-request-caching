var test = require('tape')
var CachedRequest = require('../')

test('default stringify does what we say', function(t) {
	var actual = CachedRequest.stringifyForFlatObjects({
		domain: 'example.com',
		startDate: '2014-01-01',
		endDate: '2014-02-01'
	})
	var expected = JSON.stringify([ 'domain', 'example.com', 'endDate', '2014-02-01', 'startDate', '2014-01-01' ])
	t.equals(expected, actual, 'objects turn into ordered arrays')
	t.end()
})
