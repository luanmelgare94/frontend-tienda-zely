function inicio() {
    $.ajax({
        type: 'GET',
        url: Api.url('/dashboard/statistics'),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        beforeSend: function () {
            Api.showLoader('Cargando estadisticas...');
        },
        success: function (data) {
            $("#input-cant_clie").html(data.cantidadPersonas);
            $("#input-cant_prod").html(data.cantidadProductos);
            $("#input-fecha_dia").html('Venta del ' + Api.formatDate(new Date()));
            $("#input-cant_ven_dia").html(data.cantidadVentasEnDia);
            $("#input-cant_ven_x_canc").html(data.cantidadVentasPorPagar);
        },
        error: function (xhr) {
            Api.handleError({ response: xhr });
        },
        complete: function () {
            Api.flashSuccess('Dashboard actualizado');
        }
    });
}

function formatDate(date) {
    return Api.formatDate(date);
}
