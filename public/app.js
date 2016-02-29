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
			var obj = { email : email, paginas_attributes : [] };	
			obj.paginas_attributes.push({ nome : pageName, url : url, data_acesso : accessDate });
			localStorageContent = obj;
			return localStorageContent;
		};
	
		//ALTERA OS DADOS NO LOCALSTORAGE
		var _update = function(localStorageContent, email, pageName, url, accessDate) {
			var obj = localStorageFunctions.getLocalStorage();
			console.log('update email: ' + obj.email);
			var index = -1;
			obj.paginas_attributes.forEach(function(item) {
				if(item.nome === pageName) {
					console.log('dentro do foreach')
					index = obj.paginas_attributes.indexOf(item);
				}
			});
			//SE A PÁGINA JÁ EXISTIR, ENTÃO ALTERA. 
			//SENÃO, ADICIONA.
			if(index >= 0) {
				obj.paginas_attributes.splice(index, 1, { nome : pageName, url : url, data_acesso : accessDate });	
			} else {
				obj.paginas_attributes.push({ nome : pageName, url : url, data_acesso : accessDate });
			}
			
			return obj;
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
		        url: "http://localhost:3000/contatos.json",
		        type: "POST",
		        data: {
				    "contato": JSON.stringify(contato)
				},
		        datatype: 'json',
		        success: function (data) {
		        	var obj = localStorageFunctions.getLocalStorage();
		        	obj.email = data.email;
		        	localStorageFunctions.setLocalStorage(obj);
					executeApi(data.email);
		        }
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
		        success: function (data) {
					executeApi(data.email);
		        }
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
	var executeApi = function(email) {
		var localStorageContent = localStorageFunctions.getLocalStorage();
		if(!localStorageContent) {
		//SE NÃO HOUVER COOKIE
			console.log('nao tem cookie');
			localStorageContent = apiContatos.insert(email, $('#pageTitle').html(), $(location).attr('href'), new Date());
		} else {
		//SE HOUVER COOKIE
			if(email) {
				console.log('tem email update');
				localStorageContent = apiContatos.update(localStorageContent, email, $('#pageTitle').html(), $(location).attr('href'), new Date());					
			} else {
				console.log('nao tem email update');
				localStorageContent = apiContatos.update(localStorageContent, localStorageContent.email, $('#pageTitle').html(), $(location).attr('href'), new Date());	
			}
		}
		localStorageFunctions.setLocalStorage(localStorageContent);

		//ENVIA OS DADOS PARA O SERVIDOR CASO O CLIENTE JÁ TENHA ENTRADO EM CONTATO
		if(localStorageFunctions.getLocalStorage().email) {
			console.log('Tem email: ' + localStorageFunctions.getLocalStorage().email);
			apiContatos.updateForm();
		}
	};

	//BOTÃO DE ENVIO DO CADASTRO
	$('#btEnviar').click(function() {
		apiContatos.sendForm();
	});	

	if(localStorageFunctions.getLocalStorage() && localStorageFunctions.getLocalStorage().hasOwnProperty('email')) {
		console.log('Possui a prop email. Vai atualizar os dados')
		executeApi(localStorageFunctions.getLocalStorage().email);	
	} else {
		console.log('Não possui a prop email. Vai cadastrar os dados')
		executeApi();
	}
	
	
});