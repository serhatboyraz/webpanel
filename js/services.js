anketbazApp.service('UserService', function () {
    var UserService = {};
    UserService.UserData = null;
    UserService.GetUser = function () {
        if (UserService.UserData == null) {
            var data = localStorage.getItem('UserData');
            if (data != undefined) {
                UserService.UserData = JSON.parse(Base64.decode(data));
            }
        }
        return UserService.UserData;
    };

    UserService.SetUser = function (ownerid, userid,ownertype, authkey, name, mail,compname) {
        var userData = {
            ownerid: ownerid,
            userid: userid,
            ownertype: ownertype,
            authkey: authkey,
            name: name,
            mail: mail
        };

        if(ownertype =='C'){
            userData.compname = compname;
        }
        UserService.UserData = userData;
        localStorage.setItem('UserData', Base64.encode(JSON.stringify(userData)));
    };

    UserService.RemoveUser = function () {
        UserService.UserData = null;
        localStorage.removeItem('UserData');
    };
    return UserService;
});
anketbazApp.service('WsProviderService', function ($http,$state) {

    var WsProvider = {};
    WsProvider.RequestActive = false;

    WsProvider.Send = function (serviceName, method, data, successCB) {
        WsProvider.RequestActive = true;
        var bData = Base64.encode(JSON.stringify(data));
        var sendUrl = ServiceUrl + 'DynamicService.svc/CallService?serviceName=' + serviceName + '&methodName=' + method + '&jsonParams=' + bData;
        $http.get(sendUrl).then(function successCallback(response) {
            WsProvider.RequestActive = false;
            var resultData = Deflate(response.data);
            if (!resultData.Result) {
            }
            successCB(resultData);
        }, function errorCallback(response) {
            WsProvider.RequestActive = false;
        });
    };
    WsProvider.SendPost = function (serviceName, method, data, successCB) {
        WsProvider.RequestActive = true;
        var bData = Base64.encode(JSON.stringify(data));
        var postData = {
            serviceName: serviceName,
            methodName: method,
            jsonParams: bData
        };
        var sendUrl = ServiceUrl + 'DynamicService.svc/CallServicePost';

        $http
        ({
            method: 'POST',
            url: sendUrl,
            data: postData,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function successCallback(response) {
            WsProvider.RequestActive = false;
            var resultData = Deflate(response.data.CallServicePostResult);
            if (!resultData.Result) {
                if(resultData.Data =='0x0009'){
                    $state.go('logout');
                }
            }
            successCB(resultData);
        }, function errorCallback(response) {
            WsProvider.RequestActive = false;
            errorCB(response);
        });
    };
    WsProvider.SendFile = function (fileData, jsonData, successCB, errorCB) {
        WsProvider.RequestActive = true;
        if (!(fileData && fileData.size > 0)) return;
        var bData = Base64.encode(JSON.stringify(jsonData));
        var sendUrl = ServiceUrl + 'FileService.svc/SetFile/' + bData;

        $http
        ({
            method: 'POST',
            url: sendUrl,
            headers: {
                'Content-length': fileData.size
            },
            data: fileData
        }).then(function successCallback(response) {
            WsProvider.RequestActive = false;
            var resultData = Deflate(response.data);
            successCB(resultData);
        }, function errorCallback(response) {
            WsProvider.RequestActive = false;
            errorCB(response);
        });
    };
    WsProvider.RemoveFile = function (jsonData, successCB, errorCB) {
        WsProvider.RequestActive = true;
        var bData = Base64.encode(JSON.stringify(jsonData));
        var sendUrl = ServiceUrl + 'FileService.svc/RemoveFile/' + bData;

        $http.get(sendUrl).then(function successCallback(response) {
            WsProvider.RequestActive = false;
            var resultData = Deflate(response.data);
            successCB(resultData);
        }, function errorCallback(response) {
            WsProvider.RequestActive = false;
            errorCB(response);
        });

    };
    return WsProvider;
});
