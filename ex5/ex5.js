let ASQ = require("../node_modules/asynquence/asq.js");

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

function getFile(file) {
	// what do we do here?
	return ASQ(function(done) {
		fakeAjax(file, done);
	});
}

// let getFile = ASQ.wrap(fakeAjax);

// request an array of files at once in "parallel"

// seq(..) takes one or more functions, treating each one as a separate step in
// the sequence in question. These functions are expected to return new
// sequences, from which, in turn, both the success and failure streams will be
// piped back to the sequence in question.

getFile("file1")
	.val(output)
	.seq(getFile("file2"))
	.val(output)
	.seq(getFile("file3"))
	.val(output)
	.val(function() {
		output("Complete");
	});
