angular.module('ghr.solicitudes', ['ui.bootstrap'])
  .component('componentSolicitudes', {
    templateUrl: '../bower_components/component-solicitudes/form.solicitudes.html',
    controller: solicitudesController
  }).component('ghrSolicitudesList', {
    templateUrl: '../bower_components/component-solicitudes/list.solicitudes.html',
    controller: generarSolicitudes
  });

  // Please note that $uibModalInstance represents a modal window (instance) dependency.
  // It is not the same as the $uibModal service used above.
angular.module('ghr.solicitudes').controller('ModalInstanceCtrl', function ($uibModalInstance, $log) {
  var $ctrl = this;
  $ctrl.ok = function (value) {
    $uibModalInstance.close(value);
  };
  $ctrl.cancel = function (reason) {
    $uibModalInstance.dismiss(reason);
  };
});
  // Please note that the close and dismiss bindings are from $uibModalInstance.
angular.module('ghr.solicitudes').component('modalSolicitudes', {
  templateUrl: '../bower_components/component-solicitudes/myModalContent.html',
  bindings: {
    resolve: '<',
    close: '&',
    dismiss: '&'
  },
  controller: function () {
    var $ctrl = this;
    $ctrl.$onInit = function () {
      $ctrl.seleccionado = $ctrl.resolve.seleccionado;
    };
    $ctrl.ok = function (seleccionado) {
      $ctrl.close({$value: seleccionado});
    };
    $ctrl.cancel = function () {
      $ctrl.dismiss({$value: 'cancel'});
    };
  }
}).run($log => {
    $log.log('Ejecutando Componente Modal');
});

function generarSolicitudes($filter, $uibModal, $log, $document) {
  const vm = this;
  vm.arraySolicitudes = crearSolicitudes();
  vm.maxSize = 10; // Numero maximo de elementos
  vm.currentPage = 1;
  vm.busqueda = "";

  vm.animationsEnabled = true;
  vm.openComponentModal = function (id) {
    var modalInstance = $uibModal.open({
      animation: vm.animationsEnabled,
      component: 'modalSolicitudes',
      resolve: {
        seleccionado: function () {
          return id;
        }
      }
    });

    modalInstance.result.then(function(selectedItem) {
      var deleteSolicitud;
      vm.selected = selectedItem;
      console.log(vm.arraySolicitudes.length);
      for (var i = 0; i < vm.arraySolicitudes.length; i++){
        if (vm.arraySolicitudes[i].id === selectedItem){
          deleteSolicitud = vm.arraySolicitudes[i];
        }
      }
      vm.arraySolicitudes.splice(vm.arraySolicitudes.indexOf(deleteSolicitud), 1);
      vm.actualizarArray();
      console.log(vm.arraySolicitudes.length);
        }, function() {
          $log.info('modal-solicitudes dismissed at: ' + new Date());
    });
  };

  vm.actualizarArray = function() {
                vm.solicitudesFiltradas = $filter('filter')(vm.arraySolicitudes, vm.busqueda);
                vm.totalItems = vm.solicitudesFiltradas.length;
            }
}

function solicitudesController() {
  const vm = this;
  vm.master = {};
  vm.update = function (solicitud) {
    vm.master = angular.copy(solicitud);
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
  // Arrays para rellenar nuestro objeto solicitud con valores aleatorios
var nombre = ['Adrian', 'Hector', 'Dani', 'Miguel', 'Alex', 'Rodri', 'Marta', 'Alejandro', 'Alvaro'];
var descripcion = ['descripcion1', 'descripcion2', 'descripcion3', 'descripcion4', 'descripcion5', 'descripcion6', 'descripcion7', 'descripcion8', 'descripcion9'];
var cliente = ['BBVA', 'El Corte Ingles', 'Clientazo'];
var brm = ['arm1', 'arm2', 'arm3', 'arm4', 'arm5', 'arm6'];
var adm = ['adm1', 'adm2', 'adm3', 'adm4', 'adm5', 'adm6'];
var perfil = ['programador', 'Senior Java', 'Analista', 'Senior JavaScript', 'Experto en C'];
var reqObligatorios = ['Conocimientos de java', 'Puntualidad', 'Responsabilidad'];
var reqDeseables = ['Deseable1', 'Deseable2', 'Deseable3', 'Deseable4', 'Deseable5'];
var viajar = ['F', 'R', 'E'];
var guardias = ['F', 'R', 'E'];
var ingles = ['Bajo', 'Medio', 'Alto'];
var consultorasContactadas = ['Consultora1', 'Consultora2', 'Consultora3', 'Consultora4', 'Consultora5'];
var estado = ['SinNoviaNiMujer', 'Casado', 'De lio'];
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
    // Funcion que crea un objeto solicitud y lo rellena con un valor aleatorio
function crearSolicitud(id) {
  var solicitud = {
    id: id,
    nombre: obtenerValor(nombre),
    descripcion: obtenerValor(descripcion),
    fechaRecibida: obtenerFecha(),
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
