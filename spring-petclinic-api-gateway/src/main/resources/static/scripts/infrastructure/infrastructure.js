'use strict';

angular.module('infrastructure', [])
    .factory('FormErrorHandler', function () {
        function reset(target) {
            target.formErrors = {};
            target.formErrorMessage = null;
        }

        function apply(target, response) {
            reset(target);

            var error = response && response.data ? response.data : {};
            var fieldErrors = angular.isArray(error.errors) ? error.errors : [];

            fieldErrors.forEach(function (fieldError) {
                if (fieldError.field && !target.formErrors[fieldError.field]) {
                    target.formErrors[fieldError.field] = fieldError.message || fieldError.defaultMessage;
                }
            });

            target.formErrorMessage = error.message || 'Unable to save. Please review the highlighted fields.';
        }

        return {
            reset: reset,
            apply: apply
        };
    });
