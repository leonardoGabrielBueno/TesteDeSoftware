// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova', 'angular-filepicker'])

  .run(function ($ionicPlatform, FirebaseDB, $rootScope, $state) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });

    FirebaseDB.initialize();

    // for authentication
    $rootScope.$on('$stateChangeError',
      function (event, toState, toParams, fromState, fromParams, error) {

        // if the error is "noUser" the go to login state
        if (error === "NO USER") {
          event.preventDefault();
          console.log("go to login state");
          $state.go('login', {});
        }
      });

  })

  .config(function ($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider
      .state('login', {
        url: "/login",
        templateUrl: "templates/login.html",
        controller: 'LoginCtrl',
        cache: false
      })
      .state('signup', {
        url: "/signup",
        templateUrl: "templates/signup.html",
        controller: 'LoginCtrl',
        cache: false
      })
       .state('editarFoto', {
        url: "/editarFoto",
        templateUrl: "templates/editar-foto.html",
        controller: 'PerfilCtrl',
        cache: false
      })
      .state('editarNome', {
        url: "/editarNome",
        templateUrl: "templates/editar-nome.html",
        controller: 'PerfilCtrl',
        cache: false
      })
        .state('editarDescricao', {
        url: "/editarDescricao",
        templateUrl: "templates/editar-descricao.html",
        controller: 'PerfilCtrl',
        cache: false
      })
      .state('editarExperiencias', {
        url: "/editarExperiencias",
        templateUrl: "templates/editar-experiencias.html",
        controller: 'PerfilCtrl',
        cache: false
      })
        .state('editarInstrumento', {
        url: "/editarInstrumento",
        templateUrl: "templates/editar-instrumento.html",
        controller: 'PerfilCtrl',
        cache: false
      })
      .state('editarUltimoTrabalho', {
        url: "/editarUltimoTrabalho",
        templateUrl: "templates/editar-ultimo-trabalho.html",
        controller: 'PerfilCtrl',
        cache: false
      })
      // setup an abstract state for the tabs directive
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html',
        resolve: {
          user: ['FirebaseDB', '$q', function (FirebaseDB, $q) {
            var authData = FirebaseDB.currentUser();
            return $q(function (resolve, reject) {
              authData ? resolve(authData) : reject("NO USER")
            })
          }]
        }
      })
      // Each tab has its own nav history stack:
      .state('tab.timeline', {
        url: '/timeline',
        cache: true,
        views: {
          'tab-timeline': {
            templateUrl: 'templates/tab-timeline.html',
            controller: 'TimelineCtrl'
          }
        }
      })
      .state('tab.chat-detail', {
        url: '/timeline/:chatId',
        views: {
          'tab-timeline': {
            templateUrl: 'templates/chat-detail.html',
            controller: 'ChatDetailCtrl'
          }
        }
      })
      .state('tab.photos', {
        url: '/photos',
        cache: true,
        views: {
          'tab-photos': {
            templateUrl: 'templates/tab-photos.html',
            controller: 'PhotosCtrl'
          }
        }
      })

      .state('tab.search', {
        url: '/search',
        views: {
          'tab-search': {
            templateUrl: 'templates/tab-search.html',
            controller: 'SearchCtrl'
          }
        }
      })
     .state('tab.perfil', {
        url: '/perfil',
        views: {
          'tab-perfil': {
            templateUrl: 'templates/tab-perfil.html',
            controller: 'PerfilCtrl'
          }
        }
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/timeline');

  });
