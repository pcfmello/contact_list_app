class Contato < ActiveRecord::Base

	VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i

	validates_presence_of :nome, :email
	validates_format_of :email, with: VALID_EMAIL_REGEX
	validates_uniqueness_of :email

end
