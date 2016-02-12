class MainController < ApplicationController
  respond_to :html, :json

  def exec_query 
	  @churches = params[:query_type].constantize.execute(params[:church])
	  @params = params.permit(:query_type).tap do |whitelisted|
		  whitelisted[:church] = params[:church]
	  end
	  respond_with @churches do |format|
		  format.html { render 'index' }
		  format.json { render json: @churches }
	  end
  end

  def get_history
	  @history = 
	    Church.joins(:church_data).select("churches.*, church_data.year, #{params[:property1]}, #{params[:property2]}")
			.where(church_data: {year: 2000..params[:year].to_i})
			.where(churches: {id: params[:id]})
			.where.not(church_data: {params[:property1] => nil })
			.where.not(church_data: {params[:property2] => nil })
		    .order('church_data.year asc')
	  respond_with @history do |format|
		  format.json { render json: @history }
	  end
  end

end
