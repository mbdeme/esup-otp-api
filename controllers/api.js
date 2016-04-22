var properties = require(process.cwd() + '/properties/properties');

var apiDb;

exports.initialize= function(callback) {
    if (properties.esup.apiDb) {
        apiDb = require(process.cwd() + '/databases/api/' + properties.esup.apiDb);
    	apiDb.initialize(callback);
    } else console.log("Unknown apiDb");
}

exports.get_methods = function(req, res, next) {
    console.log("get_methods");
    var response = {
        "code": "Error",
        "message": "No method found"
    };
    response.methods = {};
    for (method in properties.esup.methods) {
        response.methods[method] = properties.esup.methods[method];
        response.code = "Ok";
        response.message = "Method(s) found";
    }
    res.send(response);
}

/**
 * Active la méthode req.params.method
 *
 * @param req requete HTTP contenant le nom la personne recherchee
 * @param res response HTTP
 * @param next permet d'appeler le prochain gestionnaire (handler)
 */
exports.activate_method_admin = function(req, res, next) {
    console.log("ADMIN activate_method " + req.params.method);
    if (properties.esup.methods[req.params.method]) {
        properties.esup.methods[req.params.method].activate = true;
        res.send({
            code: 'Ok',
            message: ''
        });
    } else res.send({
        "code": "Error",
        "message": properties.messages.error.method_not_found
    });
};

/**
 * Désctive la méthode req.params.method
 *
 * @param req requete HTTP contenant le nom la personne recherchee
 * @param res response HTTP
 * @param next permet d'appeler le prochain gestionnaire (handler)
 */
exports.deactivate_method_admin = function(req, res, next) {
    console.log("ADMIN deactivate_method " + req.params.method);
    if (properties.esup.methods[req.params.method]) {
        properties.esup.methods[req.params.method].activate = false;
        res.send({
            code: 'Ok',
            message: ''
        });
    } else res.send({
        "code": "Error",
        "message": properties.messages.error.method_not_found
    });
};

/**
 * Active le transport req.params.transport pour la  méthode req.params.method
 *
 * @param req requete HTTP contenant le nom la personne recherchee
 * @param res response HTTP
 * @param next permet d'appeler le prochain gestionnaire (handler)
 */
exports.activate_method_transport = function(req, res, next) {
    console.log("ADMIN activate_method_transport " +req.params.transport +' '+ req.params.method);
    if (properties.esup.methods[req.params.method]) {
        properties.esup.methods[req.params.method][req.params.transport] = true;
        res.send({
            code: 'Ok',
            message: ''
        });
    } else res.send({
        "code": "Error",
        "message": properties.messages.error.method_not_found
    });
};

/**
 * Désctive le transport req.params.transport pour la  méthode req.params.method
 *
 * @param req requete HTTP contenant le nom la personne recherchee
 * @param res response HTTP
 * @param next permet d'appeler le prochain gestionnaire (handler)
 */
exports.deactivate_method_transport = function(req, res, next) {
    console.log("ADMIN deactivate_method_transport " +req.params.transport +' '+req.params.method);
    console.log(req.params.method);
    if (properties.esup.methods[req.params.method]) {
        properties.esup.methods[req.params.method][req.params.transport] = false;
        res.send({
            code: 'Ok',
            message: ''
        });
    } else res.send({
        "code": "Error",
        "message": properties.messages.error.method_not_found
    });
};

/**
 * Sauve l'utilisateur
 *
 * @param req requete HTTP contenant le nom la personne recherchee
 * @param res response HTTP
 * @param next permet d'appeler le prochain gestionnaire (handler)
 */
exports.save_user=function(user, callback) {
    apiDb.save_user(user, callback);
}

/**
 * Envoie le code via le transport == req.params.transport
 * Retourne la réponse du service mail
 *
 * @param req requete HTTP contenant le nom la personne recherchee
 * @param res response HTTP
 * @param next permet d'appeler le prochain gestionnaire (handler)
 */
exports.transport_code = function(code, req, res, next) {
    apiDb.transport_code(code, req, res, next);
}


/**
 * Renvoie l'utilisateur avec l'uid == req.params.uid
 *
 * @param req requete HTTP contenant le nom la personne recherchee
 * @param res response HTTP
 * @param next permet d'appeler le prochain gestionnaire (handler)
 */
exports.get_user = function(req, res, next) {
    apiDb.get_user(req, res, next);
};

/**
 * Envoie un code à l'utilisateur avec l'uid == req.params.uid et via la method == req.params.method
 *
 * @param req requete HTTP contenant le nom la personne recherchee
 * @param res response HTTP
 * @param next permet d'appeler le prochain gestionnaire (handler)
 */
exports.send_code = function(req, res, next) {
    console.log("send_code :" + req.params.uid);
    apiDb.send_code(req, res, next);
};


/**
 * Vérifie si le code fourni correspond à celui stocké en base de données
 * si oui: on retourne un réponse positive et on supprime l'otp de la base de donnée
 * sinon: on renvoie une erreur 401 InvalidCredentialsError
 *
 * @param req requete HTTP contenant le nom la personne recherchee
 * @param res response HTTP
 * @param next permet d'appeler le prochain gestionnaire (handler)
 */
exports.verify_code = function(req, res, next) {
    apiDb.verify_code(req, res, next);
};


/**
 * Génére un nouvel attribut d'auth (secret key ou matrice ou bypass codes)
 *
 * @param req requete HTTP contenant le nom la personne recherchee
 * @param res response HTTP
 * @param next permet d'appeler le prochain gestionnaire (handler)
 */
exports.generate_method_secret = function(req, res, next) {
    apiDb.generate_method_secret(req, res, next);
};


/**
 * Supprime l'attribut d'auth (secret key ou matrice ou bypass codes)
 *
 * @param req requete HTTP contenant le nom la personne recherchee
 * @param res response HTTP
 * @param next permet d'appeler le prochain gestionnaire (handler)
 */
exports.delete_method_secret = function(req, res, next) {
    apiDb.delete_method_secret(req, res, next);
};

/**
 * Renvoie le secret de l'utilisateur afin qu'il puisse l'entrer dans son appli smartphone
 *
 * @param req requete HTTP contenant le nom la personne recherchee
 * @param res response HTTP
 * @param next permet d'appeler le prochain gestionnaire (handler)
 */
exports.get_method_secret = function(req, res, next) {
    apiDb.get_method_secret(req, res, next);
};

/**
 * Renvoie les méthodes activées de l'utilisateur
 *
 * @param req requete HTTP contenant le nom la personne recherchee
 * @param res response HTTP
 * @param next permet d'appeler le prochain gestionnaire (handler)
 */
exports.get_activate_methods = function(req, res, next) {
    console.log("exports.get_activate_methods = function(req, res, next) {");
    apiDb.get_activate_methods(req, res, next);
};


/**
 * Active la méthode l'utilisateur ayant l'uid req.params.uid
 *
 * @param req requete HTTP contenant le nom la personne recherchee
 * @param res response HTTP
 * @param next permet d'appeler le prochain gestionnaire (handler)
 */
exports.activate_method = function(req, res, next) {
    console.log(req.params.uid + " activate_method " + req.params.method);
    apiDb.activate_method(req, res, next);
};


/**
 * Désctive la méthode l'utilisateur ayant l'uid req.params.uid
 *
 * @param req requete HTTP contenant le nom la personne recherchee
 * @param res response HTTP
 * @param next permet d'appeler le prochain gestionnaire (handler)
 */
exports.deactivate_method = function(req, res, next) {
    console.log(req.params.uid + " deactivate_method " + req.params.method+'sdmfjqsmlkfdjlmj') ;
    apiDb.deactivate_method(req, res, next);
};

/**
 * Drop Users
 */
exports.drop = function(req, res, next) {
    apiDb.drop(req, res, next);
};