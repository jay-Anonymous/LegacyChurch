
module Queries

class HistogramQuery < AbstractQuery
	Template = 'Show me the :property data for :year.'
	Params = {
			  :property => ['selectmenu_tag', ChurchData.get_prop_tree()],
			  :year => ['select_tag', 2000..2014],
		     }

	def self.execute(params)
	    Church.joins(:church_data).select("churches.*, #{params[:property]}")
			.where(church_data: {year: params[:year]})
			.where.not(church_data: {params[:property] => nil })
		    .order(params[:property] + ' asc')
	end

	def self.control_options
		'{"range": false, "absolute": false}'.html_safe
	end
end

end





