


'use strict';

define([
		'app',
		'utils/route-config'
	],

	function (app, routeConfig) {

			return app.config(['$routeProvider',function ($routeProvider) {
				var httpServicePath = "app/js/services/http-service.js";
				var pageDirPath = "directives/paging";
				var showErrorPath = "directives/show-error";
				var uploadPath = "directives/file-upload";
				var autoCompletePath = "directives/auto-complete";

				$routeProvider.when('/production', routeConfig.config('production.html', 'production.js',{
					services:[httpServicePath], directives:[]
				}));

				$routeProvider.when('/user', routeConfig.config('user.html', 'user.js',{
					services:[httpServicePath], directives:[pageDirPath]
				}));

				$routeProvider.when('/phrase', routeConfig.config('phrase.html', 'phrase.js',{
					services:[httpServicePath], directives:[]
				}));

				$routeProvider.when('/ad', routeConfig.config('ad.html', 'ad.js',{
					services:[httpServicePath], directives:[]
				}));

				$routeProvider.when('/edit-ad/:id', routeConfig.config('edit-ad.html', 'edit-ad.js',{
					services:[httpServicePath], directives:[showErrorPath]
				}));

				$routeProvider.when('/order', routeConfig.config('order.html', 'order.js',{
					services:[httpServicePath], directives:[pageDirPath]
				}));

				$routeProvider.when('/edit-order/:id', routeConfig.config('order-detail.html', 'order-detail.js',{
					services:[httpServicePath], directives:[]
				}));

				$routeProvider.otherwise({redirectTo:'/'});
		}]);
	});



