var app = (function () {
    
    var sum = "bad new";

    
    var creatTime = "11"; 
    
    var statement0 = " Step 2: When you finish your order, click the button - Place the order.";
    var statement1 = " Here is your order: ";
    var statement2 = " Your order number is: ";
    var statement3 = " Pickup place: ";
    // global var
    var globalTest;
    var cartSum;
    var cartNumber = 0;

    var cartName = new Array(100);
    var cartNum = new Array(100);
    //cart[0][0] = "Beef Beef";
    //cart[0][1] = 5;
    //for (var i=0; i<100; i++) {
    //   cart[i][1] = 0;
    //}
    
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
        //cartSum = "Here is your order: ";
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
    

    
    
    'use strict';

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
    };

    document.addEventListener("deviceready", onDeviceReady, false);

    var applicationSettings = {
        emptyGuid: '00000000-0000-0000-0000-000000000000',
        apiKey: 'B3HXTR1cpka5ETff'
    };

    // initialize Everlive SDK
    var el = new Everlive({
        apiKey: applicationSettings.apiKey
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
            var username = $('#loginUsername').val();
            var password = $('#loginPassword').val();

            el.Users.login(username, password)
            .then(function () {
                return usersModel.load();
            })
            .then(function () {
                mobileApp.navigate('views/addNoteView.html');
            })
            .then(null,
                  function (err) {
                      showError(err.message);
                  }
            );
        };
        var loginWithoutName = function () {
            mobileApp.showLoading();
            var username = 'No Good Name';
            var password = 123456;
            //showAlert(username);
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
        
        return {
            login: login,
            loginWithoutName: loginWithoutName
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
            sort: { field: 'CreatedAt', dir: 'desc' }
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
            noteSum:sum
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
            sort: { field: 'CreatedAt', dir: 'desc' }
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
            // $globalTest =  $('#OrderCountID');
            globalTest = $dataItem.Title;
            clickOrder(globalTest);
            showAlert("Order successful");
            //showAlert(creatTime);
            //mobileApp.navigate('#welcome');
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
            addNumber: addNumber
        };
    }());     
    
    // add note view model
    var addNoteViewModel = (function () {
        // to make a distinction between regular vars and jQuery objects.
        var $newNote;
        var $newNoteTitle;
        var test;
        
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
        
        var saveNote = function () {
            var r;
                makeOrder();
                // after that, sync.  
        navigator.notification.confirm(statement1+cartSum+statement3+pickPlace, function (confirmed) {
            if (confirmed === true || confirmed === 1) {

                
			{
                var notes = notesModel.notes;
                noteInProgress = notes.add();
                // noteInProgress.Text = $newNote.val();
                // assing string here.
                //noteInProgress.Text = test+test;
                makeOrder();
                noteInProgress.Text = cartSum;
                noteInProgress.Pickup = pickPlace;
                //showAlert(cartSum);
                
                //noteInProgress.Text = globalTest;
                
                // menu can be add together.
                noteInProgress.Title = $newNoteTitle.val();
                noteInProgress.UserId = usersModel.currentUser.get('data').Id;

                
                var count;
                //Ajax request using jQuery         
                $.ajax({
                    
                    async:false,
                    url: 'https://api.everlive.com/v1/B3HXTR1cpka5ETff/Activities/_count',
                    type: "GET",
                    //headers: {"Authorization" : "Yiqin ${AccessToken}"},
                    success: function(data){
                        //showAlert(JSON.stringify(data));
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
                        //showAlert(length);
                        //r = confirm(statement1+cartSum+statement2+count+statement3+pickPlace);
                        //creatTime = statement1+cartSum+statement2+count+statement3+pickPlace;
                    },
                    error: function(error){
                        showAlert("it is bad");
                    },

                });                  
                
                

                //showAlert(count);
                sum = statement2+count+statement1+cartSum+statement3+pickPlace;
                
                //document.getElementById("myHeader0").innerHTML=statement2+count;
                document.getElementById("myHeader").innerHTML=statement1+cartSum;
                document.getElementById("myHeader2").innerHTML=statement3+pickPlace;
                
                creatTime = usersModel.currentUser.get('data').CreatedAt;
                saveCreateTime(sum);
                noteInProgress.Num = count;
                //showAlert("create time "+creatTime);
                notes.one('sync', syncAction);
                notes.sync();
                initOrder();
    			mobileApp.navigate('views/addNoteView.html');
    			document.getElementById("yourOrderLocal1").innerHTML= statement2+count;
    			document.getElementById("yourOrderLocal2").innerHTML= statement1+cartSum;
    			document.getElementById("yourOrderLocal3").innerHTML= statement3+pickPlace;
    
    
                document.getElementById("myHeader").innerHTML="Click what you want.";
                document.getElementById("myHeader2").innerHTML="";    
            }                
                
                
            }
        }, 'You cart:', 'Ok,Cancel');   



            
               // r = confirm(statement1+cartSum+statement3+pickPlace);
          
            
   
            
            
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
        
        
        
        
        
        
        
//////////////////////////////////        
        
        return {
            init: init,
            show: show,
            me: usersModel.currentUser,
            saveNote: saveNote,
            potter: potter,
            hawkins: hawkins,
            
            lists: listsModel.lists,
            listSelected: listSelected,
            addNumber:addNumber,
            
            deleteNumber:deleteNumber,
            
            
        };
    }());
    

    
    
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
            addOrder:addOrderViewModel
        }
    };
}());