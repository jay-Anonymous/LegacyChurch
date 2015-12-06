
module Queries

class BasicQuery < AbstractQuery
	Template = 'Show me the :property data for :year.'
	Params = {
			  :property => ['selectmenu_tag', [[{descriptor: 'asdf'}, [{descriptor: 'zxcv'}, 
															[{descriptor: 'kjlh', value: '3'}]]], [{descriptor: '1234', value: '4'}]]], #ChurchData.get_all_properties(except: [:year, :church_id])],
			  :year => ['select_tag', 2000..2014],
		     }

	def self.execute(params)
	    Church.joins(:church_data).select("churches.*, #{params[:property]}")
			.where(church_data: {year: params[:year]})
			.where.not(church_data: {params[:property] => nil })
		    .order(params[:property] + ' asc')
	end
end

end





