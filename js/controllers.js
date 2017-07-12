anketbazApp.controller('MainController', function ($scope, $state, WsProviderService, UserService) {
    $scope.CheckUser();

    $scope.ShowPollDetails = false;
    $scope.PollDetails = {};
    $('.animate-panel').animatePanel();

    $scope.PollList = [];
    var serviceData;
    if (UserService.UserData != null)
        if (UserService.UserData.ownertype == 'P') {
            serviceData = {
                userid: UserService.UserData.ownerid,
                authkey: UserService.UserData.authkey
            };

            WsProviderService.SendPost('PollService', 'GetPersonnelPollList', serviceData, function (e) {
                if (e.Result) {
                    $scope.PollList = e.Data;
                }
            });
        }
        else {
            serviceData = {
                ownerid: UserService.UserData.ownerid,
                staffid: UserService.UserData.userid,
                authkey: UserService.UserData.authkey
            };
            WsProviderService.SendPost('PollService', 'GetCompanyPollList', serviceData, function (e) {
                if (e.Result) {
                    $scope.PollList = e.Data;
                }
            });
        }

    $scope.OpenPollDetails = function (pollid) {
        for (var i = 0; i < $scope.PollList.length; i++) {
            if ($scope.PollList[i].pollid == pollid) {
                $scope.PollDetails = $scope.PollList[i];
                $scope.ShowPollDetails = true;
                break;
            }
        }
    };

});
anketbazApp.controller('RegisterController', function ($scope, WsProviderService) {

    $scope.UserData = {UserName: '', Mail: '', Password: ''};
    $scope.CompanyData = {UserName: '', CompanyName: '', Sector: '', Mail: '', Password: ''}

    $scope.Register = function () {
        if ($scope.tab == 'tabUser') {
            WsProviderService.SendPost('UserService', 'Register', {
                mail: $scope.UserData.Mail,
                name: $scope.UserData.UserName,
                password: $scope.UserData.Password
            }, function (e) {
                if (e.Result) {
                    alert("Kaydınız başarılı.");
                    $scope.userId = e.Data.userid;
                    $scope.authKey = e.Data.authkey;
                }
                else {
                    alert("Kayıt sırasında bir hata meydana geldi.")
                }
            });
        }
        else {
            WsProviderService.SendPost('StaffService', 'Register', {
                mail: $scope.CompanyData.Mail,
                password: $scope.CompanyData.Password,
                name: $scope.CompanyData.UserName,
                companytitle: $scope.CompanyData.CompanyName,
                companysector: $scope.CompanyData.Sector
            }, function (e) {

                if (e.Result) {
                    alert("Kaydınız Başarılı.");
                }
                else {
                    alert("Kayıt sırassında bir hata oluştu.")
                }
            });

        }

    };
});


anketbazApp.controller('LoginController', function ($scope, $state, WsProviderService, UserService) {

    $scope.UserData = {Mail: '', Password: ''};

    $scope.Login = function () {
        if (($scope.UserData.Mail == null && $scope.UserData.Mail == "") && ($scope.UserData.Password == null || $scope.UserData.Password == "")) {
            alert("Lütfen gerekli alanları doldurunuz.")
        }
        else {
            if ($scope.tab == "tabUser") {
                WsProviderService.SendPost('UserService', 'Login',
                    {
                        mail: $scope.UserData.Mail,
                        password: $scope.UserData.Password
                    }, function (e) {

                        if (e.Result) {
                            UserService.SetUser(e.Data.userid, e.Data.userid, "P", e.Data.authkey, e.Data.name, e.Data.mail, '');
                            $state.go('dashboard.main');
                        }
                        else {
                            swal('Hata', 'Giris basarisiz !', 'error');
                        }
                    });
            }
            else {
                WsProviderService.SendPost('StaffService', 'Login', {
                    mail: $scope.UserData.Mail,
                    password: $scope.UserData.Password
                }, function (e) {

                    if (e.Result) {
                        UserService.SetUser(e.Data.compid, e.Data.staffid, "C", e.Data.authkey, e.Data.name, e.Data.mail, e.Data.compname);
                        $state.go('dashboard.main');
                    }
                    else {
                        alert("Giriş Başarısız.")
                    }
                });
            }

        }
    };

});


anketbazApp.controller('ViewPollController', function ($scope, $stateParams, WsProviderService, $uibModal, UserService) {
    $scope.CheckUser();

    $scope.PrintLine = function () {
        PrintCanvas('line');
    };
    $scope.PrintQuestionBasedReport = function () {
        PrintElement('QuestionBasedReport');
    };
    $scope.PrintPersonBasedReport = function () {
        PrintElement('PersonBasedReport');
    };

    $scope.PrintGeneratedReport = function () {
        PrintElement('GeneratedReport');
    };


    $('.animate-panel').animatePanel();
    $scope.series = ['Anket Sayisi'];
    $scope.data = [
        [0, 0, 0, 0, 0, 0, 0]
    ];

    $scope.PollData = {};
    $scope.PollFullData = {};
    $scope.FieldData = {};
    $scope.GuestData = {};
    $scope.GuestAnswerData = {};
    $scope.QuestionDetails = {};
    $scope.QuestionList = [];
    $scope.ShowQuestionDetails = function (questionIndex) {
        $scope.QuestionDetails = $scope.QuestionList[questionIndex];
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'templates/viewpoll/dashboard-viewquestionmodal.html',
            size: 'md',
            scope: $scope,
            controller: function ($scope) {
                $scope.Close = function () {
                    modalInstance.close();
                };
            }
        });
    };

    $scope.ExportExcel = function () {
        if (UserService.UserData.ownertype == 'P') {
            serviceData = {
                userid: UserService.UserData.ownerid,
                authkey: UserService.UserData.authkey,
                pollid: $stateParams.pollid
            };
            WsProviderService.SendPost('PollService', 'GetPersonnelAnalizedPollDataExport', serviceData, function (e) {
                    if (e.Result) {
                        download(b64toBlob(e.Data), $scope.PollData.PollTitle + '-Raporu.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                    } else {
                        alert('Excelde hata oldu !!')
                    }
                }
            );
        } else {
            serviceData = {
                ownerid: UserService.UserData.ownerid,
                staffid: UserService.UserData.userid,
                authkey: UserService.UserData.authkey,
                pollid: $stateParams.pollid
            };
            WsProviderService.SendPost('PollService', 'GetCompanyAnalizedPollDataExport', serviceData, function (e) {
                if (e.Result) {
                    download(b64toBlob(e.Data), $scope.PollData.PollTitle + '-Raporu.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                } else {
                    alert('Excelde hata oldu !!')
                }
            });
        }
    };

    $scope.AddToSiteCode = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'templates/viewpoll/add-to-site.html',
            size: 'md',
            scope: $scope,
            controller: function ($scope) {
                $scope.QuestionBasedReportData = $scope.PollData.Questions;

                $scope.Close = function () {
                    modalInstance.close();
                };
            }
        });
    };
    $scope.QuestionBasedReport = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'templates/viewpoll/question-based-report.html',
            size: 'lg',
            scope: $scope,
            controller: function ($scope) {
                $scope.QuestionBasedReportData = $scope.PollData.Questions;
                $scope.Close = function () {
                    modalInstance.close();
                };
            }
        });
    };

    $scope.ReportWizard = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'templates/viewpoll/report-wizard.html',
            size: 'lg',
            scope: $scope,
            controller: function ($scope) {
                $scope.View = {
                    ReportType: 'Person'
                };
                $scope.Close = function () {
                    modalInstance.close();
                };
            }
        });
    };


    $scope.GetFieldTitleText = function (fieldCode) {
        var fieldTitle = '';
        $scope.FieldData.forEach(function (e) {
            if (e.FieldCode == fieldCode) {
                fieldTitle = e.FieldTitle;
            }
        });
        return fieldTitle;
    };

    $scope.ToggleActive = function () {
        if (UserService.UserData.ownertype == 'P') {
            serviceData = {
                userid: UserService.UserData.ownerid,
                authkey: UserService.UserData.authkey,
                pollid: $stateParams.pollid
            };
            WsProviderService.SendPost('PollService', 'SetPersonnelToggleActivePoll', serviceData, function (e) {
                    if (e.Result) {
                        if ($scope.PollData.Active == "X")
                            $scope.PollData.Active = "";
                        else
                            $scope.PollData.Active = "X";

                    } else {
                        alert('toggle active hata!')
                    }
                }
            );
        } else {
            serviceData = {
                ownerid: UserService.UserData.ownerid,
                pollid: $stateParams.pollid,
                staffid: UserService.UserData.userid,
                authkey: UserService.UserData.authkey
            };
            WsProviderService.SendPost('PollService', 'SetCompanyToggleActivePoll', serviceData, function (e) {
                if (e.Result) {
                    if ($scope.PollData.Active == "X")
                        $scope.PollData.Active = "";
                    else
                        $scope.PollData.Active = "X";
                } else {
                    alert('toggle active hata!')
                }
            });
        }


    };
    $scope.PersonBasedReport = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'templates/viewpoll/person-based-report.html',
            size: 'lg',
            scope: $scope,
            controller: function ($scope) {
                $scope.PersonBasedReportData = [];

                $scope.GuestData.forEach(function (guest) {
                    var guestData = {};
                    guestData.Fields = JSON.parse(guest.fielddata);
                    guestData.Questions = [];

                    $scope.PollData.Questions.forEach(function (question) {
                        var questionData = {
                            Answers: []
                        };
                        questionData.Content = question.Content;
                        question.Answers.forEach(function (answer) {
                            if (GetGuestAnswer(guest.guestid, answer.AnswerId, question.QuestionId) != null)
                                questionData.Answers.push(answer);
                        });
                        guestData.Questions.push(questionData);
                    });

                    $scope.PersonBasedReportData.push(guestData);
                });
                $scope.Close = function () {
                    modalInstance.close();
                };
            }
        });
    };


    var serviceData;

    if (UserService.UserData.ownertype == 'P') {
        serviceData = {
            userid: UserService.UserData.ownerid,
            authkey: UserService.UserData.authkey,
            pollid: $stateParams.pollid
        };
        WsProviderService.SendPost('PollService', 'GetPersonnelAnalizedPollData', serviceData, function (e) {
            if (e.Result) {
                $scope.PollFullData = e.Data;
                console.log($scope.PollFullData);
                $scope.PollData = e.Data.Poll;
                $scope.QuestionBasedReportData = $scope.PollData.Questions;
                $scope.GuestData = e.Data.GuestList;
                $scope.GuestAnswerData = e.Data.GuestAnswers;
                $scope.FieldData = JSON.parse(e.Data.Poll.Fields);

                $scope.PollData.Questions.forEach(function (questionData) {
                    var localQuestionData = {
                        Content: questionData.Content,
                        Labels: [],
                        Data: []
                    };

                    questionData.Answers.forEach(function (answerData) {
                        localQuestionData.Labels.push(answerData.Content);
                        localQuestionData.Data.push(answerData.VoteCount);
                    });

                    $scope.QuestionList.push(localQuestionData);
                });
                e.Data.GuestList.forEach(function (guestAnswerData) {
                    var date = DateFromYmd(guestAnswerData.crdat);
                    $scope.data[0][6 - (parseInt(new Date().getDate()) - parseInt(date.getDate()))]++;

                });
            }
        });
    }
    else {
        serviceData = {
            ownerid: UserService.UserData.ownerid,
            pollid: $stateParams.pollid,
            staffid: UserService.UserData.userid,
            authkey: UserService.UserData.authkey
        };
        WsProviderService.SendPost('PollService', 'GetCompanyAnalizedPollData', serviceData, function (e) {
            if (e.Result) {
                $scope.PollFullData = e.Data;
                $scope.PollData = e.Data.Poll;
                $scope.GuestData = e.Data.GuestList;
                $scope.GuestAnswerData = e.Data.GuestAnswers;
                $scope.FieldData = JSON.parse(e.Data.Poll.Fields);

                $scope.PollData.Questions.forEach(function (questionData) {
                    var localQuestionData = {
                        Content: questionData.Content,
                        Labels: [],
                        Data: []
                    };

                    questionData.Answers.forEach(function (answerData) {
                        localQuestionData.Labels.push(answerData.Content);
                        localQuestionData.Data.push(answerData.VoteCount);
                    });

                    $scope.QuestionList.push(localQuestionData);
                });
                e.Data.GuestList.forEach(function (guestAnswerData) {
                    var date = DateFromYmd(guestAnswerData.crdat);
                    $scope.data[0][6 - (parseInt(new Date().getDate()) - parseInt(date.getDate()))]++;

                });
            }
        });
    }

    $scope.labels = [];

    for (var i = 6; i > -1; i--) {
        var datenow = new Date();
        $scope.labels.push(weekday[datenow.addDays(-i).getDay()]);

    }

    $scope.onClick = function (points, evt) {

    };
    $scope.datasetOverride = [{yAxisID: 'y-axis-1'}];
    $scope.options = {
        scales: {
            yAxes: [
                {
                    id: 'y-axis-1',
                    type: 'linear',
                    display: true,
                    position: 'left'
                }
            ]
        }
    };


    var GetGuestAnswer = function (guestId, answerId, questionId) {
        var answerData = null;
        $scope.GuestAnswerData.forEach(function (e) {
            if (e.GuestId == guestId && e.AnswerId == answerId && e.QuestionId == questionId)
                answerData = e;
        });
        return answerData;
    };
});


anketbazApp.controller('CreatePollController', function ($scope, $state, $uibModal, WsProviderService, UserService) {
    $scope.CheckUser();
    $('.animate-panel').animatePanel();
    $scope.PollData = {
        Questions: [],
        Fields: [],
        PollTitle: '',
        IsPassword: false,
        Password: '',
        IsPrivate: false,
        IpCheck: false,
        CookieCheck: false


    };
    $scope.CreatePoll = function () {
        if ($scope.PollData.Questions.length == 0) return;

        var pollData = {
            PollTitle: $scope.PollData.PollTitle,
            Questions: []
        };

        $scope.PollData.Questions.forEach(function (question) {
            var questionData = {
                Content: question.Content,
                QuestionType: question.QuestionType,
                Answers: []
            };
            question.Answers.forEach(function (answer) {
                questionData.Answers.push({
                    Content: answer.Content,
                    AnswerType: 'P'
                })
            });
            pollData.Questions.push(questionData);
        });
        var serviceData;

        if (UserService.UserData.ownertype == 'P') {
            serviceData = {
                userid: UserService.UserData.ownerid,
                authkey: UserService.UserData.authkey,
                polldata: pollData,
                fielddata: JSON.stringify($scope.PollData.Fields),
                isipcheck: $scope.PollData.IpCheck ? 'X' : '',
                isprivate: $scope.PollData.IsPrivate ? 'X' : '',
                ispassword: $scope.PollData.IsPassword ? 'X' : '',
                password: $scope.PollData.Password,
                iscookiecheck: $scope.PollData.CookieCheck ? 'X' : ''
            };

            WsProviderService.SendPost('PollService', 'AddPersonnelPoll', serviceData, function (e) {
                if (e.Result) {
                    $state.go('dashboard.main');
                }
            });
        }
        else {
            serviceData = {
                ownerid: UserService.UserData.ownerid,
                staffid: UserService.UserData.userid,
                authkey: UserService.UserData.authkey,
                polldata: pollData,
                fielddata: JSON.stringify($scope.PollData.Fields),
                isipcheck: $scope.PollData.IpCheck ? 'X' : '',
                isprivate: $scope.PollData.IsPrivate ? 'X' : '',
                ispassword: $scope.PollData.IsPassword ? 'X' : '',
                password: $scope.PollData.Password,
                iscookiecheck: $scope.PollData.CookieCheck ? 'X' : ''
            };
            WsProviderService.Send('PollService', 'AddCompanyPoll', serviceData, function (e) {
                if (e.Result) {
                    $state.go('dashboard.main');
                }
            });
        }

    };

    $scope.RemoveQuestion = function (questionIndex) {
        $scope.PollData.Questions.splice(questionIndex, 1);
    };

    $scope.AddQuestionModal = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'templates/createpoll/question-form-dialog.html',
            size: 'md',
            scope: $scope,
            controller: function ($scope) {
                $scope.QuestionData = {
                    Content: '',
                    AnswerCount: 2,
                    Answers: [{}, {}],
                    IsMultipleAnswer: false
                };
                $scope.Close = function () {
                    modalInstance.close();
                };
                $scope.RemoveAnswer = function () {
                    if ($scope.QuestionData.AnswerCount > 2) {
                        $scope.QuestionData.AnswerCount--;
                        $scope.QuestionData.Answers.splice($scope.QuestionData.AnswerCount.length, 1);
                    }
                };
                $scope.AddAnswer = function () {
                    if ($scope.QuestionData.AnswerCount < 30) {
                        $scope.QuestionData.AnswerCount++;
                        $scope.QuestionData.Answers.push({});
                    }
                };
                $scope.AddQuestion = function () {
                    $scope.QuestionData.QuestionType = $scope.QuestionData.IsMultipleAnswer ? 'M' : 'S';
                    $scope.PollData.Questions.push($scope.QuestionData);
                    modalInstance.close();
                };
            }
        });
    };

    $scope.AddFieldModal = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'templates/createpoll/field-dialog.html',
            size: 'md',
            scope: $scope,
            controller: function ($scope) {
                $scope.FieldData = {
                    FieldType: 'text',
                    FieldTitle: '',
                    FieldCode: ''
                };
                $scope.Close = function () {
                    modalInstance.close();
                };
                $scope.AddQuestion = function () {
                    $scope.FieldData.FieldCode = toSeoUrl($scope.FieldData.FieldTitle);
                    $scope.PollData.Fields.push($scope.FieldData);
                    modalInstance.close();
                };
            }
        });
    };
    $scope.RemoveField = function (fieldIndex) {
        $scope.PollData.Fields.splice(fieldIndex, 1);
    };
});


anketbazApp.controller('RouterController', function ($scope, $state) {
    $scope.CheckUser();
    setTimeout(function () {
        $state.go('dashboard.main');
    }, 200);


});
anketbazApp.controller('LogOutController', function ($scope, $state, UserService) {
    UserService.RemoveUser();
    $state.go('login');
});