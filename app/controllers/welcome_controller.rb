class WelcomeController < ApplicationController
  def index
  end

  def show
	  @churches = params[:query_type].constantize.execute(params[:church])
	  @params = params.permit(:query_type).tap do |whitelisted|
		  whitelisted[:church] = params[:church]
	  end
	  render 'index'
  end
end
