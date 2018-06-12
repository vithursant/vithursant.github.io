$(document).ready(function(){
    $('.slider').slider({full_width: true});
    // Initialize collapse button
    $(".button-collapse").sideNav({
      menuWidth: 1000, // Default is 240
      edge: 'left', // Choose the horizontal origin
      closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
    });
    // Initialize collapsible (uncomment the line below if you use the dropdown variation)
    //$('.collapsible').collapsible();

     function adjustIndex() {
      $('body').scrollTop(0);
      $("#sidenav-overlay").addClass("adjust-index");
      
    }

    $.fn.scrollView = function () {
      return this.each(function () {
        $('html, body').animate({
          scrollTop: $(this).offset().top-80
        }, 1000);
      });
    }

    $('.button-collapse').click(function(){
      adjustIndex();
    });

    $('#a-about').click(function (event) {
      var overlay = $('#sidenav-overlay');
      // $('.button-collapse').sideNav('hide'); // Needs to be simulated
      overlay.click();
      // event.preventDefault();
      $('#about-me').scrollView();
    });

    $('#a-contact').click(function (event) {
      var overlay = $('#sidenav-overlay');
      // $('.button-collapse').sideNav('hide'); // Needs to be simulated
      overlay.click();
      // event.preventDefault();
      $('#contact-me').scrollView();
    });

    $('#a-work').click(function (event) {
      var overlay = $('#sidenav-overlay');
      // $('.button-collapse').sideNav('hide'); // Needs to be simulated
      overlay.click();
      // event.preventDefault();
      $('#work').scrollView();
    });

    $('#a-education').click(function (event) {
      var overlay = $('#sidenav-overlay');
      // $('.button-collapse').sideNav('hide'); // Needs to be simulated
      overlay.click();
      // event.preventDefault();
      $('#education').scrollView();
    });

    // Stick menu bar on top
    var mn = $(".main-nav");
    $(window).scroll(function(){
      if( $(this).scrollTop() > 64 ){
        mn.addClass("main-nav-scrolled");
      }else{
        mn.removeClass("main-nav-scrolled");
      }
    });
  });
