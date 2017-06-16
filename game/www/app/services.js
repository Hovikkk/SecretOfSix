(function () {
    "use strict";

    angular.module("myapp.services", []).factory("myappService", ["$rootScope", "$http","$ionicPlatform", function ($rootScope, $http,$ionicPlatform) {
        var myappService = {};
        

        //starts and stops the application waiting indicator
        myappService.wait = function (show) {
            if (show)
                $(".spinner").show();
            else
                $(".spinner").hide();
        };

        return myappService;
    }]).service('nameStorage', function () {
        this.namePlayer;
        this.countPlayer;
        this.teams = [];
        this.update = function() {
            console.log("update function from service");
        }
        this.pleyedTeams = [];
        this.listForDel = [];

        this.requirementCount;
        this.typesLevel;
        
        this.resultPlayer;
        this.editPlayer;
        this.teamsUpdate = [];
    //    return this;
    }).service('gameStorage', function (nameStorage) {
        this.teamPlayersGame = nameStorage.pleyedTeams;
        this.step;
        this.playerIndex;
        this.selectedTeamIndex;
        this.gameResults = [];

    }).service('facebook', function () {
        this.allFriends;
        this.inGameFriends;
        this.facebookShow;
    }).service('gameSettings', function () {
        this.step;
    }).service('WebSqlDbService', function ($cordovaSQLite, $ionicPlatform) {
        var db;// = window.openDatabase('gameDB', '1.0', 'Mobile Client DB', 2 * 1024 * 1024);

        
        
        this.createDbAndTables = function () {
            if (isPhoneGap()) {
                console.log($cordovaSQLite);
                db = $cordovaSQLite.openDB({ name: "gameDB" }); //device
            } else {
                db = window.openDatabase('gameDB', '1.0', 'Mobile Client DB', 2 * 1024 * 1024); // browser
            }
            /*db.transaction(function (tx) {
                tx.executeSql('CREATE TABLE IF NOT EXISTS test ( UserInfo TEXT, UserName TEXT)');
            });*/
            if(db){
                db.transaction(function (tx) {
                    //tx.executeSql('DROP TABLE hardWords');
                    tx.executeSql('CREATE TABLE IF NOT EXISTS gameSettings ( ewl INT(7), nwl INT(7), hwl INT(7), ewc INT(7), nwc INT(7), hwc INT(7), ewu INT(7), nwu INT(7), hwu INT(7), id int(5), fblogin INT(1), sound INT(1), timer INT(3), PRIMARY KEY(id))');
                    tx.executeSql('CREATE TABLE IF NOT EXISTS teams ( id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, avatar TEXT, name VARCHAR(25), xp INT(11), members TEXT)');
                    tx.executeSql('CREATE TABLE IF NOT EXISTS easyWords( id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, word TEXT, used BIT, type INT(1))');
                    tx.executeSql('CREATE TABLE IF NOT EXISTS normalWords( id INTEGER PRIMARY KEY AUTOINCREMENT, word TEXT, used BIT, type INT(1))');
                    tx.executeSql('CREATE TABLE IF NOT EXISTS hardWords( id INTEGER PRIMARY KEY AUTOINCREMENT, word TEXT, used BIT, type INT(1))');
                
                });
            } else {
                alert("db not found, your browser does not support web sql!");
            }


        };

        this.baseQuery = function (q, backcall) {
           /* var db;
            if (isPhoneGap()) {

                db = $cordovaSQLite.openDB({ name: "gameDB" }); //device
            } else {
                db = window.openDatabase('gameDB', '1.0', 'Mobile Client DB', 2 * 1024 * 1024); // browser
            }*/
            if (db) {
                db.transaction(function (tx) {
                    tx.executeSql(q, [], function (tx, rs) {
                        backcall(rs);
                    });
                });
            } else {
                alert("db not found, your browser does not support web sql!");
            }
        }
        this.multipleInsertWords = function (tableName, rows, onSuccess) {
            var index = 0;
            var valuesList = [];
            var values = "";
            var valuesForstep = [];

            var steps = false;

            for (var i in rows) {
                
                valuesList.push("(null,\"" + rows[i].word + "\"," + rows[i].used + "," + rows[i].type + ")");
            }

            

            while (valuesList.length > 500) {
                valuesForstep.push(valuesList.splice(0,500).join(","));
            }


            valuesForstep.push(valuesList.join(","));
            /*var db;
            if (isPhoneGap()) {

                db = $cordovaSQLite.openDB({ name: "gameDB" }); //device
            } else {
                db = window.openDatabase('gameDB', '1.0', 'Mobile Client DB', 2 * 1024 * 1024); // browser
            }*/
            var count = valuesForstep.length;

            if (db) {
                
                    db.transaction(function (tx) {
                        for (var j = 0 ; j < valuesForstep.length;j++){
                            tx.executeSql("INSERT INTO " + tableName + " (id, word, used,type) VALUES " + valuesForstep[j], [],
                                function (tx, rs) {
                                    index++;
                                    if (index == count) {
                                        onSuccess(tableName);
                                    }
                                 //   

                                }, function (tx, er) {
                                    console.log(er);
                                }
                            );
                        }
                    });
                
            } else {
                alert("db not found, your browser does not support web sql!");
            }
            

        }
        this.delete = function (tableName, columName, where, backcell) {
            var whereString = [];
            for (var i = 0; i < where.length; i++) {
                whereString.push(columName+" = "+where[i] );
            }

            var query = 'DELETE FROM ' + tableName + ' WHERE ' + whereString.join(" OR ");
            console.log(query)
            /*var db;// = window.openDatabase('gameDB', '1.0', 'Mobile Client DB', 2 * 1024 * 1024);
            if (isPhoneGap()) {

                db = $cordovaSQLite.openDB({ name: "gameDB" }); //device
            } else {
                db = window.openDatabase('gameDB', '1.0', 'Mobile Client DB', 2 * 1024 * 1024); // browser
            }*/
            if (db) {
                db.transaction(function (tx) {
                    tx.executeSql(query, [], function (tx, rs) {
                        console.log(rs);
                        backcell(rs);
                    });
                });
            } else {
                alert("db not found, your browser does not support web sql!");
            }


        }
        this.select = function (tableName, newValues, values, limitNum, backcell, random) {
            var selects = [];
            var where = [];



            for (var key in values) {
                where.push(key + "=" + values[key])
            }

            var updateQuery = 'SELECT ' + newValues.join(', ') + ' FROM ' + tableName;

            if (where.length > 0) {
                updateQuery += ' WHERE ' + where.join(' and ') + ' LIMIT ' + limitNum;
            }

            //console.log(updateQuery)
           /* var db// = window.openDatabase('gameDB', '1.0', 'Mobile Client DB', 2 * 1024 * 1024);
            if (isPhoneGap()) {
                //console.log("_______________________________________________________________________________________________________");
                db = $cordovaSQLite.openDB({ name: "gameDB" }); //device
            } else {
                db = window.openDatabase('gameDB', '1.0', 'Mobile Client DB', 2 * 1024 * 1024); // browser
            }*/

            /*    $cordovaSQLite.execute(db, query, []).then(function (result) {
                    
                    console.log("INSERT ID -> " + result.insertId);
                }, function (error) {
                    console.error(error);
                });
                */
            if (db) {
                console.log(updateQuery);
                db.transaction(function (tx) {
                    tx.executeSql(updateQuery, [], function (tx, rs) {
                        console.log(tx);
                        if (random) {
                            var len = rs.rows.length;
                            if (rs.rows.length == 0) {
                                backcell(null)
                            } else {
                                //generate random number
                                var i = Math.floor(Math.random() * len);
                                //get row
                                var row
                                if (isPhoneGap()) {
                                    row = rs.rows.item(i);
                                } else {
                                    row = rs.rows[i];
                                }
                                backcell(row);
                            }
                        } else {
                            backcell(rs);
                        }
                    }, function (tx, rs) {
                        console.log(tx);

                    });
                });
            } else {
                alert("db not found, your browser does not support web sql!");
            }

        }
        this.insert = function(tableName, values, backcell){
            var value = [];
            var keys = [];
            var symbols = [];

            for (var key in values) {
                keys.push(key);
                symbols.push('?');
                value.push(values[key]);
            }
           
            var query = 'INSERT INTO ' + tableName + ' (' + keys.join() + ') ' + 'VALUES' + ' (' + symbols.join() + ')';
           // console.log(query)
            /*var db;// = window.openDatabase('gameDB', '1.0', 'Mobile Client DB', 2 * 1024 * 1024);
            if (isPhoneGap()) {

                db = $cordovaSQLite.openDB({ name: "gameDB" }); //device
            } else {
                db = window.openDatabase('gameDB', '1.0', 'Mobile Client DB', 2 * 1024 * 1024); // browser
            }*/
            //console.log(query)
            if (db) {
                db.transaction(function (tx) {
                    tx.executeSql(query, value, function (tx, rs) {
                        console.log(tx);
                        backcell(rs.insertId);
                    });
                });
            } else {
                alert("db not found, your browser does not support web sql!");
            }

        }
        this.update = function (tableName, newValues, values, backcell) {
            console.log(tableName);
            var updates = [];
            var where = [];
            
            for (var key in newValues) {
                updates.push(key + "=" + newValues[key]);
            }
            
            for (var key in values) {
                where.push(key + "=" +values[key])
            }

            var updateQuery = 'UPDATE ' + tableName + ' SET ' + updates.join(', ') + ' WHERE ' + where.join(' and ');
            console.log(updateQuery)
           /* var db// = window.openDatabase('gameDB', '1.0', 'Mobile Client DB', 2 * 1024 * 1024);
            if (isPhoneGap()) {
                db = $cordovaSQLite.openDB({ name: "gameDB" }); //device
            } else {
                db = window.openDatabase('gameDB', '1.0', 'Mobile Client DB', 2 * 1024 * 1024); // browser
            }*/
            if (db) {
                db.transaction(function (tx) {
                    tx.executeSql(updateQuery, [], function (tx, rs) {
                        console.log(rs);
                        backcell(rs);
                    });
                });
            } else {
                alert("db not found, your browser does not support web sql!");
            }

        }
        function isPhoneGap() {
            return (cordova || PhoneGap || phonegap)
            && /^file:\/{3}[^\/]/i.test(window.location.href)
            && /ios|iphone|ipod|ipad|android/i.test(navigator.userAgent);
        }
        
        
        
        this.storeUserInfo = function (user,userr) {
            //var db = window.openDatabase('gameDB', '1.0', 'Mobile Client DB', 2 * 1024 * 1024);
            if(db){
                db.transaction(function (tx) {
                    tx.executeSql('INSERT INTO test (UserInfo, UserName) VALUES (?, ?)', [JSON.stringify(user), userr.UserName]);
                });
            } else {
                alert("db not found, your browser does not support web sql!");
            }
        };
        this.deletea = function (rowid) {
            //check to ensure the mydb object has been created
            //var db = window.openDatabase('gameDB', '1.0', 'Mobile Client DB', 2 * 1024 * 1024);
            if (db) {
                
                //Get all the cars from the database with a select statement, set outputCarList as the callback function for the executeSql command
                db.transaction(function (t) {
                    t.executeSql("DELETE FROM gameSettings WHERE rowid=?", [rowid]);
                });
            } else {
                alert("db not found, your browser does not support web sql!");
            }
        }
        
        this.output = function (del) {
            //var db = openDatabase('gameDB', '1.0', 'Mobile Client DB', 2 * 1024 * 1024);
            //check to ensure the mydb object has been created
            if (db) {
                //Get all the cars from the database with a select statement, set outputCarList as the callback function for the executeSql command
                db.transaction(function (t) {
                    t.executeSql("SELECT * FROM gameSettings WHERE tuid =?", [''], function (t, rs) {
                        console.log(rs.rows.length);
                        if (rs.rows.length > 0) {
                            del(rs.rows.length);
                        } else {
                            tx.executeSql('INSERT INTO gameSettings (UserInfo, UserName) VALUES (?, ?)', [JSON.stringify(user), userr.UserName]);
                        }
                        /*var result = [];
                        for (var i = 0; i < rs.rows.length; i++) {
                            var row = rs.rows.item(i)
                            result[i] = {
                                id: row['id'],
                                name: row['name']
                            }
                        } 
                        console.log(result);*/
                    });
               
                    
                });
            } else {
                alert("db not found, your browser does not support web sql!");
            }
        }

    });


})();