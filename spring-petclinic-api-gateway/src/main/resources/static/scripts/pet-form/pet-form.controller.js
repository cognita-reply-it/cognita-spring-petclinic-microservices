'use strict';

angular.module('petForm')
    .controller('PetFormController', ['$http', '$state', '$stateParams', 'FormErrorHandler', function ($http, $state, $stateParams, FormErrorHandler) {
        var self = this;
        var ownerId = $stateParams.ownerId || 0;
        FormErrorHandler.reset(self);

        $http.get('api/customer/petTypes').then(function (resp) {
            self.types = resp.data;
        }).then(function () {

            var petId = $stateParams.petId || 0;

            if (petId) { // edit
                $http.get("api/customer/owners/" + ownerId + "/pets/" + petId).then(function (resp) {
                    self.pet = resp.data;
                    self.pet.birthDate = new Date(self.pet.birthDate);
                    self.petTypeId = "" + self.pet.type.id;
                });
            } else {
                $http.get('api/customer/owners/' + ownerId).then(function (resp) {
                    self.pet = {
                        owner: resp.data.firstName + " " + resp.data.lastName
                    };
                    self.petTypeId = "1";
                })

            }
        });

        self.submit = function (form) {
            FormErrorHandler.reset(self);

            if (form && form.$invalid) {
                self.formErrorMessage = 'Please fix the highlighted fields.';
                return;
            }

            var id = self.pet.id || 0;

            var data = {
                id: id,
                name: self.pet.name,
                birthDate: self.pet.birthDate,
                typeId: self.petTypeId
            };

            var req;
            if (id) {
                req = $http.put("api/customer/owners/" + ownerId + "/pets/" + id, data);
            } else {
                req = $http.post("api/customer/owners/" + ownerId + "/pets", data);
            }

            req.then(function () {
                $state.go('ownerDetails', {ownerId: ownerId});
            }).catch(function (response) {
                FormErrorHandler.apply(self, response);
            });
        };
    }]);
