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
		var _insert = function(pageName, url, accessDate) {						
			var obj = { 
				// email : localStorageFunctions.getLocalStorage().email, 
				paginas_attributes : [] 
			};	
			obj.paginas_attributes.push({ nome : pageName, url : url, data_acesso : accessDate });
			localStorageFunctions.setLocalStorage(obj);
			// return obj;			
		};
	
		//ALTERA OS DADOS NO LOCALSTORAGE
		var _update = function(pageName, url, accessDate) {
			var obj = localStorageFunctions.getLocalStorage();
			var index = -1;
			obj.paginas_attributes.forEach(function(item) {
				if(item.nome === pageName) {
					index = obj.paginas_attributes.indexOf(item);
				}
			});
			//SE A PÁGINA JÁ EXISTIR, ENTÃO ALTERA. 
			//SENÃO, ADICIONA.
			if(index >= 0) {
				//obj.paginas_attributes = [];
				obj.paginas_attributes.splice(index, 1, { nome : pageName, url : url, data_acesso : accessDate });	
			} else {
				obj.paginas_attributes.push({ nome : pageName, url : url, data_acesso : accessDate });
			}			
			localStorageFunctions.setLocalStorage(obj);
			// return obj;
		};

		//ENVIA OS DADOS PARA O SERVIDOR
		var _sendForm = function() {
			var contato = {
				nome: $('#nome').val(),
				telefone: $('#telefone').val(),
				email: $('#email').val(),
				assunto: $('#assunto').val(),	
				paginas_attributes: localStorageFunctions.getLocalStorage().paginas_attributes	
			};
			$.ajax({
		        url: 'http://localhost:3000/contatos.json',
		        type: "POST",
		        data: {
				    "contato": JSON.stringify(contato)
				},
		        datatype: 'json',
		        success: function (data) {
		        	var obj = localStorageFunctions.getLocalStorage();
		        	obj.email = data.email;
		        	localStorageFunctions.setLocalStorage(obj);		        	
		        },
		        error: function (request, error) {}
		    });
		};

	    //ATUALIZA AS PÁGINAS ACESSADAS DO CLIENTE JÁ CADASTRADO
	    var _updateForm = function() {
	    	var paginasUpdate = { 
				email: localStorageFunctions.getLocalStorage().email,   		
	    		paginas_attributes: localStorageFunctions.getLocalStorage().paginas_attributes 
	    	}
			$.ajax({
		        url: "http://localhost:3000/contato_update.json",
		        type: "POST",
		        data: {
				    "contato_update": JSON.stringify(paginasUpdate)
				},
		        datatype: 'json',
		        success: function (data) {},
		        error: function (request, error) {}
		    });
	    };		
		return {
			insert     : _insert,
			update     : _update,
			sendForm   : _sendForm,
			updateForm : _updateForm
		}
	})();

	//FUNÇÃO QUE EXECUTA A APLICAÇÃO
	var executeApi = function() {
		var localStorageContent = localStorageFunctions.getLocalStorage();
		if(!localStorageContent) {
		//SE NÃO HOUVER COOKIE
			apiContatos.insert($('#pageTitle').html(), $(location).attr('href'), new Date());
		} else {
		//SE HOUVER COOKIE			
			apiContatos.update($('#pageTitle').html(), $(location).attr('href'), new Date());								
		}
		// localStorageFunctions.setLocalStorage(localStorageContent);

		//ENVIA OS DADOS PARA O SERVIDOR CASO O CLIENTE JÁ TENHA ENTRADO EM CONTATO
		if(localStorageFunctions.getLocalStorage().email) {
			apiContatos.updateForm();
		}
	};

	//BOTÃO DE ENVIO DO CADASTRO
	$('#btEnviar').click(function() {
		apiContatos.sendForm();
	});	

	executeApi();

});