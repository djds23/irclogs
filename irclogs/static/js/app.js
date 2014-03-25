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
    $scope.page_num = 1;
    $scope.next_page = function() {
        if ($scope.page_num == $scope.total_pages)
            return undefined;
        else {
            $scope.page_num++;
            $scope.fetch();
        }
    };
    $scope.last_page = function() {
        if ($scope.page_num == 1)
            return undefined;
        else {
            $scope.page_num--;
            $scope.fetch();
        }
    };
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
            page: $scope.page_num,
            },
        }).success(function(data) {
            $scope.messages = data.objects;
            $scope.total_pages = data.total_pages;
        });
    };
}]);


