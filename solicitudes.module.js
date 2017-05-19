angular.module('ghr.solicitudes', ['ui.bootstrap'])
  .component('componentSolicitudes', {
    templateUrl: '../bower_components/component-solicitudes/form.solicitudes.html',
    controller: solicitudesController
  }).component('componenteList', {
    templateUrl: '../bower_components/component-solicitudes/list.solicitudes.html',
    controller: generarSolicitudes
  });

  function generarSolicitudes() {
    const vm = this;
    vm.arraySolicitudes = crearSolicitudes();
    vm.maxSize = 10; // Numero maximo de elementos
    vm.currentPage = 1;
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
  var nombres = ['Adrian', 'Hector', 'Dani', 'Miguel', 'Alex', 'Rodri', 'Marta', 'Alejandro', 'Alvaro'];
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
    for (var i = 1; i <= 101; i++) {
      arraySolicitudes.push(crearSolicitud(i));
    }
    return arraySolicitudes;
  }

    // Funcion que crea un objeto solicitud y lo rellena con un valor aleatorio
  function crearSolicitud(id) {
    var solicitud = {
      id: id,
      nombre: obtenerValor(nombres),
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
