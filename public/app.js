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
<<<<<<< HEAD
	
=======
>>>>>>> eacc954162c3af3157054ba449c3f1114e3b363e
		//ENVIA OS DADOS PARA O SERVIDOR
		var _sendForm = function() {
			console.log('Enviando Dados');
			var contato = {
				nome: $('#nome').val(),
				telefone: $('#telefone').val(),
				email: $('#email').val(),
				assunto: $('#assunto').val(),	
				paginas: JSON.parse(localStorageFunctions.getLocalStorage()).pageList	
			};
			$.ajax({
		        url: "http://localhost:3000/contatos.json",
		        type: "POST",
		        data: {
				    "contato": 
				    {
				        "nome"      : contato.nome,
				        "telefone"  : contato.telefone,
				        "email"     : contato.email,
				        "descricao" : contato.assunto,
				        "paginas"   : contato.paginas  
				    }
				},
		        datatype: 'json',
		        success: function (data) {
					executeApi(data.email);
		        }
		    });
		};
<<<<<<< HEAD
	
=======
>>>>>>> eacc954162c3af3157054ba449c3f1114e3b363e
	    //ATUALIZA AS PÁGINAS ACESSADAS DO CLIENTE JÁ CADASTRADO
	    var _updateForm = function() {
	    	console.log('Atualizando Dados');
			var contato = {
				email: JSON.parse(localStorageFunctions.getLocalStorage()).email,
				paginas: JSON.parse(localStorageFunctions.getLocalStorage()).pageList	
			};
			console.log('atualizando email: ' + contato.email);
			contato.paginas.forEach(function(item) {console.log('atualizando página: ' + item.pageName)});
			$.ajax({
		        url: "http://localhost:3000/paginas.json",
		        type: "POST",
		        data: {
				    "contato": 
				    {
				        "email"     : contato.email,
				        "paginas"   : contato.paginas  
				    }
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
<<<<<<< HEAD
	
=======
>>>>>>> eacc954162c3af3157054ba449c3f1114e3b363e
	//FUNÇÃO QUE EXECUTA A APLICAÇÃO
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

		//ENVIA OS DADOS PARA O SERVIDOR CASO O CLIENTE JÁ TENHA ENTRADO EM CONTATO
		if(JSON.parse(localStorageContent).email) {
			console.log('Tem email: ' + JSON.parse(localStorageContent).email);
			apiContatos.updateForm();
		}
	};
<<<<<<< HEAD

=======
>>>>>>> eacc954162c3af3157054ba449c3f1114e3b363e
	//BOTÃO DE ENVIO DO CADASTRO
	$('#btEnviar').click(function() {
		apiContatos.sendForm();
	});	

	executeApi();
	
});