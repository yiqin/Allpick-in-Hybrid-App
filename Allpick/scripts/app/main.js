var app = (function () {

    var IchibanAddress = 'No address now';
    var IchibanPhone = '0000';
    
    var turnOnAdd = 0;
    
    var currentUserName = '123';
    
    var sum = "bad new";
    var creatTime = "11"; 
    
    // var statement0 = " Step 2: When you finish your order, click the button - Place the order.";
    var statement1 = " Here is your order: ";
    // var statement2 = " Your order number is: ";
    var statement3 = " Pickup place: ";
    // global var
    var globalTest;
    var cartSum;
    var previousOrderHistory;
    var cartNumber = 0;

    var cartName = new Array(100);
    var cartNum = new Array(100);

    var pickPlace;
    
    var saveCreateTime = function() {
        var temp;
        temp = sum;
        return temp;
    }

    var initOrder = function() {
        for (var i=0; i<100; i++) {
            cartName[i] = 0;
            cartNum[i] = 0;
        }
    }
    
    
    var clickOrder = function(orderName) {
        var orderFlag = new Boolean(true);
        var orderArrayNum = 1;
        for (var i=0; i<100; i++) {
            if (cartNum[i] > 0) {
                orderArrayNum++;
            }
        }
        for (var i=0; i<100; i++) {
            if (orderName == cartName[i]){
                cartNum[i]++;
                orderFlag = false;
            }
        }
        if (orderFlag) {
            cartName[orderArrayNum-1] = orderName;
            cartNum[orderArrayNum-1] = 1;
        }
    }

    var deleteclickOrder = function(orderName) {
        var orderFlag = new Boolean(true);
        var orderArrayNum = 1;
        for (var i=0; i<100; i++) {
            if (cartNum[i] > 0) {
                orderArrayNum++;
            }
        }
        for (var i=0; i<100; i++) {
            if (orderName == cartName[i]){
                if (cartNum[i] > 0) {
                    cartNum[i]--;
                    orderFlag = false;                    
                }

            }
        }

    }    
    
    
    var makeOrder = function() {
        cartSum = "";
        for (var i=0; i<100; i++) {
            if (cartNum[i] > 0 ) {
                cartSum = cartSum+cartName[i]+" "+cartNum[i]+" .";
            }
        }
    }
    
    var updateDate = function() {
        var today = new Date();
        var yyyy = today.getFullYear().toString();
		var mm = (today.getMonth()+1).toString(); //January is 0!
         if (mm.length ==1) {
            mm = 0+mm;
        }         
		var dd = today.getDate().toString();
        if (dd.length ==1) {
            dd = 0+dd;
        }
        
        var hour = today.getHours().toString();
        if (hour.length ==1) {
            hour = 0+hour;
        }
        var minute = today.getMinutes().toString();
        if (minute.length ==1) {
            minute = 0+minute;
        }           
        
        // yyy+"-"+mm+""+dd didn't work.
        return {
            Date: yyyy+" "+mm+"-"+dd,
            Hours: hour+":"+minute
        }
     
    }
    
/////////////////////
	var getLocalStorage = function(e) {
        var getRemoveVariableNameInput = e,
        result = document.getElementById("yourOrderLocal1");
        if (localStorage.getItem(getRemoveVariableNameInput.value) != undefined) {
            result.value = localStorage.getItem(getRemoveVariableNameInput);
        }
        else {
            showAlert("No such record!");
            result.value = "No such record!"
        }
        showAlert("Get local storage successfully !");
        // innerHTML is not a good method. HTML must show first. Otherwise it fails to find the id.
        document.getElementById("yourOrderLocal1").innerHTML = result.value;    
    }

/////////////////////

/////////////////////    
    
    // global error handling
    var showAlert = function(message, title, callback) {
        navigator.notification.alert(message, callback || function () {
        }, title, 'OK');
    };
    var showError = function(message) {
        showAlert(message, 'Error occured');
    };
    
    window.addEventListener('error', function (e) {
        e.preventDefault();
        var message = e.message + "' from " + e.filename + ":" + e.lineno;
        showAlert(message, 'Error occured');
        return true;
    });

    var onBackKeyDown = function(e) {
        e.preventDefault();
        navigator.notification.confirm('Do you really want to exit?', function (confirmed) {
            var exit = function () {
                navigator.app.exitApp();
            };
            if (confirmed === true || confirmed === 1) {
                AppHelper.logout().then(exit, exit);
            }
        }, 'Exit', 'Ok,Cancel');
    };
    
    
    var onDeviceReady = function() {

        //Handle document events
        document.addEventListener("backbutton", onBackKeyDown, false);
        if (device.platform == 'iOS' && device.version >= '7.0') {
        		document.body.style.marginTop = "20px";
        } 
        
        
        if( window.plugins.AdMob && turnOnAdd == 0 ) {
            turnOnAdd = 1;
            var adIdiOS = 'ca-app-pub-1198168277804687/1437413255';
            var adIdAndroid = 'ca-app-pub-1198168277804687/9857160451';
            var adId = (navigator.userAgent.indexOf('Android') >=0) ? adIdAndroid : adIdiOS;
            
        	var am = window.plugins.AdMob;
        	am.createBannerView( 
        		{
        		'publisherId' : adId,
				'adSize' : am.AD_SIZE.BANNER,
				'bannerAtTop' : true
        		}, 
        		function() {
        			am.requestAd({
					'isTesting' : true,
					'extras' : {
						'color_bg' : 'AAAAFF',
						'color_bg_top' : 'FFFFFF',
						'color_border' : 'FFFFFF',
						'color_link' : '000080',
						'color_text' : '808080',
						'color_url' : '008000'
					}}, 
					function() {}, 
					function() {
						alert('Error requesting Ad');
					});
				}, 
				function() {
					alert('Error create Ad Banner');
				}
			);
        } else {
        	alert( 'AdMob plugin not loaded.' );
        }
        
        
    }


    document.addEventListener("deviceready", onDeviceReady, false);

    var applicationSettings = {
        emptyGuid: '00000000-0000-0000-0000-000000000000',
        apiKey: 'B3HXTR1cpka5ETff'
    };

    // initialize Everlive SDK
    var el = new Everlive({
        apiKey: applicationSettings.apiKey
    });
    
    var facebook = new IdentityProvider({
        name: "Facebook",
        loginMethodName: "loginWithFacebook",
        endpoint: "https://www.facebook.com/dialog/oauth",
        response_type:"token",
        client_id: "622842524411586",
        redirect_uri:"https://www.facebook.com/connect/login_success.html",
        access_type:"online",
        scope:"email",
        display: "touch"
    }); 
    
    var AppHelper = {
        resolveImageUrl: function (id) {
            if (id) {
                return el.Files.getDownloadUrl(id);
            }
            else {
                return '';
            }
        },        
        resolveProfilePictureUrl: function (id) {
            if (id && id !== applicationSettings.emptyGuid) {
                return el.Files.getDownloadUrl(id);
            }
            else {
                return 'styles/images/avatar.png';
            }
        },
        // "formateDate" is quite similar to the "updateDate" function.
        formatDate: function (dateString) {
            var date = new Date(dateString);
            var year = date.getFullYear().toString();
            var month = (date.getMonth()+1).toString();
            if (month.length ==1) {
                month = 0+month;
            }            
            var day = date.getDate().toString();
            if (day.length ==1) {
                day = 0+day;
            }              
            var hour = date.getHours().toString();
            if (hour.length ==1) {
                hour = 0+hour;
            }
            var minute = date.getMinutes().toString();
            if (minute.length ==1) {
                minute = 0+minute;
            }            
            return year+'-'+month+'-'+day+' '+hour+':'+minute;
        },
        logout: function () {
            return el.Users.logout();
        }
    };

    var mobileApp = new kendo.mobile.Application(document.body, { transition: 'slide', layout: 'mobile-tabstrip' });

    var usersModel = (function () {
        var currentUser = kendo.observable({ data: null });
        var usersData;
        var loadUsers = function () {
            return el.Users.currentUser()
            .then(function (data) {
                var currentUserData = data.result;
                currentUserData.PictureUrl = AppHelper.resolveProfilePictureUrl(currentUserData.Picture);
                currentUser.set('data', currentUserData);
                return el.Users.get();
            })
            .then(function (data) {
                usersData = new kendo.data.ObservableArray(data.result);
            })
            .then(null,
                  function (err) {
                      showError(err.message);
                  }
            );
        };
        return {
            load: loadUsers,
            users: function () {
                return usersData;
            },
            currentUser: currentUser
        };
    }());

    var loginViewModel = (function () {        
        var login = function () {
            mobileApp.showLoading();
            var username = $('#loginUsername').val();
            var password = $('#loginPassword').val();
			currentUserName = username;
            // This didn't work. The id must be defined first.
            // getLocalStorage();
            el.Users.login(username, password)
            .then(function () {
                return usersModel.load();
            })
            .then(function () {
                mobileApp.hideLoading();
                mobileApp.navigate('views/addNoteView.html');
                
                
            })
            .then(null,
                  function (err) {
                      mobileApp.hideLoading();
                      showError(err.message);
                  }
            );
        };
        var loginWithoutName = function () {
            mobileApp.showLoading();
            var username = 'No Good Name';
            var password = 123456;
            currentUserName = username;
            //showAlert(username);
            el.Users.login(username, password)
            .then(function () {
                return usersModel.load();
            })
            .then(function () {
                mobileApp.hideLoading();
                mobileApp.navigate('views/addNoteView.html');
                previousOrderHistory = usersModel.currentUser.get('data').OrderHistory;
            })
            .then(null,
                  function (err) {
                      mobileApp.hideLoading();
                      showError(err.message);
                  }
            );
        };                 
        var loginWithFacebook = function() {
            mobileApp.showLoading();
            facebook.getAccessToken(function(token) {
                el.Users.loginWithFacebook(token)
                .then(function () {
                    return usersModel.load();
                })
                .then(function () {
                    mobileApp.hideLoading();
                    mobileApp.navigate('views/activitiesView.html');
                })
                .then(null, function (err) {
                    mobileApp.hideLoading();
                    if (err.code = 214) {
                        showError("The specified identity provider is not enabled in the backend portal.");
                    }
                    else {
                        showError(err.message);
                    }
                });
            })
        };		
        
        var moveToSignUpPage = function () {
            mobileApp.navigate('views/signupView.html');
        };
        
        var moveTolocalstorageTest = function () {
            mobileApp.navigate('views/localstorageTest.html');
        }
        
        var opensafari = function () {
			window.open("http://theallpick.com", "_system");          
        }
        
        var movetToichibanAddress = function () {
            mobileApp.navigate('views/ichibanAddress.html');
        }
        
        return {
            login: login,
            loginWithoutName: loginWithoutName,
            moveToSignUpPage: moveToSignUpPage,
            loginWithFacebook: loginWithFacebook,
            moveTolocalstorageTest: moveTolocalstorageTest,
            opensafari: opensafari,
            movetToichibanAddress: movetToichibanAddress,
        };
    }());

    var signupViewModel = (function () {
        var dataSource;
        var signup = function () {
            el.Users.register(
                dataSource.Username,
                dataSource.Password,
                dataSource)
            .then(function () {
                showAlert("Registration successful");
                mobileApp.navigate('#welcome');
            },
                  function (err) {
                      showError(err.message);
                  }
            );
        };
        var show = function () {
            dataSource = kendo.observable({
                Username: '',
                Password: ''
            });
            kendo.bind($('#signup-form'), dataSource, kendo.mobile.ui);
        };
        return {
            show: show,
            signup: signup
        };
    }());

    var notesModel = (function () {
        var noteModel = {
            id: 'Id',
            fields: {
                Title: {
                    field: 'Title',
                    defaultValue: ''
                },
                Text: {
                    field: 'Text',
                    defaultValue: ''
                },
                CreatedAt: {
                    field: 'CreatedAt',
                    defaultValue: new Date()
                },
                UserId: {
                    field: 'UserId',
                    defaultValue: ''
                },
                Pickup: {
                    field: 'Pickup',
                    defaultValue: ''
                },
                Num: {
                    field: 'Num',
                    defaultValue: ''
                },                
            },
            CreatedAtFormatted: function () {
                return moment(this.get('CreatedAt')).calendar();
            },
            User: function () {
                var userId = this.get('UserId');
                var user = $.grep(usersModel.users(), function (e) {
                    return e.Id === userId;
                })[0];
                return {
                    Username: user ? user.Username : 'Anonymous',
                };
            }
        };
        var notesDataSource = new kendo.data.DataSource({
            type: 'everlive',
            schema: {
                model: noteModel
            },
            transport: {
                typeName: 'Activities'
            },
            change: function (e) {
                if (e.items && e.items.length > 0) {
                    $('#no-notes-span').hide();
                }
                else {
                    $('#no-notes-span').show();
                }
            },
            sort: { field: 'CreatedAt', dir: 'desc' },
        });
        return {
            notes: notesDataSource
        };
    }());

    // notes view model
    var notesViewModel = (function () {
        var noteSelected = function (e) {
            mobileApp.navigate('views/noteView.html?uid=' + e.data.uid);
        };
        var navigateHome = function () {
            mobileApp.navigate('#welcome');
        };
        var logout = function () {
            AppHelper.logout()
            .then(navigateHome, function (err) {
                showError(err.message);
                navigateHome();
            });
        };
        return {
            notes: notesModel.notes,
            noteSelected: noteSelected,
            logout: logout,
            noteSum:sum,
        };
    }());

    // note details view model
    var noteViewModel = (function () {
        return {
            show: function (e) {
                var note = notesModel.notes.getByUid(e.view.params.uid);
                kendo.bind(e.view.element, note, kendo.mobile.ui);
            }
        };
    }());

    var listsModel = (function () {
        var listModel = {
            id: 'Id',
            fields: {
                Title: {
                    field: 'Title',
                    defaultValue: ''
                },
                Title: {
                    field: 'TitleEnglish',
                    defaultValue: ''
                },                
                Introduction: {
                    field: 'Introduction',
                    defaultValue: ''
                },
                FoodPhoto: {
                    field: 'FoodPhoto',
                    defaultValue: ''                   
                },
                CreatedAt: {
                    field: 'CreatedAt',
                    defaultValue: new Date()
                },
                UserId: {
                    field: 'UserId',
                    defaultValue: ''
                },
                OrderNumber: {
                    field: 'OrderNumber',
                    defaultValue: ''
                },
                OrderCount: {
                    field: 'OrderCount',
                    defaultValue: ''
                }                 
            },
            
            PictureUrl: function () {
                return AppHelper.resolveImageUrl(this.get('FoodPhoto'));
            },            
            CreatedAtFormatted: function () {
                return moment(this.get('CreatedAt')).calendar();
            },
            User: function () {
                var userId = this.get('UserId');
                var user = $.grep(usersModel.users(), function (e) {
                    return e.Id === userId;
                })[0];
                return {
                    Username: user ? user.Username : 'No Good Name.',
                };
            }
        };
        var listsDataSource = new kendo.data.DataSource({
            type: 'everlive',
            schema: {
                model: listModel
            },
            transport: {
                typeName: 'MenuList'
            },
            change: function (e) {
                if (e.items && e.items.length > 0) {
                    $('#no-notes-span').hide();
                }
                else {
                    $('#no-notes-span').show();
                }
            },
            // sorting
            sort: { field: 'CreatedAt', dir: 'desc' },
        });
        return {
            lists: listsDataSource,
            listModel: listModel
        };
    }());

    // notes view model
    var listsViewModel = (function () {

        var listSelected = function (e) {
            mobileApp.navigate('views/menuView.html?uid=' + e.data.uid);
        };
        var navigateHome = function () {
            mobileApp.navigate('#welcome');
        };
        var logout = function () {
            AppHelper.logout()
            .then(navigateHome, function (err) {
                showError(err.message);
                navigateHome();
            });
        };
        var addNumber = function (e) {
            // get the list data !
            var $dataItem = e.data;
            globalTest = $dataItem.Title;
            clickOrder(globalTest);
            showAlert("Order successful");
        };


        return {
            lists: listsModel.lists,
            listSelected: listSelected,
            logout: logout,
            addNumber:addNumber,
        };

    }());

    // note details view model
    var listViewModel = (function () {
        return {
            show: function (e) {
                var list = listsModel.lists.getByUid(e.view.params.uid);
                kendo.bind(e.view.element, list, kendo.mobile.ui);
            }
        };
    }()); 
    
    var addOrderViewModel = (function () {
        var $newNote;
        var $newNoteTitle;
        var validator;
        var noteInProgress;
        var number;
        var addNumber = function () {
            mobileApp.navigate('#welcome');
        }
        var init = function () {
            notesModel.notes.bind('error', function(resp) {
                var msg;
                notesModel.notes.unbind('sync');
                if(notesModel.notes.hasChanges()) {
                    notesModel.notes.cancelChanges(noteInProgress);
                }
                try {
                    msg = JSON.parse(resp.xhr.responseText).message;
                } catch(ex) {
                    msg = "An unknown error has occurred.";
                }
                navigator.notification.alert(msg, function() {}, "Error");
            });
            validator = $('#enterNote').kendoValidator().data("kendoValidator");
            $newNote = $('#newNote');
            $newNoteTitle = $('#newNoteTitle');
        };
        var show = function () {
            $newNote.val('');
            validator.hideMessages();
        };
        var syncAction = function () {
            noteInProgress = undefined;
            mobileApp.navigate('#:back');
        };
        var saveNote = function () {
            if (validator.validate()) {
                var notes = notesModel.notes;
                noteInProgress = notes.add();
                noteInProgress.Text = $newNote.val();
                noteInProgress.Title = $newNoteTitle.val();
                noteInProgress.UserId = usersModel.currentUser.get('data').Id;
                notes.one('sync', syncAction);
                notes.sync();
            }
        };

        return {
            init: init,
            show: show,
            me: usersModel.currentUser,
            saveNote: saveNote,
            addNumber: addNumber,
        };
    }());     
    
    // add note view model
    var addNoteViewModel = (function () {
        // to make a distinction between regular vars and jQuery objects.
        var $newNote;
        var $newNoteTitle;
        var test;
        
        var currentUserInfo;
        
        test = "hello world";
        
        var validator;
        var noteInProgress;
        var init = function () {
            notesModel.notes.bind('error', function(resp) {
                var msg;
                notesModel.notes.unbind('sync');
                if(notesModel.notes.hasChanges()) {
                    notesModel.notes.cancelChanges(noteInProgress);
                }
                try {
                    msg = JSON.parse(resp.xhr.responseText).message;
                } catch(ex) {
                    msg = "An unknown error has occurred.";
                }
                navigator.notification.alert(msg, function() {}, "Error");
            });
            validator = $('#enterNote').kendoValidator().data("kendoValidator");
            $newNote = $('#newNote');
            $newNoteTitle = $('#newNoteTitle');
            
        };
        var show = function () {
            $newNote.val('');
            validator.hideMessages();
        };
        var syncAction = function () {
            noteInProgress = undefined;
            //mobileApp.navigate('views/addNoteView2.html');
        };
        var potter = function () {
            
        navigator.notification.confirm('Physics Building.', function (confirmed) {
            if (confirmed === true || confirmed === 1) {
                pickPlace = "Physics Building.";
                
                mobileApp.navigate('views/menu.html');
                
            }
        }, 'Pickup location:', 'Ok,Cancel');  
            
            
            
        };
        var hawkins = function () {
            
        navigator.notification.confirm('Hawkins.', function (confirmed) {
            if (confirmed === true || confirmed === 1) {
                pickPlace = "Hawkins.";
                
                mobileApp.navigate('views/menu.html');   
                
            }
        }, 'Pickup location:', 'Ok,Cancel');              
            
        };
        
        // Just move to activitiesView.html
        // This is feedback page.
        var movetoFeedback = function () {                
                mobileApp.navigate('views/activitiesView.html');                     
        };        
        // Just move to youOder.html
        var movetoOrder = function () {                
                mobileApp.navigate('views/yourOrder.html');                     
        }; 
        
        var saveNote = function () {
            var r;
            makeOrder();
            // get current time.
            var today = new Date();
            currentTime = today.getHours();
            
            // 10: the server close at 11:00
            if (cartSum.length > 1 && currentTime <= 10) {

                // after that, sync.  
                navigator.notification.confirm(statement1+cartSum+statement3+pickPlace, function (confirmed) {
                    if (confirmed === true || confirmed === 1) {
        
                        
                    {
                        var notes = notesModel.notes;
                        noteInProgress = notes.add();
                        // add
                        makeOrder();
                        noteInProgress.Text = cartSum;
                        noteInProgress.Pickup = pickPlace;
                        noteInProgress.UserId = usersModel.currentUser.get('data').Id;
                        noteInProgress.currentUser = currentUserName;
                        noteInProgress.Date = updateDate().Date;
                        noteInProgress.Hours = updateDate().Hours;
                        // not sure about the definition of "Title"
                        noteInProgress.Title = $newNoteTitle.val();
        
                        
                        var count;
                        var todayDate = updateDate().Date;
                        
                        // Count plus filtering
                        var filter = {
                            "Date" : todayDate
                        };                
                        // Ajax request using jQuery 
                        // javascrip SDK didn't work.
                        $.ajax({               
                            async:false,
                            url: 'https://api.everlive.com/v1/B3HXTR1cpka5ETff/Activities/_count',
                            type: "GET",
                            headers: {"Authorization" : "Bearer your-access-token-here", "X-Everlive-Filter" : JSON.stringify(filter) },
                            success: function(data){
                               cartNumber = JSON.stringify(data);
                                var length = cartNumber.length;
                                switch(length){
                                    case 12:
                                        count = cartNumber[10];
                                        break;
                                    case 13:
                                        count = cartNumber[10]+cartNumber[11];
                                        break;
                                    case 14:
                                        count = cartNumber[10]+cartNumber[11]+cartNumber[12];
                                        break;    
                                }
                            },
                            error: function(error){
                                showAlert("it is bad");
                            },
                        });                  
                        
        
                        //showAlert(count);
                        sum = "Your order number is: "+count+", "+cartSum+" Pickup place: "+pickPlace;
                        document.getElementById("myHeader").innerHTML=statement1+cartSum;
                        document.getElementById("myHeader2").innerHTML=statement3+pickPlace;

						// save "sum" into local storage.
                        // "sum" contains order information.
						// showAlert(sum);
                        // localStorage.setItem(currentUserName,sum);
                        
                        
                        creatTime = usersModel.currentUser.get('data').CreatedAt;
                        saveCreateTime(sum);
                        noteInProgress.Num = count;
                        //showAlert("create time "+creatTime);
                       
                        //showAlert(previousOrderHistory);
                        previousOrderHistory = previousOrderHistory+'#'+cartSum +'#'+count;
               
                        // Add Order history into users
                        // I don't think it works.
                        //Everlive.$.Users.updateSingle({ Id: noteInProgress.UserId, 'OrderHistory': previousOrderHistory });               
                        
                        notes.one('sync', function() {
                            mobileApp.navigate('views/addNoteView.html');
                        });
                        notes.sync();
                                
                        document.getElementById("yourOrderLocal1").innerHTML= sum;
                        //document.getElementById("yourOrderLocal1").innerHTML= statement2+count;
                        //document.getElementById("yourOrderLocal2").innerHTML= statement1+cartSum;
                        //document.getElementById("yourOrderLocal3").innerHTML= statement3+pickPlace;
                        
            			// showAlert(currentUserName);
                        
                        // call the function to get local storage.
						// getLocalStorage();
						
                        
                        document.getElementById("myHeader").innerHTML="Click what you want.";
                        document.getElementById("myHeader2").innerHTML="";    
                        
                        initOrder();
                        
                    }                
                        
                        
                    }
                }, 'You cart:', 'Ok,Cancel');   
                        
                    } // if statement
            else if ((cartSum.length > 1 && currentTime > 10)||(cartSum.length <= 1 && currentTime > 10))  {
                showAlert("Please order between 00:00 - 11:00 am");
            }
            else {
                showAlert("Your cart is empty. Please make an order.");
            }      
        };
        
////////////////////////////////        
   
        var listSelected = function (e) {
            mobileApp.navigate('views/menuView.html?uid=' + e.data.uid);
        };
        var navigateHome = function () {
            mobileApp.navigate('#welcome');
        };

        var addNumber = function (e) {
            // get the list data !
            var $dataItem = e.data;
            // $globalTest =  $('#OrderCountID');
			globalTest = $dataItem.Title;
            
            var r = true;//confirm("Add"+" "+globalTest)
            if (r==true) {
             	
            	clickOrder(globalTest);   
                makeOrder();
                
            	document.getElementById("myHeader").innerHTML=statement1+cartSum;
                document.getElementById("myHeader2").innerHTML=statement3+pickPlace;
            }

            //showAlert(creatTime);
            //mobileApp.navigate('#welcome');
        };
        var deleteNumber = function (e) {
            // get the list data !
            var $dataItem = e.data;
            // $globalTest =  $('#OrderCountID');
			globalTest = $dataItem.Title;
            
            var r = true;//confirm("Delete"+" "+globalTest)
            if (r==true) {
             	
            	deleteclickOrder(globalTest);   
                makeOrder();
                //document.getElementById("myHeader0").innerHTML= statement0;
            	document.getElementById("myHeader").innerHTML=statement1+cartSum;
                document.getElementById("myHeader2").innerHTML=statement3+pickPlace;
            }

            //showAlert(creatTime);
            //mobileApp.navigate('#welcome');
        };
        var moveBack = function () {
            mobileApp.navigate('#:back');
        };        
        
        
               
//////////////////////////////////        
        
        return {
            init: init,
            show: show,
            me: usersModel.currentUser,
            saveNote: saveNote,
            potter: potter,
            hawkins: hawkins,
            movetoFeedback: movetoFeedback,
            movetoOrder: movetoOrder,
            
            lists: listsModel.lists,
            listSelected: listSelected,
            addNumber:addNumber,
            
            deleteNumber:deleteNumber,
            
            moveBack:moveBack,
            
            
        };
    }());
    
    

    
    
    
//////////////
//////////////
    // Update: 11/14/2013
/////////////    
	// prepare the datasource of comments
    var activitiesModel = (function () {
        var activityModel = {
            id: 'Id',
            fields: {
                Text: {
                    field: 'Text',
                    defaultValue: ''
                },
                CreatedAt: {
                    field: 'CreatedAt',
                    defaultValue: new Date()
                },
                Picture: {
                    fields: 'Picture',
                    defaultValue: ''
                },
                UserId: {
                    field: 'UserId',
                    defaultValue: ''
                },
                Likes: {
                    field: 'Likes',
                    defaultValue: []
                }
            },
            CreatedAtFormatted1: function () {
                return AppHelper.formatDate(this.get('CreatedAt'));
            },           
            PictureUrl: function () {
                return AppHelper.resolvePictureUrl(this.get('Picture'));
            },
            User: function () {
                var userId = this.get('UserId');
                var user = $.grep(usersModel.users(), function (e) {
                    return e.Id === userId;
                })[0];
                return {
                    Username: user ? user.Username : 'No Good Name.',
                };
            }
        };
        var activitiesDataSource = new kendo.data.DataSource({
            type: 'everlive',
            schema: {
                model: activityModel
            },
            transport: {
                // required by Everlive
                typeName: 'Feedback'
            },
            change: function (e) {
                if (e.items && e.items.length > 0) {
                    $('#no-activities-span').hide();
                }
                else {
                    $('#no-activities-span').show();
                }
            },
            sort: { field: 'CreatedAt', dir: 'desc' },
        });
        return {
            activities: activitiesDataSource
        };
    }());    

    
    // view some comments model
    var activitiesViewModel = (function () {
        var activitySelected = function (e) {
            mobileApp.navigate('views/activityView.html?uid=' + e.data.uid);
        };
        var navigateHome = function () {
            mobileApp.navigate('#welcome');
        };
        var logout = function () {
            AppHelper.logout()
            .then(navigateHome, function (err) {
                showError(err.message);
                navigateHome();
            });
        };
        return {
            activities: activitiesModel.activities,
            activitySelected: activitySelected,
            logout: logout
        };
    }());    
    
    // add operation some comments model    
    var addActivityViewModel = (function () {
        var $newStatus;
        var validator;
        var init = function () {
            validator = $('#enterStatus').kendoValidator().data("kendoValidator");
            $newStatus = $('#newStatus');
        };
        var show = function () {
            $newStatus.val('');
            validator.hideMessages();
        };
        var saveActivity = function () {
            if (validator.validate()) {
                var activities = activitiesModel.activities;
                var activity = activities.add();
                activity.Text = $newStatus.val();
                activity.UserId = usersModel.currentUser.get('data').Id;
                activities.one('sync', function () {
                    mobileApp.navigate('#:back');
                });
                activities.sync();
            }
        };
        return {
            init: init,
            show: show,
            me: usersModel.currentUser,
            saveActivity: saveActivity
        };
    }());    
    
//////////////
//////////////
    // Update: 12/29/2013
/////////////    
	// prepare the datasource of orders
    var orderListsModel = (function () {
        var orderListModel = {
            id: 'Id',
            fields: {
                Text: {
                    field: 'Text',
                    defaultValue: ''
                },
                CreatedAt: {
                    field: 'CreatedAt',
                    defaultValue: new Date()
                },
                UserId: {
                    field: 'UserId',
                    defaultValue: ''
                },
                Num: {
                    field: 'Num',
                    defaultValue: []
                },
            },
            CreatedAtFormatted2: function () {
                return AppHelper.formatDate(this.get('CreatedAt'));
            },           
            User: function () {
                var userId = this.get('UserId');
                var user = $.grep(usersModel.users(), function (e) {
                    return e.Id === userId;
                })[0];
                return {
                    Username: user ? user.Username : '123',
                };
            }
        };
        var orderListsDataSource = new kendo.data.DataSource({
                  type: 'everlive',
                  transport: {
                    read: {
                      url: "https://api.everlive.com/v1/B3HXTR1cpka5ETff/Activities"
                    }
                  },
                  schema: {
                    model: orderListModel,
                  },
                  filter: { 
                      field: 'currentUser', 
                      operator: 'eq', 
                      value: $('#loginUsername').val()
                  },
                  sort: {
                    field: "CreatedAt",
                    dir: "desc"
                  },
                  
                  serverPaging: true,
                  serverSorting: true,
                  pageSize: 10
                });

        
        return {
            orderLists: orderListsDataSource
        };
    }());    

    
    // view some comments model
    var orderListsViewModel = (function () {
        var orderListSelected = function (e) {
            mobileApp.navigate('views/activityView.html?uid=' + e.data.uid);
        };
        return {
            orderLists: orderListsModel.orderLists,
        };
    }()); 



/////////////
    //    Update: 01/02/2014
	//    for ichiban
/////////////    
    var IchibanAddressViewModel = (function () {
        var getAddress = function () {
       		// showAlert(IchibanAddress); 
        	// showAlert(IchibanPhone);
            // Address
			IchibanAddress = localStorage.getItem("allpickAddress");
            if (IchibanAddress != undefined) {
                document.getElementById("yourAddress").innerHTML=IchibanAddress;
            }
            else {
                // showAlert("Please enter your address below.");
                document.getElementById("yourAddress").innerHTML = "Please enter your address below."
            }
            // Phone
			IchibanPhone = localStorage.getItem("allpickPhone");
            if (IchibanPhone != undefined) {
                document.getElementById("yourPhone").innerHTML=IchibanPhone;
            }
            else {
                // showAlert("000-000-0000");
                document.getElementById("yourPhone").innerHTML = "000-000-0000"
            }            
        };        

        var submit = function () {
            //showAlert($('#submitIchibanAddress').val());
            localStorage.setItem("allpickAddress",$('#submitIchibanAddress').val());
            document.getElementById("yourAddress").innerHTML = $('#submitIchibanAddress').val();
            IchibanAddress = $('#submitIchibanAddress').val();
            
            localStorage.setItem("allpickPhone",$('#submitIchibanPhone').val());
            document.getElementById("yourPhone").innerHTML = $('#submitIchibanPhone').val();
            IchibanPhone = $('#submitIchibanAddress').val();
            
            window.scrollTo(0, 0);
            window.scrollTo(0, 0);
            showAlert('submit successfully');
        };
        
        
        return {
            getAddress: getAddress,
            submit: submit

        };        
    }());
    
    
/////////////    
    return {
        sum:sum,
        creatTime: creatTime,
        saveCreateTime:saveCreateTime,
        viewModels: {
            login: loginViewModel,
            signup: signupViewModel,
            notes: notesViewModel,
            note: noteViewModel,
            lists: listsViewModel,
            list: listViewModel,
            addNote: addNoteViewModel,
            addOrder:addOrderViewModel,
            activities: activitiesViewModel,
            addActivity: addActivityViewModel,
            orderLists: orderListsViewModel,
            IchibanAddress: IchibanAddressViewModel,            
        }
    };
}());