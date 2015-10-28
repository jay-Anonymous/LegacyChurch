
class MaxMinQuery
	Template = 'Show me the :limit churches with the :order :category in :year.'
	Params = {
			  :limit => ['number_field', 'in:1..100', 'step: 1'],
		      :order => [:select, '[["Highest", "desc"], ["Lowest", "asc"]]'],
			  :category => [:select, 'ChurchData.get_all_properties(except: [:year, :church_id])'],
			  :year => [:select, '2000..2014']
		     }
	def new
	end

	def self.execute(params)
	  Church.joins(:church_data).where(church_data: {year: params[:year]}).order(
		  params[:category] + " " + params[:order]).limit(params[:limit])
	end
end





