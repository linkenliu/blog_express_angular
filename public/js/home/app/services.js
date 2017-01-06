'use strict';
let httpResource = angular.module('BlogApp.services', ['ngResource']);
httpResource.factory('blData', function ($q, $resource) {
    let blResource = function (type, name, params) {
        let requestUrl = "/home/v1/" + name;
        return $resource(requestUrl, {id: '@id'}, {
            'requestUrl': {
                method: type,
                params: params
            }
        });
    };
    return {
        requestUrl: function (type, name, params) {
            let defer = $q.defer();
            blResource(type, name, params).requestUrl(function (data) {
                defer.resolve(data);
            }, function (data) {
                defer.reject(data);
            });
            return defer.promise
        }
    };
});


