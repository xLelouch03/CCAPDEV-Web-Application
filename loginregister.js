$(document).ready(function() {
    // Switch to register form
    $('#registerLink').click(function() {
      $('#loginModal').modal('hide');
      $('#registerModal').modal('show');
    });

    // Switch to login form
    $('#loginLink').click(function() {
      $('#registerModal').modal('hide');
      $('#loginModal').modal('show');
    });

    $('#loginModal').on('hidden.bs.modal', function() {
        $(this).find('input').val('');
        $(this).find('#rememberMe').prop('checked', false);
      });
    
      $('#registerModal').on('hidden.bs.modal', function() {
        $(this).find('input').val('');
      });
  });