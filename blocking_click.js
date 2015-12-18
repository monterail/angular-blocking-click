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
        var outerHeight = function(el){
          var height = el.offsetHeight;
          var style = getComputedStyle(el);

          height += parseInt(style.marginTop) + parseInt(style.marginBottom);
          return height;
        };
        var outerWidth = function(el){
            var width = el.offsetWidth;
            var style = getComputedStyle(el);

            width += parseInt(style.marginLeft) + parseInt(style.marginRight);
            return width;
        };
        angular.element($element).bind("click", function(){
          var spinner, isText = false;
          if (!angular.isUndefined($attrs.blockingClick) && angular.isString($attrs.blockingClick) && $attrs.blockingClick != "" && $attrs.blockingClick != "$spinner"){
            spinner = angular.element('<div/>')[0];
            spinner.style.textAlign = 'center';
            spinner.style.whiteSpace = 'nowrap';
            spinner.innerHTML= $attrs.blockingClick;
            isText = true;
          }else{
            spinner = angular.element('<div class="spinner"/>')[0];
          }
          spinner.style.position = 'absolute';
          var domVersionOfElement  = angular.element($element)[0]
          var container = angular.element('<div class="blocking-click"/>')[0];
          $element.parent()[0].insertBefore(container,$element[0]).appendChild(spinner);
          container.style.height = outerHeight(domVersionOfElement)+ 'px';
          container.style.width = outerWidth(domVersionOfElement)+ 'px';
          container.style.position = 'relative';
          spinner.style.top = container.clientHeight/2 - spinner.offsetHeight/2 + 'px';
          spinner.style.left = container.clientWidth/2 - spinner.offsetHeight/2 + 'px';
          var disp = domVersionOfElement.style.display;
          domVersionOfElement.style.display= 'none';

          requestCounter.callbacks.push(function() {
            container.remove();
            domVersionOfElement.style.display = disp;
          });

          return true;
        });
      }
    };
  });
