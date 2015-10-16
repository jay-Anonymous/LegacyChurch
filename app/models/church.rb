class Church < ActiveRecord::Base
	has_many :church_data, class_name: ChurchData
end
