(function () {
    "use strict";
    var Member = (function () {
        function Member() {
            this.name = null;
            this.pic = "./images/new/people2.png";
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
    angular.module("myapp.controllers")
    .controller("editCtrl", ["$scope", "$rootScope", "$cordovaCamera", "$cordovaImagePicker", "nameStorage", "WebSqlDbService", "$ionicPopup", "facebook",  function ($scope, $rootScope, $cordovaCamera, $cordovaImagePicker, nameStorage, WebSqlDbService, $ionicPopup, facebook) {
        
        $scope.team = new Team();
        function checkConnection() {
            var networkState = navigator.connection.type;
            return Connection.NONE != networkState;
        }
        $scope.$on('$ionicView.enter', function () {
            if (checkConnection()) {
                $scope.fbShow = facebook.facebookShow;
            } else {
                $scope.fbShow = false;
            }
            $scope.deletePlayer = true;
            //$scope.fbShow = facebook.facebookShow;
            $scope.team = new Team();
            $scope.team.name = nameStorage.editPlayer.name;
            $scope.team.members = nameStorage.editPlayer.members;
            if ($scope.team.members.length == 2) {
                $scope.deletePlayer = false;
            }
            console.log($scope.team.members);
            for (var i = 0; i < $scope.team.members.length;i++){
                if ($scope.team.members[i].id != null) {
                    uids.push($scope.team.members[i].id);
                }
            }
            console.log(uids);
            $scope.team.id = nameStorage.editPlayer.id;
            $rootScope.loadingShow = false;
        });
        
        
       // console.log($scope.players);
        $scope.popupPhoto = function (s) {
            $scope.chooseSource = false;
            console.log(s);
            navigator.camera.getPicture(function (imageUri) {

                $scope.selectedMember.pic = imageUri;
                $scope.$apply()

            }, null, {
                quality: 50,
                destinationType: navigator.camera.DestinationType.FILE_URI,
                sourceType: s
            });

        }
        $scope.update = function () {
         //   $scope.$apply();
            console.log($scope.team);
            WebSqlDbService.update("teams", { 'name': "'" + $scope.team.name + "'", members: "'" + JSON.stringify($scope.team.members) + "'" }, { id: $scope.team.id }, updateHandler);
            console.log(nameStorage.teams);
            console.log(nameStorage.editPlayer);
            nameStorage.editPlayer.name = $scope.team.name;
            location.href = '#/app/play';
        }
        function updateHandler(e) {
            console.log(e);
        }
        console.log($scope.team.members);
        $scope.delete = function (index) {
            console.log($scope.team);
            console.log($scope.team.members);
            if ($scope.team.members.length > 2) {
                $scope.team.members.splice(index, 1);
                $scope.deletePlayer = true;
                if ($scope.team.members.length <= 2) {
                    $scope.deletePlayer = false;
                }
            } 
        }
        
        $scope.newPlayer = function () {
            if ($scope.team.members.length < 8) {
                $scope.deletePlayer = true;
                $scope.team.members.push(new Member());
            }
        }
        function isPhoneGap() {
            return (cordova || PhoneGap || phonegap)
            && /^file:\/{3}[^\/]/i.test(window.location.href)
            && /ios|iphone|ipod|ipad|android/i.test(navigator.userAgent);
        }
        $scope.teams = [];
        $scope.getTeams = function (e) {
            nameStorage.teams = [];
            
            for (var i = 0; i < e.rows.length; i++) {
                var t = new Team();
                if (isPhoneGap()) {
                    t.name = e.rows.item(i).name;
                    t.members = JSON.parse(e.rows.item(i).members);
                    t.id = e.rows.item(i).id;
                } else {
                    t.name = e.rows[i].name;
                    t.members = JSON.parse(e.rows[i].members);
                    t.id = e.rows[i].id;
                }
                nameStorage.teams.push(t);
            }
            $scope.teams = nameStorage.teams;
            //$scope.teams = nameStorage.teams;
            console.log($scope.teams[0].name);
        }
        
        $scope.takePicture = function (member) {
            $scope.selectedMember = member;
            $scope.chooseSource = true;
        };
        $scope.closePopup = function () {
            $scope.chooseSource = false;
        }
        $scope.friends = [];

        $scope.fbConect = function (e) {
            console.log(facebook.facebookShow);
            
            $scope.fbConectShow = true;
            if (!$(".friendConect ul li:nth-child(1)").hasClass("active")) {
                $(".friendConect ul li:nth-child(1)").addClass("active")
            }
            if ($(".friendConect ul li:nth-child(2)").hasClass("active")) {
                $(".friendConect ul li:nth-child(2)").removeClass("active")
            }
            /*facebookConnectPlugin.api("me/friends?fields=name,picture", ["user_friends"],
                        function (result) {
                            console.log(result);
                            facebook.inGameFriends = result;
                        },
                        function (error) {
                            console.log(error);
                        });*/
            $scope.friends = [];
            console.log(e);
            console.log($scope.team.members[e]);
            $scope.playerNumber = $scope.team.members[e];
            $scope.popupfb(0);
           // $scope.$apply();
        }
        $scope.closeFbPopup = function () {
            $scope.fbConectShow = false;
        }
        var uids = [];
        $scope.popupfb = function (e) {
            //test();
            $scope.allFriend = true;
            //return;
            console.log(e);
            if (e == 1) {
                $scope.friends = [];
                for (var i = 0; i < facebook.allFriends.data.length; i++) {
                    if (uids.indexOf(facebook.allFriends.data[i].id) == -1) {
                        $scope.friends.push({ name: facebook.allFriends.data[i].name, pic: facebook.allFriends.data[i].picture.data.url, id: facebook.allFriends.data[i].id });

                    }
                }
            } else {
                $scope.friends = [];
                for (var i = 0; i < facebook.inGameFriends.length; i++) {
                    if (uids.indexOf(facebook.inGameFriends[i].id) == -1) {
                        $scope.friends.push({ name: facebook.inGameFriends[i].name, pic: facebook.inGameFriends[i].picture.data.url, id: facebook.inGameFriends[i].id });
                    }
                }
            }
            console.log($scope.friends);
        }
        function test() {
            for (var i = 0; i < 10; i++) {
                $scope.friends.push({ name: "name " + i, pic: "images/background.png", id: i });
            }
            console.log($scope.friends);
        }
        $scope.fbAddFriend = function (e) {
            if (uids.indexOf($scope.playerNumber.id) > -1) {
                uids.splice(uids.indexOf($scope.playerNumber.id), 1)
            }
            console.log(e);
            console.log(facebook.allFriends.data[4].name)
            console.log($scope.playerNumber);
            console.log($scope.friends);
            uids.push($scope.friends[e].id);
            $scope.playerNumber.name = $scope.friends[e].name;
            $scope.playerNumber.pic = $scope.friends[e].pic;
            $scope.playerNumber.id = $scope.friends[e].id;
            console.log($scope.playerNumber);
            $scope.popupfb(0);
            $scope.fbConectShow = false;
        }
        $scope.takePicture = function (member) {
            $scope.selectedMember = member;
            $scope.chooseSource = true;
        };
        $scope.closePopup = function () {
            $scope.chooseSource = false;
        }
        $scope.back = function () {
            WebSqlDbService.select("teams", ['id', 'avatar', 'name', 'xp', 'members'], null, 1, $scope.getbackTeams);
            
        }
        $scope.getbackTeams = function (e) {
            nameStorage.teams = [];
            $scope.teams = [];
            for (var i = 0; i < e.rows.length; i++) {
                var t = new Team();
                if (isPhoneGap()) {
                    t.name = e.rows.item(i).name;
                    //t.xp = e.rows.item(i).xp;
                    t.members = JSON.parse(e.rows.item(i).members);
                    t.id = e.rows.item(i).id;
                } else {
                    t.name = e.rows[i].name;
                        //t.xp = e.rows[i].xp;
                    t.members = JSON.parse(e.rows[i].members);
                    t.id = e.rows[i].id;
                }
                nameStorage.teams.push(t);
            }
            $rootScope.loadingShow = true;
            location.href = "#/app/play";
        }

    }])
})();