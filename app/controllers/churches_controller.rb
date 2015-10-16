class ChurchesController < ApplicationController
	def index
		@churches = Church.all.order(:name)
	end

	def show
		@church = Church.find(params[:id])
	end
end
