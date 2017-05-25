// Modulo ghr.solicitudes con su componente para el formulario y su listado
angular.module('ghr.solicitudes', ['ui.bootstrap'])
  .component('ghrSolicitudesForm', {
    templateUrl: '../bower_components/component-solicitudes/form.solicitudes.html',
    controller: controladorFormulario
  }).component('ghrSolicitudesList', {
    templateUrl: '../bower_components/component-solicitudes/list.solicitudes.html',
    controller: generarSolicitudes
  }).factory('solicitudesFactory', function solicitudesFactory() {
    // Arrays para rellenar nuestro objeto solicitud con valores aleatorios
    var nombre = ['Adrian', 'Hector', 'Dani', 'Miguel', 'Alex', 'Rodri', 'Marta', 'Alejandro', 'Alvaro'];
    var descripcion = ['descripcionuno', 'descripciondos', 'descripciontres', 'descripcioncuatro', 'descripcioncinco'];
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
        // fechaRecibida: new Date(new Date().getTime() - linearGenerator(0, 999999999999)),
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
      return date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear();
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
    return {
      // Read and return all entities
      getAll: function getAll() {
        return angular.copy(arraySolicitudes);
      },
      create: function create(solicitud) {
        console.log('estoy creando una solicitud' + JSON.stringify(solicitud));
        solicitud.id = arraySolicitudes.length + 1;
        arraySolicitudes.push(angular.copy(solicitud));
        console.log(arraySolicitudes);
      },
      read: function read(id) {
        // var solicitud;
        // for (var i = 0; (i < arraySolicitudes.length) && (solicitud == undefined); i++) {
        //   if (arraySolicitudes[i].id == id) {
        //     solicitud = angular.copy(arraySolicitudes[i]);
        //   }
        // }
        // return solicitud;
        return angular.copy(_getReferenceById(id));
      },
      update: function update(solicitud) {
        if (!solicitud.id) {
          throw 'El objeto carece de id y no se puede actualizar' + JSON.stringify(solicitud);
        }
        // var salida = false;
        // for (var i = 0; i < arraySolicitudes.length && salida == false; i++) {
        //   if (arraySolicitudes[i].id == solicitud.id) {
        //     arraySolicitudes[i] = angular.copy(solicitud);
        //     salida = true;
        //   }
        // }
        // return angular.copy(arraySolicitudes[i]);
        oldSolicitud = _getReferenceById(solicitud.id);
        if (oldSolicitud) {
          var indice = arraySolicitudes.indexOf(oldSolicitud);
          var newSolicitud = arraySolicitudes[indice] = angular.copy(solicitud);
          return angular.copy(newSolicitud);
        }
        throw 'El objeto no existe y no se puede actualizar' + JSON.stringify(solicitud);
      },
      delete: function _delete(solicitud) {
        if (!solicitud.id) {
          throw 'El objeto carece de id y no se puede actualizar' + JSON.stringify(solicitud);
        }
        oldSolicitud = _getReferenceById(solicitud.id);
        if (oldSolicitud) {
          var indice = arraySolicitudes.indexOf(oldSolicitud);
          if (indice > -1) {
            console.log('Antes de borrar' + arraySolicitudes);
            arraySolicitudes.splice(indice, 1);
            console.log('Despues de borrar' + arraySolicitudes);
          } else {
            throw 'El objeto no existe y no se puede borrar' + JSON.stringify(solicitud);
          }
        }
      }
    };
  });
// Controller para generar nuestras solicitudes y gestionar el borrado de la solicitud
function generarSolicitudes($uibModal, $log, solicitudesFactory) {
  var vm = this;
  vm.arraySolicitudes = solicitudesFactory.getAll();
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
    modalInstance.result.then(function (selectedItem) {
      var solicitudEliminar;
      vm.selected = selectedItem;
      console.log('selected' + vm.selected);
      $log.log('Tamaño', vm.arraySolicitudes.length);
      $log.log('Eliminando, ', selectedItem);
      for (var i = 0; i < vm.arraySolicitudes.length; i++) {
        if (vm.arraySolicitudes[i].id === selectedItem) {
          solicitudEliminar = vm.arraySolicitudes[i];
        }
      }
      vm.arraySolicitudes.splice(vm.arraySolicitudes.indexOf(solicitudEliminar), 1);
      $log.log('Tamaño', vm.arraySolicitudes.length);
    }, function (reason) {
      vm.selected = reason;
    });
  };
}
// Controller que se encarga de gestionar nuestro formulario de solicitudes
function controladorFormulario(solicitudesFactory, $stateParams, $log, $state) {
  var vm = this;
  vm.master = {};
  vm.id = $stateParams.id;
  vm.arraySolicitudes = solicitudesFactory.getAll();
  console.log(solicitudesFactory.read(vm.id));
  vm.solicitudEditar = solicitudesFactory.read(vm.id);
  $log.log(vm.solicitudEditar);
  vm.updateOrCreate = function (solicitudEditar, form) {
    // if ($('form').$valid) {
    if (form.$valid) {
      if (vm.id == 0) {
        solicitudesFactory.create(vm.solicitudEditar);
        $state.go($state.current, {id: vm.solicitudEditar.id});
      } else {
        solicitudesFactory.update(vm.solicitudEditar);
      }
    }
  };
  vm.reset = function (form) {
    if (form) {
      form.$setPristine();
      form.$setUntouched();
    }
    vm.solicitud = angular.copy(vm.master);
  };
  vm.reset();
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
    // console.log(solicitudesFactory.read(1));
    // vm.solicitudEditar = solicitudesFactory.read(1);
    vm.$onInit = function () {
      vm.seleccionado = vm.resolve.seleccionado;
    };
    vm.eliminar = function (solicitud) {
      solicitudesFactory.delete(solicitudesFactory.read(solicitud));
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
