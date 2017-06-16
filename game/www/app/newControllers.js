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
    .controller("newCtrl", ["$scope", "$rootScope", "$cordovaCamera", "$cordovaImagePicker", "nameStorage", "WebSqlDbService", "$ionicPopup", "facebook", function ($scope, $rootScope, $cordovaCamera, $cordovaImagePicker, nameStorage, WebSqlDbService, $ionicPopup, facebook) {
        
        function checkConnection() {
            var networkState = navigator.connection.type;
            return Connection.NONE != networkState;
        }
        $scope.countPlayer;
        $scope.players;
        $scope.friends;
        $scope.$on('$ionicView.enter', function () {
            $("#player_count").initNumeric($("#player_count"), 2, 8, 2, setPlayerCount); $scope.namePlayer;
            if (checkConnection()) {
                $scope.fbShow = facebook.facebookShow;
            } else {
                $scope.fbShow = false;
            }
            $scope.namePlayer = "Թիմ ";
            $scope.countPlayer = 2;
            $scope.players = [];
            $scope.friends = [];
            $scope.minShow = false;
            $scope.maxShow = false;
            $scope.quantityShow = false;
            uids = [];
            updata();
            $rootScope.loadingShow = false;
        });
        
        
        $scope.save = function (countPlayer, namePlayer) {
           // nameStorage.namePlayer = namePlayer;
          //  nameStorage.countPlayer = countPlayer;
            var team = new Team();
            team.name = namePlayer;
            team.members = $scope.players;
            if (nameStorage.teams) {
                nameStorage.teams.push(team);
            } else {
                nameStorage.teams = [];
                nameStorage.teams.push(team);
            }

            for (var i = 0; i < team.members.length; i++) {
                //team.members[i].id = i;
                team.members[i].xp = 0;
            }


            nameStorage.update()
            WebSqlDbService.insert("teams", { name: team.name, members:JSON.stringify(team.members)}, successSave);
            WebSqlDbService.select("teams", ['id', 'avatar', 'name', 'xp', 'members'], null, 1, $scope.getTeams);
            //console.log(nameStorage);

        }

        function isPhoneGap() {
            return (cordova || PhoneGap || phonegap)
            && /^file:\/{3}[^\/]/i.test(window.location.href)
            && /ios|iphone|ipod|ipad|android/i.test(navigator.userAgent);
        }
        $scope.getTeams = function (e) {
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
            $scope.teams = nameStorage.teams;
            //$scope.teams = nameStorage.teams;
            console.log($scope.teams);
            
        }
        function successSave(e) {
            location.href = '#/app/play';
        }

        function setPlayerCount(countPlayer) {
            console.log(countPlayer);
            $scope.countPlayer = countPlayer;
            console.log($scope.countPlayer);
            updata();
            
        }
        
        function updata() {
            console.log($scope.players);
            if ($scope.players) {
                if ($scope.countPlayer > $scope.players.length) {
                    while ($scope.countPlayer > $scope.players.push(new Member())) { /*here is nothing to do*/
                    }
                }
                if ($scope.countPlayer < $scope.players.length) {
                    $scope.players.splice($scope.countPlayer, $scope.players.length - $scope.countPlayer);

                }
                $scope.$apply();
                console.log($scope.countPlayer);
                console.log($scope.players);
                if (($scope.players.length >= 2) && (facebook.facebookShow == true) && checkConnection()) {
                    $scope.fbShow = true;
                    $scope.$apply();
                } else {
                    $scope.fbShow = false;
                }
                $scope.$applyAsync();
            }
        };
       
        $scope.selectedMember;
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
        
        $scope.popupQuantity = function () {
            $scope.quantityShow = true;
        }
        $scope.closePopupQuantity = function () {
            $scope.quantityShow = false;
        }
        var inputQuantity = [];
        $(function () {
            $(".quantityTeame").each(function (i) {
                inputQuantity[i] = this.defaultValue;
                $(this).data("idx", i); // save this field's index to access later
            });
            $(".quantityTeame").on("keyup input", function (e) {
                /*
                var val = this.value
                console.log(val);
                if (val < 2) {
                    val = 2;
                }
                if (val > 8) {
                    val = 8;
                }

                $scope.countPlayer = val;
                this.value = val;
                $scope.$apply();
                updata();
                */
                var val = this.value;
                console.log(val)
                if (val < 2) {
                    $scope.minShow = true;
  //                  val = 2;
                } else {
                    $scope.minShow = false;
                }
                if (val > 8) {
                    $scope.maxShow = true;
//                    val = 8;
                } else {
                    $scope.maxShow = false;
                }
                $scope.$apply()
                
            });
            

            $(".quantityTeame").change(function (e) {
                
               var val = this.value
                console.log(val);
                if (val < 2) {
                    val = 2;
                    
                } else {
                    $scope.minShow = false;
                }
                if (val == 2) {
                    $scope.minShow = false;
                }
                
                if (val > 8) {
                    val = 8;
                    
                } else {
                    $scope.maxShow = false;
                }
                if (val == 8) {
                    $scope.maxShow = false;
                }
                
                $scope.countPlayer = val;
                this.value = val;
                $scope.$apply();
                updata();
               // setPlayerCount(val);
           //     inputQuantity[$thisIndex] = val;
            });
            
        });
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
            console.log($scope.players[e]);
            $scope.playerNumber = $scope.players[e];
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
            if (e == 1) {
                $scope.friends = [];
                for(var i=0; i<facebook.allFriends.data.length; i++){
                    if (uids.indexOf(facebook.allFriends.data[i].id)==-1) {
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
            
        }

        function test() {
            for (var i = 0; i < 10; i++) {
                $scope.friends.push({ name: "name "+i, pic: "images/background.png", id: i });
            }
            console.log($scope.friends);
        }
        $scope.fbAddFriend = function (e) {
            
            if (uids.indexOf($scope.playerNumber.id) > -1) {
                uids.splice(uids.indexOf($scope.playerNumber.id), 1)
            }
            uids.push($scope.friends[e].id);
            $scope.playerNumber.name = $scope.friends[e].name;
            $scope.playerNumber.pic = $scope.friends[e].pic;
            $scope.playerNumber.id = $scope.friends[e].id;
            console.log($scope.playerNumber);
            $scope.popupfb(0);
            $scope.fbConectShow = false;
            console.log(uids)
            
        }
        $scope.takePicture = function (member) {
            $scope.selectedMember = member;
            $scope.chooseSource = true;
        };
        $scope.closePopup = function () {
            $scope.chooseSource = false;
        }
        $scope.back = function () {
            $rootScope.loadingShow = true;
            location.href = "#/app/play";
        }
    }])
})();