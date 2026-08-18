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

function inicio() {
    $.ajax({
        type: 'GET',
        url: Api.url('/person/getAll'),
        contentType: "application/json; charset=utf-8",
        datatype: "json",
        beforeSend: function () {
            Api.showLoader('Cargando Clientes...');
        },
        success: function (data) {
            jsonSource = data;
            $("#bodyTable").empty();
            $.each(jsonSource, function (i, item) {
                var botonTrue = "<td class= \"text-center\"><button type=\"button\" class=\"btn btn-primary btn-circle btn\" onclick=\"editar('" + item.codigoPersona + "', '" + item.nombreCompleto + "', '" + item.observacion + "', '" + item.limiteCuenta + "', '" + item.cuenta + "' );\" title= \"Editar Cliente\"><i class=\"fas fa-edit\"></i></button>&nbsp;<button type=\"button\" class=\"btn btn-danger btn-circle btn\" onclick=\"eliminar('" + item.codigoPersona + "', '" + item.nombreCompleto + "');\" title=\"Eliminar cliente\"><i class=\"fas fa-times\"></i></button>&nbsp;<button type=\"button\" class=\"btn btn-warning btn-circle btn\" onclick=\"desactivarCuentaPorCodigo('" + item.codigoPersona + "');\" title=\"Desactivar cuenta\"><i class=\"fa-solid fa-down-long\"></i></button>";
                var botonFalse = "<td class= \"text-center\"><button type=\"button\" class=\"btn btn-primary btn-circle btn\" onclick=\"editar('" + item.codigoPersona + "', '" + item.nombreCompleto + "', '" + item.observacion + "', '" + item.limiteCuenta + "', '" + item.cuenta + "' );\" title= \"Editar Cliente\"><i class=\"fas fa-edit\"></i></button>&nbsp;<button type=\"button\" class=\"btn btn-danger btn-circle btn\" onclick=\"eliminar('" + item.codigoPersona + "', '" + item.nombreCompleto + "');\" title=\"Eliminar cliente\"><i class=\"fas fa-times\"></i></button>&nbsp;<button type=\"button\" class=\"btn btn-success btn-circle btn\" onclick=\"activarCuentaPorCodigo('" + item.codigoPersona + "');\" title=\"Activar cuenta\"><i class=\"fa-solid fa-up-long\"></i></button>";
                if (item.codigoPersona != 1) {
                    if (item.cuenta) {
                        $("#bodyTable").append("<tr><td class= \"text-center\">" + item.nombreCompleto + "<td class= \"text-center\">SI<td class= \"text-center\">" + item.observacion + "<td class= \"text-center\">S/ " + item.limiteCuenta + botonTrue);
                    } else {
                        $("#bodyTable").append("<tr><td class= \"text-center\">" + item.nombreCompleto + "<td class= \"text-center\">NO<td class= \"text-center\">" + item.observacion + "<td class= \"text-center\">S/ " + item.limiteCuenta + botonFalse);
                    }
                } else {
                    $("#bodyTable").append("<tr><td class= \"text-center\">" + item.nombreCompleto + "<td class= \"text-center\">NO<td class= \"text-center\">" + item.observacion + "<td class= \"text-center\">S/ " + item.limiteCuenta + "</tr>");
                }
            });
        },
        complete: function () {
            Api.flashSuccess('Lista de clientes');
            let tablaDisciplina = document.getElementById('tablaProducto');
            let filas = tablaDisciplina.getElementsByTagName('tbody')[0];
            if (filas.children.length == 1) {
                document.getElementById('resultado').innerText = 'Se encontró ' + filas.children.length + ' cliente';
            } else {
                document.getElementById('resultado').innerText = 'Se encontró ' + filas.children.length + ' clientes';
            }
        }
    });
};

function ajaxListarDisabled() {
    $.ajax({
        type: 'GET',
        url: Api.url('/person/getDeactivated'),
        contentType: "application/json; charset=utf-8",
        datatype: "json",
        beforeSend: function () {
            Api.showLoader('Cargando Clientes Desactivados...');
        },
        success: function (data) {
            $("#bodyTable").empty();
            $.each(data, function (i, item) {
                item.cuenta == true ? ($("#bodyTable").append("<tr><td class= \"text-center\">" + item.nombreCompleto + "<td class= \"text-center\">SI<td class= \"text-center\">" + item.observacion + "<td class= \"text-center\">S/ " + item.limiteCuenta + "<td class= \"text-center\"><button type=\"button\" class=\"btn btn-success btn-circle btn\" title=\"Reactivar\" onclick=\"activarProducto('" + item.codigoPersona + "', '" + item.nombreCompleto + "');\"><i class=\"fa-solid fa-trash-arrow-up\"></i></button></tr>")) :
                    ($("#bodyTable").append("<tr><td class= \"text-center\">" + item.nombreCompleto + "<td class= \"text-center\">NO<td class= \"text-center\">" + item.observacion + "<td class= \"text-center\">S/ " + item.limiteCuenta + "<td class= \"text-center\"><button type=\"button\" class=\"btn btn-success btn-circle btn\" title=\"Reactivar\" onclick=\"activarProducto('" + item.codigoPersona + "', '" + item.nombreCompleto + "');\"><i class=\"fa-solid fa-trash-arrow-up\"></i></button></tr>"));
            });
        },
        complete: function () {
            Api.flashSuccess('Lista de clientes desactivados');
            let tablaDisciplina = document.getElementById('tablaProducto');
            if (tablaDisciplina == null) {
                document.getElementById('resultado').innerText = 'No hay elementos';
            } else {
                let filas = tablaDisciplina.getElementsByTagName('tbody')[0];
                if (filas.children.length == 1) {
                    document.getElementById('resultado').innerText = 'Se encontró ' + filas.children.length + ' cliente';
                } else {
                    document.getElementById('resultado').innerText = 'Se encontró ' + filas.children.length + ' clientes';
                }
            }

        }
    });
};

function registrarCliente() {
    if ($("#input-nom_cliente").val() == "") {
        Swal.fire(
            'Alerta',
            'Debe ingresar un nombre de cliente',
            'error'
        );
        $("#input-nom_cliente").focus();
    } else {
        if ($("#input-observacion").val() == "") {
            Swal.fire(
                'Alerta',
                'Debe ingresar observacion del cliente',
                'error'
            );
            $("#input-observacion").focus();
        } else {
            if ($("#input-credito").is(':checked') && ($("#input-limit_cred").val() == "" || $("#input-limit_cred").val() < 10)) {
                Swal.fire(
                    'Alerta',
                    'Debe ingresar un limite de credito valido',
                    'error'
                );
                $("#input-limit_cred").focus();
            } else {
                ajaxRegistrar();
            }
        }
    }
};

function ajaxRegistrar() {
    axios.post(Api.url('/person/register'), {
        nombreCompleto: $("#input-nom_cliente").val().toUpperCase(),
        observacion: $("#input-observacion").val().toUpperCase(),
        cuenta: $("#input-credito").is(':checked') ? true : false,
        limiteCuenta: $("#input-credito").is(':checked') ? $("#input-limit_cred").val() : 0.0
    })
        .then(function (response) {
            if (response.status == 201) {
                Swal.fire({
                    title: 'Aviso',
                    text: response.data.nombreCompleto + ' fue registrado satisfactoriamente.',
                    icon: 'success',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Ok'
                }).then((result) => {
                    if (result.value) {
                        window.location.href = "clientes.html";
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

function editar(codPersona, nomCompl, observ, limitCuenta, cuenta) {
    $("#formEditar").trigger("reset");
    $(".modal-header").css("background-color", "#007bff");
    $(".modal-header").css("color", "white");
    $(".modal-title").text("Editar cliente");
    $("#modalEdit").modal("show");
    $("#input-id_producto_ed").val(codPersona);
    $("#input-nom_cliente_ed").val(nomCompl);
    cuenta == 'true' ? (
        $("#input-credito_ed").prop('checked', true),
        $("#txtCredito_ed").html('SI'),
        $("#input-limit_cred_ed").prop('disabled', false)
    ) : (
        $("#input-credito_ed").prop('checked', false),
        $("#txtCredito_ed").html('NO'),
        $("#input-limit_cred_ed").prop('disabled', true)
    );
    $("#input-observacion_ed").val(observ);
    $("#input-limit_cred_ed").val(limitCuenta);
};

function modificarCliente() {
    var idCliente;
    var nomCom;
    var cuenta;
    var obser;
    var limCue;    
    if ($("#input-nom_cliente_ed").val() == "") {
        Swal.fire(
            'Alerta',
            'Debe ingresar un nombre de cliente',
            'error'
        );
        $("#input-nom_cliente_ed").focus();
    } else {
        if ($("#input-observacion_ed").val() == "") {
            Swal.fire(
                'Alerta',
                'Debe ingresar observacion del cliente',
                'error'
            );
            $("#input-observacion_ed").focus();
        } else {
            if ($("#input-credito_ed").is(':checked') && ($("#input-limit_cred_ed").val() == "" || $("#input-limit_cred_ed").val() < 10)) {
                Swal.fire(
                    'Alerta',
                    'Debe ingresar un limite de credito valido',
                    'error'
                );
                $("#input-limit_cred_ed").focus();
            } else {
                idCliente = $("#input-id_producto_ed").val();
                nomCom = $("#input-nom_cliente_ed").val();
                cuenta = $("#input-credito_ed").is(':checked') ? true : false;
                obser = $("#input-observacion_ed").val();
                limCue = $("#input-limit_cred_ed").val();
                ajaxModificar(idCliente, nomCom, cuenta, obser, limCue);
            }
        }
    }
};

function ajaxModificar(idCliente, nomCom, cuenta, obser, limCue) {

    axios.put(Api.url('/person/update?codigo=' + idCliente), {
        nombreCompleto: nomCom,
        observacion: obser,
        cuenta: cuenta,
        limiteCuenta: limCue
    })
        .then(function (response) {
            if (response.status == 200) {
                Swal.fire({
                    title: 'Aviso',
                    text: 'El cliente ha sido actualizado correctamente.',
                    icon: 'success',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Ok'
                }).then((result) => {
                    if (result.value) {
                        window.location.href = "clientes.html";
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

function activarCuentaPorCodigo(id, nombre, precio) {

    axios.patch(Api.url('/person/enabledAccount?codigo=' + id))
        .then(function (response) {
            if (response.data) {
                Swal.fire({
                    title: 'Aviso',
                    text: 'La cuenta del cliente ha sido activada.',
                    icon: 'success',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Ok'
                }).then((result) => {
                    if (result.value) {
                        window.location.href = "clientes.html";
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

function desactivarCuentaPorCodigo(id) {

    axios.patch(Api.url('/person/disabledAccount?codigo=' + id))
        .then(function (response) {
            if (response.data) {
                Swal.fire({
                    title: 'Aviso',
                    text: 'La cuenta del cliente ha sido desactivada.',
                    icon: 'success',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Ok'
                }).then((result) => {
                    if (result.value) {
                        window.location.href = "clientes.html";
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
        text: "¿Desea activar al cliente " + y + " ?",
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
    axios.patch(Api.url('/person/active?codigo=' + id))
        .then(function (response) {
            if (response.status == 200) {
                Swal.fire(
                    'Aviso',
                    'El cliente ha sido activado correctamente.',
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
        'El cliente ' + data.nombre + ' fue registrado satisfactoriamente.',
        'success'
    );
};

function mensajeExistenteHabilitado() {
    Swal.fire(
        'Aviso',
        'Este cliente ya estaba registrado.',
        'warning'
    );
};

function mensajeExistenteDeshabilitado() {
    Swal.fire(
        'Aviso',
        'Este cliente se encuentra dado de baja. Puede habilitarlo a través de la lista de deshabilitados',
        'warning'
    );
};

function mensajeModificado() {
    Swal.fire(
        'Aviso',
        'Cliente modificado correctamente',
        'success'
    );
};

function mensajeEliminar() {
    Swal.fire(
        'Aviso',
        'Cliente dado de baja correctamente',
        'success'
    );
};

function mensajeReactivar() {
    Swal.fire(
        'Aviso',
        'Cliente activado correctamente',
        'success'
    );
};

function eliminar(x, y) {
    var idProducto = x;
    var nombreProducto = y;
    Swal.fire({
        title: 'Alerta',
        text: "¿Desea eliminar " + nombreProducto + " de los clientes registrados?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.value) {
            ajaxEliminar(idProducto);
            window.location.href = "clientes.html";
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
    axios.delete(Api.url('/person/inactive?codigo=' + id))
        .then(function (response) {
            if (response.status == 200) {
                Swal.fire(
                    'Aviso',
                    'El cliente ha sido dado de baja correctamente.',
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