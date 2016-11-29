angular.module('starter.controllers', [])

  .controller('LoginCtrl', [
    '$scope', '$state', '$timeout', 'FirebaseDB',
    function LoginCtrl($scope, $state, $timeout, FirebaseDB) {
      console.log("Login Controller");

      /**
       * 
       */
      $scope.doLoginAction = function (_credentials) {
          if (_credentials && _credentials.email && _credentials.password) {
        FirebaseDB.login(_credentials).then(function (authData) {
          console.log("Logged in as:", authData.uid);
          alert("Bem Vindo!");
          $state.go('tab.timeline', {})
        }).catch(function (error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;

          alert("Houve um problema! ", error);
          console.error("Authentication failed:", error);
          // ...
        }); } else
        
            alert("Preencha todos os campos!");
    

      

      }

      $scope.voltar = function(){
          $state.go('login', {})
      }
      
      $scope.cadastro = function(){
           $state.go('signup', {})}
      $scope.doCreateUserAction = function (_credentials) {
          
           if (_credentials && _credentials.email && _credentials.password) {
               
           
        FirebaseDB.createUser(_credentials).then(function (authData) {
          console.log("Logged in as:", authData);
          alert("Usuario Criado com Sucesso! Bem Vindo!");
          $state.go('tab.timeline', {})
        }).catch(function (error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          alert("Houve um problema!", error);
          console.error("Authentication failed:", error);
          // ...
        });
         } else
            alert("Preencha todos os campos!");
    

      }
    }])

  .controller('PhotosCtrl', function ($scope, $timeout, FirebaseDB, $cordovaImagePicker, $ionicPopup, $ionicPlatform) {

    function pickTheImage() {
      var options = {
        maximumImagesCount: 1,
        width: 320,
        quality: 80
      };

      return $cordovaImagePicker.getPictures(options)
        .then(function (results) {
          for (var i = 0; i < results.length; i++) {
            console.log('Image URI: ' + results[i]);
          }
          return results[0];

        }, function (error) {
          // error getting photos
        });
    }

    /**
     * @param  {any} _image
     * @param  {any} _title
     */
    function processImage(_image, _title) {

      // modify the image path when on Android
      if ($ionicPlatform.is("android")) {
        _image = "file://" + _image
      }

      return fetch(_image).then(function (_data) {
        return _data.blob()
      }).then(function (_blob) {
        uploadTask = FirebaseDB.storage().ref('images/' + _title + '.jpg').put(_blob)

        uploadTask.on('state_changed', function (snapshot) {
          // Observe state change events such as progress, pause, and resume
        }, function (error) {
          // Handle unsuccessful uploads
          return error
        }, function () {
          // Handle successful uploads on complete..
          var downloadURL = uploadTask.snapshot.downloadURL;

          // save a reference to the image for listing purposes
          var ref = FirebaseDB.database().ref('Timeline/images');
          ref.push({
            'imageURL': downloadURL,
            'owner': FirebaseDB.currentUser().uid,
            'when': new Date().getTime(),
          });

          return downloadURL
        });
      })
    }
    /**
     * @param  {any} _title
     */
    $scope.doAddPhoto = function () {
      pickTheImage().then(function (_image) {

        $timeout(function () {
          return $ionicPopup.prompt({
            title: 'Please enter title for the image'
          }).then(function (_title) {
            return processImage(_image, _title)
          });
        }, 1);

      })
    }

    /**
     * @param  {String} _selectedChat
     */
    function getFBPhotos(_selectedChat) {

      var ref = FirebaseDB.database().ref('Timeline/images');
      ref.on("value", function (snapshot) {
        console.log(snapshot.val());
        var res = []
        snapshot.forEach(function (_item) {
          console.log(_item.val())
          res.push(_item.val())
        })
        $timeout(function () {
          $scope.images = res
        }, 1);
      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
      });
    }

    // start here..
    getFBPhotos();
  })

  .controller('TimelineCtrl', function ($scope, $timeout, Chats, FirebaseDB, $state) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    //$scope.chats = Chats.all();
    $scope.remove = function (chat) {
       
        Chats.remove(chat);
    };

    $scope.doLogout = function () {
      $timeout(function () {
        $state.go('login', {})
      }, 1);

      firebase.auth().signOut()

    }

    $scope.inputtext = {}

    /**
     * called when the users clicks submit to add a new message
     * 
     * @param _data {String} text entered for the message
     */
    $scope.addMessage = function (_data, _selectedChat) {

      Chats.add(_selectedChat, _data.value).then(function (_data, _error) {
        if (!_error) {
          console.log("saved..")
          $timeout(function () {
            $scope.inputtext = {}
          }, 1);
        }
      })

    }

    function getFBChats(_selectedChat) {

      Chats.get(_selectedChat, function (_data) {
        $timeout(function () {
          $scope.chats = _data
        }, 1);
      });
    }

    // start here..
    getFBChats();
  })

  .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats, Users, $timeout, $sce) {
    $scope.chat =   Users.get($stateParams.chatId, function (_data) {
        $timeout(function () {
          $scope.users = _data;
          $scope.users.youtube = $sce.trustAsResourceUrl("https://www.youtube.com/embed/" + $scope.users.ultimotrabalho);
        }, 1);
      });


     
    


    // start here..
  
  })
    .controller('PerfilCtrl', function ($scope, $stateParams, FirebaseDB, $state, Perfil, $timeout, $sce) {
    $scope.editarFoto = function(){
           $state.go('editarFoto', {})}
    $scope.voltar = function(){
           $state.go('tab.perfil', {})}
    $scope.editarNome = function(){
           $state.go('editarNome', {})}
    $scope.editarDescricao = function(){
           $state.go('editarDescricao', {})}
    $scope.editarExperiencias = function(){
           $state.go('editarExperiencias', {})}
    $scope.editarInstrumento = function(){
           $state.go('editarInstrumento', {})}
    $scope.editarUltimoTrabalho = function(){
           $state.go('editarUltimoTrabalho', {})}
       
   
    $scope.mudarNome = function (_credentials) {
          
       Perfil.updateNome(_credentials).then(function (_credentials, _error) {
        if (!_error) {
          alert("Nome Alterado com Sucesso!");
          console.log("saved..")
          $timeout(function () {
         
            $scope.inputtext = {}
          }, 1);
        }else{
             alert("Erro ao alterar nome!");
        }
      })}
   $scope.mudarDescricao = function (_credentials) {
          
       Perfil.updateDescricao(_credentials).then(function (_credentials, _error) {
        if (!_error) {
          alert("Descrição Alterada com Sucesso!");
          console.log("saved..")
          $timeout(function () {
         
            $scope.inputtext = {}
          }, 1);
        }else{
             alert("Erro ao alterar Descrição!");
        }
      })}
   $scope.mudarExperiencias = function (_credentials) {
          
       Perfil.updateExperiencias(_credentials).then(function (_credentials, _error) {
        if (!_error) {
          alert("Experiencias Alteradas com Sucesso!");
          console.log("saved..")
          $timeout(function () {
         
            $scope.inputtext = {}
          }, 1);
        }else{
             alert("Erro ao alterar Experiencias!");
        }
      })}
    $scope.mudarInstrumento = function (_credentials) {
          
       Perfil.updateInstrumento(_credentials).then(function (_credentials, _error) {
        if (!_error) {
          alert("Instrumento Alterado com Sucesso!");
          console.log("saved..")
          $timeout(function () {
         
            $scope.inputtext = {}
          }, 1);
        }else{
             alert("Erro ao alterar Instrumento!");
        }
      })}
     $scope.mudarFoto = function (_credentials) {
         $scope.files = _credentials;
         
         
       Perfil.updateFoto(_credentials).then(function (_credentials, _error) {
        if (!_error) {
          alert("Foto Alterada com Sucesso!");
          console.log("saved..")
          $timeout(function () {
         
            $scope.inputtext = {}
          }, 1);
        }else{
             alert("Erro ao alterar Foto!");
        }
      })}
     $scope.mudarUltimoTrabalho = function (_credentials) {
          
       Perfil.updateUltimoTrabalho(_credentials).then(function (_credentials, _error) {
        if (!_error) {
          alert("Ultimo Trabalho Alterado com Sucesso!");
          console.log("saved..")
          $timeout(function () {
         
            $scope.inputtext = {}
          }, 1);
        }else{
             alert("Erro ao alterar Ultimo Trabalho!");
        }
      })}





      function getFBUser(_selectedUser) {
      
      Perfil.get(_selectedUser, function (_data) {
        $timeout(function () {
          $scope.users = _data;
          $scope.users.youtube = $sce.trustAsResourceUrl("https://www.youtube.com/embed/" + $scope.users.ultimotrabalho);
          
        }, 1);
      });
    }

    // start here..
    getFBUser();

  })

 
    .controller('SearchCtrl', function ($scope, $stateParams, Users, $timeout, $ionicScrollDelegate) {
        
        Users.get(function (_data) {
        $timeout(function () {
          $scope.contacts = _data;
         
          
        }, 1);
      });
  
                
                
                
         
        $scope.clearSearch = function() {
          $scope.search = '';
        };
    
  });
