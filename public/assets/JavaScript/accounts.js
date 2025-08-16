$(document).ready(function () {
    
  // Initialize the delete button with a confirmation dialog
  $('.disable-account').on('click', function (e) {
    e.preventDefault();
    const form = $(this).closest('form');
    if (confirm('Are you sure you want to disable this account?')) {
      form.submit();
    }
  });
});