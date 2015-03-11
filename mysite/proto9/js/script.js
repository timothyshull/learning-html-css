(function () {
  "use strict";
  $(document).ready(function () {
    
    function updateView(hash) {
      var viewChange;
      if (!hash) {
        hash = location.hash.slice(1);
      }
    
      var hashSwitches = {
        "programming": function () {
          $("#programming").show();
          $("#sounds").hide();
          $("#installations").hide();
        },
        "sounds": function () {
          $("#programming").hide();
          $("#sounds").show();
          $("#installations").hide();
        },
        "installations": function () {
          $("#programming").hide();
          $("#sounds").hide();
          $("#installations").show();
        },
        "default": function () {
          $("#programming").show();
          $("#sounds").hide();
          $("#installations").hide();
        }
      }

      if (hashSwitches[hash]) {
        viewChange = hashSwitches[hash];
      } else {
        viewChange = hashSwitches["default"];
      }

      return viewChange();
    } 
    
    updateView("default");
    
    $(".no_jump").click(function(event) {
      var hash = $(this).attr("href").slice(1);
      event.preventDefault();

      updateView(hash);
    });
  });

  
})();