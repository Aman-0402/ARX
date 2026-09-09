import Swal from 'sweetalert2'

const theme = {
  confirmButtonColor: '#152238', // ink
  cancelButtonColor: '#5B6B8C', // slate
  background: '#F3F6FC', // paper
  color: '#152238', // graphite
}

export async function confirmDelete(text = 'This action cannot be undone.') {
  const result = await Swal.fire({
    ...theme,
    icon: 'warning',
    title: 'Delete this?',
    text,
    showCancelButton: true,
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#dc2626',
    reverseButtons: true,
  })
  return result.isConfirmed
}

export function showError(message) {
  Swal.fire({
    ...theme,
    icon: 'error',
    title: 'Something went wrong',
    text: message,
  })
}

export function showSuccess(message) {
  Swal.fire({
    ...theme,
    icon: 'success',
    title: message,
    timer: 2000,
    showConfirmButton: false,
  })
}
