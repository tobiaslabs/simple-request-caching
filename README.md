# simple-request-caching [![Build Status](https://travis-ci.org/tobiaslabs/simple-request-caching.svg?branch=master)](https://travis-ci.org/tobiaslabs/simple-request-caching)

[![NPM](https://nodei.co/npm/simple-request-caching.png)](https://nodei.co/npm/simple-request-caching/)

A very simple caching approach for requests.

## install

There are no external dependencies for the code, so feel free to copy+paste it into whatever framework
you are using (e.g., [here's an Angular example](https://gist.github.com/saibotsivad/84d8faf3c8351c89ea3b)).
Otherwise, install using:

	npm install simple-request-caching

## using

The basic setup is this:

	var CachedRequest = require('simple-request-caching')

	var request = new CachedRequest({
		cacheMillis: 500, // the millis that the request is cached, or -1 for forever
		request: function(params) {
			return http.get('/url/path', params)
		}
	})

Set a single one of those up for any request you want to cache, then use it like:

	request({ key: 'value' }).then(function(data) {
		// the response from the http.get(), as a promise
	})

## api

When you make a new `CachedRequest`, it has the following parameters:

* `cacheMillis` (required): The number of milliseconds to cache the request
	response. Use `-1` to cache things forever.
* `request` (required): The function called when a request is not cached. Must
	return a promise.
* `stringify` (optional): A function that is called to stringify the request
	parameters. If unspecified, a default is used which will stringify flat
	object correctly and efficiently. If you have deeper objects, you'll want
	to implement your own `stringify` function.

## license

All code and documentation is released under the [VOL](http://veryopenlicense.com).

<3
