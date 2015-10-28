class WelcomeController < ApplicationController
  def index
  end

  def show
	  @churches = params[:query_type].constantize.execute(params[:church])
	  render 'index'
  end
end
