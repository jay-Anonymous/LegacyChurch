class WelcomeController < ApplicationController
  respond_to :html, :json

  def index
  end

  def show
	  @churches = params[:query_type].constantize.execute(params[:church])
	  @params = params.permit(:query_type).tap do |whitelisted|
		  whitelisted[:church] = params[:church]
	  end
	  respond_with @churches do |format|
		  format.html { render 'index' }
		  format.json { render json: @churches }
	  end
  end

end
