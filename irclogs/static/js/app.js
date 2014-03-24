var app = angular.module('app', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'partials/messages.html',
        controller: 'MessageListCtrl',
    }).otherwise({
        redirectTo: '/',
    });
}]);

app.controller('MessageListCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {
    $scope.searchQuery = $location.search().q || '';
    $scope.fetch = function() {
        if($scope.searchQuery.trim().length) {
            $location.search('q', $scope.searchQuery.trim());
        }
        $http({
            method: 'GET',
            url: '/api/v1/message',
            params: {
                q: {filters:[{
                    name: 'body',
                    op: 'like',
                    val: '%' + $scope.searchQuery + '%',
                }]},
            },
        }).success(function(data) {
            $scope.range = function(start, end) { 
                    var ret = [];
                    if (!end) {
                        end = start;
                        start = 0;
                        }
                    for (var i = start; i < end; i++){
                    ret.push(i);
                        }
                    return ret    
                };
            $scope.messages = data.objects;
        });
    };
}]);
