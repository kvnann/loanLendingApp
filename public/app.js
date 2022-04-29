var app = {};


app.config = {
  'sessionToken' : false
};

calculateTakerWillPay = ()=>{
  var price = document.querySelector('#price').value
  var percent = document.querySelector('#percent').value
  price = parseInt(price);
  percent = parseInt(percent);
  var result = ((100+percent)*price)/100;
  document.querySelector("#payAmount").value = result;
  var profit = 0.7*(result-price);
  document.querySelector("#profit").value = profit;
}

calculateLoan = () =>{
  var month = parseInt(document.querySelector('#month').value);
  var ywp = parseInt(document.querySelector('#ywp').innerHTML);
  var result = ywp/month;
  document.querySelector('.mpm').innerHTML = result;
  
}


app.client = {}
myapp = {}

myapp.client = {}

myapp.client.formatDate = (date) => {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [day, month, year].join('/');
}

app.interpolate = function(str,data){
  str = typeof(str) == 'string' && str.length > 0 ? str : '';
  data = typeof(data) == 'object' && data !== null ? data : {};


  
  
  for(var key in data){
     if(data.hasOwnProperty(key) && typeof(data[key]) == 'string'){
        var replace = data[key];
        var find = '{'+key+'}';
        str = str.replace(find,replace);
     }
  }
  return str;
};



app.postTemplate = 
`
<div class="post smallersize" id={postId}>
  <div class="post_main">
      <div class="price"><span class="span">{price} AZN</span><span class="span">{percent}%</span></div>
      <div class="profile_container">
          <img src="http://localhost:3000/public/photos/default.jpg" alt="">
          <name>{firstName} </name>
          <surname>{lastName}</surname>
      </div>
      <div class="contact">
      <a href="http://localhost:3000/post?id={postId4}"><div class="" style="margin:-20px;"><button style="padding:10px 30px;" class="mbtn">Get</button></div></a>
      </div>
      <div class="rating">
          Min. rating: <span>{minRating}</span>
      </div>
  </div>
</div>
`

app.postTemplateForDashboard = 
`
<div class="post biggersize" id={postId}>
  <div class="post_main">
      <div class="price"><span class="span">{price} AZN</span><span class="span">{percent}%</span></div>
      <div class="profile_container">
          <img src="http://localhost:3000/public/photos/default.jpg" alt="">
          <name>{firstName} </name>
          <surname>{lastName}</surname>
      </div>


      <div class="half">
      <div><button class='mbtn btn-delete bg-orange' id="{postId2}">Edit</button></div>
      <div><button class='mbtn btn-delete' id="{postId3}">Delete</button></div>
      </div>
      <div class="insurance">
        {insurance}
      </div>
      <div class="rating">
      Min. rating: <span>{minRating}</span>
  </div>   
      
  </div>
  </a>
</div>

`

app.appendPosts = ()=>{





  var accountPosts = document.querySelector("#posts");
  if(document.body.contains(accountPosts)){

    var tokenString = localStorage.getItem("token");
    var token = JSON.parse(tokenString);
    var queryStringObject = {
      'id' : token.id
    }
    app.client.request(undefined,'http://localhost:3000/api/tokens','GET',queryStringObject,undefined,function(statusCode,tokenData){
      if(statusCode != 200){
        alert("Token is invalid");
      }
      else{
        queryStringObject = {
          'phone' : tokenData.phone
        }
        app.client.request(undefined,'http://localhost:3000/api/users','GET',queryStringObject,undefined,function(statusCode,userData){
          document.querySelector("#deleteAccount").addEventListener('click' , ()=>{
            app.client.request(undefined,'http://localhost:3000/api/users','DELETE',{"phone":tokenData.phone},undefined,function(statusCode,responsePayload){
              if(statusCode == 200){
                alert("Account deleted successfully");
                window.location = '/'
              }
              else{
                alert("Could not delete account :(. May be you have negative balance. Please check your balance and try again");
              }
            });
          });
          var userPosts = typeof(userData.posts) == 'object' ? userData.posts : [];
          document.querySelector('#firstNameForHeader').innerHTML = userData.firstName
          document.querySelector('#firstNameForDetail').innerHTML = userData.firstName
          document.querySelector('#lastNameForDetail').innerHTML = userData.lastName
          document.querySelector('#posts').innerHTML = ""
          userPosts.forEach(post => {
            queryStringObject = {
              'id': post
            }
            app.client.request(undefined,'http://localhost:3000/api/posts','GET',queryStringObject,undefined,function(statusCode,postData){
                var insurance = '';
                var ins = (postData.price*2.5/100);
                if(postData.insurance){
                  insurance = '<span class="text-green">Insurance: '+ ins.toString() + ' AZN</span>';
                }
                else{
                  insurance = '<span class="text-red">Non insurance</span>';
                }
                var templateData = {
                  "postId":postData.postId,
                  "postId2":postData.postId,
                  "postId3":postData.postId,
                  "postId4":postData.postId,
                  "price":postData.price.toString(),
                  "percent":postData.percent.toString(),
                  "firstName":userData.firstName,
                  "lastName":userData.lastName,
                  "email":userData.email,
                  "phone":userData.phone,
                  "phone1":userData.phone,
                  "phone2":userData.phone,
                  "token":token,
                  "insurance":insurance,
                  "minRating":postData.minRating.toString()
                };
                var str = app.postTemplateForDashboard;
                str = app.interpolate(str,templateData);
                document.querySelector('#posts').innerHTML += str;

            
            });
          })
        });
      }
    });

  }
  var allPosts = document.querySelector("#allposts");
  if(document.body.contains(allPosts)){
    var tokenString = localStorage.getItem("token");
    var token = JSON.parse(tokenString);
    var queryStringObject = {
      'dir' : 'posts',
      'list':1
    }
    app.client.request(undefined,'http://localhost:3000/api/posts','GET ',queryStringObject,undefined,function(statusCode,userPosts){
      document.querySelector('#allposts').innerHTML = '';
      userPosts.forEach(post => {
        queryStringObject = {
          'id': post
        }
        app.client.request(undefined,'http://localhost:3000/api/posts','GET',queryStringObject,undefined,function(statusCode,postData){
        queryStringObject = {
          'phone' : postData.phone
        }  
        app.client.request(undefined,'http://localhost:3000/api/users','GET' , queryStringObject, undefined, (statusCode,userData)=>{
          var templateData = {
              "postId":postData.postId,
              "postId4":postData.postId,
              "price":postData.price.toString(),
              "percent":postData.percent.toString(),
              "firstName":userData.firstName,
              "lastName":userData.lastName,
              "email":userData.email,
              "phone":userData.phone,
              "phone1":userData.phone,
              "phone2":userData.phone,
              "minRating":postData.minRating.toString()
            };
            var str = app.postTemplate;
            str = app.interpolate(str,templateData);
            document.querySelector('#allposts').innerHTML += str;

          })      
        });
      })
    });
  }

  


}


app.client.request = function(headers,path,method,queryStringObject,payload,callback){

  
  headers = typeof(headers) == 'object' && headers !== null ? headers : {};
  path = typeof(path) == 'string' ? path : '/';
  method = typeof(method) == 'string' && ['POST','GET','PUT','DELETE'].indexOf(method.toUpperCase()) > -1 ? method.toUpperCase() : 'GET';
  queryStringObject = typeof(queryStringObject) == 'object' && queryStringObject !== null ? queryStringObject : {};
  payload = typeof(payload) == 'object' && payload !== null ? payload : {};
  callback = typeof(callback) == 'function' ? callback : false;

  
  var requestUrl = path+'?';
  var counter = 0;
  for(var queryKey in queryStringObject){
     if(queryStringObject.hasOwnProperty(queryKey)){
       counter++;
       
       if(counter > 1){
         requestUrl+='&';
       }
       
       requestUrl+=queryKey+'='+queryStringObject[queryKey];
     }
  }

  
  var xhr = new XMLHttpRequest();
  xhr.open(method, requestUrl, true);
  xhr.setRequestHeader("Content-type", "application/json");

  
  for(var headerKey in headers){
     if(headers.hasOwnProperty(headerKey)){
       xhr.setRequestHeader(headerKey, headers[headerKey]);
     }
  }


  
  if(app.config.sessionToken){
    xhr.setRequestHeader("token", app.config.sessionToken.id);
  }

  
  xhr.onreadystatechange = function() {
      if(xhr.readyState == XMLHttpRequest.DONE) {
        var statusCode = xhr.status;
        var responseReturned = xhr.responseText;

        
        if(callback){
          try{
            var parsedResponse = JSON.parse(responseReturned);
            callback(statusCode,parsedResponse);
          } catch(e){
            callback(statusCode,false);
          }

        }
      }
  }

  
  var payloadString = JSON.stringify(payload);
  xhr.send(payloadString);

};


app.bindLogoutButton = function(){
    document.getElementById("logoutButton").addEventListener("click", function(e){
   
    e.preventDefault();

    
    app.logUserOut();

  });
};


app.logUserOut = function(redirectUser){
  
  redirectUser = typeof(redirectUser) == 'boolean' ? redirectUser : true;

  
  var tokenId = typeof(app.config.sessionToken.id) == 'string' ? app.config.sessionToken.id : false;

  
  var queryStringObject = {
    'id' : tokenId
  };
  app.client.request(undefined,'http://localhost:3000/api/tokens','DELETE',queryStringObject,undefined,function(statusCode,responsePayload){
    
    app.setSessionToken(false);

    
    if(redirectUser){
       window.location = '/';
    }

  });
};


app.bindForms = function(){
  if(document.querySelector("form")){

    var buyerTokenString = localStorage.getItem('token');
    var buyerToken = JSON.parse(buyerTokenString);

    if(document.querySelector('#loanBuyer')){
        document.querySelector('#loanBuyer').value = buyerToken.phone;
      }


    var allForms = document.querySelectorAll("form");
    for(var i = 0; i < allForms.length; i++){
        allForms[i].addEventListener("submit", function(e){
        e.preventDefault();
        var formId = typeof(this.id) == 'string' ? this.id : this.id.value;
        var path = this.action;
        var method = this.method.toUpperCase();
        var payload = {};
        var elements = this.elements;
        for(var i = 0; i < elements.length; i++){
          if(elements[i].type !== 'submit'){
            
            var classOfElement = typeof(elements[i].classList.value) == 'string' && elements[i].classList.value.length > 0 ? elements[i].classList.value : '';
            var valueOfElement = elements[i].type == 'checkbox' && classOfElement.indexOf('multiselect') == -1 ? elements[i].checked : classOfElement.indexOf('intval') == -1 ? elements[i].value : parseInt(elements[i].value);
            var elementIsChecked = elements[i].checked;
            
            var nameOfElement = elements[i].name;
            if(nameOfElement == '_method'){
              method = valueOfElement;
            } else {
              
              if(nameOfElement == 'httpmethod'){
                nameOfElement = 'method';
              }
              
              if(nameOfElement == 'uid'){
                nameOfElement = 'id';
              }
              
              if(classOfElement.indexOf('multiselect') > -1){
                if(elementIsChecked){
                  payload[nameOfElement] = typeof(payload[nameOfElement]) == 'object' && payload[nameOfElement] instanceof Array ? payload[nameOfElement] : [];
                  payload[nameOfElement].push(valueOfElement);
                }
              } else {
                payload[nameOfElement] = valueOfElement;
              }

            }
          }
        }


        
        var queryStringObject = method == 'DELETE' ? payload : {};
        var tokenString = localStorage.getItem('token');
        var token = JSON.parse(tokenString);
        if(payload.phone == undefined || payload.phone == token.phone){
            if(token.phone != undefined && token.phone != payload.phone){
          payload.phone = token.phone;

        }
        }

        var headers = {
          'token':token.id
        } 
        console.log("1")
        app.client.request(headers,path,method,queryStringObject,payload,function(statusCode,responsePayload){
          console.log("8")
          
          if(statusCode !== 200){

            if(statusCode == 403){
              
              app.logUserOut();

            } else {

              
              var error = typeof(responsePayload.Error) == 'string' ? responsePayload.Error : 'An error has occured, please try again';

              alert(error);

            }
          } else {
            console.log("2")
            app.formResponseProcessor(formId,payload,responsePayload);
            console.log("3")

          }
        });
      });
    }
  }
};


app.formResponseProcessor = function(formId,requestPayload,responsePayload){
  var functionToCall = false;
  if(formId == 'cardentry'){
    window.location = '/myaccount'
  }
  if(formId == 'accountCreate'){
    
    var newPayload = {
      'phone' : requestPayload.phone,
      'password' : requestPayload.password
    };

    app.client.request(undefined,'http://localhost:3000/api/tokens','POST',undefined,newPayload,function(newStatusCode,newResponsePayload){
      
      if(newStatusCode !== 200){

        alert("Error occured");

        

      } else {
        
        app.setSessionToken(newResponsePayload);
        window.location = '/home';
      }
    });
  }
  
  if(formId == 'sessionCreate'){
    app.setSessionToken(responsePayload);
    window.location = '/home';
  }

  
  var formsWithSuccessMessages = ['accountEdit1', 'accountEdit2','postsEdit'];
  if(formsWithSuccessMessages.indexOf(formId) > -1){
    document.querySelector("#"+formId+" .successMessage").style.display = 'block';
  }

  
  if(formId == 'accountEdit3'){
    app.logUserOut(false);
    window.location = '/';
  }

  
  if(formId == 'postsCreate'){
    window.location = '/myaccount';
  }

  
  if(formId == 'postsEdit2'){
    window.location = '/home';
  } 
  console.log(formId)
  
  if(formId == 'buy'){
    window.location = '/explore'
  }

};


app.getSessionToken = function(){
  var tokenString = localStorage.getItem('token');
  if(typeof(tokenString) == 'string'){
    try{
      var token = JSON.parse(tokenString);
      app.config.sessionToken = token;
      if(typeof(token) == 'object'){
        app.setLoggedInClass(true);
      } else {
        app.setLoggedInClass(false);
      }
    }catch(e){
      app.config.sessionToken = false;
      app.setLoggedInClass(false);
    }
  }
};


app.setLoggedInClass = function(add){
  var target = document.querySelector("body");
  if(add){
    target.classList.add('loggedIn');
  } else {
    target.classList.remove('loggedIn');
  }
};


app.setSessionToken = function(token){
  app.config.sessionToken = token;
  var tokenString = JSON.stringify(token);
  localStorage.setItem('token',tokenString);
  if(typeof(token) == 'object'){
    app.setLoggedInClass(true);
  } else {
    app.setLoggedInClass(false);
  }
};


app.renewToken = function(callback){
  var currentToken = typeof(app.config.sessionToken) == 'object' ? app.config.sessionToken : false;
  if(currentToken){
    
    var payload = {
      'id' : currentToken.id,
      'extend' : true,
    };
    app.client.request(undefined,'http://localhost:3000/api/tokens','PUT',undefined,payload,function(statusCode,responsePayload){
      
      if(statusCode == 200){
        
        var queryStringObject = {'id' : currentToken.id};
        app.client.request(undefined,'http://localhost:3000/api/tokens','GET',queryStringObject,undefined,function(statusCode,responsePayload){
          
          if(statusCode == 200){
            app.setSessionToken(responsePayload);
            callback(false);
          } else {
            app.setSessionToken(false);
            callback(true);
          }
        });
      } else {
        app.setSessionToken(false);
        callback(true);
      }
    });
  } else {
    app.setSessionToken(false);
    callback(true);
  }
};


app.loadDataOnPage = function(){  
  
  var bodyClasses = document.querySelector("body").classList;
  var primaryClass = typeof(bodyClasses[0]) == 'string' ? bodyClasses[0] : false;

  
  if(primaryClass == 'accountEdit'){
    app.loadAccountEditPage();
  }

  
  if(primaryClass == 'homePage'){
    app.loadpostsListPage();
  }

  
  if(primaryClass == 'postsEdit'){
    app.loadpostsEditPage();
  }
};


app.loadAccountEditPage = function(){
  
  var phone = typeof(app.config.sessionToken.phone) == 'string' ? app.config.sessionToken.phone : false;
  if(phone){
    
    var queryStringObject = {
      'phone' : phone
    };
    document.querySelector("#accountEdit3").style.display="block"
    document.querySelector("#deleteAccount").addEventListener('click' , ()=>{
      app.client.request(undefined,'http://localhost:3000/api/users','DELETE',queryStringObject,undefined,function(statusCode,responsePayload){
        if(statusCode == 200){
          alert("Account deleted successfully");
          window.location = '/'
        }
        else{
          alert("Could not delete account :(");
        }
      });
    });
    app.client.request(undefined,'../api/users','GET',queryStringObject,undefined,function(statusCode,responsePayload){
      if(statusCode == 200){
        
        document.querySelector("#accountEdit1 .displayPhoneInput").value = responsePayload.phone;
        document.querySelector("#accountEdit1 .displayFirstNameInput").value = responsePayload.firstName;
        document.querySelector("#accountEdit1 .displayLastNameInput").value = responsePayload.lastName;
        document.querySelector("#accountEdit1 .displayFirstNameInput").disabled = false;
        document.querySelector("#accountEdit1 .displayLastNameInput").disabled = false;

        
        var hiddenPhoneInputs = document.querySelectorAll("input.hiddenPhoneNumberInput");
        for(var i = 0; i < hiddenPhoneInputs.length; i++){
            hiddenPhoneInputs[i].value = responsePayload.phone;
        }



      } else {
        
        app.logUserOut();
      }
    });
  } else {
    app.logUserOut();
  }
};


app.loadpostsListPage = function(){
  
  var phone = typeof(app.config.sessionToken.phone) == 'string' ? app.config.sessionToken.phone : false;
  if(phone){
    
    var queryStringObject = {
      'phone' : phone
    };
    app.client.request(undefined,'http://localhost:3000/api/users','GET',queryStringObject,undefined, function(statusCode,responsePayload){
      if(statusCode == 200){
        document.querySelector('.usernametoDisplay').classList.add('show');
        document.querySelector('.usernametoDisplay').classList.remove('hide');
        document.querySelector('.userNameToShow').innerHTML = responsePayload.firstName;
        
        var allposts = typeof(responsePayload.posts) == 'object' && responsePayload.posts instanceof Array && responsePayload.posts.length > 0 ? responsePayload.posts : [];
        if(allposts.length > 0){

          
          document.querySelector('.posts').innerHTML = "<h1 class='loading'>Loading your to-dos...</h1>";
          var err = 0
          allposts.forEach(function(postId){
            
            var newQueryStringObject = {
              'id' : postId
            };
            app.client.request(undefined,'http://localhost:3000/api/posts','GET',newQueryStringObject,undefined,function(statusCode,responsePayload){
              if(statusCode == 200){
                var postData = responsePayload;
                var templateData = {
                  "postId":postData.id,
                  "postTitle":postData.title,
                  "postIdForDelete":postData.id,
                  "postIdForEdit":postData.id
                };
                var str = app.postTemplate;
                str = app.interpolate(str,templateData);
                document.querySelector('.posts').innerHTML += str;
                
              } else {
                err++
                console.log("Error trying to load post ID: ",postId);
              }
            });
          });
          
          var posts = document.querySelectorAll('.post')
          var refreshIntervalId = setInterval(()=>{

            posts = document.querySelectorAll('.post')
            if(posts.length == allposts.length - err){

              clearInterval(refreshIntervalId);
              home(posts);

            }
          }, 1000); 

          
          
        } else {
          
          document.getElementById("nopostsMessage").style.display = 'flex';

        }
      } else {
        
        app.logUserOut();
      }
    });
  } else {
    app.logUserOut();
  }
};



app.loadpostsEditPage = function(){
  
  var id = typeof(window.location.href.split('=')[1]) == 'string' && window.location.href.split('=')[1].length > 0 ? window.location.href.split('=')[1] : false;
  if(id){
    
    var queryStringObject = {
      'id' : id
    };
    document.querySelector("#passwordCheck-given").addEventListener('click' , ()=>{
      var userGivenPassword = document.querySelector('#password-input-given').value;
      document.querySelector(".waitingMessage-given").style.display='block';
      app.client.request(undefined,'http://localhost:3000/api/posts','GET',queryStringObject,undefined,function(statusCode,responsePayload){
        if(userGivenPassword == responsePayload.password){
          if(statusCode == 200){
            var hiddenIdInputs = document.querySelectorAll("input.hiddenIdInput");
            for(var i = 0; i < hiddenIdInputs.length; i++){
                hiddenIdInputs[i].value = responsePayload.id;
            }
            document.querySelector(".box").style.width="auto"
            document.querySelector(".waitingMessage-given").style.display='none';
            document.querySelector("#postsEdit1").style.display="block"
            document.querySelector("#postsEdit3").style.display="block"
            document.querySelector(".requirePassword").style.display = "none";

            
            document.querySelector("#postsEdit1 .title").value = responsePayload.title;
            document.querySelector("#postsEdit1 .text").value = responsePayload.text;
            document.querySelector("#postsEdit1 .deadline").value = responsePayload.deadline;

            document.querySelector("#postsEdit3 .deletepost").addEventListener('click' , ()=>{
              app.client.request(undefined,'http://localhost:3000/api/posts','DELETE',queryStringObject,undefined,function(statusCode,responsePayload){
                if(statusCode == 200){
                  alert("To-do deleted successfully");
                  window.location = '/home'
                }
                else{
                  alert("Could not delete to-do :(");
                }
              });
            });

          } else {
            window.location = '/home';
          }
        }
        else{
          document.querySelector(".waitingMessage-given").style.display='none';
          document.querySelector(".errorMessage-given").style.display='block';
          document.querySelector(".errorMessage-given").innerHTML='Wrong password';
        }
      });
    });
  } else {
    window.location = '/home';
  }
};


app.tokenRenewalLoop = function(){
  setInterval(function(){
    app.renewToken(function(err){
      if(!err){
        console.log("Token renewed successfully @ "+Date.now());
      }
    });
  },1000 * 60 * 60);
};

app.load = () => {
  var bodyClasses = document.querySelector("body").classList;
  var primaryClass = typeof(bodyClasses[0]) == 'string' ? bodyClasses[0] : false;

  if(primaryClass != 'login'){
    var tokenString = localStorage.getItem('token');
    var token = JSON.parse(tokenString);
    var phone = typeof(token.phone) == 'string' ? token.phone : false;
    app.client.request({"token" : token.id},'http://localhost:3000/api/users','GET',{"phone":phone},undefined,function(statusCode,userData){
      if(statusCode == 200){
        if(phone){
          var queryStringObject = {
            'phone' : phone
          };
          var header = {
            'token':token.id
          }

          document.querySelector('#balance').innerHTML = userData.balance;
          if(userData.balance < 0){
            document.querySelector('.balance-color').style.color = 'red';
          }
          else{
            document.querySelector('.balance-color').style.color = 'green';
            
          }
        }
      }
    })
  }

  
    
}

app.init = function(){

  
  app.bindForms();

  app.bindLogoutButton();

   app.load();
 
  app.appendPosts();
  
  app.getSessionToken();

  
  app.tokenRenewalLoop();

  
  app.loadDataOnPage();

};


window.onload = function(){
  app.init();
};
