var miControlador = miModulo.controller(
    "usuarioRemoveController",
    ['$scope', '$http', '$routeParams', 'auth', '$location',
        function ($scope, $http, $routeParams, auth, $location) {
            $scope.authStatus = auth.data.status;
            $scope.authUsername = auth.data.message;
            if ($scope.authStatus != 200) {
                $location.path('/login');
            }

            $scope.controller = "usuarioRemoveController";
            $scope.hecho = false;
            $scope.fallido = false;
            $scope.eliminar = function () {
                $http({
                    method: 'POST',
                    url: 'http://localhost:8081/trolleyes/json?ob=usuario&op=remove&id='+$routeParams.id
                }).then(function (response) {
                    if (response.data.status == 500) {
                        $scope.fallido = true;
                    }
                    $scope.hecho = true;
                }, function () {
                    $scope.fallido = true;
                    $scope.hecho = true;
                });
            };

            $scope.volver = function () {
                window.history.back();
            };

            $http({
                method: 'POST',
                url: `http://localhost:8081/trolleyes/json?ob=usuario&op=get&id=${$routeParams.id}`
            }).then(function (response) {
                const respuesta = response.data.message;
                $scope.id = respuesta.id;
                $scope.dni = respuesta.dni;
                $scope.nombre = respuesta.nombre;
                $scope.apellido1 = respuesta.apellido1;
                $scope.apellido2 = respuesta.apellido2;
                $scope.tipo_usuario_obj = respuesta.tipo_usuario_obj;
                $scope.login = respuesta.login;
                $scope.email = respuesta.email;
            }, function () {

            });
        }
    ]
);