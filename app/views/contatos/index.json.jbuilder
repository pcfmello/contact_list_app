json.array!(@contatos) do |contato|
  json.extract! contato, :id, :nome, :telefone, :email, :descricao
  json.url contato_url(contato, format: :json)
end
