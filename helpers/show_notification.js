import swal from "sweetalert2";

function showNotification(message, type) {
  if (type === "Success") swal.fire(type, message, "success");
  else swal.fire(type, message, "error");
}

export default showNotification;
