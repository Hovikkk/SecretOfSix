(function () {
    "use strict";

    angular.module("myapp.controllers")
    .controller("playCtrl", ["$scope", "$rootScope", "nameStorage", "gameStorage", "$cordovaSQLite", "WebSqlDbService",  function ($scope, $rootScope, nameStorage, gameStorage, $cordovaSQLite, WebSqlDbService) {
        /*$ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0,
            hideOnStateChange: true,
            template: '<div class="loadingSpiner"><img src="images/gameslogo.png" class="logoLoad" alt="logo"><ion-spinner icon="spiral"></ion-spinner></div>'
        });*/
        $scope.$on('$ionicView.enter', function () {
            
            $scope.teams = [];
            $scope.$apply();
            $scope.teams = nameStorage.teams;
            nameStorage.pleyedTeams = [];
            gameStorage.teamPlayersGame = [];
            gameStorage.gameResults = [];
            $scope.array = [];
            $scope.deleteShow = false;
            $scope.editShow = false;
            $scope.del = false;
            $scope.$apply();
            $scope.nextShow = false;
            $scope.hintText = false;
            $rootScope.loadingShow = false;
            if ($scope.teams.length >= 1) {
                $scope.newPageShow = true;
                $scope.newPageHide = false;
            } else {
                $scope.newPageShow = false;
                $scope.newPageHide = true;
            }
            console.log($scope.newPageShow);
            console.log($scope.newPageHide);
            //$scope.nextShow = false;
            
            //$ionicLoading.hide();
        });

        
        
        var Member = (function () {
            function Member() {
                this.name = null;
                this.pic = null;
                this.fbuid = null;
                this.xp = null;
                this.id = null;
            }
            return Member;
        })();

        var Team = (function () {
            function Team() {
                this.name = null;
                this.members = [];
                this.id = null;
                this.xp = null;
            }
            return Team;
        })();

        $scope.array = [];

        $scope.teams = [];

        $scope.delete = function () {
            var arrayForDelete = [];
            for (var i = 0; i < $scope.array.length;i++){
                arrayForDelete.push($scope.teams[$scope.array[i]].id);

            }

            WebSqlDbService.delete('teams', "id", arrayForDelete, deleteComplateHandler);
            $scope.hintText = false;
        }
        function deleteComplateHandler() {

            WebSqlDbService.select("teams", ['id', 'avatar', 'name', 'xp', 'members'], null, 1, getTeams);
            $scope.deleteShow = false;
            $scope.array = [];
            $scope.nextShow = false;
            $scope.editShow = false;

        }
        $scope.edit = function () {
            var arrayForEdit;
            for (var i = 0; i < $scope.array.length; i++) {
                arrayForEdit = $scope.teams[$scope.array[i]];
                nameStorage.editPlayer = arrayForEdit;
                //console.log(arrayForEdit);
            }
            $rootScope.loadingShow = true;
            location.href = '#/app/editForTeams';
        }
        function isPhoneGap() {
            return (cordova || PhoneGap || phonegap)
            && /^file:\/{3}[^\/]/i.test(window.location.href)
            && /ios|iphone|ipod|ipad|android/i.test(navigator.userAgent);
        }
        function getTeams(e) {
            nameStorage.teams = [];
            $scope.teams = [];
            for (var i = 0; i < e.rows.length; i++) {
                var t = new Team();
                if (isPhoneGap()) {
                    t.name = e.rows.item(i).name;
                    t.xp = e.rows.item(i).xp;
                    t.members = JSON.parse(e.rows.item(i).members);
                    t.id = e.rows.item(i).id;
                    $scope.$apply()
                } else {
                    t.name = e.rows[i].name;
                    t.xp = e.rows[i].xp;
                    t.members = JSON.parse(e.rows[i].members);
                    t.id = e.rows[i].id;
                    $scope.$apply()
                }
                nameStorage.teams.push(t);
                
            }
            console.log(nameStorage.teams);
            $scope.teams = nameStorage.teams;
            if ($scope.teams.length >= 1) {
                $scope.newPageShow = true;
                $scope.newPageHide = false;
            } else {
                $scope.newPageShow = false;
                $scope.newPageHide = true;
            }
            console.log($scope.newPageShow);
            $scope.array = [];
            $scope.$apply();
        }
        $scope.select = function (index) {
            $scope.deleteShow = true;
            $scope.editShow = true;
            //$scope.delete();
            if ($scope.array.indexOf(index) == -1) {
                $scope.array.push(index);
                console.log($scope.del);
                $scope.del = true
                
                console.log(nameStorage.teams[index].members.length);

            } else {
                $scope.array.splice($scope.array.indexOf(index), 1);

            }
            if ($scope.array.length == 2) {
                $scope.nextShow = true;
                $scope.hintText = false;
                console.log($scope.hintText)
            } else {
                $scope.nextShow = false;
                $scope.hintText = true;
            }
            console.log($scope.array);
            if ($scope.array.length > 1) {
                $scope.editShow = false;
            }
            
            if ($scope.array.length == 0) {
                $scope.editShow = false;
                $scope.deleteShow = false;
            }
        }
        $scope.pleyedTeams = [];
        $scope.new = function () {
            $scope.array = [];
            $rootScope.loadingShow = true;
            location.href = '#/app/new';
        }
        console.log($scope.array.length);
        
        $scope.next = function () {
            
            //WebSqlDbService.delete(2);

            if ($scope.array.length == 2) {
                gameStorage.teamPlayersGame = [];
                nameStorage.pleyedTeams = [];
                nameStorage.teamsUpdate = [];
                for (var i = 0; i < $scope.array.length; i++) {
                    nameStorage.pleyedTeams.push(nameStorage.teams[$scope.array[i]])
                    var t = new Team();
                    t.name = nameStorage.teams[$scope.array[i]].name;
                    
                    t.id = nameStorage.teams[$scope.array[i]].id;
                    t.xp = nameStorage.teams[$scope.array[i]].xp;
                    console.log(nameStorage.teams[$scope.array[i]]);
                    t.avatar = nameStorage.teams[$scope.array[i]].avatar;
                    for (var j = 0; j < nameStorage.teams[$scope.array[i]].members.length; j++) {
                        var m = new Member();
                        m.pic = nameStorage.teams[$scope.array[i]].members[j].pic;
                        m.xp = nameStorage.teams[$scope.array[i]].members[j].xp;
                        m.name = nameStorage.teams[$scope.array[i]].members[j].name;
                        m.id = nameStorage.teams[$scope.array[i]].members[j].id;
                        m.fbuid = nameStorage.teams[$scope.array[i]].members[j].fbuid;
                        t.members.push(m);
                    }
                    nameStorage.teamsUpdate.push(t)
                    console.log(nameStorage.teamsUpdate);
                }
                gameStorage.teamPlayersGame = nameStorage.pleyedTeams
                console.log(nameStorage.pleyedTeams);
                console.log(nameStorage.teams);
                
                location.href = '#/app/nextGameSettings';
            }
        }
        $scope.back = function () {
            $rootScope.loadingShow = true;
            location.href = "#/app/home";
        }


    }])
})();