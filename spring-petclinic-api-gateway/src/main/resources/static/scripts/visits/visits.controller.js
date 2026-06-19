'use strict';

angular.module('visits')
    .controller('VisitsController', ['$http', '$state', '$stateParams', '$filter', 'FormErrorHandler', function ($http, $state, $stateParams, $filter, FormErrorHandler) {
        var self = this;
        var petId = $stateParams.petId || 0;
        var url = "api/visit/owners/" + ($stateParams.ownerId || 0) + "/pets/" + petId + "/visits";
        self.date = new Date();
        self.desc = "";
        FormErrorHandler.reset(self);

        $http.get(url).then(function (resp) {
            self.visits = resp.data;
        });

        self.submit = function (form) {
            FormErrorHandler.reset(self);

            if (form && form.$invalid) {
                self.formErrorMessage = 'Please fix the highlighted fields.';
                return;
            }

            var data = {
                date: $filter('date')(self.date, "yyyy-MM-dd"),
                description: self.desc
            };

            $http.post(url, data).then(function () {
                $state.go('ownerDetails', { ownerId: $stateParams.ownerId });
            }).catch(function (response) {
                FormErrorHandler.apply(self, response);
            });
        };
    }]);
