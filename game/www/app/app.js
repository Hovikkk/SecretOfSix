(function () {
    "use strict";
    var db = null;
    angular.module("myapp", ["ionic", "myapp.controllers", 'ui.router', "myapp.services", "ngCordova","timer"])
        .run(function ($ionicPlatform) {
            $ionicPlatform.registerBackButtonAction(function (event) {
                console.log("push back button ");
                event.preventDefault();
            }, 100);
            $ionicPlatform.ready(function () {
               
                //var info =  cordova.getActivity().getPackageManager().getPackageInfo("com.goapes.golearn", PackageManager.GET_SIGNATURES);
                //console.log(info);
                
            
                
                



                if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                }
                if (window.StatusBar) {
                    StatusBar.styleDefault();
                }
                console.log("Run App");
                console.log(!window.cordova)
                if (!window.cordova) {
                    var appId = prompt("Enter FB Application ID", "");
                    facebookConnectPlugin.browserInit("967392980007697");
                    console.log(facebookConnectPlugin.getLoginStatus());
                }
               // facebookConnectPlugin.getLoginStatus(function (d) { console.log(d) }, function (d) { console.log(d) })
               // facebookConnectPlugin.getAccessToken(function (d) { console.log(d) }, function (d) { console.log(d) })

                
                console.log("facebookConnectPlugin");
                
            });
        })
        /*.config(function ($stateProvider, $urlRouterProvider) {
            $stateProvider
          .state('auth', {
              url: '/auth',
              abstract: true,
              template: '<ui-view>'
          })

        .state('auth.login', {
            url: '/login',
            templateUrl: 'src/auth/partials/login.html',
            data: {
                'noLogin': true
            }
        });
        });*/


        .config(function ($stateProvider, $urlRouterProvider) {
            $stateProvider
            .state("app", {
                url: "/app",
                abstract: true,
                templateUrl: "app/templates/view-menu.html",
                controller: "appCtrl"
            })
            .state("app.home", {
                url: "/home",
                templateUrl: "app/templates/view-home.html",
                controller: "homeCtrl",
                controllerAs: "homeCtrl"
            })
            .state("app.rules", {
                url: "/rules",
                templateUrl: "app/templates/rules.html",
                controller: "rulesCtrl"
            })
            .state("app.setings", {
                url: "/setings",
                templateUrl: "app/templates/setings.html",
                controller: "setingsCtrl",
                controllerAs: "setingsCtrl"
            })
            .state("app.play", {
                url: "/play",
                templateUrl: "app/templates/play.html",
                controller: "playCtrl"
            })
            .state("app.editForTeams", {
                url: "/editForTeams",
                templateUrl: "app/templates/editForTeams.html",
                controller: "editCtrl"
            })
            .state("app.new", {
                url: "/new",
                templateUrl: "app/templates/new.html",
                controller: "newCtrl"
            })
            .state("app.nextGameSettings", {
                url: "/nextGameSettings",
                templateUrl: "app/templates/nextGameSettings.html",
                controller: "nextCtrl"
            })
            .state("app.delPlayer", {
                url: "/next",
                templateUrl: "app/templates/delPlayer.html",
                controller: "delPlayerCtrl"
            })
            .state("app.preparingGame", {
                url: "/preparingGame",
                templateUrl: "app/templates/preparingGame.html",
                controller: "preparingGameCtrl"
            })
            .state("app.readyToPlay", {
                url: "/readyToPlay",
                templateUrl: "app/templates/readyToPlay.html",
                controller: "readyToPlayCtrl"
            })
            .state("app.gameView", {
                url: "/gameView",
                templateUrl: "app/templates/gameView.html",
                controller: "gameViewCtrl"
            })
            .state("app.stepResult", {
                url: "/stepResult",
                templateUrl: "app/templates/stepResult.html",
                controller: "stepResultCtrl"
            })
            .state("app.gameResult", {
                url: "/gameResult",
                templateUrl: "app/templates/gameResult.html",
                controller: "gameResultCtrl"
            });
            $urlRouterProvider.otherwise("/app/home");
        });
})();