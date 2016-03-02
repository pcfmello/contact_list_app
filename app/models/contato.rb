class Contato < ActiveRecord::Base
	
	#RELACIONAMENTO COM PAGINAS(1:N)
	has_many :paginas, :inverse_of => :contato

	accepts_nested_attributes_for :paginas

	VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i

	validates_presence_of :email
	validates_format_of :email, with: VALID_EMAIL_REGEX
	validates_uniqueness_of :email

end
