var miControlador = miModulo.controller(
    "facturaPlistController",
    ['$scope', '$http', '$routeParams', '$location', 'auth',
        function ($scope, $http, $routeParams, $location, auth) {
            if (auth.data.status != 200) {
                $location.path('/login');
            }
            $scope.authStatus = auth.data.status;
            $scope.authUsername = auth.data.message;

            $scope.paginaActual = parseInt($routeParams.page);
            $scope.rppActual = parseInt($routeParams.rpp);
            $scope.rppS = [10, 50, 100];
            $scope.controller = "facturaPlistController";
            $scope.filter = $routeParams.id;
            $scope.buscar = $routeParams.buscar;
            if($routeParams.buscar ==undefined){
                $scope.buscar = "";
            }
            if ($routeParams.id != null) {
                urlgetpage = 'http://localhost:8081/trolleyes/json?ob=factura&op=getpage&rpp=' + $routeParams.rpp + '&page=' + $routeParams.page + '&id=' + $routeParams.id + '&filter=usuario'+'&buscar='+ $scope.buscar
                urlgetcount = 'http://localhost:8081/trolleyes/json?ob=factura&op=getcount&filter=usuario&id=' + $routeParams.id+'&buscar='+ $scope.buscar
            } else if ($scope.authUsername.tipo_usuario_obj.id == 2) {
                urlgetpage = 'http://localhost:8081/trolleyes/json?ob=factura&op=getpage&rpp=' + $routeParams.rpp + '&page=' + $routeParams.page + '&id=' + $scope.authUsername.id + '&filter=usuario'+'&buscar='+ $scope.buscar
                urlgetcount = 'http://localhost:8081/trolleyes/json?ob=factura&op=getcount&filter=usuario&id=' + $scope.authUsername.id+'&buscar='+ $scope.buscar
            }
            else {
                urlgetpage = 'http://localhost:8081/trolleyes/json?ob=factura&op=getpage&rpp=' + $routeParams.rpp + '&page=' + $routeParams.page+'&buscar='+ $scope.buscar
                urlgetcount = 'http://localhost:8081/trolleyes/json?ob=factura&op=getcount'+'&buscar='+ $scope.buscar
            }
            

            $http({
                method: 'POST',
                url: urlgetpage
            }).then(function (response) {
                $scope.status = response.data.status;
                $scope.pagina = response.data.message;
            }, function () { })

            $http({
                method: 'POST',
                url: urlgetcount
            }).then(function (response) {
                $scope.status = response.data.status;
                $scope.numRegistros = response.data.message;
                $scope.numPaginas = Math.ceil($scope.numRegistros / $routeParams.rpp);
                $scope.calcPage = [];
                for (const p of $scope.rppS) {
                    const res = $scope.paginaActual / $scope.numPaginas;
                    const next = Math.ceil($scope.numRegistros / p);
                    $scope.calcPage.push(Math.round(res * next));
                }
                paginacion(2);
            }, function () { })

            function paginacion(vecindad) {
                vecindad++;
                $scope.botonera = [];
                for (i = 1; i <= $scope.numPaginas; i++) {
                    if (i == 1) {
                        $scope.botonera.push(i);
                    } else if (i > ($scope.paginaActual - vecindad) && i < ($scope.paginaActual + vecindad)) {
                        $scope.botonera.push(i);
                    } else if (i == $scope.numPaginas) {
                        $scope.botonera.push(i);
                    } else if (i == ($scope.paginaActual - vecindad) || i == ($scope.paginaActual + vecindad)) {
                        $scope.botonera.push('...');
                    }
                }
            }

            $scope.buscar1 = function(){
                $location.path('/factura/plist/10/1/'+$scope.buscar);
             
            }


          $scope.print= function(datos)  {
            urlgetpagecompra = 'http://localhost:8081/trolleyes/json?ob=compra&op=getpage&rpp=' + $routeParams.rpp + '&page=' + $routeParams.page + '&id=' + datos.id + '&filter=factura'
            $http({
                method: 'POST',
                url: urlgetpagecompra
            }).then(function (response) {
                lineasPedido = response.data.message;
                
                var doc = new jsPDF();
                var img = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAeAAAAH3CAYAAABjB4y2AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAACAASURBVHic7N13vB1F/f/x173phVRCSQidhBaQ3hGkKB1FiqgIFkTErlh/iuhXUKxYAAUL8FWkSG/Su3SkdxJqCKSSXu79/fE555ubyy2n7Mxndvf9fDw+D0LbMzO7Z+fs7MxnQEQkjnWA/wEeB+4EhvoWR0REpNjeC1wNLAPaO8SfPAslIiJSRC3AAcBdrNjpdow2YG+vAoqIiBRJP+AobJi5u463Y7wIDHYpqYiISAEMBE4AJlNbx9sx/l/84oqIiORbP+BY4BXq73ir8Q6weuyCi4iI5FF1qPl5Gu94O8aZcYsvIiKSL63AocCzZNPxVmMpsEnEeoiIiORCK3Ak8DTZdrwd49JotREREUlcC3AItc9qbibagK3iVEtERCRdOwJ3EL7j7RhXRqmZiIhIgjYGLiRux9sxtg9fRRERkXSMB87CJkR5db7twHWhKyoiIpKCUcCpwAJ8O96OsWvQGouIiDgaAnwXmIV/h9s5rg9YbxERERf9gM8Cr+Pf0fYUW4ZqABERkZhCJdEIFReGaQYREZE4qh3vM/h3qvXEMmBCgPYQEREJqtrxPoV/Z9po/CnzVhEREQlkMHAcYdNGxoqFwLhsm0dERCRbqwInAW/h33FmGT/PsI1EREQyszmWQCOldbxZxlxgdGatJSIi0oT+wIeBm/HvIGPE97NpNhERkcZsgGWtmop/pxgz3gaGZtB+IiIiNRuAzWa+Aduyz7sz9IovNtuQIiIitdgU+CX29Ofd+aUQL2NZvERERDI3DvgScCf+HV6K8YnGm1ZERGRFw4GjsM3ol+DfyaUcT2EJRkRERBoyEDgYuJjiLh8KFR9soL1FRKTEhgKHARcAc/DvyPIa99Tb8CIiUj4jseHlC7GEEt6dV1Fi+3pOgoiIlMN44HPYsiG90w0T/6j5bIgkqsW7ACIF0Ad4D3AAsD+2kby+W2EtBdYFXvEuiEij+noXQCSnxgMfAPYB9gRW8i1O6fQFjge+7V0QCaIVWAeYBGwCrAWMAVauxBh6zg8+C5gGTMfW0U8H3gReAJ7FZtNPC1T2mulXukhtVgZ2Bd4LvA9LkiG+ZmA/hOZ7F0SatgqwRyU2BzbGttUMaRbwDLZt58PY5L6HsddGUagDFunaqlhnuyuwG3ZD0PclPZ8DzvQuhNStFft+fQDYC3uFk8L3awFwP3B3h5ge6sNSqLCIt/7YUNdWwDbATsBGriWSWj2FDVG2exdEarI2cHQl1vIsSI3agAeBa4Grsc5Z15pIg/oBWwCfxp6c7gcW4T+rV9F4fABJWQuWdOZGYBn+10szMRn4GXYPEZEeDMWGkL8I/Bn7JavOtnhxLZKq/bDvnfc1EiIeAD6DtskUAWBN4KPA74CH0BrcskQbemWQmj2A/+B/bcSI6cAPgFGZtJxITowAPgT8AZvN6P1FVPjFGUgKhgPn4H89eMQc4LvAoKZbUSRRY7GZr9ej4WTF8piHnkC8fQBLjOJ9LXjHK9g7b5FCGAZ8EriV/E/iUISLbyIe+mGjUN7nP7W4AMsFL5JL2wHnY4kWvL9MivTjZZTdL7YRWM5z73OfaryIpaYVyYU+wBGUZwKHIts4HIllbeBx/M956jEP2LexJhaJoxU4Ekus4P2FUeQ3tFdwHJOAqfif77zEYuCQhlpaJLD3oV/SiuxiOySkiajzbSQWYuk3RZIwDvgn/l8MRbFCewWHswqWDcr7HOc1pgGr19voIln7CLabjfcXQlG8WAysgWRtAHAX/uc376HMbeJmCPB3/L8EimLHKUjWfo3/eS1K7Fdn24s0bU1sv03vi19R/Hib8PvJlsn+WMpP7/NalLgPbMmHSAybA7cD63sXREphMJaR6EHvghTAMGzYdJh3QQpkHHBVq3cppBS2AG7CNrkXieWLaM/zLPwY6zAkWwfq4pTQNsQmbihPr3j4AJY3XBozEXgMSzeZqoXAW9hrhzZgKfBO5d8NBQZiT+9DsFncqfR7t6RSECmmkcC9wAbeBZHSuhZlIWrGRcCHvQuBLd95EHgaeA54Fnip8s/n1nGcAcD4SqwPbA1sA2xK/B8Zr0X+PCmRFuzm5z3ZQVHuaMNGYaR+E/Db/GQq8CfgKOL8gB+M/dC4EEsdGaOO8yLUS0rqOPxvvgpFO7ZTj9TvDOKepwXAWcBu+E4QHgGchA1th6yvOmAJYk3sHYz3jVehaMeGKLUtXH2GYBvMxzpHU4D1otSsdgcTts4vaRa0hPAjbPKDSAqGAJ/xLkTOHAqsFPHzZmOZ8VLRig3Bh/SsJmFJ1iYBj2AXsEgqXsaesJZ6FyQnrib+5LVZ2LyR67BdrSYDSyJ+/khsyeQuwCeAdQJ/3vfUAUvW/opdvCKpORybZCM9G4ot6xnoXI4l2Ezn57AlRm8D07GZz3OARcD8yn/X20zoYdhEq8HYO97BWL7w1bFXZuOx/Y1jmqQOWLI0GngV/y+uSFfuBnbyLkQO7Adc5V2IgnsA2EbDhJKlI1HnK+nasRLSs128C1ACp4De00m2DvAugEgvvuVdgBzQj5Sw7gcuhXRSckn+rYS9o+nvXRCRHrRjG4M85l2QhM3E3pNK9pYC22K7wukJWDKzJ+p8JX0twInehUjYONT5hvR9Kp0vqAOW7OzjXQCRGh1B+CUmebWxdwEK7Ergpx3/QV+ngoilWhuHTYMfDazMihOYZmD5UN/AZhYvil3AOn3AuwAiNeoLfB34vHdBErSJdwEK6l7gI1hu8v+jDjiOYcB2wA7AZtgWXxtgO3PUYinwFDZ0cR+2vdrz2RezYZti6+hE8uKT2EzUV70Lkhh1wNl7CFvapdzPkQwE9gZ+CTxKmB1Fngd+hWVu8fYN/PP9KhT1xhlIZ4/gf16KFHeid+pRjAI+hS1gj7WdVTUeBb6IX/7lW3spn0KRYiwifvajlI3Ab/vBIsb5KC9CUMOBo4FrgMX4n/CZ2LDa6gHr3Nl49KVV5DfOQar2w/98FCEWAV+rs+2lRq3AHsB5WB5S75PdVcwHfoY9lYf2HYf6KRRZxRLibPieB7H3/y1iPANsVW/DS+/WAH6I7dDhfZJrjVnA9wg3NN2XfLWHQtFVaIMGe7B4A/9zkddYApwKDKq34aV7LdjT7iVYA3uf5EbjTewdca2zrmv10QTqplA0G23AzpTbHvifh7zGLVh2NcnIEOAL2NIf75ObZUzG3ln3yaCNBmEzsb3rpFBkEfdT7sREl+B/DvIWTwEHNdLY0rVVgR9je056n9yQ8QRwCM3dcE5JoB4KRZZxFOW0Jvke4YsdT2Gjf1k8yAiWGOOPwAL8T27MeAY4lvqnyh+GDdt5l1+hyDJexZLmlM3Z+Ld96rEMW+1yAOUeKcnUTsBlaBnNDOB0ek/q0YpNr9evZUVR4w+Uy8ZYpj3vdk813sLyN6/baAP3pIzbEbZi4/bfwFJDyopeBq7D0qc9hSUVGQlsg70/nuBWMpHw2oHdgdu8CxJBK1bPsk9A62wxNrHqfOAiAubhL1MH3B/rQL6O1v2JSPeew2a1LvAuSGBfA37uXYhEzMMePC4FrsaWcEoGBmEzml/BfzhDoVDkI35Lse2GPdl5t7NnTAP+io2IuqzfLfIT8BDgOOyJdzXnsohI/nwEuMC7EAFsCNxFnEx5KWnHNpu4uhL30Wl7wNiK2AEPxTZF+BbqeEWkcfOwbUSf8C5IhjYCbgTGehckkvnA3dgmOf/CRkKTUaQOeCTwJSzj00jnsohIMTyNTVKa7l2QDFRXfazsXZDAXscSi1yFTTILNolK7GI6CdsJyPudgkKhKF48TL5/1LdgDydFfuc7EzgXW6fbN5tmk56shs3gm4v/yVcoFMWOO7B5JXkzEbgZ//YLFXcDR5J9nnvpxgjgJ8Tf9F6hUJQ7/kN+3p2OAU4DFuLfblnHUuxpd8vMWkt6NRj4Jpa1yfsCUCgU5YzXgO1J17oUd2SwDUuMsVFmrSW96oPlK34N/wtAoVAoFgI/wh4KUrAScDiWSKKoaXWfQZkLo9sJS4noffIVCoWic0wBjsBn0s/GwPHYTN8iDjNXow34Hen82MlUqsuQVsMSYH+cdMsoIgI2OncOllXppQDHH4+lxtyiEjtiW6cW3TIsmdLZ3gUJJbXOrQX4LNb5lnFbMBHJt5eA27FMUy9iWxy+TNd5pQdjw8cjsA51jQ5/XQtYH8tbX8inv14sxvbcvdi7ICGl1AGvhv2K3Ne7ICIiASzAhovBHjC0oXv3vgz8xrsQoaXSAX8IOIviZ2gREZGeXQEcjL0DLjTvDrgFW9P7LedyiIiIvznYUqoipP7slWfKrgHAn7EsJiIiIr+kJJ0v+D0Bj8Cmz+/k9PkiIpKW2cCa2FNwKbQ6fGZ/bGabOl8REam6ghJ1vhC/A27BZjrvEflzRUQkbZd4FyC22EPQp2L5nEVERKoWYVs+drVeurBiPgHvAZwY8fNERCQfHqdknS/E64AHYenEvJc9iYhIeh7xLoCHWB3wV4G1I32WiIjky3+9C+AhRgc8CPhKhM8REZF8muJdAA8xOuCPAaMjfI6IiOTTm94F8BCjAz4hwmeIiEh+TfMugIfQHfAOwGaBP0NERPLtbe8CeAjdAb8/8PFFRCT/Fvb+nxRP6A5478DHFxGR/FvqXQAPIdfljgDewnfHJRERSdtSoJ93ITyEfALeCXW+IiLSsyXeBfASsgPeOOCxRUSkGPp4F8BLyA54YsBji4hIMfTHZ2tcdyErvWHAY4uISHEM8C6Ah5DvaCcEPHZ3rgF+5fC5Ih6Gks7klYFY2tmu9FTOkd38877ASg181kp0fV8bVPn/AIZgT12d//vhlPRJLAEDKeFuSKE64AHAmEDH7sk1wI0OnysixTICWyXSUvkzWGfdr/L3/bGOfDB2vxte+XfDKn8/GPvhMbjy74ZX/r+RqKPvysDe/5PiCdUBjwp03N7c7/S5IlIsszr8eUaA4w9jxY65+udVgNWB1YBVgbGVf7YKxd7OdQTwhnchYitSB7yIkm5pJSK5M6cSr9T43/dleec8Flgf2KAS6wNrku+naq+HNlehOmCP3Y8exTphEZGiWQq8XokHu/j3A1jeKW8MbF8Jj1eBjVAHnCGPxrzP4TNFRFKwCHiiEpd1+OcbYB3xDsDOwKT4RauJOuAMDQt03J7o/a+IyIqeq8R5lb9fCzgQOAzLVpjKe+VSdsCh3hl4pKDUE7CISM+mAL8FdsGSJZ0GvONaIqMOOEOxO+A5wDORP1NEJM+eA07Enop/jO+WgOqAMxQ7OcADQFvkzxQRKYKZwP8DNgFudiqDOuAMxX4C1vtfEZHmvIjt4f4jh89WB5yh2B2w3v+KiDRvGfB94PNAe8TPVQecg+N2R0/AIiLZ+QPww4ifpw44QzE3WH6D2rPJiIhIbU4Gro/0WeqAMxSzA9bws4hI9tqBTxNnl6Jh5DuVZkPUAYuISHdeBf4Y4XNa8Ung5KoIHbDe/4qIhHMqcZ6CR/T+nxRLqA54caDjdtaOrQEWEZEwpgLnRvic4RE+Iyl5fwJ+FltELiIi4Zwf4TNGRviMpITqgGOlNNPTr4hIeHcBLwf+DD0BZ2ReoON2pglYIiLhtQP/DPwZAwIfPznqgEVEpBZXBz6+xy56rkJ1wHMDHbejJcB/I3yOiIjAPYS9t8fexMddnjvgx4gzNV5ERGx1y50Bj68OOCMxhqDvjfAZIiKyXMj7roagMxLjCVgzoEVE4now4LH7Bzx2kkIuQ1oW6NhVmoAlIhLXwwGP3Rbw2EkK1QG3A/MDHRvsCfupgMcXEZF3e41wrxhj5Y9IRsjdJ0K+B36A8E/YIiKyonbgxUDHXhTouMkK2QGHfA+sDRhERHy8FOi46oAzFPIJWO9/RUR8TAt0XHXAGQr5BKwOWETEhzrgjOSxA55G+KTgIiLStdmBjhsrhXEy8jgEHXIavIiI9CzUk+pbgY6brDw+AT8W6LgiItK7UMuFSre3ex6fgB8PdFwREeldS4BjtgPTAxw3aSE74FDvCbQDkoiInxApI2cDSwMcN2khO+AQwwlLgacDHFdERGoTYtei0j39QtgOeEaAYz5HCdOViYgkZOUAx3wzwDGTl7cn4EcDHFNERGq3eoBjTg5wzOTlrQN+PsAxRUSkdiE64FDpLZOWtyHoNwIcU0REaqcn4Izk7QlYHbCIiC91wBnJWwc8NcAxRUSkNoOBUQGOOznAMZMXsgN+h+zXdb2e8fFERKR2m5F9v7GEkub3D9kBtwOzMj6enoBFRPxsFeCYTwOLAxw3eSE7YMh2ItZMtAZYRMTTFgGOWdr0wqE74CzfA8/J8FgiIlK/EE/Apc3vkKcOWE+/IiJ+BgAbBziunoADybIDnp/hsUREpD47EWYjhtJusBO6A347w2O1ZXgsERGpzz4BjjkdeDXAcXMhdAecZeKMPhkeS0RE6nNAgGPeha1wKaXQHfBrGR6rb4bHEhGR2q0LTAxw3LsCHDM38tQBD8rwWCIiUrv9Ah337kDHFWAjbHghi3grctlFRMTcTHb38mosxGZWSyDDyO5kLQFa4hZfRKT01sUmwWbdAd8RsxIpCj0EPQeYm9Gx+gIjMzqWiIjU5ljCPPzcHuCY0smjZPeLafPIZRcRKbO+2CY4WT/9tgM7R6xHkkI/AQO8kOGx1srwWCIi0rODCLP/70zgPwGOmyt564AnZHgsERHp2fGBjnsj2W9Xmzt564A3zfBYIiLSvZ2A9wU69jWBjiud7E127wwejFx2EZGyCrH0qB2bUR1iWFu6sA7ZnbjFwJC4xRcRKZ3dCNP5tgP3xquGtACzye7k7RG3+CIipXMr4TrgL8erhgDcQ3Yn7+TIZRcRKZODCNf5LgPGxauKAJxFdifwochlFxEpi2HAK4TrgG+JV5X0xZgFDfBYhsfaAlg7w+OJiIj5KbBGwONfEPDY0o1dyfZX1FfiFl9EpPB2xoaIQz39LgZWjlYb+T9Dsc0UsjqRj8YtvohIoQ0BniJc59sOXBatNvIuD5DtydwmbvFFRAqpBfgnYTvfdmCfWBWSd/sN2Z7M8+MWX0SkkL5F+M53CtAnVoXk3Q4j2xO6BG3OICLSjL2wnMyhO+DvxqqQdG0c2Z/U30etgYhIcWwCzCB857sEpZ5MQpZ7A7djs+q0Q5KISH02INw+v53jkkh1kl6cgk6uiIinjQmbbKNz7BKnWtKbnQlzgveLWQkRkZzaAXibeJ3v3XGqJbXoQ5iTPwVYKWI9RETy5mPAfOJ1vu3AwVFqJjX7C2FO9DkxKyEikhPDgb8St+NtB54mXrpjqdH7CHfCPxKxHiIiqTsYmEz8zrcd+HT46km9WrEh4xAnfA42tV5EpMx2BW7Gp+NtB14DBgSvZc71dfjMNiyL1XcCHHsl4EpgO+CtAMcXEeloMLbBwCrAiEr0x/LfD8E6oRGVvw7GtvtrBWZ1OMY8bEkl2EPEa8BUbAh3Sh1lGQUcAnwKuwd6+gmwyLkMyWtx+twNCPt+4G5gb+zCFhGpx2hgLLAmsBqwKtbJVmMM1uGujHWqIb2N5dG/D3gc65jnV/7dUGAdYCNsqc/WQL/A5anFZGAiy39USDe8OmCASwk7Q+4mYH9gYcDPEJF8GYl1rqsD63bx5zWwp1Rp3DHYpC/phWcHvBNwZ+DPuAo4FHXCImUxCFgP61A7xzrAQL+ilcIzwKZYfmnphWcHDHAXsGPgz7gFOAh4J/DniEgco7EhzvV5dyernMO+jsC2NpQaeHfA+wJXR/icB4EDgDcifJaINK8PsDawIfaOc2Llzxti714lPQ9h+7S3eRckL7w7YIAbgT0ifM5r2JPwgxE+S0RqM5TlnWu1o52IbbKiZSz50Y4tfQr9WrFQUuiA34N1ijEypswHjgf+FuGzRGS5Vuzd7ObApEpsjr2XTeE+JM35B3CkdyHyJpUL/8/YzLlYzgU+D8yN+JkiZTGS5R3tZpXYBFsXK8UzDxvBeNW7INKYMcCbxM3U8iw2E1tEGtMHu/EeAZyKzeeIuc2dIo34LpJ7Hyb+hbMM+AW2dEFEujcYy670WeBM4B5sBMn75q/wjRfR0q7C+Cc+F9Fk4HDSGZIX8bQq8H7gm9i7vaewdZ3eN3tFerE/0rDUOpyVgYexbDQe7gK+Atzv9PkiMbViaWHf0ylW8yyU5MYFaAe6pqTWAQNsC9yO3xKEduBi4BvUlwhdJGX9sKU9W3WIzbFlQCL1mo5NrHvTuyCSvePwH1qZi00s0dOA5M0q2GYkJwJ/B55EQ8iKbOMopGkpPgFXnQN80rsQ2JZafwNOA553LotIR61YOsbOQ8hKxygh/RubIyBNSrkD7gdcDuzjXZCKZcC/sKfih5zLIuUzGBvy2wLrZDfH1tdqCFlimodttjDZuRyFkHIHDLZw/yb8N5fu7Cbgj9gPBG06LVlqxTYV2By70VWTWayLrbsV8XQccJZ3IYoi9Q4YbGb0HdiC/9RMB84HzsY2yxapxxisc52EdbbVjFGhN3kXacQVWD59yUgeOmCwdYk3YjepVD0InFeJGc5lkbRUZyBvjHWwW1X+vK5noUTqMA37gahZzxnKSwcMNrPzRuxpIWXzsZR8/wKuAeb4Fkciqg4fb8aKw8froeFjya92LOHGNd4FKZo8dcBgSd6vw9YK58EibPj8KmzRun49FscIrJPt+FSrdbVSRL8DvuBdiCLKWwcMMBx7unyfd0HqtBS4DSv7tcBLvsWRGo3A9qnduPLX6jtbrQ+XMngS2BpY4F2QIspjBwzQF/gD8BnvgjThRWxIvRozfYtTeiOxJ9nqu9nqn7VfrZTVPGy08UnvghRVnm8sLcCPKMZWWMuw/NM3VOI/wBLXEhVTP2BtbELURtjM+o0rfx3pVyyRJH0Uy6QmgeS5A646GjiDYm2JNRe4F7gTuBvb+u0d1xLlRwu2mccEbKOBDYCJlb9fG+uERaRnZwDHexei6IrQAYMNk/wLGOddkECWAY9huzXdh2Xiehp7r1xG/YG1sOHhtSt/XR/rbCeg/Z1FmnE/sAtKMhRcUTpgsEkxlwA7ehckkgXAo1hn/BDwX+BZYLZnoTIyABgLjMc6146xNvZDq9WrcCIFNgOb0T/ZuRylUKQOGOzJ6JfA570L4mgq8AzWGVfjNeB1bBlUm1/RGASMxrKbjcM62XGVWB3rcFfHMkSJSFzLgAPRet9oitYBVx2M7aY0yrsgiVmKdcKvVP76Jva+uRqzKzGX3oefhmA/eIZjs9KHV/5+SOXPK2Od7WjsPIxGQ8MiKfs68AvvQpRJUTtgsIk4fwH29C6IiEji/kIa27+WSpE74KpDsTXDK3sXREQkQXdjiY006SqyMuSnfRI4F3u3OIly/OgQEanFZGyUUDnrHZStM9oa+BWws3dBRESczQV2wlZTiIMyPAF39DrwV2yW8CRsYpCISNksBT6MJfsRJ2VcS9kO/ANLRXgYtkxHRKQs2oHjsG1TxVHZnoA7asfeD58FPI/t2bqqa4lERML7IfYqTpyV7R1wb/YCvgbsjdpGRJZbhv1QfwLbSnRW5Z+PBfbFUqPmwZ+AY70LIUadTNcmYBfpJ9DyJZGymozlmL8FuIPu07z2wTq2Y+IUq2FXAR+kvDnkk6MOuGcDgEOwL9bulHvIXqQMXgYuAi7ENiVor/H/2wR4PFShMnAvttZ3vndBZDl1wLUbCxyB7ZG5pXNZRDqbhw2NvgZMw9KMvg68Vfn7+dgGHktZvrXlUGBYJVYF3oMl4t8CGByx7N5mAX8DLsA6qlo73Y4mke5ynsewB4jp3gWRFakDbswEbCjnQ8A2qB0ljrnYxMHngRcqUf3z1Aw/ZwhwJHAS9sOzqJ4Afgech/2AacYJwG+bLlH2ngXeS7bXh2REHUfz1gAOwiZu7YY9TYg0Ywm2Vv0J7KnqCewp5iUaezpr1GrYu8/1I35maMuAK7HO8hayac9W7IfRxAyOlaUp2L6+r3gXRLqmDjhbfbEn4j2w9G47YDsEiXSlDetUH8Nu4I9hne3TWCecgsOxodm8m48tOTyd7Pe6PQb4c8bHbNYbwK7YCIkkSh1wWEOwX6DVDnkzypn8ROwppGMn+3jl71OfFLMF8JB3IZowFzgD+Dn2LjxrY4CnSCur3tvYaNwTzuWQXvT1LkDBzQOuqwTAStgErq07RJGG98puCTbs9zzwHMs72idYvm40byZ4F6BB7wC/x/a3fTvQZ7QAfyStzncW8H7U+eaCnoD9jWTFDnlrYE3XEklPFgEvYp1sdQJU9c9TKN4ay6uxRBN5MQd7v/srws/6/TpwWuDPqMdMbC7KA94FkdqoA07TCOzJY2IlJnSIQY7lKoPF2PKdV7Fh41dZsbN9BXt3WwYHApd7F6JGi7EZzf8DzIjweXsC15LOKOIMLJNfnl8XlI464HxpwZ6OO3bKa2FLRcZhazn1jrl7C7AO9TWsI32tEi93+PObxJ1pnKoR2PD5OO+C9KIduBj4NvYDKYZNsV2Ehkf6vN5Mx34QPOJdEKmPOuBi6YstHRkPrI4tkRqHddBrYBNGRlRiiFMZszQde7/X8a/Tsck2nf/5NGyITno3AHu62927IL24B8vdfk/EzxwH3E06r4nexjrf/3oXROqnDri8+rG8M+4YIzv8uT82cQxs6Htg5c/DsLScrSx/ChhY+W/mY+9JO1sALOzin8+q/LsFnf48s/LfV//c8b+Zi3Wqy+qttPSqFduu8zDvgvTgReyJ9yLijlaMBW4FNoj4mT2ZhnW+j3kXREREmlPdVKA90ZiDTXwaEKoBejAWyyrl3QbVeB3LPy0iIjk3ANuAwLtj6S6uxG/YdzVszbZ3G1TjJdJ5ChcRkSaMAG7Hv2PpKl7AdxlUap3vk9h8DhERybmJWNIG746lcywGfoPt2OQltc73frQ/uYhIIRyETWrz7lg6x234v99cj7Te+d6CnDgsIQAAIABJREFUNnoREcm9vlgGpzb8O5aOMQM4Cv/VGTtiy3u826Mal7J8BYKIiOTUOsBd+HcqneNq0th7+EPYUjrv9qjGOaSTbUtERBp0KPaU6d2pdIzZwLH4P/UCfBFbW+7dJtU4lTTaRUREGjQcOB//DqVz3IG9a/XWApyEf3tUYylwXMgKi4hIePtiea+9O5WOMQ84gTSe7gYAF+DfJtWYC+wXtMYiIhLUKOBc/DuUznEn6eyBPRbL6+zdJtV4E9gmaI1FRCSoA7Bdn7w7lI6xGBvm7ROu2nXZEUvn6N0u1XgB291MRERyaCy2NZ93Z9I5HgU2D1jveh2HbRji3S7VuAMl2BARyaVWbCbxbPw7k47RhmWz8tg8oSsDSG+ziQuwXcRERCRntgLuw78j6RyTgd2C1bp+Y7F9g73bpeOPk5NIYyKaiIjUYST2dJnSutVqXFgpXyp2Iq33vQuAI4PWWEREMtcX+BxppUqsxptYfumUfAGbAObdNtV4Ddg6aI1FRCRzuwP/xb8T6SouBMaEq3rdhpPW+t527Nx57WksIiINWA9LyO/dgXQVU7H8ySnZCZiCf9t0/oEyJGSlRUQkO0OwiToL8O9AuutUUlo+0wJ8ibSGnNtQTmcRkdzoiy0regP/DqSrmAocEqz2jVkFuBb/tukYc0jvnbiIiHRjT+Ax/DuP7iK1p16APUhrlnM78AywUchKi4hINrbH8iR7dxzdxRvAwcFq35h+wE+xYV7v9ukYlwPDAtZbREQysAFwEel1ItVowzaFT2ldL9iGDv/Bv306t9UP0fteEZGkjQPOIK0JQ53jeeB9oRqgQS3YOui5+LdPx5gJHBiw3iIi0qRR2KzY+fh3Gt3FEizL1tBAbdCo1YAr8G+fzvEwtlRMREQSNAT4Jvak5N1h9BT/Jc09aQ8lzexf5wKDA9ZbREQa1J+0lxRVYwG25rh/kFZo3Aisk/Nun67a6zMB6y0iIg0aCJwAvIJ/Z9Fb3IJNBkvNPqS3vKgdeA54T8B6i4hIA6pPvK/i31H0FjOwzFGtQVqicYOwd9Apzgy/gvRmhIuIlNpg4Cuk+cTWOdqAv5JeQg2AnbHZ195t1DkWA19DS4xERJIxBHuKfA3/TqKWeA7LtpWaQdjs8KX4t1HnmALsGK7qIiJSj2rHm4cn3uoT3KnAgBCN0aRdgGfxb6Ou4lI05CwikoShWMeb+qzmjnEraeYlHoa9612Gfxt1joXYeRYREWdDsXW80/HvHGqN6diEsBTfW+4DvIx/G3UVz6BZziIi7lbCOt4Z+HcMtcYybO1sipOsRgBn4d9G3cVFwPBgtRcRkV6NBk4GZuHfKdQT9wBbBmiPLByC7SXs3UZdxTvA0cFqLiIivVobey+ZWrL/3mIa8CnSW9MLlsP5IvzbqLu4F9tdSUREHGyGDdumvDtRV5HycHMLcBRp5nBux9ZD/4b00m+KiJTCzsCVpJl1qbd4ENg++ybJxCTgLvzbqLt4GXhvsNqLiEiX+mC769yPf0fQSLwFfJo0h5sHA6eQ9kjCP9HaXhGRqAZgQ6JP498JNBJLsBnEKQ43A+yOLeHxbqfuYh5a2ysiEtUo4HvAm/h3Ao3G9aSZTANsktUF+LdRT3EPmmglIhLNatget3lbStQxnsOGy1OU+iSrdmzU4FSgX6A2EBGRDiaRzxnNHWMOlgAkxdzNAFsAd+PfTj3F46S7JlpEpFB2A64hnzOaq7EM+AuwerZNk5mRwO9Ic9eijm34C2BgoDYQERHsJnsM8DD+N/5m41Zg60xbJzutWKKPafi3U08xGfshJiIigayKDdHmZR/enuIZ0n3PCzbcnPKa3mpciJYXiYgEsy3wv8Ai/G/4zcabwPFA30xbKDujsWVPKW4X2LkdPxioDURESq0PcABwA/43+yxiEZYCMdVdd1qx2c2pDze3Y0+9Y8I0g4hIea0MfBt4Ff8bfRaxDPgbMD7LRsrY9sAD+LdVbzGNtIftRURyaSL2hDgP/xt9VnEDaW/yPo58DDe3o6deEZFMtQJ7kt+NEXrqeFOd2QyWu/mb2H643m3VW8wAjg3TDCIi5bMSdlN9Cv8bfJZxN5YbOVUt2BDuZPzbqpa4EhgboiFERMpmA+B0LOOT9809y3gAeH+G7RTCLuTjPW87tvPT4WGaQUSkPKqzma8hH+8a64kngUOwJ8tUrQNchH9b1Rr/AFYJ0hIiIiWxOrYb0RT8b+pZx0vA0diPi1QNB34KLMS/vWqJV4EDg7SEiEhJbEX+N0XoLt7CJi+lnG+4H/Z+fSr+7VVLtGHXy6gQjSEiUnTDsZv+Y/jf0EPEYmyJ1LCsGiyA6gSr5/Fvr1rjRWwWvIiI1GkrbB3pXPxv5qHiBmDjrBoskD2Bh/Bvq1pjGXbdDA3RGCIiRTUQS1n4IP438pDxHLB/Rm0WytbATfi3VT3xOLBdiMYQESmqTYDfArPwv4mHjPnAt4D+2TRbEOsDF5Cv5CULge+TdruKiCRjAPAR4Hb8b+Ax4jasc0vVGsAfyN8Et5uACQHaQ0SkcMYBJ2FbvnnfvGPEPGx2c2sGbRfCGOBU7Oncu63qienY5LyU10mLiLjri63DLGLCjJ7iWmDNDNovhDHAaeRvg4o24Bxsb2EREenGBsApwOv437hjxjzgMxm0XwijgJ+Qj80SOscTwK7ZN4mISDEMxNaM3kC+JvJkFU8CmzXditkbig2Fz8S/jeqNBdhriwFZN4qISBFsh62/nI3/DdsrzgIGNduQGRsF/ADbes+7fRqJf5P25DURERdjgK9g6y+9b9SeMRs4rMm2zNpqwM/I7+5QU4EjM28VEZEcq250fy75mzkbIl4BtmiqRbO1JpbaMm+Tq6pRzd+8ctYNIyKSV+Oxd4gv4X+TTiXuAVZtplEztC7W8eZlh6Ku4hlg96wbRkQkjwYBHwNuppwTqnqK80lj56ItsMxVS/Fvk0ZjHpYhrF/GbSMikjtbY1mR8jhjNkb8Gt8EEK3Yuupb8G+LZuNa7OldRKS0RmCZhYq+EUKzcTZ+ne9Q7Bw92UsZ8xBvYBtviIiUUl9gX2wIM8/vDove+a4B/JT8LiXqGMuA32M/+ERESmcrbBh1Kv435LzEZcTP57wr8A/yt0FCd/EQ2i5QREpoPDbR5Qn8b8R5i+eAYfU3eUNGYWurizDMXI05wJexERcRkVIYBhyDzWIu0yYIWcce9TZ8A3YBzsPSLnrXN8u4BBtCFxEpvL7AftjQpRJlNB+31Nf8dRlL8Z52q/Eidh2KSCQaYvKzFfBx4AjSSQ5RBP/K+HijgUOAj2DveFPdJ7hRS4BfAD/CfgDKu7UAq1RiVWx2ez9sYlpfbORqADC48s+XdPh/Z3b48zxsfsBMYBq2R/LblVgatAaSJHXAca0JfBRLlrGxc1mK6p0MjrEScBDW6e5FcRNO3AF8DptnUGaDgQ2BicAELC/32Mpfx2Edb+hroNoZvwU8j81jqP71OWBu4M8XB57JCcpiGPYEdRTFfIJKzd+xHzn1aMUyVO1diR2B/hmXKyXTgROBv2DDz2UxGDvPG2MdbvWva5H+vfANrCN+Cri3Ek9jGe9EpAO91/WLNmwv2p62GewPbAl8GuuwpyVQ7lht82fKs3HCOGyv619jHVZRlodVYxa2/ePJ2P2mLOe1MFL/1Zc3W2PDyx/Bhq3Ez3xs84VXgUVYHuhVgXUqUdRh5e48h/3guN27IAGNA/bHRpp2wp5sy6QdeBTrlK8H7sSufZHCWgf4LsWcGavIfywFTqPnEYE82wL4PnA/2oCkc8zBsuYdhk0cEymE0djklTvRl16RbjwGbEux9MEmxv0OmIJ/G+clFmCd8b6VNhTJlUHA4cAV2LCO9xdKoeguFgM/pFgTySYBPwdex7998x6vAz/Bsu2JJKsPsCfwV2A2/l8chaK3eBDYnGIYiK0euBf/di1iLAEuBnau9YSIxLAl8Ev0a1uRn1gAfJtirO1fFXtCewv/di1L3Io9bIi40GQqRV7jLmw9a96tA/yB4uXXzlPcTvHmDUiiNJlKkedYCHyd/Cd3WR04g+Kt081rtGHr4/WOWDLXcTKVvvCKvMbj5P9d71Dgx1iaRe/2VLw75gAnkP8feOKsunThr2gylSLf0QacTv7X9X4YeAX/9lT0HncD63Z9GkW6Nwnb6UWTqRRFiOnkf8vANYHr8G9LRX0xGxs5FOnRGOCL2HIM74tWocgq7gfWJt8+juUv9m5LRePxJ2xTC8lAUXJB98cyvBxd+WvZ8vz2ZCnwJjC1wz9bwvLtzfoBwysxBqWsS9EfsR+Vec3ruzJwJrYrmOTfU1i++/96FyTv8t4Bbwl8AjiScu8E0oZtTXY/8DCWou91bCOCqdS3ZdkwbPbj2tgQ/maVmEgx1pjmSRs2y/lX3gVpwgHYD4jVvAuSkcXY7lmvYT9sX8fWK8/Dztfsyn83DxhSiQHAiMpfxwNrYEPxq5Hfe/AibEvL32JPxtKAPJ780diOQ5/COogymg/ciK3ZewB4iGw2ou/JAGAT4D3YbjO7YzcRCWMBNmR7iXdBGjQWS2aT1/eGS7Fc2k9U4snKX18iuz14+2Od8SRsU4lq5Gn5z7XA8cBk53JIQC3AHtj+ugvxfw/iEa9jTxL7k84M2PWBLwE3YcPa3m1UlFhIfrMSDQS+Sv5WG7wD3AD8ALvXDMm6YeowBvvhcjb52HBiHvY0rFd/BTMW+A7wPP4XmUfMxTrd7Ul/tGIk8EmsM16Gf9vlNZYAB9fZ9inoi+03/DL+bVhrvAj8Gngfab9e2RD4MunnxH4U2DFQG0gkfbD3RpdT3qeqx7EF8MObbEsv47C8xC/h35Z5i+800N6eWrEJOc/i33a1xLPY/sGbhWiMCCYCJ2M/HrzbsqtYhuVb0OupnBmD3bTzMOQSKq7D3q8WRSs2K/0alOqzlniAtJ/EOhqAzcX4L/7t1lvMxoZzdyb9kaRatWBP7ql+txZicwDKPDk2F7YF/kZ53+22A7dR/C3BJgHnovSfPcWxDbduPGtg6SPfxL+9eovHgGMo/rrVTbGnzhT3KZ8NfA8tb0zKALTPZ3ul/ns12ZZ5sxa2mL+srxd6iq2aaNeQWoDdgIvIx3m7CdiH4jzt1mocNmdkKf7noHNMx364rRqs9tKr0cBJ2Do67wvC+2I8hvLdIDpaHzgPTdjqGF9vqkWz1YJN/vsl+ZlYdTnp/oiJaTNsRrf3+egqFgBnAROC1V7eZTw221C7nthSKv0KXG5b4D/4n5cUYj42oclLK7Ad8HPyNRfjTmCnAO2Rd/sDz+B/frqKZcCV2Ix/LV8KZGPs3YTe+9lC9X2bacwCa8HSiL6B/3lKIW7Gbkz9m2jTWrRiWxp+CbgUG5nxrns98QRwYOatUiyDsExqKY80TQVOAzYK1Aalsyn2hU75pMeMi7EUj9KzYcDvSXNWp0dMx967fgFLu9pMh9wPu8EdAnyXfHa41ZiPrZjQk1PtdicfywLvxyZt5XWZWF2yfge5FvBDLIWeNnG2J/8Tsf1b253Lkid7AeeQr5R8MSwFnsPWib+M5fp+G5v9ugib3NiC5R0eU4k1sJGo9SlGh3UjcBzwgndBcmgY8BtstCkPXgKuwM75vVjObenCaGzf3TIvJeocU7BJLNKY4djrC+/zqEgjZmI/7KV5nyOfrwVfAP6OpTo9DFu6uQHFX2bWrb7A19Aen53jVuxHiTTvcCxPr/c5VfjFXdjommRnd2z0xPvcZhVzsZGhs4Ej8M3lHcXm2Hi9d8OnFv/CEtJLdjYh3dmcinCxDFs7mpfsYHmzHtZpeZ/nEPEOttxpvcxaKxEDgf8hn0MYoeNMLJe1ZG84cBn+51gRJ97EntIkrOHA3fif71CxFEv8MyarBvM0CXgK/0ZNMX7YRLtKbVqAn+J/rhVh43FgbSSWlbC11N7nPWTMwHZry60Po3dx3cWJTbSr1O8raKlSUeNatGTPw1DgdvzPf+i4BNs6NTdasSFn3fC6jv9pvGmlCR9Fr0GKFr9D73s9DQFuwf86CB3PYUvzkjcAvXfrKX7feNNKBvZFS9+KEj9GUjAMeBT/6yF0zAb2zKjNghgAXI1/Q6Ua56FkIyk4CD0J5z2+/66zKp7WohxpYRdimeGS0wL8L/4NlGrcgIbKUnI4aW7Bpug9vtXF+RR/22EpP72vj9CxFEvqkZTv4d8wqcZLKMlGio5G8xTyFt/t6kRKMg6jHN+pxcABGbVZ03ZFTxPdxXxgi8abVgI7Cf9rRFFbnNn1KZTE/AT/ayVGzCeB1MEDUMahnuKYxptWImjBcsV6XyeKnuNq9AonL/piqUC9r5kY8RbOmbM09Nx9/LaJdpV4BgH34X+9KLqOByhBnt6CWRvbDMP72okRj2D3kOhGUJ5GrjeewumkSEPGAtPwv24UK8bUyrmR/DkM/+snVpydUZvV5ZsNFrbosRSbESj5sh/lmECSl1iG7fMs+fVH/K+jWHFkRm1WkxYsO4h3pVOMU5poV/H1K/yvH4XFj3o5V5K+wcAT+F9LMWIGMC6bZuvd5hEqlMd4DJuYJvk0AHgI/+uo7HEr2iWsKLYAluB/TcWIazJqs16dGKlCeYo2YNtmGlWSMAllyvKM2cAavZ4lyZOf4X9dxYooSTpucqpcynFuUy0qKTkF/+uprHFCDedH8mUw8Dz+11aMeJ3Au3MNRAntO8d8YHwzjSpJGUR5bhgpxb0oX3pR7YX/9RUrgu54NymBCqYW2pmleMp0w0ghlmBzS6S4zsX/OosRc4HVM2qzFbQAH8I2KRYzFZgAvONdEMncFSSU87UXk4H/YIkB3sJmZc4FhgOjsPW0W2JL5Fb1KWKPfgV81bsQEtTKwJPAGO+CRHAGcHyIA2v974rx+eaaUxK2KWnnOX8W26BgzTrrNQn4Bfbj0bsO7cAc7OYsxfdZ/K+3GLGQQE/BZydQuVRiGsp4VXR/wf866xxTsC0VW5qsW3/sqdM7o93JTdZD8qMv8DT+36EYcWpGbbaCyxOoWCqhjcGLb03SmnT4O7L/0TcGW8PoUZ8ZWFpbKY8P4/89ihGzgKEZtdn/uS2BiqUQ89CwWVn8Cf/rbSnwuYB17AOc7lCv7wSsk6SpBZvx7v2dihGfzqjN/s9jCVQqhTi92YaU3JiI5Sb2vN5ODF5L87eIdZoHjIxTLUnMrvjfw2PEvVk1WNXLCVTKO9qAdZttSMkVz1cvV9H8+95aDSHeO7o/RqqTpOla/O/lMWJSVg0G9s7Gu0LecWuzjSi5szN+19sWEerX0ScyLHtK9ZK07IL/vTxGZDoZa04CFfKOzMf1JRc8Xr/cHqVmK+pP+P2R74lWG0nZg/jfz0PHy2SU4a0V7VKyELjIuxDi4i8On3mLw2cuBu4M/BlnBT6+5MNvvAsQwXjsnXfTWrF1XGV2BbZji5TP+VjKxJjeiPx5Va8HPPZi4NKAx5f8+CfwpnchIvhYFgdRB2w3YSmnaUTc87PCK9HL4IDHvhX9iBWzCDjTuxARHIJtZNSUVmxMu6zmAzd4F0JcXRD58zKdQVmHzQIe+7KAx5b8OZP4I0uxjQD2y+JA7+D/UtsrYj/9SHqGY7/aY11zsyufGdOm2FK7EPVpA9aIVxXJievxv7+Hjn8120it2OL5stLTr8wm7szkYcCnIn4ewNcJt+74AeDVQMeW/LrYuwAR7IftTNaUl/D/JeEVGzfbeFIIXyDudTcX2CRKzWz7xVBPv+3YLkwina2MDUN73+NDx2ebbagnEqiER7zSbMNJYaxH/OvvacLv47sZlkA+ZD0OD1wHya+b8L/Ph46mRs9asYlIZXSzdwEkGS8QdplOVyZieWVDTcraF1v7G/p9c+a5caUwyjAMvTOwdqP/cyv2C7mMHvIugCTlDofPXAu4G/gWGSxpqBgF/BZb375SRsfszlRgcuDPkPy60rsAEbQAhzb6P7dim4GX0SPeBZCkhM4U1Z2hwCnYq6DjaXw3ofHA/wOeA04gToa7+yJ8huTXq8Dz3oWI4JBm/ufv4z+OHjva0KbhsqIt8L8u24EFwIVYJ7oN0K+b8g7B0uGdCPwbn+0Vf1Zb00qJnYP/dypGfzK+kcbpSzmfgKdQ3qF36dqTwFL8M8MNxIa0Og5rzajEHGyIeRS2nMlbGe8dUp97gE96FyKwFuBDNJAHu6xD0A97F0CSs4h0h8tGAesDW2ITPlLofEHvf6V3ZXnV19AwdFk74Ge9CyBJety7ADlTxnuH1OdxbGSp6HYCVqv3f2rFfsWWbTj2Ne8CSJKe8C5AzqgDlt4spBzXSSvwwUb+p3bKtyTHa0s4SduL3gXIkXlYHnmR3pTle1X3MHRr5a/3Z1yQ1MVOuiD5oJGR2i30LoDkxkveBYjkvcDoev4HdcAiy+m6qN0C7wJIbkzzLkAkfYE96/kfqh1wmRbUt2MZfEQ60xNw7RZ5F0By423vAkT0vnr+42oH/AqWHL4MFqPhM+naHPRkVyt9h6RWZZrk21AHDBlsLpwTZZgSL40r8/7Y9dATsNRqsXcBIlofWL3W/7hjB3xp9mVJkjpg6UlZdwerV3/vAkhuLPEuQGSb1/ofduyAHwRezr4syVnmXQBJmp6AazPEuwAiidqs1v+wYwfcjiWBLzo9AUtP9A64NuqApVaDvQsQ2fq1/oetnf7+TGxnhyLTE7D0pMW7ADmhDlhqNci7AJHVnKu9cwf8AnB5tmVJTtkuBqmP3m3WZhD6sSK1qSs5RQHU/MTfuQMGOIliPwUPx3/LuaIbQH73W1YHXJtW8v9jthUYie4HodU8K7ggas4n0FUH/ChwdnZlSU4L9qWT7EwEvgvcgu1buxCYib1vfxo4F9vfdoBXAeugDrh2Y7wLUKeRwKexJZeTsddRM7BZuq8DVwMn0MCuNtKjsd4FiOzRZg8wApsR3V7QmNhsAwkA2wPXYyMmtbT7NODbpN0Rv4X/9ZmX2LHBNo5tLPB7bIZ7LfVaBPwNGOdR2AJ6DP9rNVZMB1bKotG2wdZEelcoROyQRQOV2CjgPBpv/2eA90cvde/6Yk9F3tdnXuKwxpo5mlbgK9Te8XaOd4CvA/1iF7xA+mArC7yv1RixANg3m2YzuwOzE6hY1rF/lo1UMpOw/T2zOA+/wr6gqVgd/2szT/GVxpo5ipWAa8imnvcAq8QtfmFMwP86jRHXAVtn1GYrWAv4BzYs413JrOILmbZQeeyF5XXN8lxcRjpLWjbH/9rMU/yisWYObhzwMNnW9UVgo5iVKIiP4X+dZhmzsWvhJuBP2JyCtRptnFpm/00BPgIMBNYBNsSGDw8nvzNd9UWq38FYopash+MOAm7AtvHyTgOZ8uSb6g+fwaTzDj3Fd6Tjgbsqf83SOpXj7kYGk2xKZFvvAnSyCNv97z7gWWwy3ixs+LirLHiLO/zz6ncwCUOAb2JbTXn/Kqk3bgnQHkW2NY2/R6s1LqbrWfkxfR7/a7Md+yFyIfAZLK1d5+U+o7DXQydjnYFXOR+qq3XDWwl4hLB1nkLaP9RSk/VIRCMxF/hfYD/yv3TuXYYDv8WWnHg3dK2h/YBrNx5bohHjvJwSqU7dOZ049ewuXsSWwdQ7i3IH4AqH8i4gnTW0fYCriFPv+yhfesVGrELtKyRCxKvAieR3pLYuWwOP43sDqydGhWmGQmkBbiXuedkrRsW6cX0P5QoZM4Ev0/wa5N2xbHYxy57K65xvELfev4lTrVw7Ep/v0yxsdHZg+CqmZRC23s7zV0+tsVOgNiiSo4l/Xp7D74szuYbyZR3XA2tkWIchwAURy5/CUqS1sGHGmOdtKYFmvRbIv4j/fboYWDVG5VJ2IOknNPhasNoXw2j8zuHJEerX2Sji/nBsw9K+hnjv3YK1YVHPVWdX4nOdPkBay+hSMhLLiBfrXMwBjohSs5wYC9yIzxejlrgqXNUL4ef4nZuFxJ/osk9GZa8lFmMrC0L7ToS6XBahHj3ZDd/7yMeD1zCfjiXeOXgSW50jnbQC3yPN7EKzSWcCSWqGYu8lPc/PSaEr2ckPMyp3b7GYuIlgfh2oHtWYhu+uSJd1U65Y8WD4KubSbcRp/5uxicDSg4OwIQLPL0pXsU3ISudYCstxphJ3vWuMCVht2Hv1mFoJX7dNotVmReuSxuqLXUJXNGfWIs7rnItJZ0188jYl/gzN3uLEoDXOr6fwPzftwEdDV7SiH3FSrn4vUn06W4WwS8mOj1eVFZxWRxlDxgWhK5ozJxG+zS9FObrrNhpLguH9hanGtWGrm0vr4n9eqvH3wHWtem+EuvwpUl26czDh6vbPiPXo6Ik6yhgyZqLXWVVDCD9583q0bWjD+gF/wP9L044lEijFIu06fAb/81KNN4nzfvGngevxBGmsSbyEMPWbSvz3wGMzKntWsX3Y6ubGlwn/XdI73wwcTxrvbz4ZuqI580/8z0nH2DxsdYGw+5UuBraKUIdarEe4TVU2i1gPsNnH3tdmx/B6vZCS/sArhGvj6VhObsnIwfjvOXxD8Frmy6v438w6xglhq8vagcv//cDlr9dvCFPPkyLWAeCsjMqdVVwXtrq58EnCtW8b1l9IxnYBZuD3xVmK7QMrMAz/G1nn+G3QGsO3A5b9AdJ7NziOME/BsXcIirXMpdZ4KWx1k9cHeIZw7fv7eFUpn00JO3TRW3w5fBVzYWv8b2SdI/REuZATeXYNXPZG/Zkw9d0gYh3eCFSHRmMZ5V4Scxzh2vYlLDeBBDQev1mN90aoXx7sh/+NrHOE3PJuy4DlTjnT2naEqfM3I5W/lTTmj3SOLHN658kowm5L+/54VSm3Udim1x5fHiXlSG9iSzu2/2oovwxU5mXEn5RUrxDDhQ9EKvvIAGXPIlI/56H8nnBtemnEegi2o5LH3qZaTA/H4H8T6xyvBqrrEGxWZYgy/y1QmbP0PcLUfcsIZR+KapH7AAANb0lEQVQTqOx5qHtqNifcaMRiYEK8qkhVP+Ivh1mCprgfhf9NrHNMDlTXUO+slmHLfVK3DmHSBZ4ZoeyjApQ7i5gUstIJaiHsZLgY15J0ow9wHnG/QGXfZPsD+N/EOsd9AerZgu2gEqK8Vwcobyi3k3395wArBS53K3G3uqs1Yu/g5S3kD3Y9ECWgFUvhF+sL9A7267qsJuJ/E+scFwaoZ8gfGvsFKG8oxxOmDY6NUPZnA5W90ZhHmL2dU7UmYXdMOy9eVaQnLcDviPdF+m6caiWphbCzGRuJrwSo552Byvoi+boJr0qY93cPEz415d8ClLuZuDlsdZPSitU3ZHtuG6020qsW4m0QPwPbNKKszsf/ZlaNNuypPEv7BixvHnfX+jdh2iL0SMDhgcrdaHw1bHWT8lXCtuUj8aoi9fgxcb5MobMvpWwX/G9m1bgl47q1YBuohyjrQmDljMsbw6GEaY97Apd7ALZZh/c12o6l083juW/EptgmNiHb8/PRaiN1C7V8omMsBjaMVaEEXY7/TW0Z2a/NPiRgeWNtnZi1foTLKrVX4LJ/OlC5640fBK5nKvpjT6ch23Ie2u0oeT8g/Jcq5UxGoY3FNzVoO9kn9x8EvBCwvLtlXN6YQn2fbgtc7lbgX4HKXmvcRXlSUJ5B+Pb8c7TaSFNOIfzFEPoXfMo883OfTvaTeE4OWN6nApQ3ptHYCoAQbbN34LIPwfKFe1yn92FJQcog1j7hykiYI78i7MXwKOntZhPTWGwkINYNbSaWjStrEwi7bvQzAcocW6hJjk9iw9wh9QV+hL06inGdLsPSLw4OXK9U7Ei4faQ7RugRE8lYC/AHwl4U345Wm3TtR9iMNzOBU7FlMVlrwfZ8DlX2qcDAAOWObTXCPQXH2m1sQ2wIM9SPraXARcBWkeqTgrHA64S9x1bjgEh1kgy1EG57tXbsy7xRtNqkbT1sx5trgVk03qZt2JPR2cBBhO3APtdEOWuJWDsAxRBqmH4mcYdqRwCfwCbGTWmy7G9g75mPA1aJWIcUDMBms8fofGOsHU9OUSrcBzgXODLQ8f+DLc9ZGuj4edSCbSG5AfYreSgwrBJDsU51FjAXm9k4F3gLy+38XOXvQ5uIbWcYaqjwVWx4e0Gg48c2DHieMJ3lOdisZQ+jset0bayOw7F3x0OxtJnV63Me9mNhLvAylm1rWvziJuPPhHkl1JW9sZEqyak+wD8I9wvtB/GqIhnoi+3zHPJXe6ybU0xHE6at2oB94lVDmhRy0mLnuDZSnSSwfsCVhLlIlgA7xauKNOlUwt40HsV+9BVNC3ATYdrsVWwvX0lb6Nc2HWMZtqWhFMQg4A7CXCwvUe7NGvLicMJstdcx9o1Wm/g2IFy2o/Mj1kPqdwjh9vftKvKwd7bUaQT2hBLigrmGfCXcL5stsHd5IW8aZUi8/13Ctd+HI9ZDarcb4dNMdoz52K5KUkBjsSfWEBfODyPWQ2q3CjbJK+RNYyGWpKTo+gOPE6YNZ5H9JhvSnM1pbmVDI/G1KDUTNxOwWYxZXzjLgIMj1kN6N5Q4SybKtF3l9tjchxDt+CQ2I1n8TSTeWt9q3E0x51BIJ1sDc8j+ApqP9qxMRX/ipCN8iPBZnVLzTcK15+XodY63DYHXiNv5LgQ2jlE5ScNehEml9hq2Flb89AEuJs5NowxDz521YPMeQrXrD+JVRTrZjDAjhL3F12NUTtJyODZ0nPXF9Djl2Qs0NX0ImwWtY5Rp6LmzlQm3MUcb8Nl4VZGKLYG3id/5aui5xE4gzEX1ANrDMrb+wD+Jc9O4l3JvygGWCS7U++Bl2A9kiWMHYAbxO9/Z2BI3KbEfE+biugtLbyfhDSbeFnRvAWvFqVbyvkO4dl6MMmXFcCg2fyV259uGJq4K9k7rHMJcZDdSjJ1xUjYSuJM4N42lwJ5xqpULLcAFhGvvecD7o9WmfL5F+AQ13cVPItRPcqIvcAVhLrSrsGxckr2NsQT5sW4aRdrpKCsDsdGeUG2+CA1HZ60f4R46aokb0Htf6WQwNiEgxAV3O5aNS7JzAPYOKdZN4xKKs1tY1lbGdk0K1fbLsHzE0rxVscxtXp3vFDRJVboxGksIEOLCexQYF68qhdWCzUAOMYO9u3gS26ZOujcRmE7Y83AS+hHUjD2w/Yy9Ot95WB4GkW6tSfObdncXk7GF7tKYccC/iXvTeANYL0blCuC9hFlf3zEuQxmz6tUX+BFxf7R2jiXA/qErKsUwAZhKmAvxLWDXeFUpjA8T/gmrc8xCW6PV6wjC757zNMqcVKvx2Cswr463HZvodXTgekrBbEa4tXFLsOwvGk7r3Qjgr8S/aczH1rpK/Y4i/NPWHOCjsSqUQ63A8cSdJ9FdaPKiNGQ7wuSNrsblaHJWTw4l3EhET7EU+FCE+hXZMcQZ8rwK2+lMltsA34lWHeN3gesqBfc+wu6J+Sz2tC3LbYrfsFkb8InwVSyF44mzznQa2lMYbEnYSYR/D19rnIdG+SQD+2HJ90NdqAuB71G+nXU6WxU4HcuC5HHDWIZ1GpKdLxHv/F1OOVMb9sFGHF7Gv9Otxrlora9kaH/C/7L8L+Wcpj8KOBWYi98NYyl68g3la8TLuLQI+CWWIa0MDgKewL/D7Rh/RNtKSgAHEr4TXgqchiUGKbph2PZz3hNFFmHvmyWcYwi3eUNX8TbW8Q+NUbnIWrF7UcgMZI3G6WjYWQI6iDjvWF7HhkOLOCy9OrYu0WP7s86xAHvFIOEdSPzE/9OBk4ExEeoX2hDsnhAz/Wo98bNwVRdZ7oPEm+jwAvAxijGkszVwPulMEnkH2D1ojaWzXYCZxD/X87AZuVuEr2LmNgZ+Svx18PXESaEqL9KVfYn7a/4xbBgvbxs7DMKSM8TasajWeJVyvm9PwWbYCI/XuX8E+DJpPxWPw4bQH8b/u9JTLMLuSyLR7YY9RcW84KcDvyDt2Z59sb1czyXsOupG4360dtTbOoTLu15rLMa2DP0asFHY6vaqFftB+B3gNnzTRtYaM9AIkjjbnnAZs3qKNmxbr2Oxd6reBmN7t/4eW5fpfXPoLi4gf6MIRTUMuBL/a6IaLwJnAp8EJhF2Gc1g7N7xOeAfWIpa7/rXE89hG3BIhjR7rTHvAa4HVnH6/Hbsqe5y4GrgcewXdEh9sF/se1ZiB2BA4M9sRjv2nupHlT9LGlqBH2Obw6d2/5mHDQE/iW2k0jHmVP59T1bCcjGPx4aUx2Od1nuwfPN5XSd7JzYP5m3vghRNal+APFkfuI40ds6Zi904HqjEw9hNY0GDx1sZe2+3aSU2AzYhP0s85mJPNRd5F0S6dQS2SXzelt/Nxr5X87FMVIOA/tiM5SL6E/AF7N2vZEwdcHNWwZ5AU53cMxOb/FKNrr5E/bHJKasAq1X+PDBWAQN4BLu5P+NdEOnVlth2g+O9CyLvMhc4Dvhf74KI9GQocA3+72jKHm3Ab0h7WFzebRXsdY739aNYHo+hfcwlR/piw2neX5yyxttY0gfJpxbgG/jlBFcsjz+Tv9cCIoAtbwi9OblixbgVWKOGcyPp2wZ4Hv9rqowxG+VGlwJ4Pz6Zf8oW87CNv/M6s1S6thK2ntz7+ipTXA+sWcvJEcmDjbB1c95frKLG1cBaNZ8NyaOjgFn4X2tFjlnAp9BkXCmgkcAV+H/JihRvAh+p5yRIro3FZkl7X3dFjKvRqxspuBbgROJuy1bEaAP+gu0jLOVzGDAV/+uwCDENveuVktkFeA3/L18e4z/AzvU3uRTMCOAs7MeY9zWZx1hcab+V6214kSIYg4bT6olngQ811NJSZHuT7v64qca1aF2vCACH4rOZQ15iOja7WQk1pDv9sE1JUt4EJIV4FrvfiEgHa2NbkHl/QVOKmdjGCcMbb1YpmdHA6SiBR+d4Gdt1qX/jTStSbC3YUou8bUuWdbyJ7Vo0oqnWlDKbAFyI/7XsHVOAL5HvXO4iUa0C/I3yTS55HvgsullIdnYF/o3/tR07XsKG5PXEK9KgXYH78P8yh447sN2KlMFKQtkW2yu76D9q7weOxt6Ji0iTWrBJE0XLojUTWwKxWXZNJdKrTbG0lkVah78IG27fM8N2EpEO+gPHAy/i/4VvNJZhw4GHoRnN4msD4DRsvoH396LRmAx8C1vOKCIR9MVSLz6M/w2gllgC3AR8ESV3l/T0x0aY/o39QPT+vvQWr2GzvHcBWgO0h4jUoAV4LzacNg//G0PHmAtcDHwcpYqU/FgHW/b2NP7foY7xOvBbbE6IOt2C0y4Y+TMcOBz4MNYpx575+A5wL3BXJe4EFkQug0iWNgAOBPbH0p72jfjZc7CJibdV4gFs8piUgDrgfBuGpebbB9gBSzeX5TldgC0Xehy4G+twH8WG70SKaCTwAWB3YHtgE/5/e3esgjAQBGH4qyWIpWAVS8Ha93+BgLWgWAoiFhJbi1HyAhLE7N9ce83c3HJ7s9+tRM/YG0y3U3qaLGXA/8UCOzk0WqwldauRQeeNfFl4yHvtU6IfbxLrdxLDPbzXzwCJopgqc2yxkTnfLZZYiZ5m0mTYS4dyj6vo6SKaOhousvdxt1/8Mi9B0GIBJVi9gQAAAABJRU5ErkJggg==';

                doc.setFontSize(15);
                cabecera = function () {
                    doc.rect(100, 10, 95, 40)
                    doc.text(datos.usuario_obj.nombre+" "+datos.usuario_obj.apellido1+" "+datos.usuario_obj.apellido2, 105, 18);
                    doc.text(datos.usuario_obj.dni, 105, 27);
                    doc.text(datos.usuario_obj.email, 105, 36);
                    doc.text("Fecha: "+datos.fecha, 105, 45);
                    doc.addImage(img, 'PNG', 15, 10, 40, 40);

                    doc.text("Producto", 25, 70);
                    doc.text("Cantidad", 140, 70);
                    doc.text("Precio", 175, 70);
                    doc.line(15, 75, 195, 75, 'S');
                }
                cabecera()

               /* doc.setFillColor(240);
                doc.rect(15, 76, 180, 15, 'F');
                doc.text("-Inserte producto aqui-", 20, 85);
                doc.text("66", 147, 85);
                doc.text("66,66€", 175, 85);*/
                var j = 0;
                var x=0;
                var totalPrecio = 0;
                
                for (i = 1; i <= lineasPedido.length; i++) {
                    totalPrecio += (lineasPedido[x].cantidad*lineasPedido[x].producto_obj.precio)
                    var rectangulo = j % 2;
                    var newPage = i % 11;
                    if (newPage == 0) {
                        doc.addPage();
                        j = 0;
                        cabecera()
                    }
                    if (rectangulo == 0) {
                        doc.setFillColor(240);
                        doc.rect(15, 76 + 15 * j, 180, 15, 'F');
                    }
                    doc.text(lineasPedido[x].producto_obj.descripcion, 20, 85 + 15 * j);
                    doc.text(lineasPedido[x].cantidad+"", 147, 85 + 15 * j);
                    doc.text(lineasPedido[x].producto_obj.precio+"€", 175, 85 + 15 * j);
                    j++;
                    x++;

                }

                

                doc.setFillColor(240);
                doc.rect(100, 241, 95, 15, 'F');
                doc.text("Base imponible:", 120, 250);
                doc.text(totalPrecio+"€", 170, 250);
                doc.text("IVA:", 147, 265);
                doc.text(datos.iva+"%", 170, 265);
                doc.setFillColor(240);
                doc.rect(100, 271, 95, 15, 'F');
                doc.text("Total:", 145, 280);
                iva = (datos.iva/100)+1;
                iva = parseFloat(iva);
                doc.text((totalPrecio*iva).toFixed(2)+"€", 170, 280);
                doc.save('Factura_'+datos.usuario_obj.login+'_'+datos.fecha);
        }, function () { })              
            }           


        }            
    ]
)