
module Queries

class TimeSeriesQuery < AbstractQuery
	Template = 'Show me the :property data from :year1 to :year2.'
	Params = {
			  :property => ['selectmenu_tag', ChurchData.get_prop_tree()],
			  :year1 => ['select_tag', 2000..2014],
			  :year2 => ['select_tag', 2000..2014],
		     }

	def self.execute(params)
	    Church.joins(:church_data).select("churches.*, church_data.year, #{params[:property]}")
			.where(church_data: {year: params[:year1]..params[:year2]})
			.where.not(church_data: {params[:property] => nil })
		    .order('churches.id asc')
	end

end

end





