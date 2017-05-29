// Modulo ghr.solicitudes con su componente para el formulario y su listado
angular.module('ghr.solicitudes', ['ui.bootstrap', 'toastr'])
  .component('ghrSolicitudesForm', {
    templateUrl: '../bower_components/component-solicitudes/form.solicitudes.html',
    controller: controladorFormulario
  }).component('ghrSolicitudesList', {
    templateUrl: '../bower_components/component-solicitudes/list.solicitudes.html',
    controller: solicitudesListController
  })
  .constant('solBaseUrl', 'http://localhost:3003/api/')
  .constant('solEntidad', 'solicitudes')
  .factory('solicitudesFactory', function solicitudesFactory($http, solBaseUrl, solEntidad) {
    // Arrays para rellenar nuestro objeto solicitud con valores aleatorios
    var nombre = ['Adrian', 'Hector', 'Dani', 'Miguel', 'Alex', 'Rodri', 'Marta', 'Alejandro', 'Alvaro'];
    var descripcion = ['descripcion1', 'descripcion2', 'descripcion3', 'descripcion4', 'descripcion5', 'descripcion6', 'descripcion7', 'descripcion8', 'descripcion9'];
    var cliente = ['BBVA', 'El Corte Ingles', 'Clientazo'];
    var brm = ['arm1', 'arm2', 'arm3', 'arm4', 'arm5', 'arm6'];
    var adm = ['adm1', 'adm2', 'adm3', 'adm4', 'adm5', 'adm6'];
    var perfil = ['programador', 'Senior Java', 'Analista', 'Senior JavaScript', 'Experto en C'];
    var reqObligatorios = ['Conocimientos de java', 'Puntualidad', 'Responsabilidad'];
    var reqDeseables = ['Deseable1', 'Deseable2', 'Deseable3', 'Deseable4', 'Deseable5'];
    var viajar = ['S', 'N'];
    var guardias = ['S', 'N'];
    var ingles = ['Bajo', 'Medio', 'Alto'];
    var consultorasContactadas = ['Consultora1', 'Consultora2', 'Consultora3', 'Consultora4', 'Consultora5'];
    var estado = ['abierta', 'cerradaCliente', 'cerradaIncorporacion', 'standby'];

    // Funcion que crea un objeto solicitud y lo rellena con un valor aleatorio
    function crearSolicitud(id) {
      var solicitud = {
        id: id,
        nombre: obtenerValor(nombre),
        descripcion: obtenerValor(descripcion),
        fechaRecibida: new Date(obtenerFecha()),
        // fechaRecibida: new Date(new Date().getTime() - distribucionLineal(100)),
        cliente: obtenerValor(cliente),
        brm: obtenerValor(brm),
        adm: obtenerValor(adm),
        reqObligatorios: obtenerValor(reqObligatorios),
        reqDeseables: obtenerValor(reqDeseables),
        perfil: obtenerValor(perfil),
        ingles: obtenerValor(ingles),
        viajar: obtenerValor(viajar),
        guardias: obtenerValor(guardias),
        consultorasContactadas: obtenerValor(consultorasContactadas),
        estado: obtenerValor(estado)
      };
      return solicitud;
    }

    // Con este metodo obtenemos una fecha aleatoria para nuestro campo fechaRecibida
    function obtenerFecha() {
      var date = new Date();
      var dia = Math.floor(Math.random() * 31);
      var mes = Math.floor(Math.random() * 13);
      date.setDate(date.getDate() + dia);
      date.setMonth(date.getMonth() + mes);
      return date.getMonth() + '/' + date.getDate() + '/' + date.getFullYear();
    }

    // Obtenemos un valor aleatorio
    function distribucionLineal(rango) {
      return Math.floor(Math.random() * rango);
    }

    // Rellenamos el array con nuestro valor aleatorio
    function obtenerValor(array) {
      return array[distribucionLineal(array.length)];
    }

    // Creamos un numero determinado de objeto solicitud
    function crearSolicitudes() {
      var arraySolicitudes = [];
      for (var i = 1; i <= 104; i++) {
        arraySolicitudes.push(crearSolicitud(i));
      }
      return arraySolicitudes;
    }

    function _getReferenceById(id) {
      var solicitud;
      for (var i = 0; (i < arraySolicitudes.length) && (solicitud == undefined); i++) {
        if (arraySolicitudes[i].id == id) {
          solicitud = arraySolicitudes[i];
        }
      }
      return solicitud;
    }
    // return crearSolicitudes();
    var arraySolicitudes = crearSolicitudes();
    var serviceUrl = solBaseUrl + solEntidad;
    return {

      // Read and return all entities
      getAll: function getAll() {
        // return angular.copy(arraySolicitudes);
        return $http({
          method: 'GET',
          url: serviceUrl
        })
        .then(function onSuccess(response) {
          return response.data;
        },
        function onFailure(reason) {

        });
      },
      create: function create(solicitud) {
        return $http({
          method: 'POST',
          url: serviceUrl,
          data: solicitud
        }).then(function onSuccess(response) {
          return response.data;
        });
      },
      read: function read(id) {
        return $http({
          method: 'GET',
          url: serviceUrl + '/' + id
        }).then(function onSuccess(response) {
          return response.data;
        });
      },
      update: function update(id, solicitud) {
        return $http({
          method: 'PATCH',
          url: serviceUrl + '/' + id,
          data: solicitud
        }).then(function onSuccess(response) {
          return response.data;
        });
      },
      delete: function _delete(id) {
        if (!id) {
          throw solEntidad + 'invalida.';
        }
        return $http({
          method: 'DELETE',
          url: serviceUrl + '/' + id
        });
      }
    };
  });

// Controller para generar nuestras solicitudes y gestionar el borrado de la solicitud
function solicitudesListController($uibModal, $log, solicitudesFactory, $filter, toastr) {
  var vm = this;

  // solicitudesFactory.getAll().then(
  //   function onSuccess(response) {
  //     vm.arraySolicitudes = response.data;
  //     console.log(response);
  //     console.log(vm.arraySolicitudes);
  //     vm.totalItems = vm.arraySolicitudes.length;
  //   });
  //
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
  vm.openComponentModal = function (id) {
    var modalInstance = $uibModal.open({
      component: 'modalComponentBorrarSolicitudes',
      resolve: {
        seleccionado: function () {
          return id;
        }
      }
    });

    // Instance para borrar una entidad concreta de solicitudes
    modalInstance.result.then(function (solicitudId) {
      solicitudesFactory.delete(solicitudId).then(function onSuccess(deletedCount) {
        solicitudesFactory.getAll().then(function (solicitudes) {
          vm.arraySolicitudes = solicitudes;
          actualizarArraySolicitudes();
        });
      }
      );
    }, function (reason) {

    });
  };
}

// Controller que se encarga de gestionar nuestro formulario de solicitudes
function controladorFormulario(toastr,solicitudesFactory, $stateParams, $log, $state) {
  var vm = this;
  vm.master = {};
  vm.id = $stateParams.id;
  $log.log(vm.solicitudEditar);
  vm.estados = ['abierta', 'cerradaCliente', 'cerradaIncorporacion', 'standby'];

  if ($stateParams.id != 0) {
    solicitudesFactory.read($stateParams.id).then(
      function (solicitud) {
        vm.solicitudEditar = angular.copy(vm.master = solicitud);
      }
    );
  }

  vm.updateOrCreate = function (solicitudEditar, form) {
    if (form.$valid) {
      if (vm.id == 0) {
        delete vm.solicitudEditar.id;
        solicitudesFactory.create(vm.solicitudEditar).then(
          function (solicitud) {
            $state.go($state.current, {id: solicitud.id});
            toastr.success('¡Solicitud creada satisfactoriamente!', '¡Éxito!');
          });
      } else {
        for (var elemento in form.$$controls) {
          if (elemento.$dirty) {
            vm.solicitudEditar[elemento.$name] = elemento.$modelValue;
          }
        }
        solicitudesFactory.update(vm.solicitudEditar.id, vm.solicitudEditar).then(
          function (response) {
            vm.solicitudEditar = angular.copy(vm. vcsolicitudEditar);
            toastr.success('¡Solicitud modificada satisfactoriamente!', '¡Éxito!');
          }
        );
      }
    }
    else {
      toastr.warning('¡Debe rellenar los campos obligatorios!', '¡Cuidado!');
    }
  };

  vm.reset = function (form) {
    if (form) {
      form.$setPristine();
      form.$setUntouched();
    }
    vm.solicitud = angular.copy(vm.master);
  };
}

// Controlador ModalInstanceCtrl para confirmar y cancelar nuestra peticion
angular.module('ghr.solicitudes').controller('ModalInstanceCtrl', function ($uibModalInstance, $log) {
  var $ctrl = this;
  vm.ok = function (value) {
    $uibModalInstance.close(value);
  };
  vm.cancel = function (reason) {
    $uibModalInstance.dismiss(reason);
  };
});

// Modulo para nuestra ventana modal con su controller para eliminar y cancelar
angular.module('ghr.solicitudes').component('modalComponentBorrarSolicitudes', {
  templateUrl: '../bower_components/component-solicitudes/myModalContent.html',
  bindings: {
    resolve: '<',
    close: '&',
    dismiss: '&'
  },
  controller: function (solicitudesFactory) {
    var vm = this;
    vm.arraySolicitudes = solicitudesFactory.getAll();

    vm.$onInit = function () {
      vm.seleccionado = vm.resolve.seleccionado;
    };

    vm.eliminar = function (solicitud) {
      vm.close({
        $value: solicitud
      });
    };

    vm.cancelar = function () {
      vm.dismiss({
        $value: 'cancel'
      });
    };
  }
});
