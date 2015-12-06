class ChurchData < ActiveRecord::Base
	belongs_to :church

	def self.get_prop_tree(except: [])
		return @props if except.empty?

		local_props = @props
		except.each do |el|
			local_props.delete(el)
		end

		return local_props
	end

	@props = column_names.map { |c| c.to_sym }
end
