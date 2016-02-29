class Pagina < ActiveRecord::Base

	include ActiveModel::ForbiddenAttributesProtection

    belongs_to :contato

    accepts_nested_attributes_for :contato

end
