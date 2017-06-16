(function () {
    "use strict";

    angular.module("myapp.controllers", [])

    .controller("appCtrl", ["$scope", function ($scope) {
    }])
    
    //homeCtrl provides the logic for the home screen
    .controller("homeCtrl", ["$scope", "$rootScope", "$state", "WebSqlDbService", "nameStorage", "facebook", "$http", "$ionicPlatform",
        function ($scope, $rootScope, $state, WebSqlDbService, nameStorage, facebook, $http, $ionicPlatform ) {
        function checkConnection() {
            var s = ["No network connection","none"]
            var networkState = navigator.connection.type;
            console.log(s.indexOf(networkState) == -1);
            return (s.indexOf(networkState) == -1);
            $scope.$apply();
        }
        console.log(location.href);
        var st = location.href.split("#")[1];
        if (st == "/app/home") {
            
            $ionicPlatform.registerBackButtonAction(function (event) {
                console.log("lala")
                $scope.exitGame = true;
                $scope.$apply();
            }, 100);
        } 
        
        $scope.loginFb = true;
        $scope.logoutFb = false;
        
        
        //$rootScope.loadingShow = true;
        $scope.faceShow = false;
        facebook.facebookShow = $scope.faceShow;
       

        $scope.$on('$ionicView.enter', function () {
            console.log("____!!!____");
            console.log(facebook.allFriends);
            console.log(facebook.inGameFriends);
            console.log("____!!!____");
            console.log(checkConnection());
            
            if (!checkConnection()) {
                $scope.logoutFb = false;
                $scope.loginFb = false;
                $scope.disabledFb = true;
                
            } else {
                $scope.disabledFb = false;
                console.log(fblogin);
                if (!fblogin) {
                    $scope.loginFb = true;
                    $scope.logoutFb = false;
                } else {
                    
                    $scope.loginFb = false;
                    
                    $scope.logoutFb = true;
                    console.log(checkConnection());
                    console.log(!fbConectLogin);
                    if (checkConnection() && !fbConectLogin) {
                        $scope.facebook();
                    }
                    console.log("___________*****************")
                    console.log(checkConnection());
                    console.log(!fbConectLogin);
                    console.log("___________*****************")
                }

            }
            $scope.$apply();
            $scope.userInfo = {
                UserId: 'as34fsdf*i#sad454',
            };
            
            $scope.exitGame = false;
          if (initialization) {
                WebSqlDbService.select("teams", ['id', 'avatar', 'name', 'xp', 'members'], null, 1, $scope.getTeams);
            }
        });
        var initialization = false;
        $ionicPlatform.ready(function (event) {
            WebSqlDbService.createDbAndTables();
            WebSqlDbService.select("easyWords", ['id', 'word', 'used', 'type'], null, 1, $scope.getEasyWords);
            //$scope.disabledFb = checkConnection();
        })
        $scope.getData = function () {
            $http.get('http://annaniks.com/gaem/', {
                headers: { 'Content-Type': 'application/json' }
            }).success(function (responseData) {
                console.log(responseData);
            }).error(function (responseData) {
                console.log("Could not get data from server.");
            });
        }

        $scope.insertGameSetings = function (e) {
            console.log(e);
            WebSqlDbService.select("gameSettings", ['ewl', 'nwl', 'hwl', 'ewc', 'nwc', 'hwc', 'ewu', 'nwu', 'hwu', 'id', 'fblogin', 'sound', 'timer'], { rowid: 1 }, 1, $scope.getSettings);
            $scope.$apply();
        };
        $scope.getSettings = function (e) {
            if ((isPhoneGap() && e.rows.length == 0) || (!isPhoneGap() && e.rows.length == 0)) {
                WebSqlDbService.insert("gameSettings", { ewl: 0, nwl: 0, hwl: 0, ewc: 0, nwc: 0, hwc: 0, ewu: 0, nwu: 0, hwu: 0, fblogin: 0, sound: 1, timer: 60 }, $scope.insertGameSetings);
            } else {
                var d;
                if (isPhoneGap()) {
                    d = e.rows.item(0);
                    
                } else {
                    d = e.rows[0];
                }
                console.log(d.fblogin);
                if (d.fblogin == 1) {
                    console.log(fblogin);
                    fblogin = true;
                    if (fblogin && checkConnection() && !fbConectLogin) {
                        
                        $scope.facebook();
                        console.log("ddfsfdfsdfsdfdsf");
                    }
                }
                initialization = true;
                WebSqlDbService.select("teams", ['id', 'avatar', 'name', 'xp', 'members'], null, 1, $scope.getTeams);
            }
        };

        
        function updateFbLogin(d) {
            WebSqlDbService.update("gameSettings", {"fblogin": d}, { rowid: 1 }, updateComplate)
        }
        function updateComplate(e) {
         //   updateInfos();
        }
        var allWords;
        $scope.getEasyWords = function (e) {
            var secret = "11";
            if (e.rows.length == 0) {
                $http.get('words.json', {
                    headers: { 'Content-Type': 'application/json' }
                }).success(function (responseData) {
                    
               //     var xor = require('lib/ionic/js/base64-xor.js');
                    console.log(responseData);
                  //  console.log(B64XorCipher);
              //      var xor = B64XorCipher;
              //      var step1 = xor.decode(responseData, secret);
              //      var step2 = xor.decode(step1, xor.decode(secret, secret))
              //      var data = JSON.parse(step2);
                    allWords = responseData;

                    var rows = [];
                    for (var i = 0; i < allWords[0].length; i++) {
                        rows.push({ word: allWords[0][i].word, used: allWords[0][i].used, type: allWords[0][i].type });

                    }
                    WebSqlDbService.multipleInsertWords("easyWords", rows, successInsertWords);
                    location.href = "#/app/rules";
                    
                }).error(function (responseData) {
                    console.log("Could not get data from server.");
                });
                

               
            } else {
                successInsertWords("easyWords")
            }
            console.log(e);
        };

        function successInsertWords(e) {
            console.log(e);
            if (e == "easyWords") {
                WebSqlDbService.select("normalWords", ['id', 'word', 'used', 'type'], null, 1, $scope.getNormalWords);

            }
            if (e == "normalWords") {
                WebSqlDbService.select("hardWords", ['id', 'word', 'used', 'type'], null, 1, $scope.getHardWords);
            }

            if (e == "hardWords") {
                WebSqlDbService.select("gameSettings", ['ewl', 'nwl', 'hwl', 'ewc', 'nwc', 'hwc', 'ewu', 'nwu', 'hwu', 'id', 'fblogin', 'sound', 'timer'], { rowid: 1 }, 1, $scope.getSettings);
            }
        }
        $scope.getNormalWords = function (e) {
            if (e.rows.length == 0) {
                var rows = [];
                for (var i = 0; i < allWords[1].length; i++) {
                    rows.push({ word: allWords[1][i].word, used: allWords[1][i].used, type: allWords[1][i].type });

                }
                WebSqlDbService.multipleInsertWords("normalWords", rows, successInsertWords);


            } else {
                successInsertWords("normalWords")
            }
        };
        $scope.getHardWords = function (e) {

            if (e.rows.length == 0) {
                var rows = [];
                for (var i = 0; i < allWords[2].length; i++) {
                    rows.push({ word: allWords[2][i].word, used: allWords[2][i].used, type: allWords[2][i].type });

                }
                WebSqlDbService.multipleInsertWords("hardWords", rows, successInsertWords);


            } else {
                successInsertWords("hardWords")
            }
        };
        $scope.getTeams = function (e) {
            nameStorage.teams = [];
            $scope.teams = [];
            for (var i = 0; i < e.rows.length; i++) {
                var t = new Team();
                if (isPhoneGap()) {
                    t.name = e.rows.item(i).name;
                    t.xp = e.rows.item(i).xp;
                    t.members = JSON.parse(e.rows.item(i).members);
                    t.id = e.rows.item(i).id;
                } else {
                    t.name = e.rows[i].name;
                    t.xp = e.rows[i].xp;
                    t.members = JSON.parse(e.rows[i].members);
                    t.id = e.rows[i].id;
                }
                nameStorage.teams.push(t);
            }
            console.log("_oo__o-");
            $scope.teams = nameStorage.teams;
            $rootScope.loadingShow = false;
            $scope.$apply();
        };
        function isPhoneGap() {
            return (cordova || PhoneGap || phonegap)
            && /^file:\/{3}[^\/]/i.test(window.location.href)
            && /ios|iphone|ipod|ipad|android/i.test(navigator.userAgent);
        };
       
        var fblogin = false;
        var fbConectLogin = false;
        $scope.gotoPlay = function () {
            if (isPhoneGap()) {
                facebookConnectPlugin.getLoginStatus(function (token) {
                    console.log("+++++++++++!!!!!!!!!!");
                    console.log(token);
                    console.log("+++++++++++!!!!!!!!!!");
                }, function (err) {
                    console.log(err);
                })
            }

            $rootScope.loadingShow = true;
            //$("loadingSpiner").show();
            location.href = "#/app/play"
        };
        $scope.gotoRules = function () {
            $rootScope.loadingShow = true;
            location.href = "#/app/rules"
        }
        $scope.gotoSettings = function () {
            $rootScope.loadingShow = true;
            location.href = "#/app/setings"
        }
        var Team = (function () {
            function Team() {
                this.name = null;
                this.members = [];
                this.id = null;
            }
            return Team;
        })();
        $scope.success = function (e) {
            console.log(e);
            
        };
        $scope.refresh = function () {
            //refresh binding
            $scope.$broadcast("scroll.refreshComplete");
        };
        $scope.onLoad = function () {
            console.log("device reday !!!!")
            document.addEventListener("deviceready", onDeviceReady, true);
        };
        $scope.fbLoginSuccess = function (userData) {

        };
        //if (checkConnection()) {
        $scope.facebook = function () {
           
            if (window.cordova.platformId == "browser") {
                facebookConnectPlugin.browserInit('967392980007697');
            }
            facebookConnectPlugin.getLoginStatus(function (response) {
                console.log(response);
                if (response.status === 'connected') {
                    console.log('User Already LoggedIn');
                    
                } else {
                    console.log('User Not Logged In');
                }
            }, function () {
                $log.warn('Get Login Status Error');

            });
            
            facebookConnectPlugin.login(["email", "public_profile", "user_friends"],
                    function (response) {
                        //console.log(userData);
                        /*facebookConnectPlugin.getLoginStatus(function (token) {
                            console.log(token);
                        }, function (err) {
                            console.log(err);
                        })*/

                        if (!fblogin) {
                            fblogin = true;
                            updateFbLogin(1)
                        }
                        //$scope.fbLog = 1;
                        fbConectLogin = true;
                        $scope.loginFb = false;
                        $scope.logoutFb = true;
                        facebook.facebookShow = true;
                        $scope.$apply();
                        
                        facebookConnectPlugin.api("me/invitable_friends?fields=name,picture&limit=1000", ["user_friends"],
                        function (result) {
                                 //   $scope.insertGameSetings();
                            
                            console.log(result);
                            facebook.allFriends = result;
                            facebookConnectPlugin.api("me/?fields=name,picture", [],
                                function (result) {
                                    facebook.inGameFriends = [];
                                    facebook.inGameFriends.push(result)
                                    console.log(result);
                                    facebookConnectPlugin.api("me/friends?fields=name,picture", ["user_friends"],
                                        function (result) {
                                            console.log(result);
                                            for (var i = 0 ; i < result["data"].length;i++){
                                                facebook.inGameFriends.push(result["data"][i]);
                                            }
                                           // facebook.inGameFriends = result;
                                        },
                                        function (error) {
                                            console.log(error);
                                        });
                                },
                                function (error) {
                                    console.log(error);
                                });
                            
                            facebookConnectPlugin.getLoginStatus(function (token) {
                                console.log(token);
                            }, function (err) {
                                console.log(err);
                            })
                            /* alerts:
                                {
                                    "id": "000000123456789",
                                    "email": "myemail@example.com"
                                }
                            */
                            
                        },
                        function (error) {
                            console.log(error);
                        });


                        

                    },
                    function (response) {
                        /*if (response.errorCode != 4201) {
                            $scope.loginFb = false;
                            $scope.$apply();
                        };*/
                        console.log(response)
                    });
        }
      //  }
        $scope.fbLogout = function () {
            facebookConnectPlugin.logout(function (response) {
                // user is now logged out
                console.log(response);
                //$scope.fbLog = 0;
                $scope.loginFb = true;
                $scope.logoutFb = false;
                facebook.facebookShow = false;
                $scope.$apply();
                fblogin = false;
                updateFbLogin(0)

            });
        }
        $scope.exitFromApp = function () {
            $scope.exitGame = true;
            //navigator.app.exitApp();
        }
        $scope.exitCancel = function (e) {
            if (e) {
                navigator.app.exitApp();
            } else {
                $scope.exitGame = false;
            }
        }
    }])

    //errorCtrl managed the display of error messages bubbled up from other controllers, directives, myappService
    .controller("errorCtrl", ["$scope", "myappService", function ($scope, myappService) {
        //public properties that define the error message and if an error is present
        $scope.error = "";
        $scope.activeError = false;

        //function to dismiss an active error
        $scope.dismissError = function () {
            $scope.activeError = false;
        };

        //broadcast event to catch an error and display it in the error section
        $scope.$on("error", function (evt, val) {
            //set the error message and mark activeError to true
            $scope.error = val;
            $scope.activeError = true;

            //stop any waiting indicators (including scroll refreshes)
            myappService.wait(false);
            $scope.$broadcast("scroll.refreshComplete");

            //manually apply given the way this might bubble up async
            $scope.$apply();
        });
    }]);
})();