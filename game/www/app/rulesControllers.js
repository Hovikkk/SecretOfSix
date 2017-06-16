(function () {
    "use strict";

    angular.module("myapp.controllers")
    .controller("rulesCtrl", ["$scope", "$rootScope", "$ionicPlatform","$ionicScrollDelegate", function ($scope, $rootScope, $ionicPlatform, $ionicScrollDelegate) {
        $scope.$on('$ionicView.enter', function () {
            $rootScope.loadingShow = false;
            $scope.$apply();
        });
        $scope.back = function () {
            $rootScope.loadingShow = true;
            location.href = "#/app/home";
        }
        $scope.startGame = function () {
            $ionicScrollDelegate.$getByHandle('scroling').scrollTo(0, 470, [true]);
        }
        $scope.rulesGame = function () {
            $ionicScrollDelegate.$getByHandle('scroling').scrollTo(0, 1850, [true]);
        }
        $scope.settingGame = function () {
            $ionicScrollDelegate.$getByHandle('scroling').scrollTo(0, 1930, [true]);
        }
        $scope.exitGame = function () {
            $ionicScrollDelegate.$getByHandle('scroling').scrollTo(0, 2000, [true]);
        }
        $scope.backTop = function () {
            $ionicScrollDelegate.$getByHandle('scroling').scrollTo(0, 0, [true]);
        }
    }])
})();