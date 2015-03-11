/*jslint browser: true */
/*global $*/
(function () {
    "use strict";
    $(document).ready(function () {
        // Replaces hashchange functionality to avoid page scroll, shows/hides based on clicked nav link
        function updateView(hash) {
            var viewChange,
                hashSwitches = {
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
                };

            if (!hash) {
                hash = location.hash.slice(1);
            }

            if (hashSwitches[hash]) {
                viewChange = hashSwitches[hash];
            } else {
                viewChange = hashSwitches["default"];
            }

            return viewChange();
        }
        // Default to shoing programming section of page
        updateView("default");
        // Update the view anytime a nav link is clicked
        $(".no_jump").click(function (event) {
            var hash = $(this).attr("href").slice(1);
            event.preventDefault();

            updateView(hash);
        });
    });
}());
