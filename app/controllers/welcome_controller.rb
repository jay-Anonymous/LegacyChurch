class WelcomeController < ApplicationController
  def index
  end

  def show
	  @churches = Church.joins(:church_data).order(
		  params[:church][:property] + " " + params[:church][:order]).limit(params[:church][:number])
	  render 'index'
  end
end
