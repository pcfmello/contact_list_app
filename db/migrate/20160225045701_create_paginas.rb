class CreatePaginas < ActiveRecord::Migration
  def change
    create_table :paginas do |t|
      t.string :nome
      t.string :url
      t.date :data_de_acesso

      t.timestamps null: false
    end
  end
end
