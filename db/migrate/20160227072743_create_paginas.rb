class CreatePaginas < ActiveRecord::Migration
  def change
    create_table :paginas do |t|
      t.string :nome
      t.string :url
      t.datetime :data_acesso
      t.references :contato, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
