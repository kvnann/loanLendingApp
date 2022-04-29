
var lib = require('./data');
var _data = require('./data')
var helpers = require("./helpers")
var config = require('./config');

var handlers = {};

var handlers = {};


handlers.buy = (data,callback) => {
  var count = 0;
  var loanBuyer = typeof(data.payload.loanBuyer) == 'string'? data.payload.loanBuyer : false;
  var id = typeof(data.payload.postId) == 'string' && data.payload.postId.trim().length == 20 ? data.payload.postId : false;
  data.queryStringObject.id = id;
  data.payload.price = parseInt(data.payload.price);
  var price = typeof(data.payload.price) == 'number' && data.payload.price > 0 ? data.payload.price : false;
  var phone = typeof(data.payload.loanSeller) == 'string' ? data.payload.loanSeller : false;
  if(phone != loanBuyer){
    //post sil - phone
    _data.delete('posts',id,(err)=>{
      if(!err){
        _data.read('users',phone,function(err,userData){
          console.log(userData)
          var userPosts = typeof(userData.posts) == 'object' && userData.posts instanceof Array ? userData.posts : [];
          var postPosition = userPosts.indexOf(id);
          if(postPosition > -1){
            userPosts.splice(postPosition,1);
            userData.posts = userPosts;
            _data.update('users',phone,userData,function(err){
              if(!err){
                count++
              } else {
                callback(500,{'Error' : 'Could not update the user.'});
              }
            });
          } else {
            callback(500,{"Error" : "Could not find the post on the user's object, so could not remove it."});
          }
        });
      }
      else{
        callback({"Error":"Error while deletting post"})
      }
    })
    

    //pul transfer


    _data.read('users' , loanBuyer , (err,userData)=>{
      if(!err){
        userData.balance += price;
        var buyed = userData.buyed instanceof Array ? buyed : [];
        buyed.push(id)
        _data.update('users',loanBuyer,userData,(err)=>{
          if(!err){
            if(count>0){
              callback(200);
            }
          }
          else{
             callback({"Error":"Error while updating user"})
          }
        })
      }
      else{
        callback({"Error":"Couldn't find you account"})
      }
    });


  }
  else{
    callback(500,{"Error" : "You cannot buy your own loan"});
  }
};


handlers.index = function(data,callback){
  
  if(data.method == 'get'){
    
    var templateData = {
    };
    
    helpers.getTemplate('index',templateData,function(err,str){
      if(!err && str){
        

            
            callback(200,str,'html');

      } else {
        callback(500,undefined,'html');
      }
    });
  } else {
    callback(405,undefined,'html');
  }
};

handlers.post = function(data,callback){
  if(data.method == 'get'){
    handlers._posts.get(data,(statusCode,post)=>{
        data.queryStringObject.phone = post.phone;
        handlers._users.get(data,(statusCode,userData)=>{
          var ywp = ((100+post.percent)*post.price)/100;
          var templateData = {
            "loanGiver":userData.phone,
            "postId":post.postId,
            "postId2":post.postId,
            "userId":post.phone,
            "price":post.price.toString(),
            "percent":post.percent.toString(),
            "firstName":userData.firstName,
            "lastName":userData.lastName,
            "email":userData.email,
            "phone":post.phone,
            "phone1":post.phone,
            "phone3":post.phone,
            "price2":post.price.toString(),
            "phone2":post.phone,
            "minRating":post.minRating.toString(),
            'ywp':ywp.toString()
          };
          
          helpers.getTemplate('post',templateData,function(err,str){
            if(!err && str){
              helpers.addUniversalTemplates(str,templateData,function(err,str){
                if(!err && str){
                  
                  callback(200,str,'html');
                } else {
                  callback(500,undefined,'html');
                }
              });
            } else {
              callback(500,undefined,'html');
            }
          });
        });
    });

  } else {
    callback(405,undefined,'html');
  }
};

handlers.payment = function(data,callback){
  
  if(data.method == 'get'){
    
    var templateData = {
      "phone4":data.payload.phone
    };
    
    helpers.getTemplate('payment',templateData,function(err,str){
      if(!err && str){
          callback(200,str,'html');

      } else {
        callback(500,undefined,'html');
      }
    });
  } else {
    callback(405,undefined,'html');
  }
};


handlers.home = function(data,callback){
  
  if(data.method == 'get'){
    
    var templateData = {
    };
    
    helpers.getTemplate('home',templateData,function(err,str){
      if(!err && str){
        
        helpers.addUniversalTemplates(str,templateData,function(err,str){
          if(!err && str){
            
            callback(200,str,'html');
          } else {
            callback(500,undefined,'html');
          }
        });
      } else {
        callback(500,undefined,'html');
      }
    });
  } else {
    callback(405,undefined,'html');
  }
};

handlers.accountCreate = function(data,callback){
  
  if(data.method == 'get'){
    
    var templateData = {
      "":""
    };
    
    helpers.getTemplate('accountCreate',templateData,function(err,str){
      if(!err && str){
        
        helpers.addUniversalTemplates(str,templateData,function(err,str){
          if(!err && str){
            
            callback(200,str,'html');
          } else {
            callback(500,undefined,'html');
          }
        });
      } else {
        callback(500,undefined,'html');
      }
    });
  } else {
    callback(405,undefined,'html');
  }
};

handlers.explore = function(data,callback){
  
  if(data.method == 'get'){
    
    var templateData = {
    };
    
    helpers.getTemplate('explore',templateData,function(err,str){
      if(!err && str){
        
        helpers.addUniversalTemplates(str,templateData,function(err,str){
          if(!err && str){
            callback(200,str,'html');
          } else {
            callback(500,undefined,'html');
          }
        });
      } else {
        callback(500,undefined,'html');
      }
    });
  } else {
    callback(405,undefined,'html');
  }
};

handlers.myaccount = function(data,callback){
  
  if(data.method == 'get'){
    
    var templateData = {
    };
    
    helpers.getTemplate('myaccount',templateData,function(err,str){
      if(!err && str){
        
        helpers.addUniversalTemplates(str,templateData,function(err,str){
          if(!err && str){
            callback(200,str,'html');
          } else {
            callback(500,undefined,'html');
          }
        });
      } else {
        callback(500,undefined,'html');
      }
    });
  } else {
    callback(405,undefined,'html');
  }
};

handlers.createPost = function(data,callback){
  
  if(data.method == 'get'){
    
    var templateData = {
    };
    
    helpers.getTemplate('postsCreate',templateData,function(err,str){
      if(!err && str){
        
        helpers.addUniversalTemplates(str,templateData,function(err,str){
          if(!err && str){
            callback(200,str,'html');
          } else {
            callback(500,undefined,'html');
          }
        });
      } else {
        callback(500,undefined,'html');
      }
    });
  } else {
    callback(405,undefined,'html');
  }
};


handlers.usersEdit = function(data,callback){
  
  if(data.method == 'get'){
    
    var templateData = {
    };
    
    helpers.getTemplate('usersEdit',templateData,function(err,str){
      if(!err && str){
        
        helpers.addUniversalTemplates(str,templateData,function(err,str){
          if(!err && str){
            callback(200,str,'html');
          } else {
            callback(500,undefined,'html');
          }
        });
      } else {
        callback(500,undefined,'html');
      }
    });
  } else {
    callback(405,undefined,'html');
  }
};


handlers.accountEdit = function(data,callback){
  
  if(data.method == 'get'){
    
    var templateData = {
      "":""
    };
    
    helpers.getTemplate('accountEdit',templateData,function(err,str){
      if(!err && str){
        
        helpers.addUniversalTemplates(str,templateData,function(err,str){
          if(!err && str){
            callback(200,str,'html');
          } else {
            callback(500,undefined,'html');
          }
        });
      } else {
        callback(500,undefined,'html');
      }
    });
  } else {
    callback(405,undefined,'html');
  }
};














handlers.favicon = function(data,callback){
  
  if(data.method == 'get'){
    
    helpers.getStaticAsset('favicon.ico',function(err,data){
      if(!err && data){
        
        callback(200,data,'favicon');
      } else {
        callback(500);
      }
    });
  } else {
    callback(405);
  }
};


handlers.public = function(data,callback){
  
  if(data.method == 'get'){
    
    var trimmedAssetName = data.trimmedPath.replace('public/','').trim();
    if(trimmedAssetName.length > 0){
      
      helpers.getStaticAsset(trimmedAssetName,function(err,data){
        if(!err && data){

          
          var contentType = 'plain';

          if(trimmedAssetName.indexOf('.css') > -1){
            contentType = 'css';
          }

          if(trimmedAssetName.indexOf('.png') > -1){
            contentType = 'png';
          }

          if(trimmedAssetName.indexOf('.jpg') > -1){
            contentType = 'jpg';
          }

          if(trimmedAssetName.indexOf('.ico') > -1){
            contentType = 'favicon';
          }

          
          callback(200,data,contentType);
        } else {
          callback(404);
        }
      });
    } else {
      callback(404);
    }

  } else {
    callback(405);
  }
};




handlers.ping = function(data,callback){
    callback(200);
};


handlers.notFound = function(data,callback){
  callback(404);
};


handlers.users = function(data,callback){
  var acceptableMethods = ['post','get','put','delete'];
  if(acceptableMethods.indexOf(data.method) > -1){
    handlers._users[data.method](data,callback);
  } else {
    callback(405);
  }
};


handlers._users  = {};

handlers._users.post = function(data,callback){
  var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length >= 8 ? data.payload.password.trim() : false;
  var photo = "default.png";
  var email = typeof(data.payload.email) == 'string' ? data.payload.email : false;
  var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 9 ? data.payload.phone.trim() : false;
  var fin = typeof(data.payload.fin) == 'string' && data.payload.fin.trim().length == 7 ? data.payload.fin : false;
  var tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;
  var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
  var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
  var age = typeof(data.payload.age) == 'boolean' && data.payload.tosAgreement == true ? data.payload.age : false;
  var rating = 5;
  rating = typeof(rating) == 'number' && rating >= 0 && rating <= 10 ? rating : false;
  if(firstName && lastName && phone && password && tosAgreement && fin && email && age){
    
    _data.read('users',phone,function(err,data){
      if(err){
        
        var hashedPassword = helpers.hash(password);
        var hashedFin = helpers.hash(fin);
        
        if(hashedPassword){
          var userObject = {
            'firstName' : firstName,
            'lastName' : lastName,
            'phone' : phone,
            'hashedPassword' : hashedPassword,
            'tosAgreement' : true,
            'email' : email,
            'hashedFin' : hashedFin,
            'photo' : photo,
            'age' : age,
            'rating' : rating,
            'balance': 50.0
          };

          
          _data.create('users',phone,userObject,function(err){
            if(!err){
              callback(200);
            } else {
              callback(500,{'Error' : 'Could not create the new user'});
            }
          });
        } else {
          callback(500,{'Error' : 'Could not hash the user\'s password.'});
        }

      } else {
        
        callback(400,{'Error' : 'A user with that phone number already exists'});
      }
    });

  } else {
    callback(400,{'Error' : 'Missing required fields'});
  }

};



handlers._users.get = function(data,callback){
  
  var phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 9 ? data.queryStringObject.phone.trim() : false;
  if(phone){
    
        _data.read('users',phone,function(err,data){
          if(!err && data){
            delete data.hashedPassword;
            delete data.hashedFin;
            callback(200,data);
          } else {
            callback(404);
          }
        });
  } else {
    callback(400,{'Error' : 'Missing required field'})
  }
};





handlers._users.put = function(data,callback){
  var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 9 ? data.payload.phone.trim() : false;
  data.payload.newBalance = parseInt(data.payload.newBalance);
  var newBalance = typeof(data.payload.newBalance) == 'number' && data.payload.newBalance >= 1 ? data.payload.newBalance : false;
  console.log(newBalance,phone);
  var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length >= 8 ? data.payload.password.trim() : false;
  var photo = typeof(data.payload.photo) == 'png' || typeof(data.payload.photo) == 'img' ? data.payload.photo : false;
  var email = typeof(data.payload.email) == 'string' ? data.payload.email : false;
  var posts = typeof(data.payload.posts) == 'object' ? data.payload.posts : false;
  if(phone){
    
    if(email || photo || password || newBalance || posts){
      var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
      handlers._tokens.verifyToken(token,phone,function(tokenIsValid){
        if(tokenIsValid){
          _data.read('users',phone,function(err,userData){
            if(!err && userData){
              if(email){
                userData.email = email;
              }
              if(posts){
                userData.posts = posts;
              }
              if(newBalance){
                userData.balance += newBalance;
              }
              if(photo){
                userData.photo = photo;
              }
              if(password){
                userData.hashedPassword = helpers.hash(password);
              }
              
              _data.update('users',phone,userData,function(err){
                if(!err){
                  callback(200);
                } else {
                  callback(500,{'Error' : 'Could not update the user.'});
                }
              });
            } else {
              callback(400,{'Error' : 'Specified user does not exist.'});
            }
          });
        } else {
          callback(403,{"Error" : "Missing required token in header, or token is invalid."});
        }
      });
    } else {
      callback(400,{'Error' : 'Missing fields to update.'});
    }
  } else {
    callback(400,{'Error' : 'Missing required field.'});
  }

};


handlers._users.delete = function(data,callback){
  
  var phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 9 ? data.queryStringObject.phone.trim() : false;
  if(phone){
    var dataForBalanceCheck = {
      queryStringObject: {
        "phone" : phone
      }
    }
    handlers._users.get(data,(statusCode,userData)=>{
      if(statusCode == 200){
        if(userData.balance > 0){
          var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
      
          
          handlers._tokens.verifyToken(token,phone,function(tokenIsValid){
            if(tokenIsValid){
              
              _data.read('users',phone,function(err,userData){
                if(!err && userData){
                  
                  _data.delete('users',phone,function(err){
                    if(!err){
                      
                      var userPosts = typeof(userData.posts) == 'object' && userData.posts instanceof Array ? userData.posts : [];
                      var postsToDelete = userPosts.length;
                      if(postsToDelete > 0){
                        var postsDeleted = 0;
                        var deletionErrors = false;
                        
                        userPosts.forEach(function(postId){
                          
                          _data.delete('posts',postId,function(err){
                            if(err){
                              deletionErrors = true;
                            }
                            postsDeleted++;
                            if(postsDeleted == postsToDelete){
                              if(!deletionErrors){
                                callback(200);
                              } else {
                                callback(500,{'Error' : "Errors encountered while attempting to delete all of the user's posts. All posts may not have been deleted from the system successfully."})
                              }
                            }
                          });
                        });
                      } else {
                        callback(200);
                      }
                    } else {
                      callback(500,{'Error' : 'Could not delete the specified user'});
                    }
                  });
                } else {
                  callback(400,{'Error' : 'Could not find the specified user.'});
                }
              });
            } else {
              callback(403,{"Error" : "Missing required token in header, or token is invalid."});
            }
          });
          
        }
        else{
          callback(500,{'Error' : 'Could not delete the specified user with negatve balance}'});

        }
      }
      else{
        callback(500,{'Error' : 'Could not delete the specified user'});
      }
    });
    
  } else {
    callback(400,{'Error' : 'Missing required field'})
  }
};


handlers.tokens = function(data,callback){
  var acceptableMethods = ['post','get','put','delete'];
  if(acceptableMethods.indexOf(data.method) > -1){
    handlers._tokens[data.method](data,callback);
  } else {
    callback(405);
  }
};


handlers._tokens  = {};




handlers._tokens.post = function(data,callback){
  var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 9 ? data.payload.phone.trim() : false;
  var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length >= 8 ? data.payload.password.trim() : false;
  if(phone && password){
    
    _data.read('users',phone,function(err,userData){
      if(!err && userData){
        
        var hashedPassword = helpers.hash(password);
        if(hashedPassword == userData.hashedPassword){
          
          var tokenId = helpers.createRandomString(20);
          var expires = Date.now() + 1000 * 60 * 60;
          var tokenObject = {
            'phone' : phone,
            'id' : tokenId,
            'expires' : expires
          };

          
          _data.create('tokens',tokenId,tokenObject,function(err){
            if(!err){
              callback(200,tokenObject);
            } else {
              callback(500,{'Error' : 'Could not create the new token'});
            }
          });
        } else {
          callback(400,{'Error' : 'Password did not match the specified user\'s stored password'});
        }
      } else {
        callback(400,{'Error' : 'Could not find the specified user.'});
      }
    });
  } else {
    callback(400,{'Error' : 'Missing required field(s).'})
  }
};




handlers._tokens.get = function(data,callback){
  
  var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
  if(id){
    
    _data.read('tokens',id,function(err,tokenData){
      if(!err && tokenData){
        callback(200,tokenData);
      } else {
        callback(404);
      }
    });
  } else {
    callback(400,{'Error' : 'Missing required field, or field invalid'})
  }
};

handlers._tokens.put = function(data,callback){
  var id = typeof(data.payload.id) == 'string' && data.payload.id.trim().length == 20 ? data.payload.id.trim() : false;
  var extend = typeof(data.payload.extend) == 'boolean' && data.payload.extend == true ? true : false;
  if(id && extend){
    
    _data.read('tokens',id,function(err,tokenData){
      if(!err && tokenData){
        
        if(tokenData.expires > Date.now()){
          
          tokenData.expires = Date.now() + 1000 * 60 * 60;
          
          _data.update('tokens',id,tokenData,function(err){
            if(!err){
              callback(200);
            } else {
              callback(500,{'Error' : 'Could not update the token\'s expiration.'});
            }
          });
        } else {
          callback(400,{"Error" : "The token has already expired, and cannot be extended."});
        }
      } else {
        callback(400,{'Error' : 'Specified user does not exist.'});
      }
    });
  } else {
    callback(400,{"Error": "Missing required field(s) or field(s) are invalid."});
  }
};





handlers._tokens.delete = function(data,callback){
  
  var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
  if(id){
    
    _data.read('tokens',id,function(err,tokenData){
      if(!err && tokenData){
        
        _data.delete('tokens',id,function(err){
          if(!err){
            callback(200);
          } else {
            callback(500,{'Error' : 'Could not delete the specified token'});
          }
        });
      } else {
        callback(400,{'Error' : 'Could not find the specified token.'});
      }
    });
  } else {
    callback(400,{'Error' : 'Missing required field'})
  }
};

handlers._tokens.verifyToken = function(id,phone,callback){
  _data.read('tokens',id,function(err,tokenData){
    if(!err && tokenData){
      if(tokenData.phone == phone && tokenData.expires > Date.now()){
        callback(true);
      } else {
        callback(false);
      }
    } else {
      callback(false);
    }
  });
};

handlers.posts = function(data,callback){
  var acceptableMethods = ['post','get','put','delete'];
  if(acceptableMethods.indexOf(data.method) > -1){
    handlers._posts[data.method](data,callback);
  } else {
    callback(405);
  }
};


handlers._posts  = {};

handlers._posts.post = function(data,callback){
  data.payload.price = parseInt(data.payload.price);
  data.payload.percent = parseInt(data.payload.percent);
  data.payload.minRating = parseInt(data.payload.minRating);
  var price = typeof(data.payload.price) == 'number' && data.payload.price > 10 ? data.payload.price : false;
  var insurance = typeof(data.payload.insurance) == 'boolean' && data.payload.insurance == true ? data.payload.insurance : false;
  var percent = typeof(data.payload.percent) == 'number' && data.payload.percent > 0 ? data.payload.percent : false;
  var minRating = typeof(data.payload.minRating) == 'number' && data.payload.minRating >= 0 && data.payload.minRating <= 10 ? data.payload.minRating : false;
  if(price && percent && minRating){

    
    var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

    _data.read('tokens',token,function(err,tokenData){
      if(!err && tokenData){
        var userPhone = tokenData.phone;

        
        _data.read('users',userPhone,function(err,userData){
          if(!err && userData){
            if(userData.balance >= price){
              var userPosts = typeof(userData.posts) == 'object' && userData.posts instanceof Array ? userData.posts : [];
              var postId = helpers.createRandomString(20);
              var postObject = {
                'price':price,
                'percent':percent,
                'minRating':minRating,
                'phone':userPhone,
                'postId':postId,
                'insurance':insurance
              };
              _data.create('posts',postId,postObject,function(err){
                if(!err){
                  
                  userData.posts = userPosts;
                  userData.posts.push(postId);
                  userData.balance -= price;

                  
                  _data.update('users',userPhone,userData,function(err){
                    if(!err){
                      
                      callback(200,postObject);
                    } else {
                      callback(500,{'Error' : 'Could not update the user with the new post.'});
                    }
                  });
                } else {
                  callback(500,{'Error' : 'Could not create the new post'});
                }
              });
            }
            else{
              callback(500,{'Error' : 'You don\'t have enough balance to share this post'});
            }
          } else {
            callback(403);
          }
        });


      } else {
        callback(403);
      }
    });
  } else {
    callback(400,{'Error' : 'Missing required inputs, or inputs are invalid'});
  }
};




handlers._posts.get = function(data,callback){
  
  var list = 0
  try{
    list = data.queryStringObject.list;
  }
  catch(e){
    list = 0
  }
  if( list == 1){
    var dir = typeof(data.queryStringObject.dir) == 'string'? data.queryStringObject.dir.trim() : false;
    if(dir){
      _data.list(dir,(err,allposts)=>{
        if(!err){
          callback(200,allposts);
        }
        else{
          callback(500,{'Error' : 'Couldn\'t list posts'});
        }
      });
    } else {
      callback(400,{'Error' : 'Missing required field, or field invalid'})
    }
  }
  else{
    var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
    if(id){
      
      _data.read('posts',id,function(err,postData){
        if(!err && postData){
              callback(200,postData);
        } else {
          callback(404);
        }
      });
    } else {
      callback(400,{'Error' : 'Missing required field, or field invalid'})
    }
  }
};

handlers._posts.delete = function(data,callback){
  
  var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
  if(id){
    
    _data.read('posts',id,function(err,postData){
      if(!err && postData){
        
        var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
        
        handlers._tokens.verifyToken(token,postData.phone,function(tokenIsValid){
          if(tokenIsValid){

            
            _data.delete('posts',id,function(err){
              if(!err){
                
                _data.read('users',postData.phone,function(err,userData){
                  if(!err){
                    var userPosts = typeof(userData.posts) == 'object' && userData.posts instanceof Array ? userData.posts : [];

                    
                    var postPosition = userPosts.indexOf(id);
                    if(postPosition > -1){
                      userPosts.splice(postPosition,1);
                      
                      userData.posts = userPosts;
                      _data.update('users',postData.phone,userData,function(err){
                        if(!err){
                          callback(200);
                        } else {
                          callback(500,{'Error' : 'Could not update the user.'});
                        }
                      });
                    } else {
                      callback(500,{"Error" : "Could not find the post on the user's object, so could not remove it."});
                    }
                  } else {
                    callback(500,{"Error" : "Could not find the user who created the post, so could not remove the post from the list of posts on their user object."});
                  }
                });
              } else {
                callback(500,{"Error" : "Could not delete the post data."})
              }
            });
          } else {
            callback(403);
          }
        });
      } else {
        callback(400,{"Error" : "The post ID specified could not be found"});
      }
    });
  } else {
    callback(400,{"Error" : "Missing valid id"});
  }
};




module.exports = handlers;
