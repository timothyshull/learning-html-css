/*jslint browser: true*/
/*global alert */

window.addEventListener("load", function () {
    "use strict";

    var form = document.getElementById("formSubmit"),
        firstNameAlert = document.getElementById("firstNameAlert"),
        passwordAlert = document.getElementById("passwordAlert"),
        submitButton = document.getElementById("submitButton");

    // Manually encode FormData object with input form information
    function encodeFormData(form) {
        var i = 0,
            formData = new FormData();

        // Create key value pairs from form information
        for (i; i < form.elements.length - 1; i = i + 1) {
            formData.append(form.elements[i].id, form.elements[i].value);
        }

        // Return for use in XHR
        return formData;
    }

    function sendData(formData) {
        var XHR = new XMLHttpRequest();

        // Event listener for successful load
        XHR.addEventListener("load", function (event) {
            console.log(event.target.responseText);
            // This is the successful form submission alert
            alert('Form successfully submitted');
        });

        // Event listener for unsuccessful error
        XHR.addEventListener("error", function () {
            alert('Form submission error ');
        });

        // Inititalize XHR request, set requested URL
        XHR.open("POST", "/echo/json/");

        // Send the FormData object passed as an argument
        XHR.send(formData);
    }

    // A function to verify existence of first name and alert if not
    function checkFirstName(firstName) {
        if (firstName === "") {
            firstNameAlert.style.visibility = "visible";
            document.getElementById("firstName").style.borderColor = "#b50011";
            setTimeout(function () {
                firstNameAlert.style.visibility = "hidden";
            }, 3000);
            return false;
        }
        return true;
    }

    // A function to verify existence and format of password and alert if not
    function checkPassword(password) {
        var strCmp = /[A-Z]+/.test(password);
        if (strCmp === false) {
            passwordAlert.style.visibility = "visible";
            document.getElementById("password").style.borderColor = "#b50011";
            submitButton.style.backgroundColor = "#878787";
            submitButton.style.textShadow = "2px 2px 10px #4F4F4F";
            setTimeout(function () {
                passwordAlert.style.visibility = "hidden";
                submitButton.style.backgroundColor = "#198913";
                submitButton.style.textShadow = "2px 2px 10px #10590c";
            }, 3000);
            return false;
        }
        return true;
    }

    // Run form validation and, if validated, submit XHR on submit event
    form.addEventListener("submit", function (event) {

        // Repopulate form from entered info (different from info on window load)
        var formNew = document.getElementById("formSubmit"),
            formValid = false,
            fn = formNew.firstName.value,
            pw = formNew.password.value,
            fd = encodeFormData(formNew),
            testName = checkFirstName(fn),
            testPw = checkPassword(pw);

        // Stops the default submit action
        event.preventDefault();

        formValid = (testName && testPw) ? true : false;

        // Check formValid and submit response or return to event loop
        if (formValid === true) {
            sendData(fd);
            return true;
        }
    });
});