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

  let btn = null;

  $(document).on("click", 'input[type="radio"]', function () {
    if (this === btn) {
      this.checked = false;
      btn = null;
      location.reload();
    } else {
      btn = this;
    }
  });

  const radios = document.querySelectorAll('input[name="idDireccion"]');
  const boton = document.getElementById("btnPedir");

  radios.forEach((r) => {
    r.addEventListener("change", () => {
      boton.disabled = false;
    });
  });

  setTimeout(() => {
    const laalerta = document.getElementById("alerta");
    if (laalerta) {
      laalerta.classList.remove("show");
      laalerta.addEventListener("transitionend", () => {
        laalerta.remove();
      });
    }
  }, 3000);
});
