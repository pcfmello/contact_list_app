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
		        url: 'https://polar-crag-62154.herokuapp.com/contatos.json',
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

		//ATUALIZA OU INSERE A PÁGINA ACESSADA PELO CLIENTE NO SERVIDOR
		var _updatePage = function(contatoId) {
			var paginas = localStorageFunctions.getLocalStorage().paginas_attributes
			var pagina = {};
			paginas.forEach(function(item) {
				if(item.nome === $('#pageTitle').html()) {
					item.contato_id = contatoId;					
					pagina = item;
				}
			});
			console.log("Página a atualizar: Nome: ".concat(pagina.nome) + 
				", url: ".concat(pagina.url) + 
				", Data de acesso: ".concat(pagina.data_acesso) + 
				", contato ID: ".concat(pagina.contato_id));

			$.ajax({
		        url: "https://polar-crag-62154.herokuapp.com/pagina_update.json",
		        type: "POST",
		        data: {
				    "pagina": pagina
				},
		        datatype: 'json',
		        success: function (data) {
		        	
		        },
		        error: function (request, error) {}
		    });
		}

	    //BUSCA O ID DO CONTATO ATRAVÉS DO E-MAIL CADASTRADO
	    var _updateForm = function() {
	    	var contato = { 
				email: localStorageFunctions.getLocalStorage().email
	    		//paginas_attributes: localStorageFunctions.getLocalStorage().paginas_attributes 
	    	}
			$.ajax({
		        url: "https://polar-crag-62154.herokuapp.com/get_contato_by_email.json",
		        type: "POST",
		        data: {
				    "contato": contato
				},
		        datatype: 'json',
		        success: function (data) {
		        	_updatePage(data)
		        },
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
			var contatoID = apiContatos.update($('#pageTitle').html(), $(location).attr('href'), new Date());
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