function SimpleRequestCaching(options) {
	if (!options || typeof options.cacheMillis !== 'number' || !options.request) {
		throw new Error('SimpleRequestCaching requires the options object: {cacheMillis, request}')
	}
	options.stringify = options.stringify || SimpleRequestCaching.stringifyForFlatObjects

	var previousRequests = {}
	return function makeRequest(request) {
		var requestString = options.stringify(request)
		var previousRequest = previousRequests[requestString]
		var promise
		if (!previousRequest || SimpleRequestCaching.hasExpired(previousRequest.requested, new Date(), options.cacheMillis)) {
			previousRequests[requestString] = {
				requested: new Date(),
				promise: options.request(request)
			}
			previousRequest = previousRequests[requestString]
			if (options.cacheMillis >= 0) {
				setTimeout(function destroyCachedRequest() {
					delete previousRequests[requestString]
				}, options.cacheMillis)
			}
		}
		return previousRequest.promise
	}
}

SimpleRequestCaching.stringifyForFlatObjects = function stringifyForFlatObjects(obj) {
	return JSON.stringify(Object.keys(obj).sort().reduce(function(ary, key) {
		return ary.concat([key, obj[key]])
	}, []))
}

SimpleRequestCaching.hasExpired = function hasExpired(previousRequestDate, now, millis) {
	if (millis < 0) {
		return false
	} else {
		var expireDate = new Date(previousRequestDate.getTime() + millis)
		return expireDate.getTime() < now.getTime()
	}
}

module.exports = SimpleRequestCaching
