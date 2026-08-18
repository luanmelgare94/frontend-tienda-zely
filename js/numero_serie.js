let consultando = false;

function limpiarResultado() {
    $('#resultado-serie').addClass('d-none');
    $('#nombre-producto').text('-');
    $('#precio-producto').text('-');
}

function anunciarProducto(nombre, precio) {
    if (!('speechSynthesis' in window) || precio == null) {
        return;
    }

    const nombreProducto = nombre || 'Producto';
    const precioNumero = parseFloat(precio);
    const soles = Math.floor(precioNumero);
    const centimos = Math.round((precioNumero - soles) * 100);
    let mensaje = `${nombreProducto} cuesta ${soles} soles`;
    if (centimos > 0) {
        mensaje += ` con ${centimos} centimos`;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(mensaje);
    utterance.lang = 'es-PE';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
}

function consultarPorNumeroSerie(serialNumber) {
    if (!serialNumber || consultando) {
        return;
    }

    consultando = true;
    $('#input-numero-serie').val(serialNumber);

    $.ajax({
        type: 'GET',
        url: Api.url('/serial-number?serialNumber=' + encodeURIComponent(serialNumber)),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        beforeSend: function () {
            Api.showLoader('Consultando producto...');
        },
        success: function (data) {
            $('#input-numero-serie').val(data.numeroSerie || serialNumber);
            $('#nombre-producto').text(data.nombreProducto || '-');
            $('#precio-producto').text(
                data.precio != null ? 'S/ ' + parseFloat(data.precio).toFixed(2) : '-'
            );
            $('#resultado-serie').removeClass('d-none');
            anunciarProducto(data.nombreProducto, data.precio);
            Api.flashSuccess('Producto encontrado');
        },
        error: function (xhr) {
            limpiarResultado();
            Api.handleError({ response: xhr });
        },
        complete: function () {
            consultando = false;
            $('#input-serial-capture').val('').focus();
        }
    });
}

function procesarEscaneo() {
    const serial = $('#input-serial-capture').val().trim();
    $('#input-serial-capture').val('');
    if (serial) {
        consultarPorNumeroSerie(serial);
    }
}

function bindEscanner() {
    const $capture = $('#input-serial-capture');

    $capture.on('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            procesarEscaneo();
        }
    });

    $(document).on('click', function () {
        if (!consultando) {
            $capture.focus();
        }
    });
}

function inicio() {
    limpiarResultado();
    $('#input-numero-serie').val('');
    $('#input-serial-capture').val('').focus();
}

$(function () {
    bindEscanner();
});
