require.config({
	paths: {
		angular: '../../../bower_components/angular/angular',
		angularRoute: '../../../bower_components/angular-route/angular-route',
        bootstrap: '../../../bower_components/bootstrap/dist/js/bootstrap.min',
        jQuery: '../../../bower_components/jquery/jquery.min',
		ngFileUpload: '../../../bower_components/ng-file-upload/ng-file-upload.min',
		ngSortable: '../../../lib/Sortable/ng-sortable',
		Sortable:'../../../lib/Sortable/Sortable.min' ,
		CkEditor:'../../../lib/ckeditor/ckeditor',
		ngCkeditor:'../../../bower_components/angular-ckeditor/angular-ckeditor.min',
		ngUiTree:'../../../bower_components/angular-ui-tree/dist/angular-ui-tree.min',
		moment: '../../../bower_components/moment/moment',
		momentLang: '../../../bower_components/moment/locale/zh-cn',
		validator: '../../../bower_components/validator-js/validator',
		btDateTime: '../../../bower_components/eonasdan-bootstrap-datetimepicker/src/js/bootstrap-datetimepicker',
		ngDate:'../../../lib/angular-bootstrap-datetimepicker-directive/angular-bootstrap-datetimepicker-directive',
		ngFileUploadShim: '../../../bower_components/ng-file-upload/ng-file-upload-shim.min'
	},



	// Add angular modules that does not support AMD out of the box, put it in a shim

	baseUrl: './app/js',
	shim: {
		'angular' : {'exports' : 'angular'},
		'angularRoute': ['angular'],
		'ngUiTree':['angular'],
        'bootstrap': ['jQuery'],
		'ngCkeditor': ['angular','CkEditor'],
		'ngSortable': ['angular','Sortable'],
		'btDateTime':['bootstrap', 'moment', 'momentLang'],
		'ngDate': ['angular', 'btDateTime'],
		'ngFileUpload': {
			deps: [
				'angular',
				'ngFileUploadShim'
			]}
	},
	priority: [
		"angular"
	]
});

// manually bootstrap the app
window.name = "NG_DEFER_BOOTSTRAP!";

require( [
	'angular',
	'app',
	'routes',
	'bootstrap',
], function(angular, app) {
	'use strict';
	var $html = angular.element(document.getElementsByTagName('html')[0]);
	angular.element().ready(function() {
		$html.addClass('ng-app');
		var a = angular.bootstrap($html, [app['name']]);
		console.log(a);
	});
});