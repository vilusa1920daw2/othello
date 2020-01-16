/*
 * Servidor HTTP que rep una cadena i la retorna invertida
 * @author  sergi.grau@fje.edu
 * @version 1.0
 * date 06.12.2015
 * format del document UTF-8
 *
 * CHANGELOG
 * 06.12.2015
 * - Servidor HTTP que rep una cadena i la retorna invertida
 *
 * NOTES
 * ORIGEN
 * Desenvolupament Aplicacions Web. Jesuïtes el Clot
 */
var http = require("http");
var path = require("path");
var url = require("url");
var querystring = require("querystring");
var fs = require('fs');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
const basePath = __dirname;

var assets = path.join(basePath, 'assets');
var tt = "false";



class Jugador {
	constructor(nombre, color, cantidad, codiPartida, turno) {
		this.nombre = nombre;
		this.color = color;
		this.cantidad = cantidad;
		this.codiPartida = codiPartida;
		this.turno = turno;
	}
	setNombre(nombre) {
		this.nombre = nombre;
	}
	getCantidad() {
		var count = 0;
		for (var i = 0; i < Object.keys(arrayJson).length; i++) {

			if (arrayJson[i].p.color == this.color.toLowerCase().charAt(0)) {
				count++;
			}
		}
		return count;
	}
}

class Partida {
	constructor(codiPartida) {
		this.codiPartida = codiPartida;

	}

}

function check(num, j) {
	console.log(num);
	var s = true;
	var texte = "";
	var sum = num;
	if (jugador1.turno) {
		while (s) {

			if (typeof arrayJson[j + sum] == 'undefined') {
				texte = "";
				s = false;
			} else if (arrayJson[j + sum].p.color == "n") {
				s = false;
			} else if ((arrayJson[j + sum].p.x == "A" || arrayJson[j + sum].p.x == "H") && num != 8 && num != -8) {
				texte = "";
				s = false;
			} else if (arrayJson[j + sum].p.color == "v") {
				texte = "";
				s = false;
			}

			else if (arrayJson[j + sum].p.color == "b") {
				console.log(texte);
				console.log("hola");
				texte = texte + ',' + sum.toString();
				sum = sum + num;
			}
		}
		//fe
	} else if (jugador2.turno) {
		while (s) {
			if (typeof arrayJson[j + sum] == 'undefined') {
				texte = "";
				s = false;
			} else if (arrayJson[j + sum].p.color == "b") {
				s = false;
			} else if ((arrayJson[j + sum].p.x == "A" || arrayJson[j + sum].p.x == "H") && num != 8 && num != -8) {
				texte = "";
				s = false;
			}

			else if (arrayJson[j + sum].p.color == "v") {
				texte = "";
				s = false;
			}

			else if (arrayJson[j + sum].p.color == "n") {
				texte = texte + ',' + sum.toString();
				sum = sum + num;
			}
		}

	}
	console.log(texte);
	return texte;

}
function colorar(text, j) {
	console.log(text);
	if (text != "") {

		var res = text.split(',');
		if (jugador1.turno) {
			for (var i = 1; i < res.length; i++) {
				console.log(res[i]);
				console.log(j + parseInt(res[i]))
				arrayJson[j + parseInt(res[i])].p.color = "n";
				arrayJson[j].p.color = "n";
			}
		} else if (jugador2.turno) {
			for (var i = 1; i < res.length; i++) {
				arrayJson[j + parseInt(res[i])].p.color = "b";
				arrayJson[j].p.color = "b";
			}
		}
		tt = "true";
	}

	return 0;
}

var jugador1 = new Jugador(null, "blanc", 2, 1, true);
var jugador2 = new Jugador(null, "negre", 2, 1, false);
var arrayJson = [];
var strmongo ="";
for (var b = 1; b < 9; b++) {
	var f;
	for (var a = 0; a < 8; a++) {
		if ((a == 3 && b == 4) || (a == 4 && b == 5)) {

			arrayJson.push({ "p": { "x": String.fromCharCode((a + 65)), "y": String(b), "color": "b" } });

		} else if ((a == 4 && b == 4) || (a == 3 && b == 5)) {

			arrayJson.push({ "p": { "x": String.fromCharCode((a + 65)), "y": String(b), "color": "n" } });

		} else {

			arrayJson.push({ "p": { "x": String.fromCharCode((a + 65)), "y": String(b), "color": "v" } });
		}

	}

}
function mongodbf() {
	var urldb = 'mongodb://localhost:27017/';
	MongoClient.connect(urldb, function (err, dbo) {
		assert.equal(null, err);
		var db = dbo.db("othello");

		var afegirDocument = function (db, err, callback) {
			console.log("hey");
			db.collection('jugadors').insertOne({
				"Nom": jugador1.nombre,
				"Color": jugador1.color,
				"Puntuacio": jugador1.getCantidad().toString()
			});
			db.collection('jugadors').insertOne({
				"Nom": jugador2.nombre,
				"Color": jugador2.color,
				"Puntuacio": jugador2.getCantidad().toString()
			});
			assert.equal(err, null);
			console.log("Afegit document a col·lecció jugadors");
			callback();

		};
		afegirDocument(db, err, function () {
			dbo.close();
		});



	});
}
function mongodbf2() {
	var urldb = 'mongodb://localhost:27017/';
	console.log("hei");
	
	MongoClient.connect(urldb, function (err, dbo) {
		assert.equal(null, err);
		strmongo="";
		var db = dbo.db("othello");
		var consultarDocument = function (db, err,callback) {
			var cursor = db.collection('jugadors').find({});
			cursor.each(function (err, doc) {
				assert.equal(err, null);
				if (doc != null) {
					
					strmongo=strmongo+","+JSON.stringify(doc);
				} else {
					callback();
				}
			});
		};
		consultarDocument(db, err, function () {
			
			dbo.close();
			
			
		});
		
	});
	
}

function iniciar() {



	function onRequest(request, response) {
		var sortida;
		var pathname = url.parse(request.url).pathname;
		console.log("Petició per a  " + pathname + " rebuda.");

		if (pathname == '/login') {

			response.writeHead(200, {
				"Content-Type": "text/html; charset=utf-8"
			});


			fs.readFile('./login.html', function (err, sortida) {
				response.writeHead(200, {
					'Content-Type': 'text/html'
				});
				response.write(sortida);
				response.end();
			});

		} else if (pathname == '/acabar') {
			response.writeHead(200, {
				"Content-Type": "text/html; charset=utf-8"
			});
			mongodbf();
			response.write("p");
			response.end();

		} else if (pathname == '/data') {
			response.writeHead(200, {
				"Content-Type": "application/json"
			});
			mongodbf2();
			
			console.log(strmongo.substr(1));
			response.write(strmongo.substr(1));

			response.end();

		} else if (pathname == '/user') {
			response.writeHead(200, {
				"Content-Type": "text/html; charset=utf-8"
			});

			response.write("p");
			response.end();

		}
		else if (pathname == '/tabla') {

			response.writeHead(200, {
				"Content-Type": "text/html; charset=utf-8"
			});
			if (jugador1.nombre == null) {
				var consulta = url.parse(request.url, true).query;
				var name = consulta['nom'];
				jugador1.setNombre(name);
				jugador1.color = "Negre";
			} else if (jugador2.nombre == null) {
				var consulta2 = url.parse(request.url, true).query;
				var name2 = consulta2['nom'];
				jugador2.setNombre(name2);
				jugador2.color = "Blanc";
			}

			fs.readFile('./othello.html', function (err, sortida) {
				response.writeHead(200, {
					'Content-Type': 'text/html'
				});
				response.write(sortida);
				response.end();
			});
		} else if (pathname == '/names') {
			response.writeHead(200, {
				"Content-Type": "text/html; charset=utf-8"
			});
			var str = jugador1.nombre + "," + jugador2.nombre;
			response.write(str);

			response.end();
		}
		else if (pathname == '/fichab') {
			fs.readFile('./ficha_blanca.png', function (err, sortida) {
				response.writeHead(200, {
					'Content-Type': 'image/png'
				});
				response.write(sortida);
				response.end();
			});
		}
		else if (pathname == '/fichan') {
			fs.readFile('./ficha_negra.png', function (err, sortida) {
				response.writeHead(200, {
					'Content-Type': 'image/png'
				});
				response.write(sortida);
				response.end();
			});

		}
		else if (pathname == '/array') {
			response.writeHead(200, {
				"Content-Type": "application/json"
			});
			var str = JSON.stringify(arrayJson);
			
			response.write(str);

			response.end();

		} else if (pathname == '/movimiento') {
			response.writeHead(200, {
				"Content-Type": "text/html; charset=utf-8"
			});
			var cambio = url.parse(request.url, true).query;
			var id = cambio['id'];
			for (var j = 0; j < Object.keys(arrayJson).length; j++) {
				if (id == (arrayJson[j].p.x) + (arrayJson[j].p.y)) {
					arrayJson[j].p.color = "b";
				}
			}

			response.write(JSON.stringify({ status: "OK" }));
			response.end();


		} else if (pathname == '/turno2') {
			response.writeHead(200, {
				"Content-Type": "text/html; charset=utf-8"
			});

			var t;
			if (jugador1.turno) {
				t = "negro";
			}
			else t = "blanco";
			response.write(t);
			response.end();
		}
		else if (pathname == '/turno') {
			response.writeHead(200, {
				"Content-Type": "text/html; charset=utf-8"
			});

			jugador1.turno = !jugador1.turno;
			jugador2.turno = !jugador2.turno;
			tt = "false";
			response.write("hola");
			response.end();
		}
		else if (pathname == '/cantidad') {
			response.writeHead(200, {
				"Content-Type": "text/html; charset=utf-8"
			});

			var str2 = jugador1.getCantidad() + "," + jugador2.getCantidad();
			response.write(str2);
			response.end();
		} else if (pathname == '/check') {
			response.writeHead(200, {
				"Content-Type": "text/html; charset=utf-8"
			});
			var cambio2 = url.parse(request.url, true).query;
			var id2 = cambio2['id'];
			var nom = cambio2['nom'];
			var x = id2.charAt(0);
			var y = id2.charAt(1);


			var color;
			var texte = "";
			for (var j = 0; j < Object.keys(arrayJson).length; j++) {
				if (id2 == (arrayJson[j].p.x) + (arrayJson[j].p.y)) {
					color = arrayJson[j].p.color;
					break;
				}
			}
			if (jugador1.turno && jugador1.nombre == nom) {


				if (color == "v") {
					if (x == "A") {
						if (y == "1") {
							for (var f = 0; f < 3; f++) {
								switch (f) {
									case 0:
										if (arrayJson[j + 1].p.color == "b") {
											texte = check(1, j);
											colorar(texte, j);
											b2 = "true";
										}
										break;
									case 1:
										if (arrayJson[j + 8].p.color == "b") {
											texte = check(8, j);
											colorar(texte, j);
										}
										break;
									case 2:
										if (arrayJson[j + 9].p.color == "b") {
											texte = check(9, j);
											colorar(texte, j);
										}
										break;

								}
							}

						}
						else if (y == "8") {
							for (var f = 0; f < 3; f++) {
								switch (f) {
									case 0:
										if (arrayJson[j + 1].p.color == "b") {
											texte = check(1, j);
											colorar(texte, j);
										}
										break;
									case 1:
										if (arrayJson[j - 8].p.color == "b") {
											texte = check(-8, j);
											colorar(texte, j);
										}
										break;
									case 2:
										if (arrayJson[j - 7].p.color == "b") {
											texte = check(-7, j);
											colorar(texte, j);
										}
										break;

								}
							}

						}
						else {
							for (var f = 0; f < 5; f++) {
								switch (f) {
									case 0:
										if (arrayJson[j + 1].p.color == "b") {
											texte = check(1, j);
											colorar(texte, j);
										}
										break;
									case 1:
										if (arrayJson[j + 8].p.color == "b") {
											texte = check(8, j);
											colorar(texte, j);
										}
										break;
									case 2:
										if (arrayJson[j + 9].p.color == "b") {
											texte = check(9, j);
											colorar(texte, j);
										}
										break;
									case 3:
										if (arrayJson[j - 8].p.color == "b") {
											texte = check(-8, j);
											colorar(texte, j);
										}
										break;
									case 4:
										if (arrayJson[j - 7].p.color == "b") {
											texte = check(-7, j);
											colorar(texte, j);
										}
										break;

								}
							}

						}
					}
					else if (x == "H") {
						if (y == "1") {
							for (var f = 0; f < 3; f++) {
								switch (f) {
									case 0:
										if (arrayJson[j - 1].p.color == "b") {
											texte = check(-1, j);
											colorar(texte, j);
										}
										break;
									case 1:
										if (arrayJson[j + 8].p.color == "b") {
											texte = check(8, j);
											colorar(texte, j);
										}
										break;
									case 2:
										if (arrayJson[j + 7].p.color == "b") {
											texte = check(7, j);
											colorar(texte, j);
										}
										break;

								}
							}

						}
						else if (y == "8") {
							for (var f = 0; f < 3; f++) {
								switch (f) {
									case 0:
										if (arrayJson[j - 1].p.color == "b") {
											texte = check(-1, j);
											colorar(texte, j);
										}
										break;
									case 1:
										if (arrayJson[j - 8].p.color == "b") {
											texte = check(-8, j);
											colorar(texte, j);
										}
										break;
									case 2:
										if (arrayJson[j - 9].p.color == "b") {
											texte = check(-9, j);
											colorar(texte, j);
										}
										break;

								}
							}

						}
						else {
							for (var f = 0; f < 5; f++) {
								switch (f) {
									case 0:
										if (arrayJson[j - 1].p.color == "b") {
											texte = check(-1, j);
											colorar(texte, j);
										}
										break;
									case 1:
										if (arrayJson[j + 8].p.color == "b") {
											texte = check(8, j);
											colorar(texte, j);
										}
										break;
									case 2:
										if (arrayJson[j - 9].p.color == "b") {
											texte = check(-9, j);
											colorar(texte, j);
										}
										break;
									case 3:
										if (arrayJson[j - 8].p.color == "b") {
											texte = check(-8, j);
											colorar(texte, j);
										}
										break;
									case 4:
										if (arrayJson[j + 7].p.color == "b") {
											texte = check(+7, j);
											colorar(texte, j);
										}
										break;

								}
							}

						}
					}
					else {
						if (y == "1") {
							for (var f = 0; f < 5; f++) {
								switch (f) {
									case 0:
										if (arrayJson[j - 1].p.color == "b") {
											texte = check(-1, j);
											colorar(texte, j);
										}
										break;
									case 1:
										if (arrayJson[j + 1].p.color == "b") {
											texte = check(+1, j);
											colorar(texte, j);
										}
										break;
									case 2:
										if (arrayJson[j + 9].p.color == "b") {
											texte = check(9, j);
											colorar(texte, j);
										}
										break;
									case 3:
										if (arrayJson[j + 8].p.color == "b") {
											texte = check(+8, j);
											colorar(texte, j);
										}
										break;
									case 4:
										if (arrayJson[j + 7].p.color == "b") {
											texte = check(+7, j);
											colorar(texte, j);
										}
										break;

								}
							}


						}
						else if (y == "8") {
							for (var f = 0; f < 5; f++) {
								switch (f) {
									case 0:
										if (arrayJson[j + 1].p.color == "b") {
											texte = check(1, j);
											colorar(texte, j);
										}
										break;
									case 1:
										if (arrayJson[j - 1].p.color == "b") {
											texte = check(-1, j);
											colorar(texte, j);
										}
										break;
									case 2:
										if (arrayJson[j - 9].p.color == "b") {
											texte = check(-9, j);
											colorar(texte, j);
										}
										break;
									case 3:
										if (arrayJson[j - 8].p.color == "b") {
											texte = check(-8, j);
											colorar(texte, j);
										}
										break;
									case 4:
										if (arrayJson[j - 7].p.color == "b") {
											texte = check(-7, j);
											colorar(texte, j);
										}
										break;

								}
							}


						}
						else {
							for (var f = 0; f < 8; f++) {
								switch (f) {
									case 0:
										if (arrayJson[j + 1].p.color == "b") {
											texte = check(1, j);
											colorar(texte, j);
										}
										break;
									case 1:
										if (arrayJson[j + 8].p.color == "b") {
											texte = check(8, j);
											colorar(texte, j);
										}
										break;
									case 2:
										if (arrayJson[j + 9].p.color == "b") {
											texte = check(9, j);
											colorar(texte, j);
										}
										break;
									case 3:
										if (arrayJson[j - 8].p.color == "b") {
											texte = check(-8, j);
											colorar(texte, j);
										}
										break;
									case 4:
										if (arrayJson[j - 7].p.color == "b") {
											texte = check(-7, j);
											colorar(texte, j);
										}
										break;
									case 5:
										if (arrayJson[j - 1].p.color == "b") {
											texte = check(-1, j);
											colorar(texte, j);
										}
										break;
									case 6:
										if (arrayJson[j + 7].p.color == "b") {
											texte = check(7, j);
											colorar(texte, j);
										}
										break;
									case 7:
										if (arrayJson[j - 9].p.color == "b") {
											texte = check(-9, j);
											colorar(texte, j);
										}
										break;

								}
							}

						}
					}
				}

			}
			else if (jugador2.turno && jugador2.nombre == nom) {


				if (color == "v") {
					if (x == "A") {
						if (y == "1") {
							for (var f = 0; f < 3; f++) {
								switch (f) {
									case 0:
										if (arrayJson[j + 1].p.color == "n") {
											texte = check(1, j);
											colorar(texte, j);
										}
										break;
									case 1:
										if (arrayJson[j + 8].p.color == "n") {
											texte = check(8, j);
											colorar(texte, j);
										}
										break;
									case 2:
										if (arrayJson[j + 9].p.color == "n") {
											texte = check(9, j);
											colorar(texte, j);
										}
										break;

								}
							}

						}
						else if (y == "8") {
							for (var f = 0; f < 3; f++) {
								switch (f) {
									case 0:
										if (arrayJson[j + 1].p.color == "n") {
											texte = check(1, j);
											colorar(texte, j);
										}
										break;
									case 1:
										if (arrayJson[j - 8].p.color == "n") {
											texte = check(-8, j);
											colorar(texte, j);
										}
										break;
									case 2:
										if (arrayJson[j - 7].p.color == "n") {
											texte = check(-7, j);
											colorar(texte, j);
										}
										break;

								}
							}

						}
						else {
							for (var f = 0; f < 5; f++) {
								switch (f) {
									case 0:
										if (arrayJson[j + 1].p.color == "n") {
											texte = check(1, j);
											colorar(texte, j);
										}
										break;
									case 1:
										if (arrayJson[j + 8].p.color == "n") {
											texte = check(8, j);
											colorar(texte, j);
										}
										break;
									case 2:
										if (arrayJson[j + 9].p.color == "n") {
											texte = check(9, j);
											colorar(texte, j);
										}
										break;
									case 3:
										if (arrayJson[j - 8].p.color == "n") {
											texte = check(-8, j);
											colorar(texte, j);
										}
										break;
									case 4:
										if (arrayJson[j - 7].p.color == "n") {
											texte = check(-7, j);
											colorar(texte, j);
										}
										break;

								}
							}

						}
					}
					else if (x == "H") {
						if (y == "1") {
							for (var f = 0; f < 3; f++) {
								switch (f) {
									case 0:
										if (arrayJson[j - 1].p.color == "n") {
											texte = check(-1, j);
											colorar(texte, j);
										}
										break;
									case 1:
										if (arrayJson[j + 8].p.color == "n") {
											texte = check(8, j);
											colorar(texte, j);
										}
										break;
									case 2:
										if (arrayJson[j + 7].p.color == "n") {
											texte = check(7, j);
											colorar(texte, j);
										}
										break;

								}
							}

						}
						else if (y == "8") {
							for (var f = 0; f < 3; f++) {
								switch (f) {
									case 0:
										if (arrayJson[j - 1].p.color == "n") {
											texte = check(-1, j);
											colorar(texte, j);
										}
										break;
									case 1:
										if (arrayJson[j - 8].p.color == "n") {
											texte = check(-8, j);
											colorar(texte, j);
										}
										break;
									case 2:
										if (arrayJson[j - 9].p.color == "n") {
											texte = check(-9, j);
											colorar(texte, j);
										}
										break;

								}
							}

						}
						else {
							for (var f = 0; f < 5; f++) {
								switch (f) {
									case 0:
										if (arrayJson[j - 1].p.color == "n") {
											texte = check(-1, j);
											colorar(texte, j);
										}
										break;
									case 1:
										if (arrayJson[j + 8].p.color == "n") {
											texte = check(8, j);
											colorar(texte, j);
										}
										break;
									case 2:
										if (arrayJson[j - 9].p.color == "n") {
											texte = check(-9, j);
											colorar(texte, j);
										}
										break;
									case 3:
										if (arrayJson[j - 8].p.color == "n") {
											texte = check(-8, j);
											colorar(texte, j);
										}
										break;
									case 4:
										if (arrayJson[j + 7].p.color == "n") {
											texte = check(+7, j);
											colorar(texte, j);
										}
										break;

								}
							}

						}
					}
					else {
						if (y == "1") {
							for (var f = 0; f < 5; f++) {
								switch (f) {
									case 0:
										if (arrayJson[j - 1].p.color == "n") {
											texte = check(-1, j);
											colorar(texte, j);
										}
										break;
									case 1:
										if (arrayJson[j + 1].p.color == "n") {
											texte = check(+1, j);
											colorar(texte, j);
										}
										break;
									case 2:
										if (arrayJson[j + 9].p.color == "n") {
											texte = check(9, j);
											colorar(texte, j);
										}
										break;
									case 3:
										if (arrayJson[j + 8].p.color == "n") {
											texte = check(+8, j);
											colorar(texte, j);
										}
										break;
									case 4:
										if (arrayJson[j + 7].p.color == "n") {
											texte = check(+7, j);
											colorar(texte, j);
										}
										break;

								}
							}


						}
						else if (y == "8") {
							for (var f = 0; f < 5; f++) {
								switch (f) {
									case 0:
										if (arrayJson[j + 1].p.color == "n") {
											texte = check(1, j);
											colorar(texte, j);
										}
										break;
									case 1:
										if (arrayJson[j - 1].p.color == "n") {
											texte = check(-1, j);
											colorar(texte, j);
										}
										break;
									case 2:
										if (arrayJson[j - 9].p.color == "n") {
											texte = check(-9, j);
											colorar(texte, j);
										}
										break;
									case 3:
										if (arrayJson[j - 8].p.color == "n") {
											texte = check(-8, j);
											colorar(texte, j);
										}
										break;
									case 4:
										if (arrayJson[j - 7].p.color == "n") {
											texte = check(-7, j);
											colorar(texte, j);
										}
										break;

								}
							}


						}
						else {
							for (var f = 0; f < 8; f++) {
								switch (f) {
									case 0:
										if (arrayJson[j + 1].p.color == "n") {
											texte = check(1, j);
											colorar(texte, j);
										}
										break;
									case 1:
										if (arrayJson[j + 8].p.color == "n") {
											texte = check(8, j);
											colorar(texte, j);
										}
										break;
									case 2:
										if (arrayJson[j + 9].p.color == "n") {
											texte = check(9, j);
											colorar(texte, j);
										}
										break;
									case 3:
										if (arrayJson[j - 8].p.color == "n") {
											texte = check(-8, j);
											colorar(texte, j);
										}
										break;
									case 4:
										if (arrayJson[j - 7].p.color == "n") {
											texte = check(-7, j);
											colorar(texte, j);
										}
										break;
									case 5:
										if (arrayJson[j - 1].p.color == "n") {
											texte = check(-1, j);
											colorar(texte, j);
										}
										break;
									case 6:
										if (arrayJson[j + 7].p.color == "n") {
											texte = check(7, j);
											colorar(texte, j);
										}
										break;
									case 7:
										if (arrayJson[j - 9].p.color == "n") {
											texte = check(-9, j);
											colorar(texte, j);
										}
										break;

								}
							}

						}
					}
				}

			}

			response.write(tt);
			response.end();


		} else {
			response.writeHead(404, {
				"Content-Type": "text/html; charset=utf-8"
			});
			sortida = "404 NOT FOUND";
			response.write(sortida);
			response.end();
		}

	}


	http.createServer(onRequest).listen(8888);
	console.log("Servidor iniciat.");
}

exports.iniciar = iniciar;
