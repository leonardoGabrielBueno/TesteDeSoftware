angular.module('starter.services', [])

  .factory('FirebaseDB', function ($q, $state, $timeout) {
    var instance, storageInstance, unsubscribe, currentUser = null
    var initialized = false

    return {
      initialize: function () {

        // Not initialized so... initialize Firebase
        var config = {
          apiKey: "AIzaSyDkG78XOvDMygc_RYAGNpEUFrRncsGDsGc",
    authDomain: "basemusicapp.firebaseapp.com",
    databaseURL: "https://basemusicapp.firebaseio.com",
    storageBucket: "basemusicapp.appspot.com",
    messagingSenderId: "176535066019"
        };

        // initialize database and storage
        instance = firebase.initializeApp(config);
        storageInstance = firebase.storage();

        // listen for authentication event, dont start app until I 
        // get either true or false
        unsubscribe = firebase.auth().onAuthStateChanged(function (user) {
          currentUser = user
          console.log("got user..", currentUser);
        })
      },
      /**
       * return database instance
       */
      database: function () {
        return instance.database()
      },
      /**
      * return storage instance
      */
      storage: function () {
        return storageInstance
      },
      isAuth: function () {
        return $q(function (resolve, reject) {
          return firebase.auth().currentUser ? resolve(true) : reject("NO USER")
        })
      },
      /**
       * return the currentUser object
       */
      currentUser: function () {
        
        return firebase.auth().currentUser
      },

      /**
       * @param  {any} _credentials
       */
      login: function (_credentials) {
        return firebase.auth().signInWithEmailAndPassword(_credentials.email, _credentials.password)
          .then(function (authData) {
            currentUser = authData
            return authData
          })
      },
      /**
       * @param  {any} _credentials
       */
      createUser: function (_credentials) {
        return firebase.auth().createUserWithEmailAndPassword(_credentials.email, _credentials.password).then(function (authData) {
          currentUser = authData
          return authData
        }).then(function (authData) {

          // add the user to a seperate list 
          var ref = instance.database().ref('Timeline/users');
          return ref.child(authData.uid).set({
            "provider": authData.providerData[0],
            "avatar": (authData.profileImageURL || "missing"),
            "displayName": _credentials.displayName
          })

        })
      }
    }
  })
 .factory('Perfil', function (FirebaseDB) {
    // Might use a resource here that returns a JSON array

    return {
      all: function () {
        return null;
      },
      remove: function (perfil) {
          
          
      },
      /**
       * @param  {any} _selectedChat
       * @param  {any} _data
       */
      add: function (_credentials) {
        var _selectedUser = FirebaseDB.currentUser().uid;
        var ref = FirebaseDB.database().ref('Users/' + _selectedUser);
       
        return ref.update({
          'nome': _credentials.nome || ref.nome
          /*'descricao': _credentials.descricao || ref.descricao,
          'instrumento': _credentials.instrumentos || ref.instrumento,
          'experiencias': _credentials.experiencias || ref.experiencias,
          'ultimotrabalho': _credentials.ultimotrabalho || ref.ultimotrabalho,
          'foto':_credentials.foto || ref.foto*/
        });
        
      },
      updateFoto: function (_credentials) {
        var _selectedUser = FirebaseDB.currentUser().uid;
        var ref = FirebaseDB.database().ref('Users/' + _selectedUser);
       
        return ref.update({
          'foto':_credentials.foto 
        });
        
      }, 
      updateNome: function (_credentials) {
        var _selectedUser = FirebaseDB.currentUser().uid;
        var ref = FirebaseDB.database().ref('Users/' + _selectedUser);
       
        return ref.update({
          'nome':_credentials.nome
        });
        
      }, 
      updateDescricao: function (_credentials) {
        var _selectedUser = FirebaseDB.currentUser().uid;
        var ref = FirebaseDB.database().ref('Users/' + _selectedUser);
       
        return ref.update({
          'descricao':_credentials.descricao
        });
        
      }, 
      updateInstrumento: function (_credentials) {
        var _selectedUser = FirebaseDB.currentUser().uid;
        var ref = FirebaseDB.database().ref('Users/' + _selectedUser);
       
        return ref.update({
          'instrumento':_credentials.instrumentos
        });
        
      },
      updateExperiencias: function (_credentials) {
        var _selectedUser = FirebaseDB.currentUser().uid;
        var ref = FirebaseDB.database().ref('Users/' + _selectedUser);
       
        return ref.update({
          'experiencias':_credentials.experiencias
        });
        
      },
      updateUltimoTrabalho: function (_credentials) {
        var _selectedUser = FirebaseDB.currentUser().uid;
        var ref = FirebaseDB.database().ref('Users/' + _selectedUser);
       
        return ref.update({
          'ultimotrabalho':_credentials.ultimotrabalho
        });
        
      },

      /**
       * @param  {any} _selectedChat
       * @param  {any} _handler
       * 
       * buscando do firebase e mostrando na 
       */
      get: function (_selectedUser, _handler) {
        var _selectedUser = FirebaseDB.currentUser().uid;

        var ref = FirebaseDB.database().ref('Users/' + _selectedUser);
        ref.on("value", function (snapshot) {
          console.log("User:: " + snapshot.val());
          var res = snapshot.val();
         
          
          
          

          // send updated data back to controller..
          _handler(res);

        }, function (errorObject) {
          console.log("The read failed: " + errorObject.code);
        });
      }
    };
  })
  .factory('Chats', function (FirebaseDB) {
    // Might use a resource here that returns a JSON array

    return {
      all: function () {
        return null;
      },
      remove: function (chat) {
        var _selectedChat = chat;
        
        var ref = FirebaseDB.database().ref('Timeline/post/' + _selectedChat);
            ref.remove().then(function() {
                alert("Post deletado com Sucesso!");
             }).catch(function(error) {
                  alert("Erro ao deletar post!");
             });;
      },
      /**
       * @param  {any} _selectedChat
       * @param  {any} _data
       */
      add: function (_selectedChat, _data) {
        var _selectedChat = _selectedChat || 'post'
        var ref = FirebaseDB.database().ref('Timeline/' + _selectedChat);
       
        return ref.push({
          'player': FirebaseDB.currentUser().displayName || FirebaseDB.currentUser().email,
          'message': _data,
          'when': new Date().getTime(),
          'player_uid': FirebaseDB.currentUser().uid,
        });
        
      },

      /**
       * @param  {any} _selectedChat
       * @param  {any} _handler
       * 
       * buscando do firebase e mostrando na timeline
       */
      get: function (_selectedChat, _handler) {
        var _selectedChat = _selectedChat || 'post'

        var ref = FirebaseDB.database().ref('Timeline/' + _selectedChat);
        ref.on("value", function (snapshot) {
          console.log(snapshot.val());
          var res = []
          snapshot.forEach(function (_item) {
            res.unshift({ player: _item.val().player, message: _item.val().message, user_id:_item.val().player_uid, id:_item.key  })
          })
       
          // send updated data back to controller..
          _handler(res);

        }, function (errorObject) {
          console.log("The read failed: " + errorObject.code);
        });
      }
    };
  })
  .factory('Users', function (FirebaseDB) {
    // Might use a resource here that returns a JSON array

    return {
      all: function () {
        return null;
      },

      get: function (_selectedChat, _handler) {
        var _selectedChat = _selectedChat

        var ref = FirebaseDB.database().ref('Users/' + _selectedChat);
        ref.on("value", function (snapshot) {
          console.log("User:: " + snapshot.val());
          var res = snapshot.val();
         
         
          
          
          

          // send updated data back to controller..
          _handler(res);

        }, function (errorObject) {
          console.log("The read failed: " + errorObject.code);
        });
      }
    };
  })
.filter('searchContacts', function(FirebaseDB){
    var refs = FirebaseDB.database().ref('Users/');
    return function (refs, query) {
    var filtered = [];
    var letterMatch = new RegExp(query, 'i');
    for (var i = 0; i < refs.length; i++) {
      var ref = refs[i];
      if (query) {
        if (letterMatch.test(ref.nome.substring(0, query.length))) {
          filtered.push(ref);
        }
      } else {
        filtered.push(ref);
      }
    }
    return filtered;
  };
});
