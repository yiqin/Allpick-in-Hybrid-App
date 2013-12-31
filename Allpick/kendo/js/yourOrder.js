<script>    
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
        
            User: function () {
                var userId = this.get('UserId');
                var user = $.grep(usersModel.users(), function (e) {
                    return e.Id === userId;
                })[0];
                return {
                    Username: user ? user.Username : 'No Good Name',
                };
            }
        };
    
var dataSource = new kendo.data.DataSource({
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

    // Here we couln't name app.
var app1 = new kendo.mobile.Application(document.body);    
    
  </script>   