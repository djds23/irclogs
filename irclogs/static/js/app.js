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
    $scope.limit = 5;
    $scope.older = function() {
            $scope.limit+=25;
            $scope.fetch();
    };
    $scope.fetch = function() {
        if($scope.searchQuery.trim().length) {
            $location.search('q', $scope.searchQuery.trim());
        }
        $http({
            method: 'GET',
            url: '/api/v1/message',
            params: {
                q: {
                    filters:[{
                        name: 'body',
                        op: 'like',
                        val: '%' + $scope.searchQuery + '%',
                    }],
                    order_by:[{
                        field: 'created',
                        direction: 'desc',
                    }],
                },
                limit:$scope.limit, 
            },
        }).success(function(data) {
            $scope.messages = data.objects;
            $scope.total_pages = data.total_pages;
            console.log($scope.limit);
        });
    };
}]);


