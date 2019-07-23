let appConfig = {};

appConfig.port = 8080;
appConfig.allowedCorsOrigin = '*';
appConfig.env = 'dev';
appConfig.db = {
  uri: 'mongodb://127.0.0.1:27017/chatAppDb'
};
appConfig.version = '/api/v1';

//exporting module
module.exports = {
  port: appConfig.port,
  allowedCorsOrigin: appConfig.allowedCorsOrigin,
  environment: appConfig.env,
  db: appConfig.db,
  apiVersion: appConfig.version
}; //end exporting module
