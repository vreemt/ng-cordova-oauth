/*
 * Cordova AngularJS Oauth
 *
 * Modified by Sandra Koning
 * Based on plugin Created by Nic Raboy
 * http://www.nraboy.com
 *
 *
 * DESCRIPTION:
 *
 * Use Oauth sign in for various web services.
 *
 *
 * REQUIRES:
 *
 *    Apache Cordova 3.5+
 *    Apache InAppBrowser Plugin
 *    Apache Cordova Whitelist Plugin
 *
 *
 * SUPPORTS:
 *
 *    Autodata (based on Dropbox)
 *
 */

angular.module("ngCordovaOauth", [
    "oauth.providers",
    "oauth.utils"
]);
