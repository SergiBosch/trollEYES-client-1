var miControlador = miModulo.controller(
    "facturaRemoveController",
    ['$scope', '$http', '$routeParams', 'auth', '$location',
        function ($scope, $http, $routeParams, auth, $location) {
            $scope.authStatus = auth.data.status;
            $scope.authUsername = auth.data.message;
            if ($scope.authStatus != 200) {
                $location.path('/login');
            }

            $scope.controller = "facturaRemoveController";
            $scope.hecho = false;
            $scope.fallido = false;
            $scope.eliminar = function () {
                $http({
                    method: 'POST',
                    url: 'http://localhost:8081/trolleyes/json?ob=factura&op=remove&id='+$routeParams.id
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
                url: `http://localhost:8081/trolleyes/json?ob=factura&op=get&id=${$routeParams.id}`
            }).then(function (response) {
                const respuesta = response.data.message;
                $scope.id = respuesta.id;
                $scope.iva = respuesta.iva;
                $scope.fecha = respuesta.fecha;
                $scope.usuario_id = respuesta.usuario_obj.id;
                
            }, function () {

            });
        }
    ]
);