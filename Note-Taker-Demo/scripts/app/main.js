var app = (function () {
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

    var facebook = new IdentityProvider({
        name: "Facebook",
        loginMethodName: "loginWithFacebook",
        endpoint: "https://www.facebook.com/dialog/oauth",
        response_type:"token",
        client_id: "165834540266609",
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
                mobileApp.navigate('views/building.html');
            })
            .then(null,
                  function (err) {
                      showError(err.message);
                  }
            );
        };
        var loginWithoutName = function () {
            var username = 'No Good Name';
            var password = 123456;
            //showAlert(username);
            el.Users.login(username, password)
            .then(function () {
                return usersModel.load();
            })
            .then(function () {
                mobileApp.navigate('views/building.html');
            })
            .then(null,
                  function (err) {
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
                    mobileApp.navigate('views/notesView.html');
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
        }         
        
        return {
            login: login,
            loginWithFacebook: loginWithFacebook,
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
                }
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
            logout: logout
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
        var addNumber = function () {
            mobileApp.navigate('#welcome');
        };        
        return {
            lists: listsModel.lists,
            listSelected: listSelected,
            logout: logout,
            addNumber:addNumber
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
        var $newNote;
        var $newNoteTitle;
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
            saveNote: saveNote
        };
    }());

    return {
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