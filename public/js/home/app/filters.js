'use strict';

/* Filters */

angular.module('linkenBlog.filters', [])
    .filter('interceptor', function (version) {
      return function (text) {
        return String(text).replace(/\%VERSION\%/mg, version);
      };
    })
    .filter('toTrusted',  ['$sce', function ($sce) {
        return function (text) {
            return $sce.trustAsHtml(text);
        }
    }]);