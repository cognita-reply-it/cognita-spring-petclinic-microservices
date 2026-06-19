'use strict';

angular.module('ownerForm')
    .controller('OwnerFormController', ["$http", '$state', '$stateParams', 'FormErrorHandler', function ($http, $state, $stateParams, FormErrorHandler) {
        var self = this;

        var ownerId = $stateParams.ownerId || 0;
        FormErrorHandler.reset(self);

        if (!ownerId) {
            self.owner = {};
        } else {
            $http.get("api/customer/owners/" + ownerId).then(function (resp) {
                self.owner = resp.data;
            });
        }

        self.submitOwnerForm = function (form) {
            FormErrorHandler.reset(self);

            if (form && form.$invalid) {
                self.formErrorMessage = 'Please fix the highlighted fields.';
                return;
            }

            var id = self.owner.id;

            if (id) {
                $http.put('api/customer/owners/' + id, self.owner).then(function () {
                    $state.go('ownerDetails', {ownerId: ownerId});
                }).catch(function (response) {
                    FormErrorHandler.apply(self, response);
                });
            } else {
                $http.post('api/customer/owners', self.owner).then(function () {
                    $state.go('owners');
                }).catch(function (response) {
                    FormErrorHandler.apply(self, response);
                });
            }
        };
    }]);
