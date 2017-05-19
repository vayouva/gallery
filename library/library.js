// -------------------------------------------------------------------- 
// -------------- FONCTIONS FOURNIES ----------------------------------
// --------------------------------------------------------------------
	
// fonction pour ajouter un élément
// si contenu est chaine vide alors crée un élément vide (par ex. pour img)

var ajouterElement = function (balise, contenu, parent) {
    var noeud = document.createElement(balise);
    if (contenu != '') {
        var noeudTexte = document.createTextNode(contenu);
        noeud.appendChild(noeudTexte);
    }
    parent.appendChild(noeud);

    return noeud;
}

	
	
// fonction fournie pour charger un contenu XML
var loadXML = function (url) {
    var xmlhttp=new XMLHttpRequest();
    xmlhttp.open("GET", url, false);
    xmlhttp.send();
    var doc = xmlhttp.responseXML;
    removeBlankNodes(doc.documentElement);
    return doc;
}

// fonction qui supprime les "blank nodes" d'un document
// explications et source de la fonction :
// http://www.sitepoint.com/removing-useless-nodes-from-the-dom/
var removeBlankNodes = function (node) {
    for (var n = 0; n < node.childNodes.length; n++) {
        var child = node.childNodes[n];
        if (child.nodeType === 8 ||
        (child.nodeType === 3 && !/\S/.test(child.nodeValue))
        ) {
            node.removeChild(child);
            n--;
        } else if(child.nodeType === 1) {
            removeBlankNodes(child);
        }
    }
}		

var nettoyerElement = function(element) {
	while(element.childNodes.length) 
		element.removeChild(element.firstChild);
}

// fonction pour creer un appel callback en JSONP
var JSONPcall = function (url, params, callback) {
    queryString = url+"&"; 
    for(key in params) {
        queryString += key + '=' + encodeURIComponent(params[key]) + '&';
    }
    queryString = queryString.slice(0, queryString.length - 1);
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', queryString);
    document.head.appendChild(script);
}

// Fonction pour creer des noeuds à partir d'un fichier json
var creerNoeud = function(options)
{
    // verifier la presence du type d'element à  creer
    if (!options.hasOwnProperty('balise')) {
        console.log("Pas de nom de balise donnée");
        return null;
    }
    // creer l'element
    var elt = document.createElement(options.balise);

    // si il y a contenu alors creer le nd de texte
    if (options.hasOwnProperty('contenu')) {
        var txt = document.createTextNode(options.contenu);
        elt.appendChild(txt);
    }

    // si il y a des attributs les ajouter
    if (options.hasOwnProperty('attributs')) {
        for (var attr in options.attributs) {
            elt.setAttribute(attr, options.attributs[attr]);
        }
    }
    return elt;
}