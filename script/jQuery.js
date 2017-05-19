/*Quand on clique sur l'élément ayant la class "ouvrir_f", on change les deux propriétés de class "display" de la valeur none à la valeur block
 pour que les éléments ayant ces classes puissent apparaitre sur la page. On fait en sorte aussi qu'on puisse voir la page web en arrière 
 plan qui est transformée à semi transparante avec la ligne suivante. Avec la troisième ligne, on fait en sorte d'enlever l'effet d'apparition 
 de la fenetre modale */

$(document).ready(function(){
	$('.ouvrir_f').click(function(){
		$('.arriere_Pl, .f_modale').css('display', 'block');
		$('.arriere_Pl, .f_modale').animate({'opacity':'.50'}, 350);
		$('.f_modale').animate({'opacity':'1.00'}, 350);
		var imageUrl = $(this).attr('class');
		
		});
					
	$('#divConteneur img').mouseover(function() {
		$(this).css({
			'cursor':'pointer',
			'border-Color': 'red'
			})
		});

	$('#divConteneur img').mouseout(function() {
		$(this).css({
			'cursor':'default',
			'border-Color': 'default'
			})
		});

	$('#divConteneur img').click(function() {
		var imageUrl = $(this).attr('src');
		$("#imgModale").attr('src',imageUrl);
		});

	$('.fermer').click(function(){
		close_box();
		});
 
	$('.arriere_Pl').click(function(){
		close_box();
		});
 	
 	});
 
function close_box() {
	$('.arriere_Pl, .f_modale').animate({'opacity':'0'}, 300, function(){
	$('.arriere_Pl, .f_modale').css('display', 'none');
	});
}
