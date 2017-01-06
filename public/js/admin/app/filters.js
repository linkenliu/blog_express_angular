'use strict';

/* Filters */

angular.module('linkenBlog.filters', [])
    .filter('interceptor', function (version) {
      return function (text) {
        return String(text).replace(/\%VERSION\%/mg, version);
      };
    });

