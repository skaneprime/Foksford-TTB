const PATH_TO_MAIN_MODULE = "./index";

void function resetAtMidnight() {
  var now = new Date();
  var night = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1, // the next day, ...
      0, 0, 0 // ...at 00:00:00 hours
  );
  var msToMidnight = night.getTime() - now.getTime();

  setTimeout(function() {
      delete require.cache[require.resolve(PATH_TO_MAIN_MODULE)];
      require(PATH_TO_MAIN_MODULE);
      resetAtMidnight();
  }, msToMidnight);
}();