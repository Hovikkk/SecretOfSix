(function () {
    "use strict";

    angular.module("myapp.controllers")
    .controller("setingsCtrl", ["$scope", "$rootScope", "WebSqlDbService",  function ($scope, $rootScope, WebSqlDbService) {
       
        
        $scope.$on('$ionicView.enter', function () {
            
            $rootScope.loadingShow = false;
            $scope.newWord = false;
            updateInfos();
          //  $scope.soundActiv = true;
            $scope.timerShow = false;
            document.addEventListener("backbutton", onBackKeyDown, false);
            function onBackKeyDown() {
                console.log("sasasas");
                $("#timerInput:focus").css("margin-top", "0")
            }
            $scope.$apply();
        });
        $scope.closePopupTimer = function(){
            $scope.timerShow = false;
        }
        
        
       // WebSqlDbService.select("easyWords", ['id', 'word', 'used', 'type'], { used: 1 }, 100, getEasyWords, true);
  //      updateInfos();
        //$scope.minute = 1;
        //$scope.second = 0;
        var normalWordsvalue = 25;
        var esayWordsvalue = 25;
        var hardWordsvalue = 25;
        var data = {};
        $scope.timerPopup = function () {
            $scope.timerShow = true;
        }
        function updateInfos() {
            WebSqlDbService.select("gameSettings", ['ewl', 'nwl', 'hwl', 'ewc', 'nwc', 'hwc', 'ewu', 'nwu', 'hwu', 'id', 'sound', 'timer'], { rowid: 1 }, 1, getSettings);
            WebSqlDbService.baseQuery("SELECT * FROM easyWords;", getEasyWords);
            WebSqlDbService.baseQuery("SELECT * FROM normalWords;", getNormalWords);
            WebSqlDbService.baseQuery("SELECT * FROM hardWords;", getHardWords);
        }

        function getEasyWords(e) {
           
            console.log(e);
            var usedEasyWordLength = 0;
            for (var i = 0; i < e.rows.length; i++) {
                if (isPhoneGap()) {
                    if (e.rows.item(i).used == 1) {
                        usedEasyWordLength++;
                    }
                } else {
                    if (e.rows[i].used == 1) {
                        usedEasyWordLength++;
                    }
                }
                
            }

            
            

            var endValue = Math.floor(5 + 20 * (usedEasyWordLength / e.rows.length));
            console.log(endValue);
            var delta;
            console.log(esayWordsvalue == endValue);
            if (esayWordsvalue == endValue) {
                return
            }
            esayWordsvalue = endValue;
            $(".easySettingsIcon").animate({ "height": endValue + "vw" }, 1500)
            $scope.$apply();


        }
        function getNormalWords(e) {

            console.log(e);

            var usedNormalWordLength = 0;
            for (var i = 0; i < e.rows.length; i++) {
                if (isPhoneGap()) {
                    if (e.rows.item(i).used == 1) {
                        usedNormalWordLength++;
                    }
                } else {
                    if (e.rows[i].used == 1) {
                        usedNormalWordLength++;
                    }
                }
            }
 //           $('.easypiechart#normalpercent').data('easyPieChart').update(usedNormalWordLength * 100 / e.rows.length);
            console.log(usedNormalWordLength);
            console.log(e.rows.length)
            console.log(usedNormalWordLength * 100 / e.rows.length);
            var endValue = Math.floor(5 + 20 * (usedNormalWordLength / e.rows.length));
            console.log(endValue);
            var delta;
            console.log(normalWordsvalue == endValue);
            if (normalWordsvalue == endValue) {
                return
            }
            normalWordsvalue = endValue;
            $(".normalSettingsIcon").animate({ "height": endValue + "vw" },1500)
            $scope.$apply();
            
        }
        function getHardWords(e) {

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
  //          $('.easypiechart#hardpercent').data('easyPieChart').update(usedHardWordLength * 100 / e.rows.length);
            console.log(usedHardWordLength);
            console.log(e.rows.length)
            console.log(usedHardWordLength * 100 / e.rows.length);
            
            

            var endValue = Math.floor(5 + 20 * (usedHardWordLength / e.rows.length));
            console.log(endValue);
            var delta;
            console.log(hardWordsvalue == endValue);
            if (hardWordsvalue == endValue) {
                return
            }
            hardWordsvalue = endValue;
            $(".hardSettingsIcon").animate({ "height": endValue + "vw" }, 1500)
            $scope.$apply();
        }
        function getSettings(e) {
            console.log(e.rows)
            if (isPhoneGap()) {
                data = e.rows.item(0);
            } else {
                data = e.rows[0]
            }
            ;
            console.log(data);
            
            $scope.num = data.timer;
            console.log($scope.num);
            $scope.minute = Math.floor($scope.num / 60);
            $scope.second = $scope.num - $scope.minute * 60;
            $scope.soundActiv = data.sound != 0;
            $scope.soundNone = data.sound == 0;
            (data.sound == 0) ? $scope.soundChecked.value = false : $scope.soundChecked.value = true;
            $scope.$apply();
        }
        $scope.saveTimer = function (num) {
            data.timer = num;
            update();
        }
        
        $scope.soundChecked = {
            value : false
        }
        console.log($scope.soundChecked.value);
        function getCordovaPath() {
            var absolutePath = window.location.pathname;
            //14 is length of html file name(including .html) 
            actualPath = absolutePath.substr( path, path.length - 14 );
            return 'file://' + actualPath;
        }

        function playAudio() {
            
        }
        $scope.saveSound = function () {
            playAudio();
            (data.sound==0)?data.sound=1 :data.sound=0;
            console.log($scope.soundChecked.value);
            /*if ($scope.soundActiv) {
                $scope.soundActiv = false;
                $scope.soundNone = true;
            } else {
                $scope.soundActiv = true;
                $scope.soundNone = false;
            }
            */
            //
            update();
        }
        function isPhoneGap() {
            return (cordova || PhoneGap || phonegap)
            && /^file:\/{3}[^\/]/i.test(window.location.href)
            && /ios|iphone|ipod|ipad|android/i.test(navigator.userAgent);
        }
        $scope.reset = function (type) {
           
            //must be logic
            // used count must be 0
            // words  must be unused
            resetAllwords(type);
           
            WebSqlDbService.update(type + "Words", {used:0}, {used: 1 }, updateComplate)
           // update();
        }

        function resetAllwords(type) {

        }
        function update() {
            WebSqlDbService.update("gameSettings", data, { rowid: 1 }, updateComplate)
        }

        function updateComplate(e) {
            updateInfos();
        }

        $(function () {
            $('.easypiechart#easypercent').easyPieChart({
                //your options goes here
                barColor: "#2ec13f",
                trackColor: '#edeef0',
                scaleColor: '#d2d3d6',
                scaleLength: 5,
                lineCap: 'square',
                lineWidth: 2,
                size: 90,
                onStep: function (from, to, percent) {
                    $(this.el).find('.percent').text(Math.round(percent));
                }
            });
        });
        $(function () {
            $('.easypiechart#normalpercent').easyPieChart({
                //your options goes here
                barColor: "#cfdb0e",
                trackColor: '#edeef0',
                scaleColor: '#d2d3d6',
                scaleLength: 5,
                lineCap: 'square',
                lineWidth: 2,
                size: 90,
                onStep: function (from, to, percent) {
                    $(this.el).find('.percent').text(Math.round(percent));
                }
            });
        });
        $(function () {
            $('.easypiechart#hardpercent').easyPieChart({
                //your options goes here
                barColor: "#e73c3c",
                trackColor: '#edeef0',
                scaleColor: '#d2d3d6',
                scaleLength: 5,
                lineCap: 'square',
                lineWidth: 2,
                size: 90,
                onStep: function (from, to, percent) {
                    $(this.el).find('.percent').text(Math.round(percent));
                }
            });
        });

        var inputQuantity = [];
        $(function () {
            $(".quantity").each(function (i) {
                inputQuantity[i] = this.defaultValue;
                $(this).data("idx", i); // save this field's index to access later
            });
            $(".quantity").on("keyup", function (e) {
                console.log("keyup");
                var $field = $(this),
                    val = this.value,
                    $thisIndex = parseInt($field.data("idx"), 10); // retrieve the index
                
                if (val > Number($field.attr("max"))) {
                    val = Number($field.attr("max"));
                    $field.val(val);
                    console.log(val);
                    $field.trigger('input');

                }
                console.log(this.value);
                $scope.timer(this.value);
                inputQuantity[$thisIndex] = val;
                
            });
            $(".quantity").change(function (e) {
                console.log("change");
                var $field = $(this),
                    val = this.value,
                    $thisIndex = parseInt($field.data("idx"), 10); // retrieve the index

                if (val > Number($field.attr("max"))) {
                    val = Number($field.attr("max"));
                    $field.val(val);
                    console.log(val);
                    $field.trigger('input');

                }
                console.log(this.value);
                $scope.timer(this.value);
                inputQuantity[$thisIndex] = val;
            });
        });
        

        $scope.timer = function (num) {
            console.log("num - "  + num);
            if (num >= 0) {
                if (num > 999) {
                    num = 999;
                }
                $scope.minute = Math.floor(num / 60);
                $scope.second = num - $scope.minute * 60;
                
            } else {
                $scope.minute = 0;
                $scope.second = 0;
            }
            console.log($scope.minute);
            console.log($scope.second);
            $scope.$apply();
        };
        console.log($scope.minute);
        console.log($scope.second);
        $scope.fbLogout = function () {
            facebookConnectPlugin.logout(function (response) {
                // user is now logged out
                console.log(response)
            });
        }
        $scope.back = function (num) {
            
            if (num == undefined) {
                num = 300;
            }
            console.log(num);
            data.timer = num;
            update();
            $rootScope.loadingShow = true;
            location.href = "#/app/home";
        }
    }])
})();