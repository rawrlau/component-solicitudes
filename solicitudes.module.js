angular
    .module('ghr.solicitudes', ['ui.bootstrap', 'toastr', 'ghr.candidatos', 'ghr.caracteristicas', 'ghr.requisitos'])
    .component('ghrSolicitudesForm', {
        templateUrl: '../bower_components/component-solicitudes/form.solicitudes.html',
        controller: controladorFormulario
    })
    .component('ghrSolicitudesList', {
        templateUrl: '../bower_components/component-solicitudes/list.solicitudes.html',
        controller: solicitudesListController
    })
    .config(function(toastrConfig) { // Configura los toastr
        angular.extend(toastrConfig, {
            closeButton: true,
            extendedTimeOut: 2000,
            tapToDismiss: true,
            preventOpenDuplicates: true
        });
    })
    .constant('solBaseUrl', 'http://localhost:3003/api/')
    .constant('solEntidad', 'solicitudes')
    .factory('solicitudesFactory', function solicitudesFactory(toastr, $http, solBaseUrl, solEntidad, candidatoFactory, caracteristicasFactory, requisitosFactory) {
        var serviceUrl = solBaseUrl + solEntidad;
        return {
            // Read and return all entities
            getAll: function getAll() {
                return $http({
                    method: 'GET',
                    url: serviceUrl
                }).then(function onSuccess(response) {
                    return response.data;
                }, function onFailure(reason) {
                    toastr.error('No se ha podido realizar la operacion, por favor compruebe su conexion a internet e intentelo más tarde.', '¡Error!');
                });
            },
            create: function create(solicitud) {
                return $http({
                    method: 'POST',
                    url: serviceUrl,
                    data: solicitud
                }).then(function onSuccess(response) {
                    toastr.success('¡Solicitud creada satisfactoriamente!', '¡Ok!');
                    return response.data;
                }, function onFailure(reason) {
                    toastr.error('No se ha podido realizar la operacion, por favor compruebe su conexion a internet e intentelo más tarde.', '¡Error!');
                });
            },
            read: function read(id) {
                return $http({
                    method: 'GET',
                    url: serviceUrl + '/' + id
                }).then(function onSuccess(response) {
                    return response.data;
                }, function onFailure(reason) {
                    toastr.error('No se ha podido realizar la operacion, por favor compruebe su conexion a internet e intentelo más tarde.', '¡Error!');
                });
            },
            update: function update(id, solicitud) {
                return $http({
                    method: 'PATCH',
                    url: serviceUrl + '/' + id,
                    data: solicitud
                }).then(function onSuccess(response) {
                    toastr.success('¡Solicitud modificada satisfactoriamente!', '¡Ok!');
                    return response.data;
                }, function onFailure(reason) {
                    toastr.error('No se ha podido realizar la operacion, por favor compruebe su conexion a internet e intentelo más tarde.', '¡Error!');
                });
            },
            delete: function _delete(id) {
                if (!id) {
                    throw solEntidad + 'invalida.';
                }
                return $http({
                    method: 'DELETE',
                    url: serviceUrl + '/' + id
                }).then(function onSuccess(response) {
                    toastr.success('¡Solicitud eliminada satisfactoriamente!', '¡Ok!');
                    return response.data;
                }, function onFailure(reason) {
                    toastr.error('No se ha podido realizar la operacion, por favor compruebe su conexion a internet e intentelo más tarde.', '¡Error!');
                });
            },
            // Devuelve el candidato seleccionado de la solicitud
            getCandidato: function getCandidato(id) {
                return $http({
                    method: 'GET',
                    url: serviceUrl + '/' + id + '/candidato'
                }).then(function onSuccess(response) {
                    return response.data;
                }, function onFailure(reason) {
                    toastr.error('No se ha podido realizar la operacion, por favor compruebe su conexion a internet e intentelo más tarde.', '¡Error!');
                });
            }
        };
    });
// Controller para generar nuestras solicitudes y gestionar el borrado de la solicitud
function solicitudesListController($uibModal, $log, solicitudesFactory, $filter, toastr) {
    const vm = this;

    function actualizarArraySolicitudes() {
        vm.arrayFiltrado = $filter('filter')(vm.arraySolicitudes, vm.filtro);
    }
    vm.actualizarArraySolicitudes = actualizarArraySolicitudes;
    solicitudesFactory.getAll().then(
        function onSuccess(response) {
            vm.arraySolicitudes = response;
            vm.arrayFiltrado = vm.arraySolicitudes;
            vm.totalItems = vm.arraySolicitudes.length;
        });
    // vm.arraySolicitudes = solicitudesFactory.getAll();
    vm.maxSize = 10; // Numero maximo de elementos
    vm.currentPage = 1;

    // Se encarga de abrir nuestra ventana modal en base al id obtenido
    vm.openComponentModal = function(id) {
        var modalInstance = $uibModal.open({
            component: 'modalComponentBorrarSolicitudes',
            resolve: {
                seleccionado: function() {
                    return id;
                }
            }
        });
        // Instance para borrar una entidad concreta de solicitudes
        modalInstance.result.then(function(solicitudId) {
            solicitudesFactory.delete(solicitudId).then(function onSuccess(deletedCount) {
                solicitudesFactory.getAll().then(function(solicitudes) {
                    vm.arraySolicitudes = solicitudes;
                    actualizarArraySolicitudes();
                });
            });
        }, function(reason) {});
    };
}
// Controller que se encarga de gestionar nuestro formulario de solicitudes
function controladorFormulario(toastr, solicitudesFactory, candidatoFactory, caracteristicasFactory, requisitosFactory, $stateParams, $log, $state) {
    const vm = this;

    vm.mode = $stateParams.mode;
    vm.estados = ['abierta', 'cerradaCliente', 'cerradaIncorporacion', 'standby'];

    /**
     * Cambia al modo entre view y edit
     * @return {[type]} [description]
     */
    vm.changeMode = function() {
        var modo;
        if ($stateParams.mode == 'view') modo = 'editar'
        else modo = 'view'
        $state.go($state.current, {
            mode: modo
        });
        vm.mode = $stateParams.mode;
    }

    /**
     * Crea una copia de la solicitud en un nuevo objeto para
     * ser recuperado en caso de descartar cambios
     * @return {[type]} [description]
     */
    vm.setOriginal = function(data) {
        vm.original = angular.copy(vm.solicitud = vm.formatearFecha(data));
    }

    /**
     * Descartar cambios
     * @return {[type]} [description]
     */
    vm.reset = function() {
        vm.solicitud = angular.copy(vm.original);
    };
    vm.reset();

    /**
     * Lee la solicitud pasada por el $stateParams
     * @return {[type]} [description]
     */
    vm.getSolicitud = function() {
        solicitudesFactory.read($stateParams.id)
            .then(function onSuccess(solicitud) {
                vm.solicitud = angular.copy(vm.original = vm.formatearFecha(solicitud));
            });
    }

    /**
     * Devuelve el candidato seleccionado de la solicitud
     * @return {[type]} [description]
     */
    vm.getCandidatoSeleccionado = function() {
        solicitudesFactory.getCandidato($stateParams.id)
            .then(function onSuccess(response) {
                vm.candidatoSeleccionado = response;
            });
    }

    /**
     * Devuelve la lista con los candidatos recomendados
     * @return {[type]} [description]
     */
    vm.setCandidatosRecomendados = function() {
        // candidatos
        candidatoFactory.getAll().then(function onSuccess(response) {
            vm.candidatos = response.filter(function(candidato) {
                return candidato.id != vm.candidatoSeleccionado.id;
            });
        });
        // requisitos
        requisitosFactory.getAll().then(function(response) {
            vm.reqObl = response.filter(function(requisito) {
                return requisito.listaDeRequisitoId == vm.solicitud.idReqObligatorios;
            });
            vm.reqDes = response.filter(function(requisito) {
                return requisito.listaDeRequisitoId == vm.solicitud.idReqDeseables;
            });
            console.log(vm.reqObl);
            console.log(vm.reqDes);
        });
    }

    // Lee la solicitud, el candidato seleccionado y los candidatos recomendados
    if ($stateParams.id != 0) {
        vm.getSolicitud();
        vm.getCandidatoSeleccionado();
        vm.setCandidatosRecomendados();
    }

    /**
     * Setea el candidato seleccionado de la solicitud
     * @return {[type]} [description]
     */
    vm.setCandidatoSelect = function setCandidatoSelect(id) {
        var idCandidato = null;
        if (id !== null) idCandidato = id;
        var solicitudMod = {
            candidatoId: idCandidato
        };
        solicitudesFactory.update($stateParams.id, solicitudMod)
            .then(function(response) {
                vm.solicitud = angular.copy(vm.solicitud);
            });

        vm.getCandidatoSeleccionado();
        vm.setCandidatosRecomendados();
    }

    /**
     * Formata la fecha de la solicitud para que sea compatible con la vista
     * @param  {[type]} response [description]
     * @return {[type]}          [description]
     */
    vm.formatearFecha = function formatearFecha(response) {
        response.fechaRecibida = new Date(response.fechaRecibida);
        return response;
    }

    /**
     * Crea o actualiza una solicitud
     * @param  {[type]} solicitud [description]
     * @param  {[type]} form      [description]
     * @return {[type]}           [description]
     */
    vm.updateOrCreate = function(solicitud, form) {
        if (form.$valid) {
            // Create
            if ($stateParams.id == 0) {
                delete vm.solicitud.id;
                solicitudesFactory.create(vm.solicitud).then(
                    function(solicitud) {
                        $state.go($state.current, {
                            id: solicitud.id
                        });
                    });
            }
            // Update
            else {
                var solicitudMod = {}
                for (var i = 0; i < form.$$controls.length; i++) {
                    var input = form.$$controls[i];
                    if (input.$dirty)
                        solicitudMod[input.$name] = input.$modelValue;
                }
                console.log(solicitudMod);
                if (form.$dirty) {
                    solicitudesFactory.update(solicitud.id, solicitudMod).then(
                        function onSuccess(response) {
                            vm.setOriginal(response);
                        }
                    );
                } else
                    toastr.info('No hay nada que modificar', 'Info');
            }
        } else {
            toastr.warning('¡Debe rellenar los campos obligatorios!', '¡Cuidado!');
        }
    };

    // Paginación de los candidatos recomendados
    vm.maxSize = 5; // Numero maximo de elementos
    vm.currentPage = 1;

}
// Controlador ModalInstanceCtrl para confirmar y cancelar nuestra peticion
angular
    .module('ghr.solicitudes')
    .controller('ModalInstanceCtrl', function($uibModalInstance, $log) {
        var $ctrl = this;
        vm.ok = function(value) {
            $uibModalInstance.close(value);
        };
        vm.cancel = function(reason) {
            $uibModalInstance.dismiss(reason);
        };
    });
// Modulo para nuestra ventana modal con su controller para eliminar y cancelar
angular
    .module('ghr.solicitudes')
    .component('modalComponentBorrarSolicitudes', {
        templateUrl: '../bower_components/component-solicitudes/myModalContent.html',
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&'
        },
        controller: function(toastr, solicitudesFactory) {
            var vm = this;
            vm.arraySolicitudes = solicitudesFactory.getAll();
            vm.$onInit = function() {
                vm.seleccionado = vm.resolve.seleccionado;
            };
            vm.eliminar = function(solicitud) {
                vm.close({
                    $value: solicitud
                });
            };
            vm.cancelar = function() {
                vm.dismiss({
                    $value: 'cancel'
                });
            };
        }
    });
