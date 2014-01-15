var app = (function () {

    // Global valurable
    // Some valurables are not used.
    var IchibanAddress = 'No address now';
    var IchibanPhone = '0000';
        
    var currentUserName = '123';
    
    var sum = "bad new";
    var creatTime = "11"; 
    
    // var statement0 = " Step 2: When you finish your order, click the button - Place the order.";
    var statement1 = " Here is your order: ";
    // var statement2 = " Your order number is: ";
    var statement3 = " Pickup place: ";
    
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
    
    // When the user click add button, "clickOrder" function is executed.
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

    // When the user click delete button, "deleteclickOrder" function is executed.
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
    
    // Get the order list - (string type).
    var makeOrder = function() {
        cartSum = "";
        for (var i=0; i<100; i++) {
            if (cartNum[i] > 0 ) {
                cartSum = cartSum+cartName[i]+" "+cartNum[i]+" .";
            }
        }
    }
    
    // Date function. Get date.
    // return two valuables. Date, Hours.
    var updateDate = function() {
        var today = new Date();
        var yyyy = today.getFullYear().toString();
		var mm = (today.getMonth()+1).toString(); //January is 0.
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
    // showAlert, showError, window.addEventListener, onBackKeyDown are default functions from sample code.
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
///////////////////// 
    
    // When the app is initialized, onDeviceReady is executed for only one time.
    var onDeviceReady = function() {   
        //Handle document events
        document.addEventListener("backbutton", onBackKeyDown, false);
        
        // Status Bar Style
        // Set the status bar to "Hide". No need to set 20px now.
        // 20px
        // if (device.platform == 'iOS' && device.version >= '7.0') {
        // 		document.body.style.marginTop = "20px";
        // } 

		// Get device ID. This is the unique number for device. It's used in identifying the user.
        var deviceName = window.device.name;
        var deviceId = window.device.uuid;
        var deviceOs = window.device.platform;
        var deviceOsVersion = window.device.version;
        
        // showAlert(deviceId); 
        
        // initialize banner ads from AdMob
        // https://github.com/yiqin/cordova-plugin-admob.git
        // AdMob doesn't work in Simulation. Only work in device.
        if( window.plugins.AdMob ) {
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
					'isTesting' : false,
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
    
    // facebook login.
    // Not used here.
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
    
    // AppHelper
    // contains logout. logout function is not used here.
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
        // Default function.
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

    // loginViewModel --> login 
    // data-model="app.viewModels.login"
    // data-model load functions from loginViewModel
    // deviceID is used here. We don't have login page. So username is not used here.
    // Basically we only use mobileApp.navigate('views/addNoteView.html');
    // move to addNoteView.html.(second page)
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
        
        // If user loginWithoutName, then username is assigned "No Good Name".
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
        
        // navigation function. Move to different pages.
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

    // singnupViewModel --> signup
    // data-model="app.viewModels.signup"
    // No used here.
    // not sure about data-show. (01/07/2014)
    // data-show="app.viewModels.signup.show"
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

//////////////////////////
    ////// Activities: for Great Wall
    ////// Back-End
    ////// Get DataSource
//////////////////////////
    // Activities Datasource is for saving orders.
    // We don't use Activities Datasource in Front-End.
    //
    // Before fetching and creating items in Activities, we need to initialize it.
    // All are inclued in notesModel. Note that it is not named with ViewModel.
    // I directly copy the code from the sample code. So noteModel --> Activities.
    //
    // Two step:
    // (1). noteModel
    //      Initialize object types. fields are cooresponsed to contents in items in Activities.
    // (2). notesDataSource
    //      Get the data from Everlive with filtering, sorting, paging.
    //
    // Only return notes: notesDataSource
    // This function is not directly called. In "notesViewModel", this function is called thought "notes: notesModel.notes,"
    // A little tricky there.
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
        // kendo data DataSource
        var notesDataSource = new kendo.data.DataSource({
            type: 'everlive',
            schema: {
                model: noteModel
            },
            // For different Types, just change typeName.
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
            // sorting according to the create time.
            sort: { field: 'CreatedAt', dir: 'desc' },
        });
        return {
            notes: notesDataSource
        };
    }());

    // ViewModel for Activities
    // Display Activities in a list.
    // This is Font-End function
    // not used here.
    // The way to call Types Activitis.
    // notes(in html) --> notesViewModel --> notes --> notesModel.notes
    var notesViewModel = (function () {
        var noteSelected = function (e) {
            mobileApp.navigate('views/noteView.html?uid=' + e.data.uid);
        };
        var navigateHome = function () {
            mobileApp.navigate('#welcome');
        };
        // No logout perfermance here.
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

    // ViewModel for a specified item in Activities.
    // not used here.
    var noteViewModel = (function () {
        return {
            show: function (e) {
                var note = notesModel.notes.getByUid(e.view.params.uid);
                kendo.bind(e.view.element, note, kendo.mobile.ui);
            }
        };
    }());
    

//////////////////////////
    ////// Activities: for Great Wall Menu
    ////// Back-End
    ////// Get DataSource    
//////////////////////////    
    
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
        // Check this function.
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
            }, 'Pickup location:', 'OK,Cancel');  
        };
        var hawkins = function () {
            navigator.notification.confirm('Hawkins.', function (confirmed) {
                if (confirmed === true || confirmed === 1) {
                    pickPlace = "Hawkins.";
                    mobileApp.navigate('views/menu.html');   
                }
            }, 'Pickup location:', 'OK,Cancel');
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
            // 10 --> 11:00
            var limitTime = 10;
            
            // 10: the server close at 11:00
            if (cartSum.length > 1 && currentTime <= limitTime) {

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
                        
                        // noteInProgress.currentUser = currentUserName;
                        noteInProgress.currentUser = window.device.uuid;
                        
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
                            headers: {"Authorization" : "0QJ0Hrc7POtaGodFTwqOO86Tzn2vPNIF", "X-Everlive-Filter" : JSON.stringify(filter) },
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
            else if ((cartSum.length > 1 && currentTime > limitTime)||(cartSum.length <= 1 && currentTime > limitTime))  {
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
            
            // Get dota from listsModel.lists
            lists: listsModel.lists,
            listSelected: listSelected,
            addNumber:addNumber,
            
            deleteNumber:deleteNumber,
            
            moveBack:moveBack,
            
            
        };
    }());
    
    

    
    
    
//////////////////////////
    // Update: 11/14/2013
//////////////////////////    
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
    

/////////////
    //    Update: 01/02/2014
	//    for ichiban
/////////////    
    var IchibanAddressViewModel = (function () {
        var getAddressFlag = false;
        var getPhoneFlag = false;
     
        var getAddress = function () {
       		// showAlert(IchibanAddress); 
        	// showAlert(IchibanPhone);
            // Address
            // iOS and Android are different for IchibanAddress != ''
            // iOS != ''
            // Android != undefined
			IchibanAddress = localStorage.getItem("allpickAddress");
            if (IchibanAddress != '') {
                document.getElementById("yourAddress").innerHTML=IchibanAddress;
                getAddressFlag = true;
            }
            else {
                // showAlert("Please enter your address below.");
                document.getElementById("yourAddress").innerHTML = "Please enter your address below."
            }
            // Phone
			IchibanPhone = localStorage.getItem("allpickPhone");
            if (IchibanPhone != '') {
                document.getElementById("yourPhone").innerHTML=IchibanPhone;
                getPhoneFlag = true; 
            }
            else {
                // showAlert("000-000-0000");
                document.getElementById("yourPhone").innerHTML = "Please enter your phone number below."
            }            
        };        

        var submitAddress = function () {
            if ($('#submitIchibanAddress').val() != '') {
                window.scrollTo(0, 0);
                localStorage.setItem("allpickAddress",$('#submitIchibanAddress').val());
                //document.getElementById("yourAddress").innerHTML = $('#submitIchibanAddress').val();
                IchibanAddress = $('#submitIchibanAddress').val();
                document.getElementById("yourAddress").innerHTML=IchibanAddress;
                getAddressFlag = true;
            }
            else {
                showAlert("Enter your address");
            }
        };
        
        var submitPhone = function () {
            if ($('#submitIchibanPhone').val() != '') {
                // window.scrollTo(0, 0)
                // This solution doesn't work effectively.
                window.scrollTo(0, 0);
                localStorage.setItem("allpickPhone",$('#submitIchibanPhone').val());
                //document.getElementById("yourPhone").innerHTML = $('#submitIchibanPhone').val();
                IchibanPhone = $('#submitIchibanPhone').val();
                document.getElementById("yourPhone").innerHTML=IchibanPhone;
                getPhoneFlag = true;                  
            }
            else {
                showAlert("Enter your phone");
            }            
        };

        
		var moveToIchibanMenu = function () {
            // clear cartSum
            if (getAddressFlag == false)
            {
                showAlert('Invalid address');
            }
            else if (getPhoneFlag == false)
            {
                showAlert('Invalid phone');
            }
            else
            {
                cartSum = '';
                pickPlace = IchibanAddress;
                mobileApp.navigate('views/ichibanMenu.html');                
            }
        }
        var moveToIchibanOrder = function () {
            mobileApp.navigate('views/ichibanOrder.html');                
        }
        
        return {
            getAddress: getAddress,
            submitAddress: submitAddress,
            submitPhone: submitPhone,
            moveToIchibanMenu: moveToIchibanMenu,
            moveToIchibanOrder: moveToIchibanOrder,
        };        
    }());


/////////////
    //    Update: 01/13/2014
	//    for ichiban
///////////// 
    var IchibanlistsModel = (function () {
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
                typeName: 'IchibanMenu'
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

    var IchibannotesModel = (function () {
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
                Phone: {
                    field: 'Phone',
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
        // kendo data DataSource
        var notesDataSource = new kendo.data.DataSource({
            type: 'everlive',
            schema: {
                model: noteModel
            },
            // For different Types, just change typeName.
            transport: {
                typeName: 'IchibanActivities'
            },
            change: function (e) {
                if (e.items && e.items.length > 0) {
                    $('#no-notes-span').hide();
                }
                else {
                    $('#no-notes-span').show();
                }
            },
            // sorting according to the create time.
            sort: { field: 'CreatedAt', dir: 'desc' },
        });
        return {
            notes: notesDataSource
        };
    }());
    
    // add note view model
    // take care of note view model.
    var IchibanMenuViewModel = (function () {
        // to make a distinction between regular vars and jQuery objects.
        var $newNote;
        var $newNoteTitle;
        
        var currentUserInfo;
                
        var validator;
        var noteInProgress;
        var init = function () {
            //showAlert('test');
            // auto fetch local item.
            mobileApp.showLoading();
            IchibannotesModel.notes.bind('error', function(resp) {
                var msg;
                IchibannotesModel.notes.unbind('sync');
                if(IchibannotesModel.notes.hasChanges()) {
                    IchibannotesModel.notes.cancelChanges(noteInProgress);
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
            // auto fetch local item.
            IchibanAddressViewModel.getAddress();
            mobileApp.hideLoading();
        };
        var show = function () {
            $newNote.val('');
            validator.hideMessages();
        };
        var syncAction = function () {
            noteInProgress = undefined;
            //mobileApp.navigate('views/addNoteView2.html');
        };
    
        var saveNote = function () {
            makeOrder();
            // get current time.
            var today = new Date();
            currentTime = today.getHours();
            // 10 --> 11:00
            var limitTime = 23;
            
            // 10: the server close at 11:00
            if (cartSum.length > 1 && currentTime <= limitTime) {

                // after that, sync.  
                navigator.notification.confirm(statement1+cartSum+statement3+pickPlace+'..Phone:'+IchibanPhone, function (confirmed) {
                    if (confirmed === true || confirmed === 1) {
            
                    {  
                        var notes = IchibannotesModel.notes;
                        noteInProgress = notes.add();
                        
                        // add
                        makeOrder();
                        noteInProgress.Text = cartSum;
                        noteInProgress.Pickup = pickPlace;
                        noteInProgress.Phone = IchibanPhone;
                        // noteInProgress.UserId = usersModel.currentUser.get('data').Id;
                        // noteInProgress.currentUser = currentUserName;
                        noteInProgress.currentUser = window.device.uuid;
                        
                        noteInProgress.Date = updateDate().Date;
                        noteInProgress.Hours = updateDate().Hours;
                        // not sure about the definition of "Title"
                        //noteInProgress.Title = $newNoteTitle.val();
        
                        var count;
                        var todayDate = updateDate().Date;
                     
                        // Count plus filtering
                        var filter = {
                            "Date" : todayDate
                        };                
                        // Ajax request using jQuery 
                        // javascrip SDK didn't work.
                        // point to IchibanActivities database.
                        $.ajax({               
                            async:false,
                            url: 'https://api.everlive.com/v1/B3HXTR1cpka5ETff/IchibanActivities/_count',
                            type: "GET",
                            headers: {"Authorization" : "0QJ0Hrc7POtaGodFTwqOO86Tzn2vPNIF", "X-Everlive-Filter" : JSON.stringify(filter) },
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
                        sum = "Your order number is: "+count+", "+cartSum+" Pickup place: "+pickPlace+" Phone: "+IchibanPhone;
                        document.getElementById("IchibanCart1").innerHTML=statement1+cartSum;
						// save "sum" into local storage.
                        // "sum" contains order information.
						// showAlert(sum);
                        // localStorage.setItem(currentUserName,sum);
                        
                        
                        // creatTime = usersModel.currentUser.get('data').CreatedAt;
                        saveCreateTime(sum);
                        noteInProgress.Num = count;
                                                
                        notes.one('sync', function() {
                            mobileApp.navigate('views/ichibanAddress.html');
                            document.getElementById("IchibanSum").innerHTML= sum;
                        });
                        notes.sync();
                                                        
                        document.getElementById("IchibanCart1").innerHTML="Click what you want.";                        
                        initOrder();
                        
                    }                
                        
                        
                    }
                }, 'You cart:', 'Ok,Cancel');   
                        
                    } // if statement
            else if ((cartSum.length > 1 && currentTime > limitTime)||(cartSum.length <= 1 && currentTime > limitTime))  {
                showAlert("Please order between 00:00 - 11:00 am");
            }
            else {
                showAlert("Your cart is empty. Please make an order.");
            }      
        };

        var addNumber = function (e) {
            // get the list data !
            // the specified item
            var $dataItem = e.data;
			globalTest = $dataItem.Title; 	
            clickOrder(globalTest);   
            makeOrder();
            document.getElementById("IchibanCart1").innerHTML=statement1+cartSum;
        };
        var deleteNumber = function (e) {
            // get the list data !
            var $dataItem = e.data;
			globalTest = $dataItem.Title;
            deleteclickOrder(globalTest);   
            makeOrder();
            document.getElementById("IchibanCart1").innerHTML=statement1+cartSum;
        };
        var moveBack = function () {
            mobileApp.navigate('#:back');
        };        
           
        return {
            init: init,
            show: show,
            me: usersModel.currentUser,
            saveNote: saveNote,    
            // Get dota from listsModel.lists
            // how to view the database !
            // IchibanlistsModel must be declared first.
            Ichibanlists: IchibanlistsModel.lists,
            
            addNumber:addNumber,            
            deleteNumber:deleteNumber,  
            moveBack:moveBack,           
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
            activities: activitiesViewModel,
            addActivity: addActivityViewModel,
            IchibanAddress: IchibanAddressViewModel,
            IchibanMenu: IchibanMenuViewModel,  

        }
    };
}());