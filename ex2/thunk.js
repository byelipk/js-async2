const doAsync = function doAsyc(x, y, cb) {
  setTimeout(function() {
    cb(x + y);
  }, 1000);
}

const thunk = function(cb) {
  doAsync(10, 15, cb);
}

const anotherThunk = function(cb) {
  doAsync(199, 234, cb);
}

// We can't just call thunk and get a return value.
// We need to pass in a callback.
thunk(function(value) {
  console.log(value);
});

anotherThunk(function(x) {
  thunk(function(y) {
    console.log(x * y);
  });
});

thunk(function(value) {
  console.log(value);
});
