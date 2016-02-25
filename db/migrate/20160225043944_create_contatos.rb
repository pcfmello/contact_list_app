class CreateContatos < ActiveRecord::Migration
  def change
    create_table :contatos do |t|
      t.string :nome
      t.string :telefone
      t.string :email
      t.text :descricao

      t.index :email, unique: true #CRIA UM ÍNDICE E O DEIXA ÚNICO

      t.timestamps null: false
    end
  end
end
