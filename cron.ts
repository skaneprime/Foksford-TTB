import schedule from "node-schedule";

const PATH_TO_MAIN_MODULE = "./index";

schedule.scheduleJob('0 0 * * *', () => {
  delete require.cache[require.resolve(PATH_TO_MAIN_MODULE)];
  require(PATH_TO_MAIN_MODULE);
}) // run everyday at midnight