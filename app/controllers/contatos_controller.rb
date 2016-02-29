class ContatosController < ApplicationController
  before_action :set_contato, only: [:show, :edit, :update, :destroy]

  skip_before_filter  :verify_authenticity_token

  # GET /contatos
  # GET /contatos.json
  def index
    @contatos = Contato.all
  end

  # GET /contatos/1
  # GET /contatos/1.json
  def show
    @paginas = Pagina.where(contato_id: @contato.id)
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
      if @contato.update(params[:contato])
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
    @contato = {
      nome: contato.nome,
      telefone: contato.telefone,
      email: contato.email,
      paginas: contato_update.paginas
    };

    @contato[:paginas].each do |item|
      puts "Pagina => nome: #{item.nome}, data: #{item.data_acesso}" 
    end

    if @contato.update(@contato)
      puts '--------------------------------------'
      puts "ATUALIZOU O CONTATO"
      puts '--------------------------------------'
    else
      puts '--------------------------------------'
      puts "NÃO ATUALIZOU O CONTATO"
      puts '--------------------------------------'

    end
    render :nothing => true, :status => 200, :content_type => 'text/html'
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
      params.require(:contato).permit(:nome, :telefone, :email, :assunto, :paginas => [])
    end

    def contato_update_params
      params.require(:contato_update).permit(:email, :paginas => [])
    end

end
