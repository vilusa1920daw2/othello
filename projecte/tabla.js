

document.write("<table>");
            for (var b=1; b < 9; b++) {
            document.write("<tr>");
            for(var a=0; a<8; a++) {
                document.write("<td id=",String.fromCharCode((a+65)).concat(String(b)),"></td>");
        }
        document.write("</tr>");
        }
        document.write("</table>");
			var xhr;

			function inici() {
				try {
					// Firefox, Opera 8.0+, Safari, Chrome
					xhr = new XMLHttpRequest();
				} catch (e) {
					// Internet Explorer
					try {
						xhr = new ActiveXObject("Msxml2.XMLHTTP");
						//ie6+
					} catch (e) {
						try {
							xhr = new ActiveXObject("Microsoft.XMLHTTP");
							//ie5
						} catch (e) {
							alert("El teu navegador no suporta AJAX!");
							return false;
						}
					}
				}
				document.getElementById("cadena").onkeyup = function() {
					ajaxFunction(this.value);
				};
			}

			function ajaxFunction(cadena) {

				//callback
				xhr.onreadystatechange = function() {
					if (xhr.readyState == 4) {
						document.getElementById("cadenaInvertida").innerHTML = xhr.responseText;
					}
				};

				xhr.open("GET", "invertir?cadena=" + cadena, true);
				xhr.send(null);
			}


			window.addEventListener("load", inici, true);
		