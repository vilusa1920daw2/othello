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
	getCantidad(index) {
		var count = 0;
		for (var i = 0; i < Object.keys(arrayPartida[index].arrayJson).length; i++) {

			if (arrayPartida[index].arrayJson[i].p.color == this.color.toLowerCase().charAt(0)) {
				count++;
			}
		}
		return count;
	}
}

class Partida {
	constructor(codiPartida, jugador1, jugador2, arrayJson) {
		this.codiPartida = codiPartida;
		this.jugador1 = jugador1;
		this.jugador2 = jugador2;
		this.arrayJson = arrayJson;
	}

}

function check(num, j, index) {
	console.log(num);
	var s = true;
	var texte = "";
	var sum = num;
	if (arrayPartida[index].jugador1.turno) {
		while (s) {

			if (typeof arrayPartida[index].arrayJson[j + sum] == 'undefined') {
				texte = "";
				s = false;
			} else if (arrayPartida[index].arrayJson[j + sum].p.color == "n") {
				s = false;
			} else if ((arrayPartida[index].arrayJson[j + sum].p.x == "A" || arrayPartida[index].arrayJson[j + sum].p.x == "H") && num != 8 && num != -8) {
				texte = "";
				s = false;
			} else if (arrayPartida[index].arrayJson[j + sum].p.color == "v") {
				texte = "";
				s = false;
			}

			else if (arrayPartida[index].arrayJson[j + sum].p.color == "b") {
				console.log(texte);
				console.log("hola");
				texte = texte + ',' + sum.toString();
				sum = sum + num;
			}
		}
		//fe
	} else if (arrayPartida[index].jugador2.turno) {
		while (s) {
			if (typeof arrayPartida[index].arrayJson[j + sum] == 'undefined') {
				texte = "";
				s = false;
			} else if (arrayPartida[index].arrayJson[j + sum].p.color == "b") {
				s = false;
			} else if ((arrayPartida[index].arrayJson[j + sum].p.x == "A" || arrayPartida[index].arrayJson[j + sum].p.x == "H") && num != 8 && num != -8) {
				texte = "";
				s = false;
			}

			else if (arrayPartida[index].arrayJson[j + sum].p.color == "v") {
				texte = "";
				s = false;
			}

			else if (arrayPartida[index].arrayJson[j + sum].p.color == "n") {
				texte = texte + ',' + sum.toString();
				sum = sum + num;
			}
		}

	}
	console.log(texte);
	return texte;

}
function colorar(text, j, index) {
	console.log(text);
	if (text != "") {

		var res = text.split(',');
		if (arrayPartida[index].jugador1.turno) {
			for (var i = 1; i < res.length; i++) {
				console.log(res[i]);
				console.log(j + parseInt(res[i]))
				arrayPartida[index].arrayJson[j + parseInt(res[i])].p.color = "n";
				arrayPartida[index].arrayJson[j].p.color = "n";
			}
		} else if (arrayPartida[index].jugador2.turno) {
			for (var i = 1; i < res.length; i++) {
				arrayPartida[index].arrayJson[j + parseInt(res[i])].p.color = "b";
				arrayPartida[index].arrayJson[j].p.color = "b";
			}
		}
		tt = "true";
	}

	return 0;
}


var arrayJson = [];
var strmongo = "";
var codPartida = 0;
var arrayPartida = [];
var jugado1 = new Jugador(null, "blanc", 2, 1, true);
var jugado2 = new Jugador(null, "negre", 2, 1, false);
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
var partida = new Partida(codPartida, jugado1, jugado2, arrayJson);
arrayPartida.push(partida);
function mongodbf(index) {
	var urldb = 'mongodb://localhost:27017/';
	MongoClient.connect(urldb, function (err, dbo) {
		assert.equal(null, err);
		var db = dbo.db("othello");

		var afegirDocument = function (db, err, callback) {

			db.collection('jugadors').insertOne({
				"Nom": arrayPartida[index].jugador1.nombre,
				"Color": arrayPartida[index].jugador1.color,
				"Puntuacio": arrayPartida[index].jugador1.getCantidad(index).toString()
			});
			db.collection('jugadors').insertOne({
				"Nom": arrayPartida[index].jugador2.nombre,
				"Color": arrayPartida[index].jugador2.color,
				"Puntuacio": arrayPartida[index].jugador2.getCantidad(index).toString()
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


	MongoClient.connect(urldb, function (err, dbo) {
		assert.equal(null, err);
		strmongo = "";
		var db = dbo.db("othello");
		var consultarDocument = function (db, err, callback) {
			var cursor = db.collection('jugadors').find({});
			cursor.each(function (err, doc) {
				assert.equal(err, null);
				if (doc != null) {

					strmongo = strmongo + "," + JSON.stringify(doc);
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
			var consulta = url.parse(request.url, true).query;
			var index = consulta['code'];
			mongodbf(index);

			response.write("p");
			response.end();

		}else if(pathname == '/assets/style.css'){
			fs.readFile('./assets/style.css', function (err, sortida) {
				response.writeHead(200, {
					'Content-Type': 'text/css'
				});
				response.write(sortida);
				response.end();
			});

		} else if (pathname == '/data') {
			response.writeHead(200, {
				"Content-Type": "application/json"
			});
			mongodbf2();


			response.write(strmongo.substr(1));

			response.end();

		} else if (pathname == '/user') {
			response.writeHead(200, {
				"Content-Type": "text/html; charset=utf-8"
			});
			if (arrayPartida[codPartida].jugador1.nombre != null && arrayPartida[codPartida].jugador2.nombre != null) {
				var arrayJson = [];
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
				var jugado1 = new Jugador(null, "blanc", 2, 1, true);
				var jugado2 = new Jugador(null, "negre", 2, 1, false);
				codPartida++;
				var partida = new Partida(codPartida, jugado1, jugado2, arrayJson);
				arrayPartida.push(partida);
				console.log(arrayPartida);
			}
			console.log(codPartida);
			response.write(String(codPartida));
			response.end();

		} else if (pathname == '/user2') {
			response.writeHead(200, {
				"Content-Type": "text/html; charset=utf-8"
			});
			var consulta = url.parse(request.url, true).query;
			var name = consulta['nom'];
			var index = consulta['code'];
			if (arrayPartida[index].jugador1.nombre == name) {
				arrayPartida[index].jugador1.setNombre(null);
			} else arrayPartida[index].jugador2.setNombre(null);
			arrayPartida[index].turno = true;
			arrayPartida[index].turno = false;
			arrayPartida[index].arrayJson.splice(0, arrayPartida[index].arrayJson.length);

			for (var b = 1; b < 9; b++) {
				var f;
				for (var a = 0; a < 8; a++) {
					if ((a == 3 && b == 4) || (a == 4 && b == 5)) {

						arrayPartida[index].arrayJson.push({ "p": { "x": String.fromCharCode((a + 65)), "y": String(b), "color": "b" } });

					} else if ((a == 4 && b == 4) || (a == 3 && b == 5)) {

						arrayPartida[index].arrayJson.push({ "p": { "x": String.fromCharCode((a + 65)), "y": String(b), "color": "n" } });

					} else {

						arrayPartida[index].arrayJson.push({ "p": { "x": String.fromCharCode((a + 65)), "y": String(b), "color": "v" } });
					}

				}

			}
			response.write("p");
			response.end();

		}
		else if (pathname == '/tabla') {

			response.writeHead(200, {
				"Content-Type": "text/html; charset=utf-8"
			});
			var consulta = url.parse(request.url, true).query;
			var index = consulta['code'];
			if (arrayPartida[index].jugador1.nombre == null) {

				var name = consulta['nom'];

				arrayPartida[index].jugador1.setNombre(name);
				arrayPartida[index].jugador1.color = "Negre";
			} else if (arrayPartida[index].jugador2.nombre == null) {

				var name2 = consulta['nom'];

				arrayPartida[index].jugador2.setNombre(name2);
				arrayPartida[index].jugador2.color = "Blanc";
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
			var consulta = url.parse(request.url, true).query;

			var index = consulta['code'];
			var str = arrayPartida[index].jugador1.nombre + "," + arrayPartida[index].jugador2.nombre;
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
			var consulta = url.parse(request.url, true).query;

			var index = consulta['code'];
			var str = JSON.stringify(arrayPartida[index].arrayJson);

			response.write(str);

			response.end();

		} else if (pathname == '/movimiento') {
			response.writeHead(200, {
				"Content-Type": "text/html; charset=utf-8"
			});
			var cambio = url.parse(request.url, true).query;
			var id = cambio['id'];
			var index = consulta['code'];
			for (var j = 0; j < Object.keys(arrayPartida[index].arrayJson).length; j++) {
				if (id == (arrayPartida[index].arrayJson[j].p.x) + (arrayPartida[index].arrayJson[j].p.y)) {
					arrayPartida[index].arrayJson[j].p.color = "b";
				}
			}

			response.write(JSON.stringify({ status: "OK" }));
			response.end();


		} else if (pathname == '/turno2') {
			response.writeHead(200, {
				"Content-Type": "text/html; charset=utf-8"
			});
			var cambio2 = url.parse(request.url, true).query;

			var index = cambio2['code'];
			var t;
			if (arrayPartida[index].jugador1.turno) {
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
			var cambio2 = url.parse(request.url, true).query;

			var index = cambio2['code'];
			arrayPartida[index].jugador1.turno = !arrayPartida[index].jugador1.turno;
			arrayPartida[index].jugador2.turno = !arrayPartida[index].jugador2.turno;
			tt = "false";
			response.write("hola");
			response.end();
		}
		else if (pathname == '/cantidad') {
			response.writeHead(200, {
				"Content-Type": "text/html; charset=utf-8"
			});
			var cambio2 = url.parse(request.url, true).query;

			var index = cambio2['code'];
			var str2 = arrayPartida[index].jugador1.getCantidad(index) + "," + arrayPartida[index].jugador2.getCantidad(index);
			response.write(str2);
			response.end();
		} else if (pathname == '/check') {
			response.writeHead(200, {
				"Content-Type": "text/html; charset=utf-8"
			});
			var cambio2 = url.parse(request.url, true).query;
			var id2 = cambio2['id'];
			var nom = cambio2['nom'];
			var index = cambio2['code'];
			var x = id2.charAt(0);
			var y = id2.charAt(1);


			var color;
			var texte = "";
			for (var j = 0; j < Object.keys(arrayPartida[index].arrayJson).length; j++) {
				if (id2 == (arrayPartida[index].arrayJson[j].p.x) + (arrayPartida[index].arrayJson[j].p.y)) {
					color = arrayPartida[index].arrayJson[j].p.color;
					break;
				}
			}
			if (arrayPartida[index].jugador1.turno && arrayPartida[index].jugador1.nombre == nom) {


				if (color == "v") {
					if (x == "A") {
						if (y == "1") {
							for (var f = 0; f < 3; f++) {
								switch (f) {
									case 0:
										if (arrayPartida[index].arrayJson[j + 1].p.color == "b") {
											texte = check(1, j, index);
											colorar(texte, j, index);
											b2 = "true";
										}
										break;
									case 1:
										if (arrayPartida[index].arrayJson[j + 8].p.color == "b") {
											texte = check(8, j, index);
											colorar(texte, j, index);
										}
										break;
									case 2:
										if (arrayPartida[index].arrayJson[j + 9].p.color == "b") {
											texte = check(9, j, index);
											colorar(texte, j, index);
										}
										break;

								}
							}

						}
						else if (y == "8") {
							for (var f = 0; f < 3; f++) {
								switch (f) {
									case 0:
										if (arrayPartida[index].arrayJson[j + 1].p.color == "b") {
											texte = check(1, j, index);
											colorar(texte, j, index);
										}
										break;
									case 1:
										if (arrayPartida[index].arrayJson[j - 8].p.color == "b") {
											texte = check(-8, j, index);
											colorar(texte, j, index);
										}
										break;
									case 2:
										if (arrayPartida[index].arrayJson[j - 7].p.color == "b") {
											texte = check(-7, j, index);
											colorar(texte, j, index);
										}
										break;

								}
							}

						}
						else {
							for (var f = 0; f < 5; f++) {
								switch (f) {
									case 0:
										if (arrayPartida[index].arrayJson[j + 1].p.color == "b") {
											texte = check(1, j, index);
											colorar(texte, j, index);
										}
										break;
									case 1:
										if (arrayPartida[index].arrayJson[j + 8].p.color == "b") {
											texte = check(8, j, index);
											colorar(texte, j, index);
										}
										break;
									case 2:
										if (arrayPartida[index].arrayJson[j + 9].p.color == "b") {
											texte = check(9, j, index);
											colorar(texte, j, index);
										}
										break;
									case 3:
										if (arrayPartida[index].arrayJson[j - 8].p.color == "b") {
											texte = check(-8, j, index);
											colorar(texte, j, index);
										}
										break;
									case 4:
										if (arrayPartida[index].arrayJson[j - 7].p.color == "b") {
											texte = check(-7, j, index);
											colorar(texte, j, index);
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
										if (arrayPartida[index].arrayJson[j - 1].p.color == "b") {
											texte = check(-1, j, index);
											colorar(texte, j, index);
										}
										break;
									case 1:
										if (arrayPartida[index].arrayJson[j + 8].p.color == "b") {
											texte = check(8, j, index);
											colorar(texte, j, index);
										}
										break;
									case 2:
										if (arrayPartida[index].arrayJson[j + 7].p.color == "b") {
											texte = check(7, j, index);
											colorar(texte, j, index);
										}
										break;

								}
							}

						}
						else if (y == "8") {
							for (var f = 0; f < 3; f++) {
								switch (f) {
									case 0:
										if (arrayPartida[index].arrayJson[j - 1].p.color == "b") {
											texte = check(-1, j, index);
											colorar(texte, j, index);
										}
										break;
									case 1:
										if (arrayPartida[index].arrayJson[j - 8].p.color == "b") {
											texte = check(-8, j, index);
											colorar(texte, j, index);
										}
										break;
									case 2:
										if (arrayPartida[index].arrayJson[j - 9].p.color == "b") {
											texte = check(-9, j, index);
											colorar(texte, j, index);
										}
										break;

								}
							}

						}
						else {
							for (var f = 0; f < 5; f++) {
								switch (f) {
									case 0:
										if (arrayPartida[index].arrayJson[j - 1].p.color == "b") {
											texte = check(-1, j, index);
											colorar(texte, j, index);
										}
										break;
									case 1:
										if (arrayPartida[index].arrayJson[j + 8].p.color == "b") {
											texte = check(8, j, index);
											colorar(texte, j, index);
										}
										break;
									case 2:
										if (arrayPartida[index].arrayJson[j - 9].p.color == "b") {
											texte = check(-9, j, index);
											colorar(texte, j, index);
										}
										break;
									case 3:
										if (arrayPartida[index].arrayJson[j - 8].p.color == "b") {
											texte = check(-8, j, index);
											colorar(texte, j, index);
										}
										break;
									case 4:
										if (arrayPartida[index].arrayJson[j + 7].p.color == "b") {
											texte = check(+7, j, index);
											colorar(texte, j, index);
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
										if (arrayPartida[index].arrayJson[j - 1].p.color == "b") {
											texte = check(-1, j, index);
											colorar(texte, j, index);
										}
										break;
									case 1:
										if (arrayPartida[index].arrayJson[j + 1].p.color == "b") {
											texte = check(+1, j, index);
											colorar(texte, j, index);
										}
										break;
									case 2:
										if (arrayPartida[index].arrayJson[j + 9].p.color == "b") {
											texte = check(9, j, index);
											colorar(texte, j, index);
										}
										break;
									case 3:
										if (arrayPartida[index].arrayJson[j + 8].p.color == "b") {
											texte = check(+8, j, index);
											colorar(texte, j, index);
										}
										break;
									case 4:
										if (arrayPartida[index].arrayJson[j + 7].p.color == "b") {
											texte = check(+7, j, index);
											colorar(texte, j, index);
										}
										break;

								}
							}


						}
						else if (y == "8") {
							for (var f = 0; f < 5; f++) {
								switch (f) {
									case 0:
										if (arrayPartida[index].arrayJson[j + 1].p.color == "b") {
											texte = check(1, j, index);
											colorar(texte, j, index);
										}
										break;
									case 1:
										if (arrayPartida[index].arrayJson[j - 1].p.color == "b") {
											texte = check(-1, j, index);
											colorar(texte, j, index);
										}
										break;
									case 2:
										if (arrayPartida[index].arrayJson[j - 9].p.color == "b") {
											texte = check(-9, j, index);
											colorar(texte, j, index);
										}
										break;
									case 3:
										if (arrayPartida[index].arrayJson[j - 8].p.color == "b") {
											texte = check(-8, j, index);
											colorar(texte, j, index);
										}
										break;
									case 4:
										if (arrayPartida[index].arrayJson[j - 7].p.color == "b") {
											texte = check(-7, j, index);
											colorar(texte, j, index);
										}
										break;

								}
							}


						}
						else {
							for (var f = 0; f < 8; f++) {
								switch (f) {
									case 0:
										if (arrayPartida[index].arrayJson[j + 1].p.color == "b") {
											texte = check(1, j, index);
											colorar(texte, j, index);
										}
										break;
									case 1:
										if (arrayPartida[index].arrayJson[j + 8].p.color == "b") {
											texte = check(8, j, index);
											colorar(texte, j, index);
										}
										break;
									case 2:
										if (arrayPartida[index].arrayJson[j + 9].p.color == "b") {
											texte = check(9, j, index);
											colorar(texte, j, index);
										}
										break;
									case 3:
										if (arrayPartida[index].arrayJson[j - 8].p.color == "b") {
											texte = check(-8, j, index);
											colorar(texte, j, index);
										}
										break;
									case 4:
										if (arrayPartida[index].arrayJson[j - 7].p.color == "b") {
											texte = check(-7, j, index);
											colorar(texte, j, index);
										}
										break;
									case 5:
										if (arrayPartida[index].arrayJson[j - 1].p.color == "b") {
											texte = check(-1, j, index);
											colorar(texte, j, index);
										}
										break;
									case 6:
										if (arrayPartida[index].arrayJson[j + 7].p.color == "b") {
											texte = check(7, j, index);
											colorar(texte, j, index);
										}
										break;
									case 7:
										if (arrayPartida[index].arrayJson[j - 9].p.color == "b") {
											texte = check(-9, j, index);
											colorar(texte, j, index);
										}
										break;

								}
							}

						}
					}
				}

			}
			else if (arrayPartida[index].jugador2.turno && arrayPartida[index].jugador2.nombre == nom) {


				if (color == "v") {
					if (x == "A") {
						if (y == "1") {
							for (var f = 0; f < 3; f++) {
								switch (f) {
									case 0:
										if (arrayPartida[index].arrayJson[j + 1].p.color == "n") {
											texte = check(1, j, index);
											colorar(texte, j, index);
										}
										break;
									case 1:
										if (arrayPartida[index].arrayJson[j + 8].p.color == "n") {
											texte = check(8, j, index);
											colorar(texte, j, index);
										}
										break;
									case 2:
										if (arrayPartida[index].arrayJson[j + 9].p.color == "n") {
											texte = check(9, j, index);
											colorar(texte, j, index);
										}
										break;

								}
							}

						}
						else if (y == "8") {
							for (var f = 0; f < 3; f++) {
								switch (f) {
									case 0:
										if (arrayPartida[index].arrayJson[j + 1].p.color == "n") {
											texte = check(1, j, index);
											colorar(texte, j, index);
										}
										break;
									case 1:
										if (arrayPartida[index].arrayJson[j - 8].p.color == "n") {
											texte = check(-8, j, index);
											colorar(texte, j, index);
										}
										break;
									case 2:
										if (arrayPartida[index].arrayJson[j - 7].p.color == "n") {
											texte = check(-7, j, index);
											colorar(texte, j, index);
										}
										break;

								}
							}

						}
						else {
							for (var f = 0; f < 5; f++) {
								switch (f) {
									case 0:
										if (arrayPartida[index].arrayJson[j + 1].p.color == "n") {
											texte = check(1, j, index);
											colorar(texte, j, index);
										}
										break;
									case 1:
										if (arrayPartida[index].arrayJson[j + 8].p.color == "n") {
											texte = check(8, j, index);
											colorar(texte, j, index);
										}
										break;
									case 2:
										if (arrayPartida[index].arrayJson[j + 9].p.color == "n") {
											texte = check(9, j, index);
											colorar(texte, j, index);
										}
										break;
									case 3:
										if (arrayPartida[index].arrayJson[j - 8].p.color == "n") {
											texte = check(-8, j, index);
											colorar(texte, j, index);
										}
										break;
									case 4:
										if (arrayPartida[index].arrayJson[j - 7].p.color == "n") {
											texte = check(-7, j, index);
											colorar(texte, j, index);
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
										if (arrayPartida[index].arrayJson[j - 1].p.color == "n") {
											texte = check(-1, j, index);
											colorar(texte, j, index);
										}
										break;
									case 1:
										if (arrayPartida[index].arrayJson[j + 8].p.color == "n") {
											texte = check(8, j, index);
											colorar(texte, j, index);
										}
										break;
									case 2:
										if (arrayPartida[index].arrayJson[j + 7].p.color == "n") {
											texte = check(7, j, index);
											colorar(texte, j, index);
										}
										break;

								}
							}

						}
						else if (y == "8") {
							for (var f = 0; f < 3; f++) {
								switch (f) {
									case 0:
										if (arrayPartida[index].arrayJson[j - 1].p.color == "n") {
											texte = check(-1, j, index);
											colorar(texte, j, index);
										}
										break;
									case 1:
										if (arrayPartida[index].arrayJson[j - 8].p.color == "n") {
											texte = check(-8, j, index);
											colorar(texte, j, index);
										}
										break;
									case 2:
										if (arrayPartida[index].arrayJson[j - 9].p.color == "n") {
											texte = check(-9, j, index);
											colorar(texte, j, index);
										}
										break;

								}
							}

						}
						else {
							for (var f = 0; f < 5; f++) {
								switch (f) {
									case 0:
										if (arrayPartida[index].arrayJson[j - 1].p.color == "n") {
											texte = check(-1, j, index);
											colorar(texte, j, index);
										}
										break;
									case 1:
										if (arrayPartida[index].arrayJson[j + 8].p.color == "n") {
											texte = check(8, j, index);
											colorar(texte, j, index);
										}
										break;
									case 2:
										if (arrayPartida[index].arrayJson[j - 9].p.color == "n") {
											texte = check(-9, j, index);
											colorar(texte, j, index);
										}
										break;
									case 3:
										if (arrayPartida[index].arrayJson[j - 8].p.color == "n") {
											texte = check(-8, j, index);
											colorar(texte, j, index);
										}
										break;
									case 4:
										if (arrayPartida[index].arrayJson[j + 7].p.color == "n") {
											texte = check(+7, j, index);
											colorar(texte, j, index);
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
										if (arrayPartida[index].arrayJson[j - 1].p.color == "n") {
											texte = check(-1, j, index);
											colorar(texte, j, index);
										}
										break;
									case 1:
										if (arrayPartida[index].arrayJson[j + 1].p.color == "n") {
											texte = check(+1, j, index);
											colorar(texte, j, index);
										}
										break;
									case 2:
										if (arrayPartida[index].arrayJson[j + 9].p.color == "n") {
											texte = check(9, j, index);
											colorar(texte, j, index);
										}
										break;
									case 3:
										if (arrayPartida[index].arrayJson[j + 8].p.color == "n") {
											texte = check(+8, j, index);
											colorar(texte, j, index);
										}
										break;
									case 4:
										if (arrayPartida[index].arrayJson[j + 7].p.color == "n") {
											texte = check(+7, j, index);
											colorar(texte, j, index);
										}
										break;

								}
							}


						}
						else if (y == "8") {
							for (var f = 0; f < 5; f++) {
								switch (f) {
									case 0:
										if (arrayPartida[index].arrayJson[j + 1].p.color == "n") {
											texte = check(1, j, index);
											colorar(texte, j, index);
										}
										break;
									case 1:
										if (arrayPartida[index].arrayJson[j - 1].p.color == "n") {
											texte = check(-1, j, index);
											colorar(texte, j, index);
										}
										break;
									case 2:
										if (arrayPartida[index].arrayJson[j - 9].p.color == "n") {
											texte = check(-9, j, index);
											colorar(texte, j, index);
										}
										break;
									case 3:
										if (arrayPartida[index].arrayJson[j - 8].p.color == "n") {
											texte = check(-8, j, index);
											colorar(texte, j, index);
										}
										break;
									case 4:
										if (arrayPartida[index].arrayJson[j - 7].p.color == "n") {
											texte = check(-7, j, index);
											colorar(texte, j, index);
										}
										break;

								}
							}


						}
						else {
							for (var f = 0; f < 8; f++) {
								switch (f) {
									case 0:
										if (arrayPartida[index].arrayJson[j + 1].p.color == "n") {
											texte = check(1, j, index);
											colorar(texte, j, index);
										}
										break;
									case 1:
										if (arrayPartida[index].arrayJson[j + 8].p.color == "n") {
											texte = check(8, j, index);
											colorar(texte, j, index);
										}
										break;
									case 2:
										if (arrayPartida[index].arrayJson[j + 9].p.color == "n") {
											texte = check(9, j, index);
											colorar(texte, j, index);
										}
										break;
									case 3:
										if (arrayPartida[index].arrayJson[j - 8].p.color == "n") {
											texte = check(-8, j, index);
											colorar(texte, j, index);
										}
										break;
									case 4:
										if (arrayPartida[index].arrayJson[j - 7].p.color == "n") {
											texte = check(-7, j, index);
											colorar(texte, j, index);
										}
										break;
									case 5:
										if (arrayPartida[index].arrayJson[j - 1].p.color == "n") {
											texte = check(-1, j, index);
											colorar(texte, j, index);
										}
										break;
									case 6:
										if (arrayPartida[index].arrayJson[j + 7].p.color == "n") {
											texte = check(7, j, index);
											colorar(texte, j, index);
										}
										break;
									case 7:
										if (arrayPartida[index].arrayJson[j - 9].p.color == "n") {
											texte = check(-9, j, index);
											colorar(texte, j, index);
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
