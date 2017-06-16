(function () {
    "use strict";

    angular.module("myapp.controllers")
    .controller("stepResultCtrl", ["$scope", "$rootScope", "nameStorage", "gameStorage", "gameSettings", "facebook", function ($scope, $rootScope, nameStorage, gameStorage, gameSettings, facebook) {
        var data;
        $scope.results = [];
        $scope.teamsTotalXp = [];
        
        $scope.$on('$ionicView.enter', function () {
            $scope.currectTeam = gameStorage.teamPlayersGame[gameStorage.selectedTeamIndex];
            $scope.currectMember = $scope.currectTeam.members[gameStorage.playerIndex];
            $scope.teamPlayersResult = gameStorage.teamPlayersGame;
            console.log($scope.teamPlayersResult);
            $scope.teameFirst = gameStorage.teamPlayersGame[0].name;
            $scope.teameSecond = gameStorage.teamPlayersGame[1].name;
            console.log($scope.currectTeam);
            data = gameStorage.gameResults;
            $scope.results = [];
            $scope.teamsTotalXp[0] = 0;
            $scope.teamsTotalXp[1] = 0;
            for (var i = 0; i < gameStorage.teamPlayersGame[0].members.length; i++) {
                $scope.results.push([{ totalXp: gameStorage.gameResults[i][0].totalXp, xp: "", isplay: 0, pic: gameStorage.teamPlayersGame[0].members[i].pic, id: gameStorage.gameResults[i][0].id, name: gameStorage.teamPlayersGame[0].members[i].name }, { totalXp: gameStorage.gameResults[i][1].totalXp, xp: "", isplay: 0, pic: gameStorage.teamPlayersGame[1].members[i].pic, id: gameStorage.gameResults[i][1].id, name: gameStorage.teamPlayersGame[1].members[i].name }]);
                $scope.teamsTotalXp[0] += gameStorage.gameResults[i][0].totalXp;
                $scope.teamsTotalXp[1] += gameStorage.gameResults[i][1].totalXp
            }

            for (var i = 0; i < gameStorage.teamPlayersGame[0].members.length; i++) {

                if (gameStorage.gameResults[i][0].xp != 0) {
                    $scope.results[i][0].xp = gameStorage.gameResults[i][0].xp;
                } else {
                    if (gameStorage.playerIndex >= i) {
                        $scope.results[i][0].xp = "0"
                    }
                }

                if (gameStorage.gameResults[i][1].xp != 0) {
                    $scope.results[i][1].xp = gameStorage.gameResults[i][1].xp;
                } else {
                    if (gameStorage.playerIndex >= i) {
                        if (gameStorage.selectedTeamIndex == 1) {
                            $scope.results[i][1].xp = "0";
                        } else {
                            if (gameStorage.playerIndex == i) {
                                $scope.results[i][1].xp = "-";
                            } else {
                                $scope.results[i][1].xp = "0";
                            }
                            
                        }
                    }
                    
                }
            }

            $scope.results[gameStorage.playerIndex][gameStorage.selectedTeamIndex].isplay = 1;
            console.log($scope.results[gameStorage.playerIndex][gameStorage.selectedTeamIndex].xp);
            console.log($scope.currectMember.name);
            $rootScope.loadingShow = false;
            if (facebook.facebookShow == true) {
                $scope.shereShow = true;
            } else {
                $scope.shereShow = false;
            }
            console.log($scope.results);
        });

        $scope.gameView = function () {
            var b = true;
            gameStorage.gameResults[gameStorage.playerIndex][gameStorage.selectedTeamIndex].isplay = 0;
            console.log(gameStorage.gameResults);
            gameStorage.selectedTeamIndex++;
            if (gameStorage.selectedTeamIndex == 2) {
                gameStorage.selectedTeamIndex = 0;
                gameStorage.playerIndex++;
                
                console.log(gameStorage.playerIndex, $scope.currectTeam);
                console.log($scope.currectTeam.members.length)
                if (gameStorage.playerIndex == $scope.currectTeam.members.length) {
                    for (var i = 0; i < gameStorage.teamPlayersGame[0].members.length; i++) {
                        gameStorage.gameResults[i][0].xp = 0;
                        gameStorage.gameResults[i][1].xp = 0;
                    }
                    gameStorage.playerIndex = 0;
                    gameStorage.step++;
                    if (gameStorage.step == gameSettings.step) {
                        b = false;
                    }
                }
            }
            if (b) {
                $rootScope.loadingShow = true;
                location.href = '#/app/readyToPlay';
            } else {
                $rootScope.loadingShow = true;
                location.href = '#/app/gameResult';
            }
        }
        $scope.sherePlayer = function () {
            facebookConnectPlugin.showDialog({
                method: 'feed',
                link: 'https://apps.facebook.com/967392980007697/',
                caption: $scope.currectTeam.name,
                //picture: 'https://scontent-vie1-1.xx.fbcdn.net/hphotos-xfp1/t31.0-8/10506956_936668339747538_8164793851133561001_o.jpg',
                description: $scope.currectMember.name + ' խաղացել և հավաքել է ' + $scope.results[gameStorage.playerIndex][gameStorage.selectedTeamIndex].xp + ' միավոր',
            }, function (response) {
                console.log(response);
            }, function (error) {
                console.log(error);
            });
        }
    }])
})();