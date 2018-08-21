// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { AuthConfig } from "angular-oauth2-oidc";

const baseURL = "https://api.medunigraz.at:8088/";
//const baseURL = "http://localhost:4201/";

export const environment = {
  production: false
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

export const auth: AuthConfig = {
  clientId: "o5AMvJLFuKNhKzBltNK1d0DDyP53h5Ng2gxVBT7p",
  redirectUri: "http://localhost:4201/",
  loginUrl: baseURL + "oauth2/authorize/",
  postLogoutRedirectUri: "",
  scope: "editor",
  resource: "",
  rngUrl: "",
  oidc: false,
  requestAccessToken: true,
  options: null,
  clearHashAfterLogin: true,
  tokenEndpoint: baseURL + "oauth2/token/",
  responseType: "token",
  showDebugInformation: true,
  silentRefreshRedirectUri: "http://localhost:4201/silent-refresh.html",
  silentRefreshMessagePrefix: "",
  silentRefreshShowIFrame: false,
  silentRefreshTimeout: 20000,
  dummyClientSecret: null,
  requireHttps: false,
  strictDiscoveryDocumentValidation: false,
  customQueryParams: null,
  silentRefreshIFrameName: "angular-oauth-oidc-silent-refresh-iframe",
  timeoutFactor: 0.75,
  sessionCheckIntervall: 3000,
  sessionCheckIFrameName: "angular-oauth-oidc-check-session-iframe",
  disableAtHashCheck: false,
  skipSubjectCheck: false
};
