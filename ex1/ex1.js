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
//
// In order to control the flow of our async programs
// we need to rely on global variables and functions.
// We still are left with the inversion of control problem -
// the idea that cannot trust that the code which executes
// the callback will return the correct value on time, the
// correct number of times, safely.
//
// Trust:
//
// 	1. Not too early
// 	2. Not too late
//  3. Not too many times
//  4. Not too few times
//  5. No lost context
//  6. No swalloed errors

const responses = {};

function getFile(file) {
	fakeAjax(file, function(text) {
		fileReceived(file, text);
	});
}

function fileReceived(file, text) {
	let files = ["file1", "file2", "file3"];

	if (!responses[file]) {
		responses[file] = text;
	}

	let sortedKeys = Object.keys(responses).sort();

	for (var i = 0; i < sortedKeys.length; i++) {
		if (sortedKeys[i] === files[i] && responses[files[i]] != -1) {
			output(responses[files[i]]);
			responses[files[i]] = -1;
		}
	}

	if (sortedKeys.length === files.length) {
		output("Complete!");
	}
}

// request all files at once in "parallel"
getFile("file1");
getFile("file2");
getFile("file3");
