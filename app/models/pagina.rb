class Pagina < ActiveRecord::Base

    belongs_to :contato, inverse_of: :paginas

    accepts_nested_attributes_for :contato

end
