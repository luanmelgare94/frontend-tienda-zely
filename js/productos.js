let jsonSource;
let jsonCustomize;
let existenciaValue;
let existenciaId;
let busquedaValue;
let busquedaId;
let jsonBusquedaId = {};
let letter;
let idProd;
let activo;

function formatUltimaActualizacion(item) {
    return item.ultimaActualizacion == null
        ? 'Hace varios dias'
        : Api.formatDateTime(new Date(item.ultimaActualizacion));
}

function actualizarContadorProductos() {
    const tabla = document.getElementById('tablaProducto');
    if (!tabla) {
        return;
    }
    const filas = tabla.getElementsByTagName('tbody')[0];
    const total = filas.children.length;
    const texto = total === 1 ? 'producto' : 'productos';
    document.getElementById('resultado').innerText = 'Se encontró ' + total + ' ' + texto;
}

function renderProductosActivos(items) {
    $("#bodyTable").empty();
    $.each(items, function (i, item) {
        $("#bodyTable").append(
            "<tr><td>" + item.nombre +
            "<td class= \"text-center\">" + item.tipoProducto.nombre +
            "<td class= \"text-center\">S/ " + item.precio.toFixed(2) +
            "<td class= \"text-center\">" + formatUltimaActualizacion(item) +
            "<td class= \"text-center\"><button type=\"button\" class=\"btn btn-secondary btn-circle btn\" onclick=\"infoProducto('" + item.codigo + "', '" + item.nombre + "', '" + item.tipoProducto.nombre + "', '" + item.precio + "');\" title=\"Informacion de Producto\"><i class=\"fas fa-search-plus\"></i></button>&nbsp;<button type=\"button\" class=\"btn btn-primary btn-circle btn\" onclick=\"editar('" + item.codigo + "', '" + item.nombre + "', '" + item.tipoProducto.codigo + "', '" + item.precio + "');\" title=\"Editar Producto\"><i class=\"fas fa-edit\"></i></button>&nbsp;<button type=\"button\" class=\"btn btn-danger btn-circle btn\" onclick=\"eliminar('" + item.codigo + "', '" + item.nombre + "');\" title=\"Eliminar Producto\"><i class=\"fas fa-times\"></i></button></tr>"
        );
    });
    actualizarContadorProductos();
}

function filtrarProductos() {
    if (!jsonSource) {
        return;
    }
    const letter = $("#producto").val().trim().toLowerCase();
    const filtered = letter === ''
        ? jsonSource
        : jsonSource.filter(function (item) {
            return item.nombre.toLowerCase().includes(letter);
        });
    renderProductosActivos(filtered);
}

function inicio() {
    $('#producto').val('');
    $("#producto").focus();
    existenciaValue = document.getElementById("existenciaValue").value;
    existenciaId = document.getElementById("existenciaCodigo").value;
    busquedaValue = document.getElementById("busquedaValue").value;
    $.ajax({
        type: 'GET',
        url: Api.url('/product/active'),
        contentType: "application/json; charset=utf-8",
        datatype: "json",
        beforeSend: function () {
            Api.showLoader('Cargando Productos...');
        },
        success: function (data) {
            jsonSource = data;
            renderProductosActivos(jsonSource);
        },
        complete: function () {
            Api.flashSuccess('Productos cargados');
        }
    });
};

function ajaxListarDisabled() {
    $.ajax({
        type: 'GET',
        url: Api.url('/product/desactive'),
        contentType: "application/json; charset=utf-8",
        datatype: "json",
        beforeSend: function () {
            Api.showLoader('Cargando Productos...');
        },
        success: function (data) {
            $("#bodyTable").empty();
            $.each(data, function (i, item) {
                $("#bodyTable").append("<tr><td>" + item.nombre + "<td class= \"text-center\">" + item.tipoProducto.nombre + "<td class= \"text-center\">S/ " + item.precio.toFixed(2) + "<td class= \"text-center\">" + (item.ultimaActualizacion == null ? 'Hace varios dias' : Api.formatDateTime(new Date(item.ultimaActualizacion))) + "<td class= \"text-center\"><button type=\"button\" class=\"btn btn-primary btn-circle btn\" onclick=\"activarProducto('" + item.codigo + "', '" + item.nombre + "' );\"><i class=\"fas fa-check-circle\"></i></button></tr>");
            });
            //$("#divtableproduct").html(respuesta);
        },
        complete: function () {
            Api.flashSuccess('Productos cargados');
            let tablaDisciplina = document.getElementById('tablaProducto');
            if (tablaDisciplina == null) {
                document.getElementById('resultado').innerText = 'No hay elementos';
            } else {
                let filas = tablaDisciplina.getElementsByTagName('tbody')[0];
                if (filas.children.length == 1) {
                    document.getElementById('resultado').innerText = 'Se encontró ' + filas.children.length + ' producto';
                } else {
                    document.getElementById('resultado').innerText = 'Se encontró ' + filas.children.length + ' productos';
                }
            }

        }
    });
};

function registrarProducto() {
    let nomProducto = $("#nomProd").val();
    let precio = $("#precio").val();
    if ($("#nomProd").val() == "") {
        Swal.fire(
            'Alerta',
            'Debe ingresar un producto',
            'error'
        );
        $("#nomProd").focus();
    } else {
        if ($("#precio").val() == "") {
            Swal.fire(
                'Alerta',
                'Debe ingresar el precio',
                'error'
            );
            $("#precio").focus();
        } else {
            ajaxRegistrar();
        }
    }
};

function ajaxRegistrar() {
    var nombre = $("#nomProd").val().toUpperCase();
    var precio = $("#precio").val();
    var tipoProducto = $("#tipoProducto").val();
    axios.post(Api.url('/product/insert'), {
        nombre: nombre,
        codigoTipoProducto: tipoProducto,
        precio: precio
    })
        .then(function (response) {
            if (response.status == 201) {
                Swal.fire({
                    title: 'Aviso',
                    text: response.data.nombre + ' con precio S/ ' + response.data.precio + ' fue registrado satisfactoriamente.',
                    icon: 'success',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Ok'
                }).then((result) => {
                    if (result.isConfirmed) {
                        inicio();
                        $("#modalCRUD").modal("hide");
                    }
                });
            } else {
                if (response.status == 202) {
                    mensajeExistenteHabilitado();
                    $("#modalCRUD").modal("hide");
                } else {
                    if (response.status == 200) {
                        mensajeExistenteDeshabilitado();
                        $("#modalCRUD").modal("hide");
                    }
                }
            }
        })
        .catch(function (error) {
            Api.handleError(error);
        })
        .then(function () {
        });
};

function editar(idProducto, nombreProducto, idTipoProducto, precio) {
    $("#formEditar").trigger("reset");
    $(".modal-header").css("background-color", "#007bff");
    $(".modal-header").css("color", "white");
    $(".modal-title").text("Editar producto");
    $("#modalEdit").modal("show");
    $("#nomProdEd").val(nombreProducto);
    $("#precioEd").val(precio);
    $("#idProducto").val(idProducto);
    $("#auxmatb2").val(nombreProducto);
    $("#auxmatb").val('PARAPRECIO');
    $("#tipoProductoEd").html("<option value>--SELECCIONE--</option>");
    $.ajax({
        type: 'GET',
        url: Api.url('/typeProduct/getAll'),
        contentType: "application/json; charset=utf-8",
        datatype: "json",
        beforeSend: function () {
            Api.showLoader('Cargando Datos...');
        },
        success: function (data) {            
            $.each(data, function (i, item) {
                $("#tipoProductoEd").append("<option value=" + item.codigo + ">" + item.nombre + "</option>");
            });
        },
        complete: function (data) {
            Api.flashSuccess('Datos cargados');
            $("#tipoProductoEd").val(idTipoProducto);
        }
    });
};

function renderNumerosSerieProducto(numerosSerie) {
    $("#bodyTableNumeroSerie").empty();
    if (!numerosSerie || numerosSerie.length === 0) {
        $("#bodyTableNumeroSerie").append(
            '<tr><td class="text-center text-muted">Sin numeros de serie registrados</td></tr>'
        );
        return;
    }
    $.each(numerosSerie, function (i, item) {
        $("#bodyTableNumeroSerie").append(
            "<tr><td class=\"text-center\">" + item.numeroSerie + "</td></tr>"
        );
    });
}

function cargarNumerosSerieProducto(idProducto, mostrarMensaje, mostrarLoader) {
    $.ajax({
        type: 'GET',
        url: Api.url('/serial-number/product?idProduct=' + idProducto),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {
            if (mostrarLoader !== false) {
                Api.showLoader('Cargando numeros de serie...');
            }
        },
        success: function (data) {
            renderNumerosSerieProducto(data);
        },
        error: function (xhr) {
            Api.handleError({ response: xhr });
        },
        complete: function () {
            if (mostrarMensaje) {
                Api.flashSuccess('Informacion cargada');
            }
        }
    });
}

function activarEscaneoNumeroSerie() {
    $('#estado-escaneo-serie').removeClass('d-none');
    $('#input-serial-capture-modal').val('').focus();
}

function registrarNumeroSerieProducto(numeroSerie) {
    const idProducto = $('#idProductoInfo').val();
    if (!numeroSerie || !idProducto) {
        return;
    }

    axios.post(Api.url('/serial-number'), {
        codigoProducto: parseInt(idProducto, 10),
        tieneCodigoPropio: true,
        numeroSerie: numeroSerie
    })
        .then(function (response) {
            if (response.status === 201) {
                Api.flashSuccess('Numero de serie registrado');
                cargarNumerosSerieProducto(idProducto, false, false);
            }
        })
        .catch(function (error) {
            Api.handleError(error);
        })
        .finally(function () {
            $('#input-serial-capture-modal').val('').focus();
        });
}

function procesarEscaneoModal() {
    const serial = $('#input-serial-capture-modal').val().trim();
    $('#input-serial-capture-modal').val('');
    if (serial) {
        registrarNumeroSerieProducto(serial);
    }
}

function bindEscannerModalInfo() {
    $('#btnEscanearNumeroSerie').on('click', function () {
        activarEscaneoNumeroSerie();
    });

    $('#input-serial-capture-modal').on('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            procesarEscaneoModal();
        }
    });

    $('#modalInfo').on('shown.bs.modal', function () {
        activarEscaneoNumeroSerie();
    });

    $('#modalInfo').on('hidden.bs.modal', function () {
        $('#estado-escaneo-serie').addClass('d-none');
        $('#input-serial-capture-modal').val('');
    });
}

function infoProducto(idProducto, nombreProducto, nombreTipoProducto, precio) {
    $("#formInfo").trigger("reset");
    $(".modal-header").css("background-color", "#6c757d");
    $(".modal-header").css("color", "white");
    $(".modal-title").text("Informacion del producto");
    $("#nomProdInfo").text(nombreProducto);
    $("#tipoProductoInfo").text(nombreTipoProducto);
    $("#precioInfo").text('S/ ' + parseFloat(precio).toFixed(2));
    $("#idProductoInfo").val(idProducto);
    renderNumerosSerieProducto([]);
    $("#modalInfo").modal("show");
    cargarNumerosSerieProducto(idProducto, true);
}

function modificarProducto() {
    var idProducto = $("#idProducto").val();
    var auxmatb = $("#auxmatb").val();
    var nombreProducto = $("#nomProdEd").val();
    var precio = $("#precioEd").val();
    var idTipoProducto = $("#tipoProductoEd").val();
    if (nombreProducto == "" || precio == "") {
        if (nombreProducto == "") {
            Swal.fire(
                'Alerta',
                'Debe ingresar el nombre del producto',
                'error'
            );
        } else {
            if (precio == "") {
                Swal.fire(
                    'Alerta',
                    'Debe ingresar el precio',
                    'error'
                );
            }
        }
    } else {
        switch (auxmatb) {
            case 'NOEXISTE':
                ajaxModificar(idProducto, nombreProducto, precio, idTipoProducto);
                break;
            case 'INACTIVO':
                Swal.fire(
                    'Alerta',
                    'El producto ya estaba registrado y esta inactivo',
                    'error'
                );
                break;
            case 'PARAPRECIO':
                ajaxModificar(idProducto, nombreProducto, precio, idTipoProducto);
                break;
            case 'ACTIVO':
                Swal.fire(
                    'Alerta',
                    'Producto ya estaba registrado y esta activo',
                    'error'
                );
                break;
            default:
        }
    }
};

function ajaxModificar(id, nombre, precio, idTipoProducto) {

    axios.put(Api.url('/product/update?codigoProducto=' + id), {
        nombre: nombre,
        codigoTipoProducto: idTipoProducto,
        precio: precio
    })
        .then(function (response) {
            if (response.status == 200) {
                Swal.fire({
                    title: 'Aviso',
                    text: 'El producto ha sido actualizado correctamente.',
                    icon: 'success',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Ok'
                }).then((result) => {
                    if (result.isConfirmed) {
                        inicio();
                        $("#modalEdit").modal("hide");
                    }
                });
            } else {
                if (response.status == 304) {
                    Swal.fire(
                        'Error',
                        'No se pudo completar con la operación, comuníquese con el administrador.',
                        'error'
                    );
                } else {
                    if (response.status == 500) {
                        Swal.fire(
                            'Error',
                            'Error con el sistema, comuníquese con el administrador.',
                            'error'
                        );
                    }
                }
            }
        })
        .catch(function (error) {
            Api.handleError(error);
        })
        .then(function () {
        });

};

function activarProducto(x, y) {
    Swal.fire({
        title: 'Alerta',
        text: "¿Desea activar el producto" + y + " ?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Activar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.value) {
            ajaxReactivar(x);
            ajaxListarDisabled();
        } else {
            swalWithBootstrapButtons.fire(
                'Cancelado',
                'No se realizo cambios',
                'info'
            );
        }
    });

};

function ajaxReactivar(id) {
    axios.put(Api.url('/product/active?codigoProducto=' + id))
        .then(function (response) {
            if (response.status == 200) {
                Swal.fire(
                    'Aviso',
                    'El producto ha sido activado correctamente.',
                    'success'
                );
            } else {
                if (response.status == 304) {
                    Swal.fire(
                        'Error',
                        'No se pudo completar con la operación, comuníquese con el administrador',
                        'error'
                    );
                }
            }
        })
        .catch(function (error) {
            Api.handleError(error);
        })
        .then(function () {
        });
    ajaxListarDisabled();
};

function mensajeRegistrado(data) {
    Swal.fire(
        'Aviso',
        data.nombre + ' con precio S/ ' + data.precio + ' fue registrado satisfactoriamente.',
        'success'
    );
};

function mensajeExistenteHabilitado() {
    Swal.fire(
        'Aviso',
        'Este producto ya estaba registrado.',
        'warning'
    );
};

function mensajeExistenteDeshabilitado() {
    Swal.fire(
        'Aviso',
        'Este producto se encuentra dado de baja. Puede habilitarlo a través de la lista de deshabilitados',
        'warning'
    );
};

function mensajeModificado() {
    Swal.fire(
        'Aviso',
        'Producto modificado correctamente',
        'success'
    );
};

function mensajeEliminar() {
    Swal.fire(
        'Aviso',
        'Producto dado de baja correctamente',
        'success'
    );
};

function mensajeReactivar() {
    Swal.fire(
        'Aviso',
        'Producto activado correctamente',
        'success'
    );
};

function eliminar(x, y) {
    var idProducto = x;
    var nombreProducto = y;
    Swal.fire({
        title: 'Alerta',
        text: "¿Desea eliminar " + nombreProducto + " de los productos registrados?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.value) {
            ajaxEliminar(idProducto);
            inicio();
        } else {
            swalWithBootstrapButtons.fire(
                'Cancelado',
                'No se realizo cambios',
                'info'
            );
        }
    });
};

function ajaxEliminar(id) {
    axios.delete(Api.url('/product/inactive/' + id))
        .then(function (response) {
            if (response.status == 200) {
                Swal.fire(
                    'Aviso',
                    'El producto ha sido dado de baja correctamente.',
                    'success'
                );
            } else {
                if (response.status == 304) {
                    Swal.fire(
                        'Error',
                        'No se pudo completar con la operación, comuníquese con el administrador',
                        'error'
                    );
                } else {
                    if (response.status == 500) {
                        Swal.fire(
                            'Error',
                            'Error con el sistema, comuníquese con el administrador.',
                            'error'
                        );
                    }
                }
            }
        })
        .catch(function (error) {
            Api.handleError(error);
        })
        .then(function () {
        });
    inicio();
};

function desactivar() {
    if ($('#chkProdInactivos').prop('checked') == true) {
        $("#producto").prop('disabled', true);
        $("#btnNuevo").prop('disabled', true);
        ajaxListarDisabled();
    } else {
        $("#producto").prop('disabled', false);
        $("#btnNuevo").prop('disabled', false);
        inicio();
    }
};

function registrarProductoCSV() {
    var fd = new FormData();
    var files = $("#txtRegistraMasivo")[0].files;

    if (files.length > 0) {
        fd.append('file', files[0]);

        $.ajax({
            url: Api.url('/product/insertCSV'),
            type: 'POST',
            data: fd,
            contentType: false,
            processData: false,
            beforeSend: function () {
                Api.showLoader('Registrando productos desde CSV...');
            },
            success: function () {
                $("#modalRegistroMasivo").modal("hide");
                inicio();
                Api.flashSuccess('Se subio correctamente el archivo');
            },
            error: function (xhr) {
                Api.handleError({ response: xhr });
            },
            complete: function () {
                Swal.close();
            }
        });
    } else {
        Swal.fire(
            'Aviso',
            'Tiene que cargar un archivo en formato CSV',
            'error'
        );
    }
};

function actualizarProductoCSV() {
    var fd = new FormData();
    var files = $("#txtActualizacionMasiva")[0].files;

    if (files.length > 0) {
        fd.append('file', files[0]);

        $.ajax({
            url: Api.url('/product/updateCSV'),
            type: 'PUT',
            data: fd,
            contentType: false,
            processData: false,
            beforeSend: function () {
                Api.showLoader('Actualizando productos desde CSV...');
            },
            success: function () {
                $("#modalActualizacionMasiva").modal("hide");
                inicio();
                Api.flashSuccess('Se subio correctamente el archivo');
            },
            error: function (xhr) {
                Api.handleError({ response: xhr });
            },
            complete: function () {
                Swal.close();
            }
        });
    } else {
        Swal.fire(
            'Aviso',
            'Tiene que cargar un archivo en formato CSV',
            'error'
        );
    }
}

$(function () {
    $('#producto').on('keyup input', filtrarProductos);
    bindEscannerModalInfo();
});