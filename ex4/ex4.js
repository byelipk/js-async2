function fakeAjax(url,cb) {
	var fake_responses = {
		"file1": "The first text",
		"file2": "The middle text",
		"file3": "The last text"
	};
	var randomDelay = (Math.round(Math.random() * 1E4) % 8000) + 1000;

	console.log("Requesting: " + url);

	setTimeout(function(){
		cb(fake_responses[url]);
	},randomDelay);
}

function output(text) {
	console.log(text);
}

// **************************************
// The old-n-busted callback way

function getFile(file) {
	return new Promise(function(resolve){
		fakeAjax(file,resolve);
	});
}

// Request all files at once in
// "parallel" via `getFile(..)`.
//
// Render as each one finishes,
// but only once previous rendering
// is done.

// ???

function all(list) {
	let resolved = [];

	return new Promise(function executor(resolve, reject) {
		list
			.map(getFile)
			.reduce(function combine(chain, promise) {
				return chain.then(function() {
					return promise.then(function(value) {
						resolved.push(value);
					});
				});
			}, Promise.resolve())
			.then(function(x) {
				resolve(resolved);
			})
			.catch(function(err) {
				reject(err);
			})
	});
}

all(["file1", "file2", "file3"]).then(output);

// Long live the promise chain!
["file1", "file2", "file3"]
	.map(getFile)
	.reduce(function combine(chain, promise) {
		return chain.then(function() {
			return promise;
		}).then(output); // Calling `then` returns a promise
	}, Promise.resolve())
	.then(function() {
		output("Completed!");
	});
