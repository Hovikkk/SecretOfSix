(function () {
    "use strict";

    angular.module("myapp.controllers")
    .controller("readyToPlayCtrl", ["$scope", "$rootScope", "nameStorage", "gameStorage", "$ionicLoading",  function ($scope, $rootScope, nameStorage, gameStorage, $ionicLoading) {
        /*$ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0,
            hideOnStateChange: true,
            template: '<div class="loadingSpiner"><img src="images/gameslogo.png" class="logoLoad" alt="logo"><ion-spinner icon="spiral"></ion-spinner></div>'
        });*/
        //console.log(nameStorage.typesLevel);
        $scope.$on('$ionicView.enter', function () {
            $scope.currectTeam = gameStorage.teamPlayersGame[gameStorage.selectedTeamIndex];
            $scope.currectMember = $scope.currectTeam.members[gameStorage.playerIndex];
            console.log($scope.currectTeam);
            console.log($scope.currectMember);
            console.log(gameStorage.teamPlayersGame[1]);
            console.log(gameStorage.playerIndex);
            console.log(gameStorage.selectedTeamIndex, gameStorage.playerIndex, gameStorage.step);
            gameStorage.gameResults[gameStorage.playerIndex][gameStorage.selectedTeamIndex].isplay = 1;
            if (!gameStorage.selectedTeamIndex) {
                $scope.teamIcon2 = false;
                $scope.teamIcon1 = true;
                $scope.playerIndexNumber = gameStorage.playerIndex;
            } else {
                $scope.teamIcon1 = false;
                $scope.teamIcon2 = true;
                $scope.playerIndexNumber = gameStorage.playerIndex;
            }
            $scope.$apply();
           // $ionicLoading.hide();
            $rootScope.loadingShow = false;
        });

        $scope.gameView = function () {
            $rootScope.loadingShow = true;
            location.href = '#/app/gameView';
        }
        $scope.endGame = function () {
            $rootScope.loadingShow = true;
            location.href = "#/app/gameResult";
        }
    }])
})();