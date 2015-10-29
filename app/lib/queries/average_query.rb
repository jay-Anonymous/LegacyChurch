
module Queries
class AverageQuery
	def self.categories_for_select
		ChurchData.get_all_properties(except: [:year, :church_id]).map { |el| [el, "avg(#{el})"] }
	end

	Template = 'Show me the :limit churches with the :order average :category from :year1 to :year2.'
	Params = {
			  :limit => ['number_field_tag', 'in:1..100', 'step: 1'],
		      :order => ['select_tag', [['Highest', 'desc'], ['Lowest', 'asc']]],
			  :category => ['select_tag', categories_for_select],
			  :year1 => ['select_tag', 2000..2014],
			  :year2 => ['select_tag', 2000..2014],
		     }

	def self.execute(params)
	    Church.joins(:church_data).select("churches.*, #{params[:category]}").
			where(church_data: {year: params[:year1]..params[:year2]}).group(:id).
		    order(params[:category] + ' ' + params[:order]).limit(params[:limit])
	end

end

end





