json.array!(@paginas) do |pagina|
  json.extract! pagina, :id, :nome, :url, :data_acesso, :contato_id
  json.url pagina_url(pagina, format: :json)
end
