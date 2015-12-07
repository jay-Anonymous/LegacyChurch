class Church < ActiveRecord::Base
	has_many :church_data, -> { order(year: :asc) }, class_name: ChurchData 
end
