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
		//LIMPA OS DADOS DO FORMULÁRIO
		var _resetForm = function() {
			$('#nome').val("");
			$('#telefone').val("");
			$('#email').val("");
			$('#assunto').val("");
		}

		//INSERE OS DADOS NO LOCALSTORAGE
		var _insert = function(pageName, url, accessDate) {						
			var obj = { 
				paginas_attributes : [] 
			};	
			obj.paginas_attributes.push({ nome : pageName, url : url, data_acesso : accessDate });
			localStorageFunctions.setLocalStorage(obj);
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
				obj.paginas_attributes.splice(index, 1, { nome : pageName, url : url, data_acesso : accessDate });	
			} else {
				obj.paginas_attributes.push({ nome : pageName, url : url, data_acesso : accessDate });
			}			
			localStorageFunctions.setLocalStorage(obj);
		};

		//ENVIA OS DADOS PARA O SERVIDOR
		var _sendForm = function() {
			var contato = {
				nome: $('#nome').val(),
				telefone: $('#telefone').val(),
				email: $('#email').val(),
				assunto: $('#assunto').val()
			};
			$.ajax({
		        url: window.location.origin.concat('/contatos.json'),
		        type: "POST",
		        data: {
				    "contato": contato
				},
		        datatype: 'json',
		        success: function (data) {
		        	localStorageFunctions.getLocalStorage().paginas_attributes.forEach(function(item) {
		        		item.contato_id = data.id;
		        		$.ajax({
					        url: window.location.origin.concat('/pagina_update.json'),
					        type: "POST",
					        data: {
							    "pagina": item
							},
					        datatype: 'json',
					        success: function (data) {
					        	$('#modal-cadastro-ok').modal('show')
					        	_resetForm();
					        },
					        error: function (request, error) {
					        	$('#modal-cadastro-erro').modal('show')
					        }
					    });
		        	});
		        	var obj = localStorageFunctions.getLocalStorage();
		        	obj.email = data.email;
		        	localStorageFunctions.setLocalStorage(obj);		  
		        }		        
		    });
		};

		//ATUALIZA OU INSERE A PÁGINA ACESSADA PELO CLIENTE NO SERVIDOR
		var _sendPage = function(contatoId) {
			var paginas = localStorageFunctions.getLocalStorage().paginas_attributes
			var pagina = {};
			paginas.forEach(function(item) {
				if(item.nome === $('#pageTitle').html()) {
					item.contato_id = contatoId;					
					pagina = item;
				}
			});
			$.ajax({
		        url: window.location.origin.concat('/pagina_update.json'),
		        type: "POST",
		        data: {
				    "pagina": pagina
				},
		        datatype: 'json',
		        success: function (data) {
		        	
		        }
		    });
		}

	    //BUSCA O ID DO CONTATO ATRAVÉS DO E-MAIL CADASTRADO
	    var _getContatoByEmail = function() {
	    	var contato = { 
				email: localStorageFunctions.getLocalStorage().email
	    	}
			$.ajax({
		        url: window.location.origin.concat('/get_contato_by_email.json'),
		        type: "POST",
		        data: {
				    "contato": contato
				},
		        datatype: 'json',
		        success: function (data) {
		        	_sendPage(data)
		        }
		    });	
	    };		
		return {
			insert            : _insert,
			update            : _update,
			sendForm          : _sendForm,
			getContatoByEmail : _getContatoByEmail
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
		//ENVIA OS DADOS PARA O SERVIDOR CASO O CLIENTE JÁ TENHA ENTRADO EM CONTATO
		if(localStorageFunctions.getLocalStorage().email) {
			apiContatos.getContatoByEmail();
		}
	};

	//BOTÃO DE ENVIO DO CADASTRO
	$('#btEnviar').click(function() {
		apiContatos.sendForm();
	});	

	executeApi();

});