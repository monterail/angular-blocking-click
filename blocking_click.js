angular.module('blockingClick', [])
  .provider('requestCounter', function($httpProvider){
    this.$get = ['$timeout', function($timeout){
      var activeRequests = 0, obj = { callbacks: [] };
      
      $httpProvider.defaults.transformRequest.push(function(data){
        activeRequests++;
        return data;
      });
      
      $httpProvider.defaults.transformResponse.push(function(data){
        activeRequests--;

        if (activeRequests == 0){
          angular.forEach(obj.callbacks, function(f){
            $timeout(function(){
              if (activeRequests == 0) f();
              else obj.callbacks.push(f);
            });
          });
          obj.callbacks = [];
        }

        return data;
      });

      return obj;
    }];
  })
  .directive('blockingClick', function() {    
    return {
      restrict: 'A',
      controller: function($scope, $element, $attrs, requestCounter){
        angular.element($element).on("click", function(){
          var spinner, isText = false;
          if (!angular.isUndefined($attrs.blockingClick) && angular.isString($attrs.blockingClick) && $attrs.blockingClick != "" && $attrs.blockingClick != "$spinner"){
            spinner = angular.element('<div/>').css('text-align', 'center').css('white-space', 'nowrap').text($attrs.blockingClick);
            isText = true;
          }else{
            spinner = angular.element('<div class="spinner"/>');
          }
          spinner.css('position', 'absolute');
          var container = angular.element('<div class="blocking-click"/>').insertBefore($element).append(spinner);
          container.css({height: angular.element($element).outerHeight(true) + 'px', width: angular.element($element).outerWidth(true) + 'px', position: 'relative'});
          spinner.css('top', container.innerHeight()/2 - spinner.outerHeight()/2 + 'px');
          spinner.css('left', container.innerWidth()/2 - spinner.outerWidth()/2 + 'px');
          var disp = angular.element($element).css('display');
          angular.element($element).css('display','none');
                    
          requestCounter.callbacks.push(function() {
            container.remove();
            angular.element($element).css('display', disp);
          });

          return true;
        });
      }
    };
  });
