/**
 * Created by xx on 15/9/6.
 */
define([], function () {

    var $provide;

    function setProvide(value) {
        $provide = value;
    }

    function register(service) {
        if (service) {
            if (!$provide || !$provide[service[0]]) {
                throw new Error("$setProvide is not set!");
            }
            $provide[service[0]](service[1], service[2]);
        } else {
            $provide.value = null;
        }

    }


    return {
        setProvide: setProvide,
        register: register
    }
});