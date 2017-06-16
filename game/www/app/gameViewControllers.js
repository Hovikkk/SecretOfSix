(function () {
    "use strict";

    angular.module("myapp.controllers")
    .controller("gameViewCtrl", ["$scope", "$rootScope", "nameStorage", "gameStorage", "WebSqlDbService", function ($scope, $rootScope, nameStorage, gameStorage, WebSqlDbService) {
        var gameIsStarted = false;
        var gameTimer = 0;
        var interval;
        var radius;
        var startAngle;
        var colorRed;
        var colorGreen;
        var colorBlue;
        var value;



        $scope.$on('$ionicView.enter', function () {
            $scope.chooseReset = false;
            $scope.pauseGame = false;
            $scope.resetErr = false;
            gameIsStarted = false;
            WebSqlDbService.select("gameSettings", ['ewl', 'nwl', 'hwl', 'ewc', 'nwc', 'hwc', 'ewu', 'nwu', 'hwu', 'id', 'sound', 'timer'], { rowid: 1 }, 1, $scope.getSettings);
 //           WebSqlDbService.select("hardWords", ['id', 'word', 'used', 'type'], null, 1, $scope.getHardWords);
            $scope.currectTeam = gameStorage.teamPlayersGame[gameStorage.selectedTeamIndex];
            $scope.currectMember = $scope.currectTeam.members[gameStorage.playerIndex];
            console.log(gameStorage.selectedTeamIndex, gameStorage.playerIndex, gameStorage.step);
            if (gameStorage.selectedTeamIndex == 0) {
                $scope.opponentTeam = gameStorage.teamPlayersGame[1];
                $scope.opponentMember = $scope.opponentTeam.members[gameStorage.playerIndex];
                console.log($scope.opponentTeam);
                console.log($scope.opponentMember);
            } else {
                $scope.opponentTeam = gameStorage.teamPlayersGame[0];
                $scope.opponentMember = $scope.opponentTeam.members[gameStorage.playerIndex];
                console.log($scope.opponentTeam);
                console.log($scope.opponentMember);
                
            }
            if (gameStorage.selectedTeamIndex) {
                $scope.teamIcon2 = false;
                $scope.teamIcon1 = true;
                $scope.playerIndexNumber = gameStorage.playerIndex;
            } else {
                $scope.teamIcon1 = false;
                $scope.teamIcon2 = true;
                $scope.playerIndexNumber = gameStorage.playerIndex;
            }
            cardModes = [];
            $scope.showWords();
            $scope.readyShow = false;
            $scope.divBlocked = false;
            $scope.resultShow = true;
            $scope.readShow = false;
            $scope.easyShow = false;
            $scope.cards = [];
            $scope.selword = [];
            $scope.resultWord = [];
            $scope.readSelword = [];
            
            $scope.number = 0;
            
            //$scope.$broadcast('timer-add-cd-seconds', 40);
            $scope.$apply();
            //$scope.$broadcast('timer-set-countdown', 3);
            //$scope.$broadcast('timer-start');
            
            
            
        });
        
        /*$scope.getHardWords = function (e) {
            console.log(e);
            var usedHardWordLength = 0;
            for (var i = 0; i < e.rows.length; i++) {
                if (isPhoneGap()) {
                    if (e.rows.item(i).used == 1) {
                        usedHardWordLength++;
                    }
                } else {
                    if (e.rows[i].used == 1) {
                        usedHardWordLength++;
                    }
                }

            }
            console.log(usedHardWordLength);
            console.log(e.rows.length);
            if (usedHardWordLength == e.rows.length) {
                $scope.resetErr = true;
            }
        }*/

        function isPhoneGap() {
            return (cordova || PhoneGap || phonegap)
            && /^file:\/{3}[^\/]/i.test(window.location.href)
            && /ios|iphone|ipod|ipad|android/i.test(navigator.userAgent);
        }
        function setIntervalTimer() {
            var canvas = document.getElementById('myCanvas');
            var context = canvas.getContext('2d');
            var x = canvas.width / 2;
            var y = canvas.height / 2;
            
            var endAngle = 1.5 * Math.PI;
            var counterClockwise = false;

            var delta = (2 * 500 / (gameTimer * 1000))
            var cDelta = (255 * 500 / (gameTimer * 1000));
            
            interval = setInterval(function () {
                context.beginPath();
                value += delta;
                startAngle = value * Math.PI;
                context.clearRect(x - radius - 20, y - radius - 20, radius * 2 + 40, radius * 2 + 40);
                context.arc(x, y, radius, startAngle, endAngle, counterClockwise);
                context.lineWidth = 15;

                // line color
                context.strokeStyle = "rgb(" + Math.floor(colorRed) + "," + Math.floor(colorGreen) + "," + Math.floor(colorBlue) + ")";
                console.log(colorRed + "," + colorGreen + "," + colorBlue)
                console.log("hello");
                colorRed += 2 * cDelta
                if (colorRed > 255) {
                    colorRed = 255;
                    colorGreen -= 2 * cDelta
                }
                if (colorGreen < 0.1) {
                    clearInterval(interval)
                }
                context.stroke();
            }, 500)
        }
        $scope.getSettings = function (e) {
            if (isPhoneGap()) {
                gameTimer = e.rows.item(0).timer;
            } else {
                gameTimer = e.rows[0].timer;
               
            }
            radius = 75;
            startAngle = -0.5 * Math.PI;
            colorRed = 0;
            colorGreen = 255;
            colorBlue = 0;
            value = -0.5;
            setIntervalTimer();
            console.log(gameTimer);
            $scope.$broadcast('timer-set-countdown', gameTimer);
            $scope.$broadcast('timer-stop');
            //$scope.$broadcast('timer-set-countdown', e.rows[0].timer);
            
        }

        

        $scope.cards = []

        console.log(nameStorage.typesLevel);
        var wordTableIndex
        var loopIndex;

        $scope.showWords = function () {
            $scope.words = [];
            wordTableIndex = Math.floor(Math.random() * (nameStorage.typesLevel.length - 0.3));
            cardModes.push(nameStorage.typesLevel[wordTableIndex]);
            //$scope.$apply();
            loopIndex = 0;
            if (nameStorage.typesLevel[wordTableIndex] == "easy") {
                $scope.cardMode = 0;
                $scope.imgGV = "./images/gameView/easyIcon.png";
                $(".resetGV").addClass("esayIconReset");
            }else if (nameStorage.typesLevel[wordTableIndex] == "normal") {
                $scope.cardMode = 1;
                $scope.imgGV = "./images/gameView/normalIcon.png";
                $(".resetGV").addClass("normalIconReset");
            } else if (nameStorage.typesLevel[wordTableIndex] == "hard") {
                $scope.cardMode = 2;
                $scope.imgGV = "./images/gameView/hardIcon.png";
                $(".resetGV").addClass("hardIconReset");
            };
            loop()
        }
        
        function loop() {
            

            if (loopIndex < 6) {
                WebSqlDbService.select(nameStorage.typesLevel[wordTableIndex] + "Words", ['id', 'word', 'used', 'type'], { type: loopIndex, used: 0 }, 100, $scope.getEasyWords, true);
            } else {
                $scope.$apply();

                var tmp = [];
                for (var i = 0; i < $scope.words.length; i++) {
                    tmp[i] = $scope.words[i];
                }
                $scope.cards.push(tmp);
                console.log(!gameIsStarted);
                if (!gameIsStarted) {
                    gameIsStarted = true;
                    $rootScope.loadingShow = false;
                    $scope.$apply();
                    $scope.$broadcast('timer-start');
                    
                }
                ;
                $rootScope.loadingShow = false;
                $scope.$apply()
               // setTimeout(function () {
                    
              //  }, 500)
            }
        }
        
        
        $scope.resetPopup = function () {
            WebSqlDbService.update(nameStorage.typesLevel[wordTableIndex] + "Words", { used: 0 }, { used: 1 }, updateComplate);
            $scope.chooseReset = false;
            $scope.$broadcast('timer-start');
        }
        $scope.closePopup = function () {
            $rootScope.loadingShow = true;
            location.href = '#/app/home';
        }
        function updateComplate() {
            
            loop(); 
            $rootScope.loadingShow = true;
        }
        $scope.words = [];
        $scope.getEasyWords = function (e) {
            console.log(e);
            if (e == null) {
                $rootScope.loadingShow = false;

                $scope.$apply();
                $scope.chooseReset = true;
                $scope.$broadcast('timer-stop');
                $scope.$apply();
            } else {
                $scope.words.push(e.word);
                console.log($scope.words);
                WebSqlDbService.update(nameStorage.typesLevel[wordTableIndex] + "Words", { 'used': 1 }, { id: e.id }, setUsed);
            }
        }
        function setUsed(e) {

            loopIndex++;
            loop();
            
        }
        $scope.selword = [];
        $scope.selectWords = function (index) {
            if ($scope.selword.indexOf(index) == -1) {
                $scope.selword.push(index);
            } else {
                $scope.selword.splice($scope.selword.indexOf(index), 1);
            }
            if ($scope.selword.length == 6) {
                $scope.readyShow = true;
            } else {
                $scope.readyShow = false;
            }
            console.log($scope.selword);
        }
        $scope.readWords = [];
        $scope.readSelword = [];
        $scope.resultWord = [];
        var cardModes = [];
        $scope.readSelectWords = function (index) {
            var mode = cardModes[$scope.number];
            var count = 0;
            console.log(mode)
            if (mode == "easy") {
                count = 1;
            } else if (mode == "normal") {
                count = 2;
            } else if (mode == "hard") {
                count = 3;
            };
            

            if ($scope.readSelword.indexOf(index) == -1) {
                $scope.readSelword.push(index);
            } else {
                $scope.readSelword.splice($scope.readSelword.indexOf(index), 1);
            }
            
            console.log($scope.resultWord.indexOf(6 * $scope.number + index))
            if ($scope.resultWord.indexOf(6 * $scope.number + index) == -1) {
                for (var i = 0; i < count;i++)
                    $scope.resultWord.push(6 * $scope.number + index);
            } else {
                for (var i = 0; i < count; i++)
                $scope.resultWord.splice($scope.resultWord.indexOf(6 * $scope.number + index), 1);
            }
            console.log($scope.resultWord);
            if ($scope.readSelword.length == 6) {
                console.log($scope.cards.length);
                if ($scope.number < $scope.cards.length-1) {
                    $scope.number++;
                    $scope.readSelword = [];
                }
                
                //$scope.$apply();
                console.log($scope.number);
            }
        }
        $scope.stepResult = function () {
          
            nameStorage.resultPlayer = $scope.resultWord.length;
            console.log($scope.resultWord.length);
            gameStorage.gameResults[gameStorage.playerIndex][gameStorage.selectedTeamIndex].xp = $scope.resultWord.length;
            gameStorage.gameResults[gameStorage.playerIndex][gameStorage.selectedTeamIndex].totalXp += $scope.resultWord.length;
            $rootScope.loadingShow = true;
            location.href = '#/app/stepResult';
        }
        $scope.saveWords = [];
        $scope.gameView = function () {
            $scope.selword = [];
            $scope.saveWords.push($scope.words);
            $scope.showWords();
            $scope.readyShow = false;
        }
        $scope.endView = function () {
            clearInterval(interval);
            $scope.$broadcast('timer-stop');
            $scope.divBlocked = true;
        }
        $scope.closeDivBlock = function () {
            $scope.divBlocked = false;
            $scope.resultShow = false;
            $scope.readShow = true;
            console.log($scope.words);
            //$scope.readWords.push($scope.words);
        }
        $scope.finished = function () {
            //location.href = '#/app/stepResult';
            $scope.divBlocked = true;
            $scope.$apply();
            console.log($scope.cards);
        }
        $scope.continueButton = function () {
            $scope.pauseGame = false;
            $scope.$broadcast('timer-start');
            setIntervalTimer();
        }
        $scope.back = function () {
            clearInterval(interval);
            $scope.$broadcast('timer-stop');
            $scope.pauseGame = true;
            //location.href = "#/app/home";
        }
    }])
})();