let jsonSource;

function inicio() {
    $.ajax({
        type: 'GET',
        url: Api.url('/parameter/withoutPaid'),
        contentType: "application/json; charset=utf-8",
        datatype: "json",
        beforeSend: function () {
            Api.showLoader('Cargando clientes con deuda...');
        },
        success: function (data, textStatus, xhr) {
            jsonSource = data;
            if (xhr.status != 204) {
                $.each(data, function (i, item) {
                    $("#input-cliente").append("<option value = " + item.codigoPersona + ">" + item.nombreCompleto + "</option>");
                });
            }
        },
        complete: function (data) {
            if (data.status != 204) {
                Api.flashSuccess('Lista de clientes cargada');
            } else {
                $("#btnConsultarCliente").prop('disabled', true);
                Api.flashInfo('Todos los clientes estan al dia en sus cuentas');
            }
        }
    });
}

function consultarCliente() {
    const codigoCliente = $("#input-cliente").val();
    if (codigoCliente != '') {
        $.ajax({
            type: 'GET',
            url: Api.url('/detailSale/detailSaleByCodigoCliente?codigo=' + codigoCliente),
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            beforeSend: function () {
                Api.showLoader('Consultando cuenta del cliente...');
            },
            success: function (data) {
                jsonSource = data.detallesVenta;
                $("#cuerpoTablaDetalleVenta").empty();
                $.each(jsonSource, function (i, item) {
                    $("#cuerpoTablaDetalleVenta").append("<tr><td class = \"text-center\">" + (i + 1) + "<td class = \"text-center\">" + Api.formatDateTime(new Date(item.fechaVenta)) + "<td class= \"text-center\">" + item.cantidad + "<td class= \"text-center\">" + item.unidadMedida + "<td class= \"text-center\">" + item.nombreProducto + "<td class= \"text-center\">S/ " + parseFloat(item.precioVenta).toFixed(2));
                });
                document.getElementById('resultado').innerHTML = '<b>Nombre de cliente: </b>' + data.nombreCliente + '<br><b>Precio a pagar: </b>S/ ' + data.precioFinal.toFixed(2);
            },
            complete: function () {
                Api.flashSuccess('Consulta realizada');
            }
        });
    } else {
        Swal.fire(
            'Alerta',
            'Debe seleccionar un cliente para continuar',
            'info'
        );
    }
}
