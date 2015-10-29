
module Queries

class MaxMinQuery
	Template = 'Show me the :limit churches with the :order :category in :year.'
	Params = {
			  :limit => ['number_field_tag', 'in:1..100', 'step: 1'],
		      :order => ['select_tag', [['Highest', 'desc'], ['Lowest', 'asc']]],
			  :category => ['select_tag', ChurchData.get_all_properties(except: [:year, :church_id])],
			  :year => ['select_tag', 2000..2014]
		     }

	def self.execute(params)
	    Church.joins(:church_data).select("church.*, #{params[:category]}").
			where(church_data: {year: params[:year]}).
		    order(params[:category] + " " + params[:order]).limit(params[:limit])
	end
end

end





