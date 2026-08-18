let jsonSource;
let jsonDetallesVenta = [];

function inicio() {
    $("#cancelo").hide();
    $.ajax({
        type: 'GET',
        url: Api.url('/parameter/parameter1'),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        beforeSend: function () {
            Api.showLoader('Cargando parametros de venta...');
        },
        success: function (data) {
            jsonSource = data;
            $("#input-cliente").html('<option value="">--SELECCIONE--</option>');
            $("#input-producto").html('<option value="">--SELECCIONE--</option>');
            $("#input-tip_venta").html('<option value="">--SELECCIONE--</option>');

            $.each(data.personas, function (i, item) {
                $("#input-cliente").append(`<option value="${item.codigoPersona}">${item.nombreCompleto}</option>`);
            });
            $.each(data.productos, function (i, item) {
                $("#input-producto").append(`<option value="${item.codigo}">${item.nombre}</option>`);
            });
            $.each(data.tipoVentas, function (i, item) {
                $("#input-tip_venta").append(`<option value="${item.codigo}">${item.nombre}</option>`);
            });
        },
        error: function (xhr) {
            Api.handleError({ response: xhr });
        },
        complete: function () {
            Api.flashSuccess('Parametros cargados');
        }
    });
}

function listarUnidadDeMedicionPorCodigoProducto(codigo) {
    $.ajax({
        type: 'GET',
        url: Api.url('/parameter/parameter2?codigo=' + codigo),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        beforeSend: function () {
            Api.showLoader('Cargando unidades de medida...');
        },
        success: function (data) {
            $("#input-unidad").html('<option value="">--SELECCIONE--</option>');
            $("#input-cantidad").prop('disabled', true);
            $("#input-cantidad").val('');
            $("#input-costo").val(data.precio);
            $("#input-precio").val('');
            $.each(data.datosUnidad, function (i, item) {
                $("#input-unidad").append(`<option value="${item.codigoValor}">${item.nombre}</option>`);
                $("#input-codigoPadre").val(item.codigoPadre);
            });
        },
        error: function (xhr) {
            Api.handleError({ response: xhr });
        },
        complete: function () {
            Api.flashSuccess('Unidades cargadas');
        }
    });
}

function registrarVenta() {
    if ($("#input-cliente").val() === '' || $("#input-tip_venta").val() === '' || jsonDetallesVenta.length === 0) {
        Swal.fire(
            'Aviso',
            'Solo los campos de observaciones son opcionales, el resto es obligatorio',
            'warning'
        );
        return;
    }

    const persona = { codigo: $("#input-cliente").val() };
    const tipoVenta = { codigo: $("#input-tip_venta").val() };
    const pagado = $("#input-tip_venta").val() === '1' ? true : $('#input-canc_ven').is(':checked');
    const observacionVenta = $("#input-observacion_venta").val() === ''
        ? 'SIN OBSERVACIONES'
        : $("#input-observacion_venta").val().toUpperCase();

    axios.post(Api.url('/sale/register'), {
        pagado: pagado,
        persona: persona,
        tipoVenta: tipoVenta,
        observacion: observacionVenta,
        detalleVenta: jsonDetallesVenta
    })
        .then(function (response) {
            if (response.status === 201) {
                Swal.fire({
                    title: 'Aviso',
                    text: 'Venta registrada satisfactoriamente.',
                    icon: 'success',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Ok'
                }).then((result) => {
                    if (result.value) {
                        window.location.href = 'reg_ventas.html';
                    }
                });
            }
        })
        .catch(function (error) {
            Api.handleError(error);
        });
}

function agregarDetalle() {
    if ($("#input-cliente").val() === '' || $("#input-tip_venta").val() === '' || $("#input-producto").val() === '' ||
        ($("#input-cantidad").val() === '' || $("#input-cantidad").val() === '0') || $("#input-unidad").val() === '' ||
        ($("#input-precio").val() === '' || $("#input-precio").val() === '0')) {
        Swal.fire(
            'Aviso',
            'Solo los campos de observaciones son opcionales, el resto es obligatorio',
            'warning'
        );
        return;
    }

    const producto = { codigo: $("#input-producto").val() };
    const cantidad = $("#input-cantidad").val();
    const unidad = { codigoPadre: $("#input-codigoPadre").val(), codigoValor: $("#input-unidad").val() };
    const precio = $("#input-precio").val();
    const observacionDetalle = $("#input-observacion_detalle").val() === ''
        ? 'SIN OBSERVACIONES'
        : $("#input-observacion_detalle").val().toUpperCase();

    jsonDetallesVenta.push({
        producto: producto,
        cantidad: cantidad,
        unidad: unidad,
        precio: precio,
        observacion: observacionDetalle
    });

    Swal.fire('Aviso', 'El detalle se agrego correctamente', 'info');

    const cuerpoTablaDetalle = document.getElementById('cuerpoTablaDetalleVenta');
    cuerpoTablaDetalle.innerHTML += `<tr>
        <td class="text-center">${$("#input-producto option:selected").text()}</td>
        <td class="text-center">${$("#input-cantidad").val()}</td>
        <td class="text-center">${$("#input-unidad option:selected").text()}</td>
        <td class="text-center">${$("#input-precio").val()}</td>
    </tr>`;

    $("#input-producto").val('');
    $("#input-cantidad").val('');
    $("#input-unidad").val('');
    $("#input-precio").val('');
    $("#input-observacion_detalle").val('');
}
