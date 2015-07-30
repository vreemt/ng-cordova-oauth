angular.module("oauth.providers", ["oauth.utils"])

    .factory("$cordovaOauth", ["$q", '$http', "$cordovaOauthUtility", function($q, $http, $cordovaOauthUtility) {

        return {

            /*
             * Sign into the Autodata service
             *
             * @param    string requestUri
             * @param    string appKey
             * @param    object options
             * @return   promise
             */
            autodata: function(appKey, options) {
                var deferred = $q.defer();
                if(window.cordova) {
                    var cordovaMetadata = cordova.require("cordova/plugin_list").metadata;
                    if($cordovaOauthUtility.isInAppBrowserInstalled(cordovaMetadata) === true) {
                        var redirect_uri = "http://localhost/callback";
                        if(options !== undefined) {
                            if(options.hasOwnProperty("redirect_uri")) {
                                redirect_uri = options.redirect_uri;
                            }
                            if(!options.hasOwnProperty("search_string"))  {
                                deferred.reject("No search terms found");
                            }
                        } else {
                            deferred.reject("No options found");
                        }

                        var completeRequestUri = requestUri.replace("{appKey}",appKey);
                        completeRequestUri = completeRequestUri.replace("{search_string}", options.search_string);
                        var browserRef = window.open(completeRequestUri+"&response_type=token", "_blank", "location=no,clearsessioncache=yes,clearcache=yes");
                        browserRef.addEventListener("loadstart", function(event) {
                            if((event.url).indexOf(redirect_uri) === 0) {
                                browserRef.removeEventListener("exit",function(event){});
                                browserRef.close();
                                var callbackResponse = (event.url).split("#")[1];
                                var responseParameters = (callbackResponse).split("&");
                                var parameterMap = [];
                                for(var i = 0; i < responseParameters.length; i++) {
                                    parameterMap[responseParameters[i].split("=")[0]] = responseParameters[i].split("=")[1];
                                }
                                if(parameterMap.access_token !== undefined && parameterMap.access_token !== null) {
                                    deferred.resolve({ access_token: parameterMap.access_token, token_type: parameterMap.token_type, uid: parameterMap.uid });
                                } else {
                                    deferred.reject("Problem authenticating");
                                }
                            }
                        });
                        browserRef.addEventListener('exit', function(event) {
                            deferred.reject("The sign in flow was cancelled");
                        });
                    } else {
                        deferred.reject("Could not find InAppBrowser plugin");
                    }
                } else {
                    deferred.reject("Cannot authenticate via a web browser");
                }
                return deferred.promise;
            },
            /*
             * Sign into the Dropbox service
             *
             * @param    string appKey
             * @param    object options
             * @return   promise
             */
            dropbox: function(appKey, options) {
                var deferred = $q.defer();
                if(window.cordova) {
                    var cordovaMetadata = cordova.require("cordova/plugin_list").metadata;
                    if($cordovaOauthUtility.isInAppBrowserInstalled(cordovaMetadata) === true) {
                        var redirect_uri = "http://localhost/callback";
                        if(options !== undefined) {
                            if(options.hasOwnProperty("redirect_uri")) {
                                redirect_uri = options.redirect_uri;
                            }
                        }
                        var browserRef = window.open("https://www.dropbox.com/1/oauth2/authorize?client_id=" + appKey + "&redirect_uri=" + redirect_uri + "&response_type=token", "_blank", "location=no,clearsessioncache=yes,clearcache=yes");
                        browserRef.addEventListener("loadstart", function(event) {
                            if((event.url).indexOf(redirect_uri) === 0) {
                            	browserRef.removeEventListener("exit",function(event){});
                            	browserRef.close();
                                var callbackResponse = (event.url).split("#")[1];
                                var responseParameters = (callbackResponse).split("&");
                                var parameterMap = [];
                                for(var i = 0; i < responseParameters.length; i++) {
                                    parameterMap[responseParameters[i].split("=")[0]] = responseParameters[i].split("=")[1];
                                }
                                if(parameterMap.access_token !== undefined && parameterMap.access_token !== null) {
                                    deferred.resolve({ access_token: parameterMap.access_token, token_type: parameterMap.token_type, uid: parameterMap.uid });
                                } else {
                                    deferred.reject("Problem authenticating");
                                }
                            }
                        });
                        browserRef.addEventListener('exit', function(event) {
                            deferred.reject("The sign in flow was canceled");
                        });
                    } else {
                        deferred.reject("Could not find InAppBrowser plugin");
                    }
                } else {
                    deferred.reject("Cannot authenticate via a web browser");
                }
                return deferred.promise;
            };

    }]);
