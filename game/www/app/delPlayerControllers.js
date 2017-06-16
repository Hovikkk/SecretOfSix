(function () {
    "use strict";

    angular.module("myapp.controllers")
    .controller("delPlayerCtrl", ["$scope", "nameStorage", function ($scope, nameStorage) {
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
        /*if (nameStorage.teams[0].members.length != nameStorage.teams[1].members.length) {
           
        }*/
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
    }])
})();