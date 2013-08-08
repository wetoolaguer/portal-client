
var client;

var NamespaceFactory = function (cl) {
    client = cl;
};

NamespaceFactory.prototype.create = function (namespace, value) {
    client[namespace] = value;
};

NamespaceFactory.prototype.attachProperty = function (namespace, prop, value) {
    client[namspace].prop = value;
};

module.exports = NamespaceFactory;
