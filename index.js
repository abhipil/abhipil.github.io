var Life = require("life")

var life = new Life()
life.start()

document.addEventListener("DOMContentLoaded", function(){
    Typed.new("#hi", {
        strings: ["Hi^500, I'm Abhishek"],
        typeSpeed: 100,
        showCursor: false,
        callback: function() {
            $('.header div a')
                .show(1000);
        }
    });
});
