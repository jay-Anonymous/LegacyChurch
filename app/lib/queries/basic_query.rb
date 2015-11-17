
module Queries

class BasicQuery
	Template = 'Show me the :category data for :year.'
	Params = {
			  :category => ['select_tag', ChurchData.get_all_properties(except: [:year, :church_id])],
			  :year => ['select_tag', 2000..2014]
		     }

	def self.execute(params)
	    Church.joins(:church_data).select("churches.*, #{params[:category]}")
			.where(church_data: {year: params[:year]})
			.where.not(church_data: {params[:category] => nil })
		    .order(params[:category] + ' asc')
	end
end

end





