var app = angular.module('flapperNews', ['ui.router']);

app.controller('MainCtrl', [
    '$scope',
    'posts',

    function($scope, posts){

        $scope.posts = posts.posts;

        $scope.addPost = function(){
            if(!$scope.title || $scope.title === '') { return; }

            $scope.incrementUpvotes = function(post) {
                post.upvotes += 1;
            };

            $scope.posts.push({
                title: $scope.title,
                link: $scope.link,
                upvotes: 0,
                comments: [
                    {author: 'Joe', body: 'Cool post!', upvotes: 0},
                    {author: 'Bob', body: 'Great idea but everything is wrong!', upvotes: 0}
                ]
            });

        };


    }]);

    app.controller('PostsCtrl', [
        '$scope',
        '$stateParams',
        'posts',
        function($scope, $stateParams, posts){
            $scope.post = posts.posts[$stateParams.id];

            $scope.addComment = function(){
                if($scope.body === '') { return; }
                $scope.post.comments.push({
                    body: $scope.body,
                    author: 'user',
                    upvotes: 0
                });
                $scope.body = '';
            };

        }]);

        app.factory('posts', ['$http', function($http){ //inject $http for performing GET request
            var o = {
                posts: []
            };

            o.getAll = function() {
                return $http.get('/posts').success(function(data){
                    angular.copy(data, o.posts); //create a deep copy -ensures $scope.posts will be updated in MainCtrl so new values will be reflected in view. copies response post from GET request.
                });
            };

            return o;
        }]);

        app.config([
            '$stateProvider',
            '$urlRouterProvider',
            function($stateProvider, $urlRouterProvider) {

                $stateProvider
                .state('home', {
                    url: '/home',
                    templateUrl: '/home.html',
                    controller: 'MainCtrl'
                    resolve: { //query backend to GET all posts when home state is entered
                        postPromise: ['posts', function(posts){
                            return posts.getAll();
                        }]
                    }
                });

                $stateProvider
                .state('posts', {
                    url: '/posts/{id}',
                    templateUrl: '/posts.html',
                    controller: 'PostsCtrl'
                });

                $urlRouterProvider.otherwise('home');
            }]);
