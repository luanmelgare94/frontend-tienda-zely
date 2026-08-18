let jsonSource;

function actualizarContadorVentas() {
    const tabla = document.getElementById('tablaProducto');
    if (!tabla) {
        return;
    }
    const filas = tabla.getElementsByTagName('tbody')[0];
    const total = filas.children.length;
    const texto = total === 1 ? 'venta' : 'ventas';
    document.getElementById('resultado').innerText = 'Se encontró ' + total + ' ' + texto;
}

function renderVentas(items) {
    $("#bodyTable").empty();
    $.each(items, function (i, item) {
        const botonTrue = "<td class= \"text-center\"><button type=\"button\" class=\"btn btn-primary btn-circle btn\" onclick=\"mostrarDetalles('" + item.codigo + "');\" title= \"Ver detalles\"><i class=\"fas fa-search-plus\"></i></button>";
        const botonFalse = "<td class= \"text-center\"><button type=\"button\" class=\"btn btn-primary btn-circle btn\" onclick=\"mostrarDetalles('" + item.codigo + "');\" title= \"Ver detalles\"><i class=\"fas fa-search-plus\"></i></button>&nbsp;<button type=\"button\" class=\"btn btn-success btn-circle btn\" onclick=\"pagarCuenta('" + item.codigo + "');\" title=\"Pagar cuenta\"><i class=\"fas fa-donate\"></i></button>";
        const fila = "<tr><td class= \"text-center\">" + item.persona.nombreCompleto +
            "<td class= \"text-center\">" + item.tipoVenta.iso +
            "<td class= \"text-center\">" + formatDate(new Date(item.fechaVenta)) +
            "<td class= \"text-center\">" + evaluarPago(item.pagado) +
            "<td class= \"text-center\">" + formatearDiaPago(item.fechaPago);
        $("#bodyTable").append(fila + (item.pagado ? botonTrue : botonFalse));
    });
    actualizarContadorVentas();
}

function cargarVentas(endpoint, loaderMessage, successMessage) {
    $.ajax({
        type: 'GET',
        url: Api.url(endpoint),
        contentType: "application/json; charset=utf-8",
        datatype: "json",
        beforeSend: function () {
            Api.showLoader(loaderMessage || 'Cargando ventas...');
        },
        success: function (data) {
            jsonSource = data;
            renderVentas(data);
        },
        complete: function () {
            Api.flashSuccess(successMessage || 'Lista de ventas');
        }
    });
}

function inicio() {
    cargarVentas('/sale/getAll', 'Cargando ventas...', 'Lista de ventas');
}

function mostrarDetalles(codigo) {
    $("#formDetallesVenta").trigger("reset");
    $(".modal-header").css("background-color", "#007bff");
    $(".modal-header").css("color", "white");
    $(".modal-title").text("Detalles de venta");
    $("#modalDetalles").modal("show");
    $.ajax({
        type: 'GET',
        url: Api.url('/sale/getById?codigo=' + codigo),
        contentType: "application/json; charset=utf-8",
        datatype: "json",
        beforeSend: function () {
            Api.showLoader('Cargando detalle de venta...');
        },
        success: function (data) {
            jsonSource = data.detalleVenta;
            let acumuladorImporte = 0.0;
            $("#bodyTableDetalle").empty();
            $("#input-nombre_cliente").text(data.persona.nombreCompleto);
            $("#input-tipo_venta").text(data.tipoVenta.iso);
            $("#input-fecha_venta").text(formatDate(new Date(data.fechaVenta)));
            $("#input-pagado").text(evaluarPago(data.pagado));
            $("#input-fecha_pagado").text(formatearDiaPago(data.fechaPago));
            $.each(jsonSource, function (i, item) {
                acumuladorImporte += item.precio;
                $("#bodyTableDetalle").append("<tr><td class= \"text-center\">" + item.producto.nombre + "<td class= \"text-center\">" + item.cantidad + "<td class= \"text-center\">" + item.unidad.nombre + "<td class= \"text-center\">" + item.precio);
            });
            $("#input-importe_total").text(acumuladorImporte);
        },
        complete: function () {
            Api.flashSuccess('Detalle de venta cargado');
        }
    });
}

function pagarCuenta(codigo) {
    Swal.fire({
        title: 'Alerta',
        text: "¿Desea dar por pagada esta venta?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.value) {
            axios.patch(Api.url('/sale/paidSale?codigo=' + codigo))
                .then(function (response) {
                    if (response.status == 200) {
                        Swal.fire(
                            'Aviso',
                            'La venta fue pagada con éxito.',
                            'success'
                        );
                        window.location.href = "ventas.html";
                    } else if (response.status == 204) {
                        Swal.fire(
                            'Error',
                            'No se pudo completar con la operación, comuníquese con el administrador',
                            'error'
                        );
                    }
                })
                .catch(function (error) {
                    Api.handleError(error);
                });
        } else {
            swalWithBootstrapButtons.fire(
                'Cancelado',
                'No se realizo cambios',
                'info'
            );
        }
    });
}

function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

function formatDate(date) {
    return [
        padTo2Digits(date.getDate()),
        padTo2Digits(date.getMonth() + 1),
        date.getFullYear(),
    ].join('/') + ' ' + [
        padTo2Digits(date.getHours()),
        padTo2Digits(date.getMinutes()),
    ].join(':');
}

function evaluarPago(condicion) {
    return condicion ? 'SI' : 'NO';
}

function formatearDiaPago(date) {
    return date != null ? formatDate(new Date(date)) : 'NO REGISTRADO';
}

function bindVentasFiltros() {
    $("#rb-Ventas").click(function () {
        cargarVentas('/sale/getAll', 'Cargando ventas...', 'Lista de ventas');
    });
    $("#rb-VentasPagadas").click(function () {
        cargarVentas('/sale/getPaid', 'Cargando ventas pagadas...', 'Lista de ventas pagadas');
    });
    $("#rb-VentasNoPagadas").click(function () {
        cargarVentas('/sale/getNotPaid', 'Cargando ventas no pagadas...', 'Lista de ventas no pagadas');
    });
}

$(function () {
    bindVentasFiltros();
});
