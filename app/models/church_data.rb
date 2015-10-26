class ChurchData < ActiveRecord::Base
	belongs_to :church

	def self.get_all_properties(except: [])
		if except.empty? then return @props end

		local_props = @props
		except.each do |el|
			local_props.delete(el)
		end

		return local_props
	end

	def MEMBTOT
		self[:MEMBPREV] + self[:RECPROF] + self[:RECREST] + self[:RECCOR] +
			self[:RECOTH] - self[:REMCHR] - self[:REMWITH] - self[:REMCOR] - 
			self[:REMUMC] - self[:REMOTH] - self[:REMDEATH]
	end

	def CFTOTAL
		self[:CFCHILD] + self[:CFYOUTH] + self[:CFYADLT] + self[:CFOADLT]
	end

	def GRANDTOT
	end

	def ANNOPP
		self[:BENOTHAa] + self[:BENOTHAb] + self[:BENOTHAc] + self[:BENOTHAd] +
			self[:BENOTHAe] + self[:BENOTHAf] + self[:BENOTHAg]
	end

	def CAPFUN
		self[:CAPFUNa] + self[:CAPFUNb] + self[:CAPFUNc] + self[:CAPFUNd]
	end

	def FUNDSCR
		self[:FUNDSCRa] + self[:FUNDSCRb] + self[:FUNDSCRc]
	end

	@computed_values = [:MEMBTOT, :CFTOTAL, :GRANDTOT, :ANNOPP, :CAPFUN, :FUNDSCR]
	@props = @computed_values + column_names.map { |c| c.to_sym }
end
