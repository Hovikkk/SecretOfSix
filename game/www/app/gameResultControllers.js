(function () {
    "use strict";

    angular.module("myapp.controllers")
    .controller("gameResultCtrl", ["$scope", "$rootScope", "nameStorage", "gameStorage", "WebSqlDbService", "facebook",  function ($scope, $rootScope, nameStorage, gameStorage, WebSqlDbService, facebook) {
        $scope.teamName1 = null;
        $scope.teamName2 = null;
        $scope.team1 = null;
        $scope.team2 = null;
        $scope.newArray = null;
        $scope.ratingPlayers = null;
        
        $scope.$on('$ionicView.enter', function () {
            $scope.ratingPlayers = []
            $scope.currectTeam = gameStorage.teamPlayersGame[gameStorage.selectedTeamIndex];
            $scope.currectMember = $scope.currectTeam.members[gameStorage.playerIndex];
            //console.log(gameStorage.selectedTeamIndex, gameStorage.playerIndex, gameStorage.step);
            $scope.teamName1 = gameStorage.teamPlayersGame[0].name;
            $scope.teamName2 = gameStorage.teamPlayersGame[1].name;
            $scope.team1 = 0;
            $scope.team2 = 0;
            newArray = [];
            for (var i = 0; i < gameStorage.gameResults.length; i++) {
                $scope.team1 += gameStorage.gameResults[i][0].totalXp;
                $scope.team2 += gameStorage.gameResults[i][1].totalXp;
                newArray.push({ totalXp: gameStorage.gameResults[i][0].totalXp, name: gameStorage.teamPlayersGame[0].members[i].name, pic: gameStorage.teamPlayersGame[0].members[i].pic, id: gameStorage.teamPlayersGame[0].members[i].id });
                newArray.push({ totalXp: gameStorage.gameResults[i][1].totalXp, name: gameStorage.teamPlayersGame[1].members[i].name, pic: gameStorage.teamPlayersGame[1].members[i].pic, id: gameStorage.teamPlayersGame[1].members[i].id });
                $scope.$apply()
            }
            $scope.ratingPlayers = newArray;
            $scope.teamsMember = [];
            for (var i = 0; i < gameStorage.teamPlayersGame[0].members.length; i++) {
                $scope.teamsMember.push(gameStorage.teamPlayersGame[0].members);
            }
            console.log(gameStorage.gameResults);
            console.log(nameStorage.teamsUpdate);
            /*for (var i = 0; i < gameStorage.gameResults[0].length; i++) {
                for(var j = 0; j < nameStorage.teamsUpdate[0].members.length; j++){
                    console.log(nameStorage.teamsUpdate[0].members[j].id,gameStorage.gameResults[0][i].id);
                    if (nameStorage.teamsUpdate[0].members[j].id == gameStorage.gameResults[i][0].id) {
                        nameStorage.teamsUpdate[0].members[j].xp += gameStorage.gameResults[i][0].totalXp;
                    }
                    console.log(nameStorage.teamsUpdate[1].members[j].id, gameStorage.gameResults[1][i].id);
                    if (nameStorage.teamsUpdate[1].members[j].id == gameStorage.gameResults[i][1].id) {
                        nameStorage.teamsUpdate[1].members[j].xp += gameStorage.gameResults[i][1].totalXp;
                    }
                }  
            }*/
            
            
            console.log(nameStorage.teamsUpdate[0].xp);
            console.log($scope.team1);
            nameStorage.teamsUpdate[0].xp += $scope.team1;
            nameStorage.teamsUpdate[1].xp += $scope.team2;
            for (var i = 0; i < nameStorage.teamsUpdate.length; i++) {
                for (var j = 0; j < nameStorage.teamsUpdate[i].members.length; j++) {
                    for (var k = 0; k < gameStorage.gameResults.length; k++) {
                        console.log(i+"  "+j+"  "+k);
                        console.log(gameStorage.gameResults[k][i]);
                        console.log(nameStorage.teamsUpdate[i].members[j]);
                        if (gameStorage.gameResults[k][i].id == nameStorage.teamsUpdate[i].members[j].id) {
                            nameStorage.teamsUpdate[i].members[j].xp += gameStorage.gameResults[k][i].totalXp;
                        }
                    }
                }
            }
            console.log(nameStorage.teamsUpdate);
            WebSqlDbService.select("teams", ['id', 'avatar', 'name', 'xp', 'members'], null, 1, getTeams);
            function isPhoneGap() {
                return (cordova || PhoneGap || phonegap)
                && /^file:\/{3}[^\/]/i.test(window.location.href)
                && /ios|iphone|ipod|ipad|android/i.test(navigator.userAgent);
            }
            function getTeams(e) {
                console.log(e);
                if (isPhoneGap()) {
                    e.rows.item(0).xp += $scope.team1;
                    e.rows.item(1).xp += $scope.team2;
                    $scope.$apply()
                } else {
                    e.rows[0].xp += $scope.team1;
                    console.log($scope.team1);
                    console.log(e.rows[0].xp);
                    e.rows[1].xp += $scope.team2;
                    $scope.$apply()
                }
                console.log(e);
                updateComplate();
            }
            for (var i = 0; i < nameStorage.teamsUpdate.length; i++) {
                WebSqlDbService.update("teams", { xp: nameStorage.teamsUpdate[i].xp, members: "'" + JSON.stringify(nameStorage.teamsUpdate[i].members) + "'" }, { id: nameStorage.teamsUpdate[i].id }, updateComplate);
                $scope.$apply()
            }
            function updateComplate(e) {
                console.log(e);
            }

            sorting();
            if ($scope.team1 > $scope.team2) {
                $scope.medalTwo = false;
                $scope.medalOne = true;
            } else if ($scope.team1 < $scope.team2) {
                $scope.medalOne = false;
                $scope.medalTwo = true;
            } else {
                $scope.medalTwo = false;
                $scope.medalOne = false;
            };
            console.log(gameStorage.gameResults);
            console.log(gameStorage.teamPlayersGame);
            $rootScope.loadingShow = false;
            if (facebook.facebookShow == true) {
                $scope.shereShow = true;
            } else {
                $scope.shereShow = false;
            }
        });
        
        
        
        
        var newArray = [];
        function sorting() {

            console.log(newArray.sort(dynamicSort("-totalXp")));
            
        }

        function dynamicSort(property) {
            var sortOrder = 1;
            if (property[0] === "-") {
                sortOrder = -1;
                property = property.substr(1);
            }
            return function (a, b) {
                var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
                return result * sortOrder;
            }
        }
        $scope.sherePlayer = function () {
            facebookConnectPlugin.showDialog({
                method: 'feed',
                link: 'https://apps.facebook.com/967392980007697/',
                caption: 'վերջնական արդյունքներ',
                //picture: 'https://scontent-vie1-1.xx.fbcdn.net/hphotos-xfp1/t31.0-8/10506956_936668339747538_8164793851133561001_o.jpg',
                description: $scope.teamName1 + ' հավաքել է ' + $scope.team1 +' միավոր, ' + $scope.teamName2 + ' հավաքել է ' + $scope.team2 + ' միավոր',
            }, function (response) {
                console.log(response);
            }, function (error) {
                console.log(error);
            });
        }
        $scope.newGame = function () {

            //$scope.$apply();
            location.href = "#/app/home";
        }
    }])
})();