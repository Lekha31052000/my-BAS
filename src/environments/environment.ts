// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  //baseUrl: 'https://bas.mobinius.com/api/',  //prod url
   baseUrl:'https://bas-stage.mobinius.net/api/',  // staging url
  // baseUrl: 'http://192.168.2.133:2001/',
  // baseUrl: 'http://52.66.242.189/api/',
  // baseUrl: 'http://192.168.2.87:2001/',

 // fingerprintUrl: 'https://bas.mobinius.com/',
   fingerprintUrl: 'https://bas-stage.mobinius.net/',
//   fingerprintUrl: 'http://15.206.59.2:8080/',
  sdkUrl: 'http://localhost:8090/FM220/',
  //capctha -- i'm not a robot
  siteKey: "6LdNq8sUAAAAAKwyuY1g_YY_zwzyvqD9IefnIHqq"
  // siteKey: "6LfgWtwZAAAAAD2x5NA3IoSaszMJhAW75BDMH76D"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
