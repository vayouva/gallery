/*
	DEVOIR MAISON DE DSAOS 	
	
	Youva ABASSI (21201084)
	
*/

// -------------------------------------------------------------------- 
// ------- VARIABLES GLOBALES -----------------------------------------
// --------------------------------------------------------------------

// Namespaces utilisés
var x_NS   		 = 'adobe:ns:meta/'; //namespace
var rdf_NS 		 = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#';//namespace
var dc_NS  		 = 'http://purl.org/dc/elements/1.1/'; //namespace
var exif_NS		 = 'http://ns.adobe.com/exif/1.0/'; //namespace
var pdf_NS 		 = 'http://ns.adobe.com/pdf/1.3/'; //namespace
var photoshop_NS = 'http://ns.adobe.com/photoshop/1.0/';//namespace
var tiff_NS      = 'http://ns.adobe.com/tiff/1.0/'; //namespace
var xmpRights_NS = 'http://ns.adobe.com/xap/1.0/rights/'; //namespace
var Iptc4xmpCore_NS = 'http://iptc.org/std/Iptc4xmpCore/1.0/xmlns/'//namespace
var carte; //reference pour l'objet Google Maps
var end = 12; //nombre de photos, posé comme condition d'arret lors du chargement des photos

//--------------- URL DU SERVICE FLICKR + API KEY + format=json -------
var flickrUrl 			= "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=d32e3dff12655cf1e9d387636ebaf1f1&format=json"



// -------------------------------------------------------------------- 
// -------------- AFFICHER LES DETAILS D'UNE IMAGE --------------------
// --------------------------------------------------------------------
window.onload = function() {
	//Au chargement de la page, on execute la fonction afficheData(jsonData) qui va charger les images de la galerie sur la page html
	afficheData(jsonData);

	//L'ancienne méthode de chargement des images sur la page html avant de rajouter le fichier Json
	//initialisation des interactions
	//console.log('init, c\'est pret');
    //var conteneur = document.getElementById('galerie'); //reference de la section galerie
    //console.log(jsonData);
    
    //Charger les images dans la page html
    /*for(var i=1; i <= end; i++){
    	var elt = ajouterElement("img", "", conteneur); //ajouter les balises contenants les images dans la section conteneur
    	//console.log(conteneur);
    	elt.setAttribute("src", "images/photo"+[i]+".jpg"); //ajouter l'attribut src à l'image chargée
    	elt.setAttribute("width", 200); //definir la largeur de l'image
    	elt.setAttribute("height", 150); //definir la hauteur de l'image
    	elt.setAttribute("title", "cliquez dessus pour afficher plus de details"); //insérer un titre à l'image
    	elt.setAttribute("style", "margin: 0 2px;"); //insérer des espaces entre les photos pour mieux les différencier
    	
    	//pour chaque image ajoutée, on lui rajoute un détecteur d'événement click, et qui lance la fonction afficheDetails(fichierXMP)
    	elt.addEventListener("click", (function(photo) { return function() { afficheDetails(photo+".xmp"); };})("photo"+[i]), false);

    } */
    
};

// -------------------------------------------------------------------- 
// -------------- CHARGER LES IMAGES AVEC JSON ------------------------
// --------------------------------------------------------------------
//Beaucoup plus pratique 
var afficheData = function(jsonData){
	var conteneur = document.getElementById('galerie');
	var lightboxDiv = document.getElementById('divConteneur');
	nettoyerElement(conteneur);
	//nettoyerElement(lightboxDiv);

	//ajouter le titre de la galerie
	var monTitre = creerNoeud({
		"balise" : "h4",
		"contenu" : jsonData[0].galleryName.title,
		"attributs": {
			"style": jsonData[0].galleryName.style,
		}
	});
	
	conteneur.appendChild(monTitre);
	var chemin = jsonData[0].folderName;
    
	//charger les images pour la section galerie 
    for (var i=1; i<jsonData.length-1; i++) {
    	// Creer les neouds des images avec leurs attributs
    	var noeudImg = creerNoeud({
        	"balise" : "img",
        	"attributs": {
            	"src" : chemin+jsonData[i].filename,
            	"height": jsonData[13].height,
            	"width": jsonData[13].width,
            	"style": jsonData[13].style,
            	"id": jsonData[i].id,            	
            	"title": jsonData[i].title
        	}
    	});

    conteneur.appendChild(noeudImg);

    //pour chaque image ajoutée, on lui rajoute un détecteur d'événement click, et qui lance la fonction afficheDetails(fichierXMP)
    noeudImg.addEventListener("click", (function(photo) { return function() { afficheDetails(photo+".xmp"); };})("photo"+[i]), false);
	
	}
	
}

//console.log(document.getElementById("divConteneur").getElementsByTagName("img").length);

// -------------------------------------------------------------------- 
// -------------- AFFICHER LES DETAILS DES IMAGES ---------------------
// --------------------------------------------------------------------

var afficheDetails = function(fichierXMP) {
	//console.log(fichierXMP);
    var conteneur = document.getElementById('details'); //reference de la section details
	nettoyerElement(conteneur); //vider la section details pour afficher de nouvelles données
   	var xmpFile = loadXML('xmp/'+fichierXMP);//Charger le fichier xmp correspondant a l'image qui a ete cliquee
	//Je récupère toutes les données dans des variables pour pouvoir faire des testes pour certaines d'entre elles, car dans certains fichiers 		xmp il se peut que les données comme city, source... n'existent pas 
	//namespace dc_NS
	var createur = xmpFile.getElementsByTagNameNS(dc_NS , 'creator')[0].firstChild.firstChild.textContent; //recuperer le nom du createur
	var description = xmpFile.getElementsByTagNameNS(dc_NS , 'description')[0].firstChild.firstChild.textContent; //recuperer la description de la photo
	var copyright = xmpFile.getElementsByTagNameNS(dc_NS , 'rights')[0].firstChild.firstChild.textContent; //recuperer les copyrights de la photo
	
	//namespace photoshop_NS
	var Headline = xmpFile.getElementsByTagNameNS(photoshop_NS , 'Headline')[0].firstChild.textContent;// recuperer le gros titre de l'image
	var pays = xmpFile.getElementsByTagNameNS(photoshop_NS , 'Country')[0].firstChild.textContent; //recuperer le pays où la photo a ete prise
	//namespace exif_NS
	var date = xmpFile.getElementsByTagNameNS(exif_NS, 'DateTimeOriginal')[0].firstChild.textContent;// recuperer la date où la photo a ete prise
	var usageTerms = xmpFile.getElementsByTagNameNS(xmpRights_NS, "UsageTerms")[0].firstChild.firstChild.textContent;
	//namespace pdf_NS
	var motsCles = xmpFile.getElementsByTagNameNS(pdf_NS, 'Keywords')[0].textContent; //recuperer les mots cles   	
	
	// On ajoute toutes les donnees dans la section details
	ajouterElement("h4",Headline,conteneur);
	ajouterElement("ul","Description:",conteneur);
	ajouterElement("p", description, conteneur);
	ajouterElement("ul","Photo prise par:",conteneur);
	ajouterElement("li",createur,conteneur);
	ajouterElement("ul","Photo prise le:",conteneur);
	ajouterElement("li",date,conteneur);


	//Dans certains fichiers xmp, y a pas le site web du créateur, du coup on fait le test s'il existe on le rajoute sinon on fait rien
	if (xmpFile.getElementsByTagNameNS(Iptc4xmpCore_NS, 'CiUrlWork').length > 0) {
		ajouterElement("ul", "Site web du créateur:", conteneur);
		var site = xmpFile.getElementsByTagNameNS(Iptc4xmpCore_NS, 'CiUrlWork')[0].textContent;
		ajouterElement("a", site, conteneur);
		document.getElementById("details").getElementsByTagName("a")[0].setAttribute("href", site);
		document.getElementById("details").getElementsByTagName("a")[0].setAttribute("title", "Plus d'infos sur le créateur");
		document.getElementById("details").getElementsByTagName("a")[0].setAttribute("target", "_blank");
		
	}
	
	//meme test pour le nom de la ville, pays, les droits d'auteur et les mots clés
	if (xmpFile.getElementsByTagNameNS(photoshop_NS , 'City').length >0 ) {
		var city = xmpFile.getElementsByTagNameNS(photoshop_NS , 'City')[0].firstChild.textContent;
		ajouterElement("li", city, ajouterElement("ul", "Ville :", conteneur));
	}
	 
	if (pays.length > 0)
		ajouterElement("li", pays, ajouterElement("ul", "Pays :", conteneur));
 	if (copyright != null)
		ajouterElement("li", copyright, ajouterElement("ul", "Copyright :", conteneur));
 	if (motsCles != null)
		ajouterElement("li", motsCles, ajouterElement("ul", "Quelques mots clés :", conteneur));

	//recuperer les conditions d'utilisation)
	if (xmpFile.getElementsByTagNameNS(Iptc4xmpCore_NS, 'CiUrlWork').length > 0) {
		ajouterElement("ul", "Conditions d\'utilisation :", conteneur);
		var usageTerms = xmpFile.getElementsByTagNameNS(xmpRights_NS, "UsageTerms")[0].firstChild.firstChild.textContent;
		ajouterElement("a", usageTerms, conteneur);
		document.getElementById("details").getElementsByTagName("a")[1].setAttribute("id", "");
		document.getElementById("details").getElementsByTagName("a")[1].setAttribute("href", usageTerms);
		document.getElementById("details").getElementsByTagName("a")[1].setAttribute("title", "conditions d\'utilisation");
		document.getElementById("details").getElementsByTagName("a")[1].setAttribute("target", "_blank");
		
	}
	else {
		ajouterElement("ul", "Conditions d\'utilisation :", conteneur);
		var usageTerms = xmpFile.getElementsByTagNameNS(xmpRights_NS, "UsageTerms")[0].firstChild.firstChild.textContent;
		ajouterElement("a", usageTerms, conteneur);
		document.getElementById("details").getElementsByTagName("a")[0].setAttribute("href", usageTerms);
		document.getElementById("details").getElementsByTagName("a")[0].setAttribute("title", "conditions d\'utilisation");
		document.getElementById("details").getElementsByTagName("a")[0].setAttribute("target", "_blank")
	};

	ajouterElement("p","", conteneur);
		
	
	//button pour "afficher la carte" + listener vers la carte sur google maps
	var buttonCarte = ajouterElement("button","Afficher la carte",conteneur);
	buttonCarte.addEventListener("click", function() {
		nettoyerElement(conteneur);
		ajouterElement("p", "Chargement...", conteneur);
		
		afficherCarte(fichierXMP, ConvertDMSToDD(Latitude), ConvertDMSToDD(Longitude), Headline);
	}, false);
	
	//Definir la latitude et la longitude pour la recherche JSONPcall
	var Latitude = xmpFile.getElementsByTagNameNS(exif_NS, "GPSLatitude")[0].textContent;//recuperer la latitude 
	var Longitude = xmpFile.getElementsByTagNameNS(exif_NS, "GPSLongitude")[0].textContent;//recuperer la longitude
	
	//création du listener
	//au clic, on nettoie la partie droite
	//puis on interroge le service Flickr (JSONPcall) avec les arguments lat, lon, radius, ...
	var buttonImages = ajouterElement("button","Trouver des images dans cette zone",conteneur);
	buttonImages.addEventListener("click", function(ev) {
			nettoyerElement(conteneur);
			ajouterElement("h3", "Photos autour de: "+Headline, conteneur);
			
			JSONPcall(flickrUrl, {lat:ConvertDMSToDD(Latitude), lon: ConvertDMSToDD(Longitude), radius: "10", content_type: "1", per_page:"40"}, jsonFlickrApi);
			//JSONPcall est une fonction include dans le dossier library/library.js
			//Elle permet d'interoger le service de flickr, avec une adresse (ici flickUrl (var globable), + des infos et enfin
			//jsonFlickrApi qui est la fonction qui sera appelée lors de la réponse. Son argument "rsp" contiendra les informations au format json que l'on traitera ensuite
			//pour y afficher les images sur la page.
		}, false);
		
};

// -------------------------------------------------------------------- 
// -------------- FONCTION AFFICHER LA CARTE --------------------------
// --------------------------------------------------------------------

var afficherCarte = function(fichierXMP,lat,lng,titre){
	//console.log(lat, lng, titre);	
	var conteneur = document.getElementById('details'); //reference de la section details
	nettoyerElement(conteneur); //vider la section details pour afficher de nouvelles données
	var xmpFile = loadXML('xmp/'+fichierXMP);//Charger le fichier xmp correspondant a  l'image qui a ete cliquee
	var pays = xmpFile.getElementsByTagNameNS(photoshop_NS , 'Country')[0].firstChild.textContent; //recuperer le pays où la photo a ete prise
	ajouterElement("h4",titre,conteneur);//ajouter le gros titre de l'image
	

	// Ajouter une division qui va contenir la map
	ajouterElement("div","  ", conteneur);//creer la div qui va contenir la map
	document.getElementById("details").getElementsByTagName("div")[0].setAttribute("id", "divMap");//attribuer un id pour la div 


	// Options d'affichage de la carte
	var myLatLng = {lat: lat, lng: lng};
	var mapOptions = {
		center: myLatLng,
		zoom: 17,
		mapTypeId: google.maps.MapTypeId.SATELLITE,
		disableDefaultUI: true,

	};
	
	// reference de la division qui va contenir la map
	var conteneurCarte = document.getElementById("divMap");
	
	// Instanciation de la carte google
	// variable carte est GLOBALE pour pouvoir l'utiliser dans les autres fonctions
	carte = new google.maps.Map(conteneurCarte, mapOptions); 

	ajouterMarker(lat, lng, titre);

	ajouterElement("br", "   ", conteneur);
	//Boutton retourner aux details de l'image cliquée
	var retourDetails = ajouterElement("button","Revenir aux details",conteneur);
	retourDetails.addEventListener("click", function() {
		nettoyerElement(conteneur);
		ajouterElement("p", "Chargement...", conteneur);
		
		afficheDetails(fichierXMP);
	}, false);

	//ajouter le boutton pour la recherche des restaurants qui se trouvent autour

	var rechercheRestaurant = ajouterElement("button","Trouver des restaurants autour",conteneur);
	rechercheRestaurant.addEventListener("click", function() {
		rechercheRestaurants(lat, lng);
	}, false);

	
	if (xmpFile.getElementsByTagNameNS(photoshop_NS , 'City').length >0 ) {
		var city = xmpFile.getElementsByTagNameNS(photoshop_NS , 'City')[0].firstChild.textContent;
		ajouterElement("li", city, ajouterElement("ul", "Ville :", conteneur));
	}
	 
	if (pays.length > 0)
		ajouterElement("li", pays, ajouterElement("ul", "Pays :", conteneur));

	ajouterElement("ul", "Latitude :", conteneur);
	ajouterElement("li", lat, conteneur);
	ajouterElement("ul", "Longitude :", conteneur);
	ajouterElement("li", lng, conteneur); 
	

	//Ajouter un boutton pour afficher des infos avec Reverse Geocoding
	var geocoder = new google.maps.Geocoder;
  	var infowindow = new google.maps.InfoWindow;

    var reverseDiv = ajouterElement("div","",conteneurCarte);
    reverseDiv.setAttribute("id","floating-panel");
    //la balise input pour saisir les coordonnées + les attributs qu'elle contient
    var latlngInput = ajouterElement("input","",reverseDiv);
    latlngInput.setAttribute("id","latlng");
    latlngInput.setAttribute("type","text");
    latlngInput.setAttribute("value",lat+","+lng);

    //la balise input pour soumettre les coordonnées saisies + les attributs qu'elle contient
    var submit = ajouterElement("input","",reverseDiv);
    submit.setAttribute("id","submit");
    submit.setAttribute("type","button");
    submit.setAttribute("value","Reverse Geocode");

    document.getElementById('submit').addEventListener('click', function() {
    	geocodeLatLng(geocoder, carte, infowindow);
  	});

};

// -------------------------------------------------------------------- 
// -------------- FONCTION POUR AFFICHER LES MARKERS ------------------
// --------------------------------------------------------------------

function ajouterMarker(lat, lng, titre) { 
	//création du marker avec ses options
	var marker = new google.maps.Marker({
		position: new google.maps.LatLng(lat, lng),
		map: carte,
		title: titre,
		color: "#FFF",		
	});

	return marker

}


// -------------------------------------------------------------------- 
// -------------- FONCTION POUR AFFICHER LES IMAGES FLICKR ------------
// --------------------------------------------------------------------

function jsonFlickrApi(rsp) {
	var conteneur = document.getElementById("details");
	//rsp = réponse de Flickr, on obtient les photos sous forme JSON
	//console.log(rsp);
    for (var i=0; i < rsp.photos.photo.length; i++) {
		var photo = rsp.photos.photo[i];
		
		//mise en forme des URL (miniature et image en grande taille)
		var miniature_url = "http://farm" + photo.farm + ".static.flickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + "_" + "t.jpg";
		var photo_url = "http://www.flickr.com/photos/" + photo.owner + "/" + photo.id;

		//création d'un élément div par image
		var div = ajouterElement("div", "", conteneur);
		div.setAttribute("class", "imageflickr");
		
		//si le titre de l'image est trop grand (> 20), on le coupe (pour ne pas abimer l'affichage)
		var titleCoupe = photo.title+"";
		if(titleCoupe.length > 20)
			titleCoupe = titleCoupe.substring(0, 20)+"...";
			
		//création du lien vers l'image sur Flickr
		var a = ajouterElement("a", titleCoupe, div);
		a.href = photo_url;
		a.target = "_blank"
		
		//affichage de l'image
		var img = ajouterElement("img", "", div);
		img.setAttribute("src",miniature_url);
		img.setAttribute("title", photo.title);
	}

	//création du boutton "revenir aux details" + listener vers afficheDetails()
	var button = ajouterElement("button", "Revenir à la galerie", conteneur);
	button.addEventListener("click", function() {
		QuitterRechercheFlickr();
	}, false);
}

//fonction pour retourner à l'affichage de la galerie après la recherche flickr, car si je mets afficheDetails à la place, ça marche mais elle prend aucun paramètre et ça affiche un message d'erreur dans la console 
var QuitterRechercheFlickr = function(){
	var conteneur = document.getElementById("details");
	nettoyerElement(conteneur);
	afficheData(jsonData);
}

// -------------------------------------------------------------------- 
// -------------- FONCTION POUR CONVERTIR LES COORDONNEES GPS ---------
// -------------------------------------------------------------------- 

function ConvertDMSToDD(coords) { 
	//Récupérer les jours
	var resJours = coords.split(",");
	var joursOut = parseInt(resJours[0]);

	//Récupérer la direction 
	var res = coords.split(".");
	var direction = res[1].split("");
	var longTableau = direction.length;
	var directionIn = direction[longTableau -1];//la direction est toujours rajoutée en dernier

	//Récupérer les minutes
	var minutesIn = resJours[1]; //On récupère la deuxième partie après la virgule dans un tableau
	var chaine = "";
	for (var i = 0; i < minutesIn.length; i++) {
	    chaine +=minutesIn[i];
	};

	var minutes = parseFloat(chaine);

	var minutesRes = minutes / 60;
	//console.log(minutesRes);
	var minutesSplitted = (minutesRes+"").split(".");
	var minutesOut = minutesSplitted[1];
	//console.log(minutesOut);

	//Si la direction est W ou S, on renvoie -jours
	if (directionIn == "S" || directionIn == "W") {
        joursOut =  -joursOut;
    }; //Ne rien faire pour le cas où la direction est E ou N 


    var resFinal = joursOut+"."+minutesOut;
    return parseFloat(resFinal);

};

//42,22.776833N, 83,1.741833W
//42.379617, -83.028928

	

// -------------------------------------------------------------------- 
// -------------- FONCTION GEOCODING ----------------------------------
// --------------------------------------------------------------------

var  geocodeLatLng = function(geocoder, map, infowindow) {
	var conteneur = document.getElementById("details");
	var input = document.getElementById('latlng').value;
  	var latlngStr = input.split(',', 2);
  	var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
  	geocoder.geocode({'location': latlng}, function(results, status) {
    	if (status === google.maps.GeocoderStatus.OK) {
      		if (results[1]) {
        		map.setZoom(16);
        		var marker = new google.maps.Marker({
          		position: latlng,
          		map: map
        	});
        infowindow.setContent(results[1].formatted_address);
        infowindow.open(map, marker);
        ajouterElement("ul", "Résultat de la recherche Geocoding : ", conteneur);
    	ajouterElement("li",results[1].formatted_address, conteneur);
      } else {
        window.alert('No results found');
      }
    } else {
      window.alert('Geocoder failed due to: ' + status);
    }    

  });
}


// -------------------------------------------------------------------- 
// -------------- FONCTION RECHECHE RESTAURANTS -----------------------
// --------------------------------------------------------------------
//Cette fonction complémentaire ne marche pas à cause du fameux: TypeError: a is null

var rechercheRestaurants = function (latitude, longitude) {
	console.log(latitude, longitude);

  	var pyrmont = {lat: latitude, lng: longitude};
  	map = new google.maps.Map(document.getElementById('conteneurCarte'), {
    	center: pyrmont,
    	zoom: 15
  	});

  	infowindow = new google.maps.InfoWindow();

  	var service = new google.maps.places.PlacesService(map);
  	service.nearbySearch({
    	location: pyrmont,
    	radius: 10000, //distance autour en mètres = 10km
    	types: ['restaurant']
  		}, callback);
	}

function callback(results, status) {
	console.log(results);
	if (status === google.maps.places.PlacesServiceStatus.OK) {
    	for (var i = 0; i < results.length; i++) {
      		createMarker(results[i]);
    	}
  	}
}


function createMarker(place) {
	var placeLoc = place.geometry.location;
  	var marker = new google.maps.Marker({
  		map: carte,
    	position: place.geometry.location
  	});

  	google.maps.event.addListener(marker, 'click', function() {
    	infowindow.setContent(place.name);
    	infowindow.open(carte, this);
  	});
}



