//LOCAL STORAGE
$(document).ready(function() {

	var contatoAppList = localStorage.getItem('contatoAppList'); //RECUPERA OS DADOS ARMAZENADOS
	contatoAppList = JSON.parse(contatoAppList); //CONVERTE STRING PARA OBJETO

	if(contatoAppList == null) {
		contatoAppList = [];
	}

	//COLETA OS DADOS DA PÁGINA ACESSADA
	var add = function() {
		var email = "";
		var pageTitle = $('#pageTitle').html();
		contatoAppList = contatoAppList.filter(function(item) {
			if(JSON.parse(item).pageTitle != pageTitle) {
				return item;				
			}
		});
		
		contatoAppList.push(JSON.stringify({
			email: email,
			pageTitle : pageTitle,
			url : $(location).attr('href'),
			accessDate : new Date()
		}));

		localStorage.setItem('contatoAppList', JSON.stringify(contatoAppList));
	};

	var send = function() {
		var contato = {
			nome: $('#nome').val(),
			telefone: $('#telefone').val(),
			email: $('#email').val(),
			assunto: $('#assunto').val()
		};

		console.log('Enviando dados... ' + contato);
	}

	add();

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
			for(var prop in data) {
				console.log(data[prop]);
			}
        }
    });

		
	});

	contatoAppList.forEach(function(item){
		console.log(item);		
	});

});