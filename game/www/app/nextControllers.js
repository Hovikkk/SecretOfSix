(function () {
    "use strict";

    angular.module("myapp.controllers")
    .controller("nextCtrl", ["$scope", "$rootScope", "nameStorage", "gameSettings", "$ionicPopup",  function ($scope, $rootScope, nameStorage, gameSettings, $ionicPopup) {
        $("#loopCount").initNumeric($("#loopCount"), 1, 10, 1, selectLoop);
        console.log($ionicPopup);
        $scope.popapData = [];
        $scope.mess = { text: "Text" };
        $rootScope.loadingShow = false;
        $scope.$on('$ionicView.enter', function () {
            $scope.compare();
            $scope.teams = nameStorage.teams;
            console.log($scope.popapData);
            $scope.checkboxError = false;
            $scope.nextQuantityShow = false;
            $scope.types = [];
            $scope.maxErrorloop = false;
            $scope.minErrorloop = false;
            $scope.checkbox = {
                e: false,
                n: false,
                h: false
            } 
            $scope.$apply();
            $rootScope.loadingShow = false;
            
        });
        $scope.nextPopupQuantity = function () {
            $scope.nextQuantityShow = true;
        }
        $scope.closePopupQuantity = function () {
            $scope.nextQuantityShow = false;
        }
        var inputQuantity = [];
        $(function () {
            $(".quantityGame").each(function (i) {
                inputQuantity[i] = this.defaultValue;
                $(this).data("idx", i); // save this field's index to access later
            });
            $(".quantityGame").on("keyup input", function (e) {
                /*var $field = $(this),
                    val = this.value,
                    $thisIndex = parseInt($field.data("idx"), 10); // retrieve the index

                if (val > Number($field.attr("max"))) {
                    val = Number($field.attr("max"));
                    $field.val(val);
                    console.log(val);
                    $field.trigger('input');

                }
                selectLoop(this.value);
                inputQuantity[$thisIndex] = val;
                */
                var val = this.value;
                console.log(val)
                if (val > 10) {
                    $scope.maxErrorloop = true;
                } else {
                    $scope.maxErrorloop = false;
                }
                if (val < 1) {
                    $scope.minErrorloop = true;
                } else {
                    $scope.minErrorloop = false;
                }
                $scope.$apply()
            });
            $(".quantityGame").change("keyup", function (e) {
                /*var $field = $(this),
                    val = this.value,
                    $thisIndex = parseInt($field.data("idx"), 10); // retrieve the index

                if (val > Number($field.attr("max"))) {
                    val = Number($field.attr("max"));
                    $field.val(val);
                    console.log(val);
                    $field.trigger('input');

                }
                console.log(this.value);
                selectLoop(this.value);
                inputQuantity[$thisIndex] = val;*/
                var val = this.value;
                if (val > 10) {
                    val = 10;
                } else {
                    $scope.maxErrorloop = false;
                }
                if (val == 10) {
                    $scope.maxErrorloop = false;
                }
                if (val < 1) {
                    val = 1;
                } else {
                    $scope.minErrorloop = false;
                }
                if (val == 1) {
                    $scope.minErrorloop = false;
                }
                $scope.step = val;
                gameSettings.step = val;
                this.value = val;
                $scope.$apply();
            });
        });
        $scope.$ionicGoBack = function () {
            $rootScope.loadingShow = true;
            console.log("bum");
        }
        $scope.step = 1;
        $scope.types = [];
       
        gameSettings.step = 1;
       function selectLoop(step) {
            console.log(step);
            gameSettings.step = step;
            $scope.$apply();
        }
        $scope.teamsPlayer = [];
        $scope.showAlert = function () {
            $scope.delPlayerDivShow = true;
            nameStorage.listForDel = $scope.popapData;
            console.log(nameStorage.listForDel);
            $scope.delShow = true;
            $scope.members = [];
            $scope.members = nameStorage.listForDel;
            console.log(nameStorage.pleyedTeams);
            var def = []
            for (var i = 0 ; i < $scope.members.length; i++) {
                def.push($scope.members[i]);
            }
            $scope.members = []
            for (var i = 0; i < def.length; i++) {
                $scope.members.push(def[i]);
            }
            $scope.del = function (index) {
                $scope.members.splice(index, 1);
                nameStorage.listForDel = $scope.members;
                if ($scope.members.length == nameStorage.requirementCount) {
                    $scope.delShow = false;

                }
            }
            
            $scope.reset = function () {
                $scope.delShow = true;
                console.log($scope.members);
                console.log(def);
                $scope.members = []
                for (var i = 0; i < def.length; i++) {
                    $scope.members.push(def[i]);
                }
                nameStorage.listForDel = $scope.members;
            }
            /*var alertPopup = $ionicPopup.show({
                templateUrl: 'app/templates/delPlayer.html',
                buttons: [{ // Array[Object] (optional). Buttons to place in the popup footer.
                    type: 'button-default okButton',
                    scope: $scope,
                    
                    onTap: function (e) {
                        console.log(nameStorage.pleyedTeams);

                        console.log(nameStorage.listForDel);
                        nameStorage.pleyedTeams[$scope.largIndex].members = nameStorage.listForDel;
                        if (nameStorage.pleyedTeams[0].members.length != nameStorage.pleyedTeams[1].members.length) {
                            e.preventDefault();
                        }
                    }
                }, {
                    type: 'button-default resetButton',
                    scope: $scope,

                    onTap: function (e) {
                        console.log($(".reset1Button"));
                        console.log();
                        $(".reset1Button").trigger("click");
                        e.preventDefault();
                    }
                }]
            });

            alertPopup.then(function (res) {
                console.log('Thank you for not eating my delicious ice cream cone');
            });*/
        };
        $scope.okButton = function () {
            console.log(nameStorage.pleyedTeams);

            console.log(nameStorage.listForDel);
            nameStorage.pleyedTeams[$scope.largIndex].members = nameStorage.listForDel;
            if (nameStorage.pleyedTeams[0].members.length != nameStorage.pleyedTeams[1].members.length) {
                $scope.delPlayerDivShow = true;
            } else {
                $scope.delPlayerDivShow = false;
            }
        }
        
        
        $scope.reset = function () {

        }

        $scope.compare = function () {
            if (nameStorage.pleyedTeams[0].members.length == nameStorage.pleyedTeams[1].members.length) {
                
            } else {
                console.log(nameStorage.pleyedTeams);
                $scope.popapData = (nameStorage.pleyedTeams[0].members.length > nameStorage.pleyedTeams[1].members.length) ? nameStorage.pleyedTeams[0].members : nameStorage.pleyedTeams[1].members;
                $scope.largIndex = (nameStorage.pleyedTeams[0].members.length > nameStorage.pleyedTeams[1].members.length)?0:1;
                nameStorage.requirementCount = (nameStorage.pleyedTeams[0].members.length > nameStorage.pleyedTeams[1].members.length) ? nameStorage.pleyedTeams[1].members.length : nameStorage.pleyedTeams[0].members.length;
                console.log("a");
                console.log(nameStorage.pleyedTeams[0].members);
                $scope.showAlert();
            }
            console.log("----");
            console.log(nameStorage.teams[0].members[0]);
            console.log("----*");
        }
        $scope.preparingGame = function () {
            $scope.types = [];
            if ($scope.checkbox.e) $scope.types.push('easy');
            if ($scope.checkbox.n) $scope.types.push('normal');
            if ($scope.checkbox.h) $scope.types.push('hard');
            if ($scope.types.length >= 1) {
                nameStorage.typesLevel = $scope.types;
                $rootScope.loadingShow = true;
                location.href = "#/app/preparingGame";
            } else {
                $scope.checkboxError = true;
            }
        }
        $scope.back = function () {
            $rootScope.loadingShow = true;
            location.href = "#/app/play";
        }
    }])
})();