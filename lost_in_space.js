"use strict";
function Game(context) {
	/*
	Création de l'objet principal Game qui se charge de créer le vaisseau joueur, les vaisseaux ennemis et les tirs.
	*/
	this.context = context; //Context du canvas qui permet de dessiner sur le canvas.
	this.joueur = new Ship(250,500,context);
	this.enemies = [];
	this.tirs=[];
	for (var i = 0; i < 300 ; i++) {
		if (i%2 == 0) {
			this.enemies.push(new Enemy((Math.floor(560 * Math.random())),10,-1,4,context));
		}
		else {
			this.enemies.push(new Enemy((Math.floor(560 * Math.random()))-10,10,1,4,context));
		}
	}
}

Game.prototype.loop = function() {
	/*
	Prototype loop de l'objet Game qui sers de boucle principale dans laquelle on efface le canvas puis on applique les déplacements (si nécéssaire)
	des vaisseaux et tirs avant de les redessiner a leur place modifiée.
	On regarde aussi avant de dessiner les ennemis s'il y a collision entre les tirs et les ennemis, les tirs et le vaisseau joueur, les ennemies et le vaisseau joueur.
	*/
  	this.context.fillStyle = 'black';
  	this.context.fillRect(0,0, 600,600); //nettoie le canvas
	this.joueur.update(); //mets à jour les coordonnées du vaisseau joueur
	this.joueur.draw(); //dessine le vaisseau joueur
	
	if (boolSpace) {
		//créé un nouvel objet tir si la touche espace est enfoncée.
		this.tirs.push(new Tir(this.joueur.x,this.joueur.y,7,this.context));
	}
	for (var j = 0; j < this.tirs.length ; j++) {
		//on mets à jour les coordonnées des tirs et les redessine
		this.tirs[j].update();
		this.tirs[j].draw();
	}


	for (var i = 0; i < this.enemies.length ; i++) {
		//Pour chaque ennemi on vérifie :
		if (this.enemies[i].bool == false){
			//si l'ennemi est mort on le passe
			continue;
		}
		//Sinon on regarde s'il est en collision avec le joueur, si oui on appelle GameOver().
		var ix = this.enemies[i].x+32;
		var iy = this.enemies[i].y+32;
		var cx = this.joueur.x+48;
		var cy = this.joueur.y+48;
		if ( Math.abs(cx-ix) <= 10  && Math.abs(cy-iy) <=10 ){
			this.joueur.bool = false;
			this.GameOver();
			break;
		}
		//S'il n'est pas en collision avec le joueur on regarde pour chaque tir, si le tir est en collision avec un ennemi ou avec le joueur.
		//S'il est en collision avec un ennemi on supprime le tir et le joueur, s'il est en collision avec le joueur on appelle GameOver().
		for (var j = 0; j < this.tirs.length ; j++){
			if (this.tirs[j].bool == false){
				continue;
			}
			var bx = this.tirs[j].x+43;
			var by = this.tirs[j].y+46;
			if ( Math.abs(ix-bx) <= 10  && Math.abs(iy-by) <=10 ){
				this.enemies[i].bool = false;
				this.tirs[j].bool = false;
				break;
			}
			if ( Math.abs(cx-bx) <= 10  && Math.abs(cy-by) <=10 ){
				this.joueur.bool = false;
				this.GameOver();
				break;
			}

		}
		if (!this.joueur.bool){
			//Si le joueur est mort on arrête le for.
			break;
		}
		this.enemies[i].update(); //On met à jour les coordonnées des vaisseaux ennemis.
		this.enemies[i].draw(); //On les redessine.
	}


	this.Win(); //On vérifie si tout les ennemis sont morts.

}
Game.prototype.GameOver = function() {
	/*
	Prototype GameOver de l'objet Game qui se déclenche lorsque le joueur à perdu, vide le canvas et affiche GAME OVER.
	*/
	window.clearInterval(timerId); //On arrête le setInterval
  	this.context.fillStyle = 'black';
  	this.context.fillRect(0,0, 600,600);
	this.context.fillStyle = "white";
	this.context.font = "40px Arial";   
	this.context.fillText("Game Over", 200, 300);
	var audio = new Audio('floe.mp3');
	audio.play();  
}

Game.prototype.Win = function() {
	for (var k = 0; k < this.enemies.length ; k++){
		if (this.enemies[k].bool == true){
			//Si un ennemi est vivant on arrête la vérification.
			return 0
		}
	}
	window.clearInterval(timerId); //On arrête le setInterval
  	this.context.fillStyle = 'black';
  	this.context.fillRect(0,0, 600,600);
	this.context.fillStyle = "white";                                        
	this.context.font = "40px Arial";   
	this.context.fillText("VICTORY", 230, 300);
	this.context.drawImage(document.getElementById('boshy'),10,400);
	this.context.fillText("<= you",170, 490);
	this.context.drawImage(document.getElementById('boshyman'),200,10);
	var audio = new Audio('ggwp.mp3');
	audio.play();  
}

function Ship(x,y,context) {
	/*
	Objet Ship correspondant au vaisseau joueur, il utilise des coordonnées x et y, son image, et un booléen.
	*/
	this.image = document.getElementById('dodonpachi');
	this.x = x; //Coordonnée x du vaisseau joueur.
	this.y = y; //Coordonnée y du vaisseau joueur.
	this.context = context; //Context du canvas qui permet de dessiner sur le canvas.
	this.bool = true; //Booléen gérant si le vaisseau joueur est vivant ou mort.
}

Ship.prototype.draw = function() {
	/*
	Prototype draw de l'objet Ship qui affiche le vaisseau si le booléen est vrai, il est faux dans le cas ou le vaisseau joueur est mort.
	*/
	if (this.bool) {
		//Si le vaisseau est en vie, le dessiner.
  		this.context.drawImage(this.image,this.x,this.y);
  	}
}
Ship.prototype.update = function() {
	/*
	Prototype update de l'objet Ship qui gère les déplacements du vaisseau joueur en fonction des booléens des flèches directionnelles.
	Si un booléen est vrai alors on ajuste la coordonnée en x ou y afin qu'au prochain passage de la boucle principale le vaisseau soit
	dessiné à ses nouvelles coordonnées.
	*/
	if (boolRight) {
		//Si la flèche droite est enfoncée , on déplace le vaisseau à droite en augmentant sa coordonnée x.
		if (this.x < 530) {
			this.x+=7;
		}
	}
	if (boolLeft) {
		//Si la flèche gauche est enfoncée , on déplace le vaisseau à gauche en réduisant sa coordonnée x.
		if (this.x > -20) {
			this.x-=7;
		}
	}
	if (boolDown) {
		//Si la flèche bas est enfoncée , on déplace le vaisseau vers le bas en augmentant sa coordonnée y.
		if (this.y < 530) { 
			this.y+=7;
		}
	}
	if (boolUp) {
		//Si la flèche haut est enfoncée , on déplace le vaisseau vers le haut en augmentant sa coordonnée y.
		if (this.y > -10) {
			this.y-=7;
		}
	}
}

function Enemy(x,y,vx,vy,context) {
	/*
	Objet Enemy correspondant aux vaisseaux ennemis, il utilise des coordonnées x et y, des vecteurs vitesses x et y. 
	*/
	this.image = document.getElementById('enemy'); //Image de l'ennemi qui permet de le dessiner.
	this.x = x; //Coordonnée en x de chaque ennemi.
	this.y = y; //Coordonnée en y de chaque ennemi.
	this.vecteurx = vx; //Vecteur vitesse sur l'axe x qui gère l'accélération des ennemis.
	this.vecteury = vy; //Vecteur vitesse sur l'axe y qui gère l'accélération des ennemis.
	this.context = context; //Context du canvas qui permet de dessiner sur le canvas.
	this.bool = true; //Booléen qui gère si chaque vaisseau ennemi est mort ou vivant.
}
Enemy.prototype.draw = function() {
	/*
	Prototype draw de l'objet Enemy qui affiche le vaisseau si le booléen est vrai, il est faux dans le cas ou le vaisseau ennemi est mort.
	*/
	if (this.bool) {
		//Si l'ennemi est en vie on le dessine.
		this.context.drawImage(this.image,this.x,this.y);
	}
}

Enemy.prototype.update = function() {
	/*
	Prototype update de l'objet Enemy qui si le booléen est vrai ( si le vaisseau n'est pas mort ), actualise à chaque passage de la boucle
	les coordonnées en x et y à l'aide du vecteur vitesse.
	On vérifie si le vaisseau n'a pas encore touché un mur, s'il touche un mur à gauche ou à droite de l'écran on inverse sa direction, s'il touche
	un mur en haut ou en bas de l'écran il gagne 10% en vitesse et change de direction.
	*/
	if (this.bool) {
		//Si l'ennemi est en vie :
		if (this.x+this.vecteurx > 600) {
			//S'il s'apprête a dépasser le bord droit de l'écran on inverse sa direction.
			this.vecteurx*=-1;
		}
		if (this.x+this.vecteurx < 0) {
			//S'il s'apprête a dépasser le bord gauche de l'écran on inverse sa direction.
			this.vecteurx*=-1;
		}
		if (this.y+this.vecteury > 560) {
			//S'il s'apprête a dépasser le bord inférieur de l'écran on inverse sa direction et sa vitesse augmente de 10%.
			this.vecteury*=-1.1;
		}
		if (this.y+this.vecteury < 0) {
			//S'il s'apprête a dépasser le bord supérieur de l'écran on inverse sa direction et sa vitesse augmente de 10%.
			this.vecteury*=-1.1;
		}
		this.x+=this.vecteurx; //On applique à x le déplacement de son vecteur vitesse.
		this.y+=this.vecteury; //On applique à y le déplacement de son vecteur vitesse.
	}
}

function Tir(x,y,vy,context) {
	/*
	Objet Tir correspondant aux tirs du vaisseau joueur. Chaque tir utilise une cordonnée x et y et un vecteur y permettant de le faire avancer
	verticalement.
	*/
	this.image = document.getElementById('shot');
	this.x = x+6; //Coordonnée en x du tir.
	this.y = y-58; //Coordonnée en y du tir.
	this.y2 = 0; //Variable qui récupère la distance parcourue pour vérifier si le tir à parcouru 300 pixels.
	this.vecteury = vy; //Vecteur vitesse sur l'axe y qui gère la décélération du tir.
	this.context = context; //Context du canvas qui permet de dessiner sur le canvas.
	this.bool = true; //Booléen qui gère si le tir est "mort ou vivant".
}

Tir.prototype.draw = function() {
	/*
	Prototype draw de l'objet Tir, si le booléen est vrai ( le tir n'a touché aucun vaisseau ennemi / le tir n'a pas encore parcouru la moitiéi du canvas),
	on l'affiche.
	*/
	if (this.bool) {
		//Si le tir est en "vie" on le dessine.
		this.context.drawImage(this.image,this.x,this.y);
	}
}

Tir.prototype.update = function() {
	/*
	Prototype update de l'objet Tir, qui actualise la coordonnée en y et modifie le vecteur vitesse car chaque tir perd 1% de sa vitesse à chaque passage de la boucle principale.
	*/
	if (this.y2 < 300) {
		//Si le tir n'a pas encore parcouru 300 pixels ( sa durée de vie = la moitié du canvas ) on réduit sa vitesse de 1%.
		this.vecteury *= 0.99;
	}
	else {
		//Sinon le tir doit "mourir", son booléen prend donc la valeur false.
		this.bool = false;
	}
	this.y = this.y - this.vecteury; //On applique à y le déplacement du vecteur vitesse.
	this.y2 = this.y2 + this.vecteury; // On ajoute à y2 la distance parcourue.
}	

var boolLeft = false; //Booléen gérant la flèche directionelle gauche.
var boolRight = false; //Booléen gérant la flèche directionelle droite.
var boolUp = false; //Booléen gérant la flèche directionelle haut.
var boolDown = false; //Booléen gérant la flèche directionelle bas.
var boolSpace = false; //Booléen gérant la barre Espace.

var timerId; //Variable timerId utilisée dans GameOver afin d'arrêter le setInterval quand le joueur à perdu.
window.addEventListener('keydown', function (event) {
	/*
	Fonction qui se déclenche lorsqu'une touche du clavier est enfoncée , et si la touche est une des flèches directionelles
	ou la barre Espace, le booléen respectif à la touche enfoncée prend la valeur True afin d'être utilisé pour déplacer le vaisseau ou tirer
	*/
	var e = event.key;
  	if (e == "ArrowRight")  { boolRight = true; } 
  	else if (e == "ArrowLeft") { boolLeft = true; }
  	else if (e == "ArrowDown") { boolDown = true; }
  	else if (e == "ArrowUp") { boolUp = true; }
  	else if (e == " ") { boolSpace = true; }
});
window.addEventListener('keyup', function(event) {
	/*
	Fonction qui se déclenche lorsqu'une touche précedemment enfoncée est lachée , et si la touche est une des flèches directionnelles
	ou la barre Espace, son booléen respectif prend la valeur False ce qui permet d'arrêter le déplacement / arrêter de tirer.
	*/
	var e = event.key;
  	if (e == "ArrowRight")  { boolRight = false; } 
  	else if (e == "ArrowLeft") { boolLeft = false; }
  	else if (e == "ArrowDown") { boolDown = false; }
  	else if (e == "ArrowUp") { boolUp = false; }
  	else if (e == " ") { boolSpace = false; }

});
window.onload = function() {
	var canvas = document.getElementById('game_area');
	var context = canvas.getContext("2d");
	var game = new Game(context); //On crée le nouvel objet Game qui sera l'objet principal.
	timerId = window.setInterval(function() { game.loop() },25);
}
