(function () {
    "use strict";

    angular.module("myapp.controllers")
    .controller("preparingGameCtrl", ["$scope", "$rootScope", "nameStorage", "gameStorage", "gameSettings", "facebook", function ($scope, $rootScope, nameStorage, gameStorage, gameSettings, facebook) {
        $scope.teameFirst = null;
        $scope.teameSecond = null;
        
        $scope.$on('$ionicView.enter', function () {
            console.log(gameStorage.teamPlayersGame);
            $scope.teameFirst = gameStorage.teamPlayersGame[0].name;
            $scope.teameSecond = gameStorage.teamPlayersGame[1].name;
            console.log(nameStorage.pleyedTeams)
            $scope.team1 = [];
            for (var i = 0; i < nameStorage.pleyedTeams[0].members.length; i++) {
                $scope.team1.push(nameStorage.pleyedTeams[0].members[i].name);
            }
            $scope.team2 = [];
            for (var i = 0; i < nameStorage.pleyedTeams[1].members.length; i++) {
                $scope.team2.push(nameStorage.pleyedTeams[1].members[i].name);
            }
            console.log($scope.team1);
            $scope.teamPlayers = nameStorage.pleyedTeams;
            $scope.shereShow = false;
            $scope.$apply();
            $rootScope.loadingShow = false;
            console.log(facebook.facebookShow);
            if (facebook.facebookShow == true) {
                $scope.shereShow = true;
            } else {
                $scope.shereShow = false;
            }
            $scope.esayPreparting = "";
            for (var i = 0; i < nameStorage.typesLevel.length; i++) {
                console.log(nameStorage.typesLevel[i])
                switch(nameStorage.typesLevel[i]){
                    case "easy":
                        $scope.esayPreparting += " հեշտ";
                        break;
                    case "normal":
                        $scope.esayPreparting += " նորմալ";
                        break;
                    case "hard":
                        $scope.esayPreparting += " դժվար";
                        break;
                }
                if (i < nameStorage.typesLevel.length-1) {
                    $scope.esayPreparting += ","
                } else {
                $scope.esayPreparting += " "
                }
   
            }
            console.log($scope.esayPreparting);
            console.log(gameSettings.step)
            $scope.stepPreparting = gameSettings.step
        });
        
        $scope.starGame = function () {
            for (var i = 0; i < gameStorage.teamPlayersGame[0].members.length; i++) {
                gameStorage.gameResults.push([{ totalXp: 0, xp: 0, isplay: 0, id: gameStorage.teamPlayersGame[0].members[i].id }, { totalXp: 0, xp: 0, isplay: 0, id: gameStorage.teamPlayersGame[1].members[i].id }])
            }
            
            gameStorage.step = 0;
            gameStorage.playerIndex = 0;
            gameStorage.selectedTeamIndex = 0;
            $rootScope.loadingShow = true;
            location.href = '#/app/readyToPlay';
        }
        
        $scope.sherePlayer = function () {
            facebookConnectPlugin.showDialog({
                method: 'feed',
                link: 'https://apps.facebook.com/967392980007697/',
                caption: 'խաղին մասնակցում են',
                //picture: 'https://scontent-vie1-1.xx.fbcdn.net/hphotos-xfp1/t31.0-8/10506956_936668339747538_8164793851133561001_o.jpg',
                description: $scope.teameFirst + '(' + $scope.team1 + ')' + $scope.teameSecond + '(' + $scope.team2 + ')',
            }, function (response) {
                console.log(response);
            }, function (error) {
                console.log(error);
            });
        } 
            
        
        $scope.back = function () {
            $rootScope.loadingShow = true;
            location.href = "#/app/nextGameSettings";
        }

    }])
})();