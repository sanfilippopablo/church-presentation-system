angular
  .module('app', [
    'ngMaterial',
    'ui.router'
  ])
  .config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
    .state('songs', {
      url: '/songs',
      views: {
        'primary-menu': {
          templateUrl: 'partials/songs/primary-menu.html'
        },
        'secondary-menu': {
          templateUrl: 'partials/songs/secondary-menu.html'
        }
      }
    });


    $urlRouterProvider.otherwise('/songs');
  });
