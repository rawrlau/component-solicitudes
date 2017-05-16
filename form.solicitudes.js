angular.module('ghr.solicitudes', [])
.component('componentSolicitudes', {
  templateUrl: '../bower_components/component-solicitudes/form.solicitudes.html',
  controller: solicitudesController
})
.run(['$log', function (log) {
  log.log('Saludos desde ghr.solicitudes');
}])
;

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
