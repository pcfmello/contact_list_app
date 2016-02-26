//LOCAL STORAGE
$(document).ready(function() {

	//FUNÇÕES DO LOCALSTORAGE
	var localStorageFunctions = (function() {
		//NOME DO OBJETO QUE CONTEM OS DADOS NO LOCALSTORAGE
		var _appName = 'contatoAppList';		
		//DESEMPACOTA OS DADOS E RETORNA-OS
		var _getLocalStorage = function() {
			return JSON.parse(localStorage.getItem(_appName));
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

	//FUNÇÕES DA API DE CONTATOS
	var apiContatos = (function() {
		//INSERE OS DADOS NO LOCALSTORAGE
		var _insert = function(email, pageName, url, accessDate) {			
			var localStorageContent = {};
			var obj = { email : email, pageList : [] };	
			obj.pageList.push({ pageName : pageName, url : url, accessDate : accessDate });
			localStorageContent = JSON.stringify(obj);
			return localStorageContent;
		};
		//ALTERA OS DADOS NO LOCALSTORAGE
		var _update = function(localStorageContent, email, pageName, url, accessDate) {
			var obj = { email : email };
			var list = JSON.parse(localStorageContent).pageList;
			var index = -1;
			list.forEach(function(item) {
				if(item.pageName === pageName) {
					index = list.indexOf(item);
				}
			});
			//SE A PÁGINA JÁ EXISTIR, ENTÃO ALTERA. 
			//SENÃO, ADICIONA.
			if(index >= 0) {
				list.splice(index, 1, { pageName : pageName, url : url, accessDate : accessDate });	
			} else {
				list.push({ pageName : pageName, url : url, accessDate : accessDate });
			}
			obj.pageList = list;
			localStorageContent = JSON.stringify(obj);
			return localStorageContent;
		};
		return {
			insert : _insert,
			update : _update
		}
	})();

	var executeApi = function(email) {
		var localStorageContent = localStorageFunctions.getLocalStorage();
		if(!localStorageContent) {
		//SE NÃO HOUVER COOKIE
			localStorageContent = apiContatos.insert(email, $('#pageTitle').html(), $(location).attr('href'), new Date());
		} else {
		//SE HOUVER COOKIE
			if(email) {
				localStorageContent = apiContatos.update(localStorageContent, email, $('#pageTitle').html(), $(location).attr('href'), new Date());	
			} else {
				localStorageContent = apiContatos.update(localStorageContent, JSON.parse(localStorageContent).email, $('#pageTitle').html(), $(location).attr('href'), new Date());	
			}
		}
		localStorageFunctions.setLocalStorage(localStorageContent);
		console.log(localStorageFunctions.getLocalStorage());
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
			        "assunto" : $('#assunto').val(),
			        "paginas" : JSON.parse(localStorageFunctions.getLocalStorage()).pageList
			    }
			},
	        datatype: 'json',
	        success: function (data) {
	            console.log('Enviando dados... ');
				executeApi(data.email);
	        }
	    });
	});	

	executeApi();
	
});