const Api = {
    url(path) {
        const base = AppConfig.API_BASE_URL.replace(/\/$/, '');
        const normalizedPath = path.startsWith('/') ? path : `/${path}`;
        return `${base}${normalizedPath}`;
    },

    getLoaderHtml() {
        return '<div class="sweet_loader"><svg viewBox="0 0 140 140" width="140" height="140"><g class="outline"><path d="m 70 28 a 1 1 0 0 0 0 84 a 1 1 0 0 0 0 -84" stroke="rgba(0,0,0,0.1)" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"></path></g><g class="circle"><path d="m 70 28 a 1 1 0 0 0 0 84 a 1 1 0 0 0 0 -84" stroke="#71BBFF" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-dashoffset="200" stroke-dasharray="300"></path></g></svg></div>';
    },

    showLoader(message) {
        Swal.fire({
            html: `<h5>${message || 'Cargando...'}</h5>`,
            showConfirmButton: false,
            didOpen: () => {
                $('.swal2-content').prepend(this.getLoaderHtml());
            }
        });
    },

    flashSuccess(message, timer) {
        setTimeout(() => {
            Swal.fire({
                icon: 'success',
                html: `<h5>${message || 'Operacion completada'}</h5>`,
                timer: timer == null ? 100 : timer
            });
        }, 300);
    },

    flashInfo(message, timer) {
        setTimeout(() => {
            Swal.fire({
                icon: 'info',
                html: `<h5>${message || 'Informacion'}</h5>`,
                timer: timer == null ? 3000 : timer
            });
        }, 300);
    },

    handleError(error) {
        let data = null;
        if (error && error.response) {
            data = error.response.data || error.response.responseJSON || null;
        }
        if (data && data.fieldErrors) {
            const details = Object.entries(data.fieldErrors)
                .map(([field, msg]) => `${field}: ${msg}`)
                .join('<br>');
            Swal.fire('Validacion', details, 'error');
            return;
        }
        let message = (data && data.message) ? data.message : 'Ocurrio un error al procesar la solicitud';
        if (message.includes('; ')) {
            message = message.split('; ').join('<br>');
            Swal.fire({ title: 'Error', html: message, icon: 'error' });
            return;
        }
        Swal.fire('Error', message, 'error');
    },

    padTo2Digits(num) {
        return num.toString().padStart(2, '0');
    },

    formatDate(date) {
        return [
            this.padTo2Digits(date.getDate()),
            this.padTo2Digits(date.getMonth() + 1),
            date.getFullYear()
        ].join('/');
    },

    formatDateTime(date) {
        return `${this.padTo2Digits(date.getDate())}/${this.padTo2Digits(date.getMonth() + 1)}/${date.getFullYear()} ${this.padTo2Digits(date.getHours())}:${this.padTo2Digits(date.getMinutes())}:${this.padTo2Digits(date.getSeconds())}`;
    }
};

const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
        confirmButton: 'btn btn-primary mx-1',
        cancelButton: 'btn btn-danger mx-1'
    },
    buttonsStyling: false
});

window.swalWithBootstrapButtons = swalWithBootstrapButtons;
