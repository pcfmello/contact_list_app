class ContatosController < ApplicationController
  before_action :set_contato, only: [:show, :edit, :update, :destroy]

  skip_before_filter  :verify_authenticity_token

  #POST api/adicionaContato.json
  # def adicionaContato
  #   @contato = Contato.new(JSON.parse(params[:contato]))
  #   #@contato.save
  #   redirect_to :action => show
  # end

  # GET /contatos
  # GET /contatos.json
  def index
    @contatos = Contato.all
  end

  # GET /contatos/1
  # GET /contatos/1.json
  def show
  end

  # GET /contatos/new
  def new
    @contato = Contato.new
  end

  # GET /contatos/1/edit
  def edit
  end

  # POST /contatos
  # POST /contatos.json
  def create
    @contato = Contato.new(JSON.parse(params[:contato]))
    respond_to do |format|
      if @contato.save
        format.html { redirect_to @contato, notice: 'Contato was successfully created.' }
        format.json { render :show, status: :created, location: @contato }
      else
        format.html { render :new }
        format.json { render json: @contato.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /contatos/1
  # PATCH/PUT /contatos/1.json
  def update
    respond_to do |format|
      if @contato.update(JSON.parse(params[:contato]))
        format.html { redirect_to @contato, notice: 'Contato was successfully updated.' }
        format.json { render :show, status: :ok, location: @contato }
      else
        format.html { render :edit }
        format.json { render json: @contato.errors, status: :unprocessable_entity }
      end
    end
  end

  # POST /contato_update.json
  def contato_update
    contato_update = Contato.new(JSON.parse(params[:contato_update]))

    contato = Contato.find_by email: contato_update.email
    contato = {
      nome: contato.nome,
      telefone: contato.telefone,
      email: contato.email,
      paginas_attributes: contato_update.paginas
    };

    # puts @contato.nome
    puts 'printando email'
    # puts contato.email
    puts 'printando paginas'

    contato_update.paginas.each do |item|
      puts item.nome
    end

    respond_to do |format|
       @contato.update(contato)

  #       #format.html { redirect_to @contato, notice: 'Contato was successfully updated.' }
        format.json { render status: :ok, location: contato }
  #   #   else
  #   #     format.html { render :edit }
  #   #     format.json { render json: @contato.errors, status: :unprocessable_entity }
  #   #   end
    end
  end

  # DELETE /contatos/1
  # DELETE /contatos/1.json
  def destroy
    @contato.destroy
    respond_to do |format|
      format.html { redirect_to contatos_url, notice: 'Contato was successfully destroyed.' }
      format.json { head :no_content }
    end
  end  

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_contato
      @contato = Contato.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def contato_params
      params.require(:contato).permit(:nome, :telefone, :email, :assunto, :paginas_attributes => [])
    end

    def contato_update_params
      params.require(:contato_update).permit(:email, :paginas_attributes => [])
    end

end
