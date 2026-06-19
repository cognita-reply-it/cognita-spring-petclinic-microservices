'use strict';

/**
 * Global HTTP errors handler.
 */
angular.module('infrastructure')
    .factory('HttpErrorHandlingInterceptor', ['$q', function ($q) {
        return {
            responseError: function (response) {
                var error = response.data || {};

                if (response.status === -1 || response.status >= 500) {
                    alert(error.message || error.error || 'A server error occurred. Please try again.');
                }

                return $q.reject(response);
            }
        }
    }]);
