import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/+esm";

$(document).ready(function () {
  $(".delete-confirm").on("click", function (e) {
    e.preventDefault();
    const form = $(this).closest("form");
    if (confirm("Are you sure you want to delete this?")) {
      form.submit();
    }
  });

  const formularios = document.querySelectorAll(".form-eliminar");

  formularios.forEach((formulario) => {
    formulario.addEventListener("submit", function (e) {
      e.preventDefault();

      Swal.fire({
        title: "Esta seguro?",
        text: "Esto no se puede deshacer",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "No",
      }).then((result) => {
        if (result.isConfirmed) {
          formulario.submit();
        }
      });
    });
  });
});
