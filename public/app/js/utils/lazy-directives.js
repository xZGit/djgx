/**
 * Created by xx on 15/9/6.
 */
define([], function () {

    var $compileProvider;

    function setCompileProvider(value) {
        $compileProvider = value;
    }

    function register(directive) {
        if(directive){
            if (!$compileProvider) {
                throw new Error("$compileProvider is not set!");
            }
            console.log(directive);
            $compileProvider.directive.apply(null, directive);
        }else{
            $compileProvider.directive.apply = null;
        }

    }

    return {
        setCompileProvider: setCompileProvider,
        register: register
    }
});