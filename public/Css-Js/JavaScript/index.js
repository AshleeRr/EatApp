$(document).ready(function(){
    $('.delete-confirm').on('click', function (e){
        e.preventDefault();
        const form = $(this).closest('form');
        if(confirm('Are you sure you want to delete this?')){
            form.submit();
        }
    });
});