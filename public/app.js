//LOCAL STORAGE
$(document).ready(function() {

	//FUNÇÕES DO LOCALSTORAGE
	var localStorageFunctions = (function() {

		//NOME DO OBJETO QUE CONTEM OS DADOS NO LOCALSTORAGE
		var _appName = 'contatoAppList';
		
		//DESEMPACOTA OS DADOS E RETORNA-OS
		var _getLocalStorage = function() {
			return localStorage.getItem(_appName);
		};

		//EMPACOTA OS DADOS E ENVIA PARA O LOCALSTORAGE
		var _setLocalStorage = function(dados) {
			localStorage.setItem(_appName, JSON.stringify(dados));
		};

		return {
			getLocalStorage : _getLocalStorage,
			setLocalStorage : _setLocalStorage
		}

	})();

	//INSERE OS DADOS NO LOCALSTORAGE
	var insert = function(email, pageName, url, accessDate) {		
		JSON.parse(contatoAppList.push(JSON.stringify({
			email: email,
			pageName : pageName,
			url : url,
			accessDate : accessDate	
		})));
		return contatoAppList;
	};

	//ALTERA OS DADOS NO LOCALSTORAGE
	var edit = function(index, email, pageName, url, accessDate) {
		item = JSON.stringify({
			email: email,
			pageName : pageName,
			url : url,
			accessDate : accessDate	
		});
		contatoAppList.splice(index, 1, item);
		return contatoAppList;
		
	}

	var executeApi = function(email, pageName, url, accessDate) {

		var index = -1;

		/*contatoAppList = JSON.parse(contatoAppList);*/

		for(var prop in contatoAppList) {
			console.log(JSON.parse(contatoAppList[prop]));
			if(JSON.parse(contatoAppList[prop]).pageName == pageName) {
				index = prop;				
			} 
		}
		console.log(index);
		
		if(index == undefined) {
			contatoAppList = insert(email, pageName, url, accessDate);

		} else {
			contatoAppList = edit(index, email, pageName, url, accessDate);

		}

		localStorageFunctions.setLocalStorage(contatoAppList);
		/*console.log('contatoAppList : ' + JSON.parse(localStorageFunctions.getLocalStorage()));*/
	};
	
	$('#btEnviar').click(function() {
		
		var contato = {
			nome: $('#nome').val(),
			telefone: $('#telefone').val(),
			email: $('#email').val(),
			assunto: $('#assunto').val(),			
		};

		$.ajax({
	        url: "http://localhost:3000/contatos.json",
	        type: "POST",
	        data: {
			    "contato": 
			    {
			        "nome":     $('#nome').val(),
			        "telefone": $('#telefone').val(),
			        "email":    $('#email').val(),
			        "assunto" : $('#assunto').val()
			    }
			},

	        datatype: 'json',
	        success: function (data) {
	            console.log('Enviando dados... ');
				executeApi(data.email, $('#pageTitle').html(), $(location).attr('href'), new Date());
				
	        }
	    });
	});	

	//BUSCA OS DADOS DO USUÁRIO NO LOCALSTORAGE
	var contatoAppList = localStorageFunctions.getLocalStorage();

	if(contatoAppList == null) {
		contatoAppList = [];
	}

	console.log('contatoAppList : ' + contatoAppList);

	executeApi('', $('#pageTitle').html(), $(location).attr('href'), new Date());

	contatoAppList.forEach(function(item) {
		console.log('----------------------------------------');
		console.log('');
		console.log('Email: ' + JSON.parse(item).email);
		for(prop in JSON.parse(item).pages) {
			console.log(prop + ': ' + JSON.parse(item).pages[prop]);			
		}		
	});

	
});