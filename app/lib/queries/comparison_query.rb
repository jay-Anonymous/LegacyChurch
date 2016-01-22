
module Queries

class ComparisonQuery < AbstractQuery
	Template = 'Show me a comparison of :property1 and :property2 for :year.'
	Params = {
			  :property1 => ['selectmenu_tag', ChurchData.get_prop_tree()],
			  :property2 => ['selectmenu_tag', ChurchData.get_prop_tree()],
			  :year => ['select_tag', 2000..2014],
		     }

	def self.execute(params)
	    Church.joins(:church_data).select("churches.*, church_data.year, 
										  #{params[:property1]}, #{params[:property2]}")
			.where(church_data: {year: params[:year]})
			.where.not(church_data: {params[:property1] => nil })
			.where.not(church_data: {params[:property2] => nil })
		    .order('churches.id asc')
	end

end

end





