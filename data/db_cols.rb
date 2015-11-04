
$db_column_rules = {'MISSENGAGE' => [['MISPAR']],
				    'CFCHILD'    => [['CSCHILD', 'AOCHILD']],
				    'CFYOUTH'    => [['CSYOUTH', 'AOYOUTH']],
				    'CFOADLT'    => [['CSADULTS', 'CSLEAD', 'AOADULTS', 'AOLEAD']],
					'CFTOTAL'    => [['CSTOTAL', 'AOTOTAL']],
				    'ONGOCLASS'  => [['CHOTH', 'YOOTH', 'YOADULT']],
				    'OUTSRVD'    => [['TOTSERV']],
				    'VALPROP'    => [['VALCHUR', 'VALPARS']],
				    'GENADV'     => [['GASb'], ['GASWSS']],
				    'WSSPEC'     => [['WSS']],
				    'OTHDIRECT'  => [['BENOTHER']],
				    'TOTPAST'    => [['PASTHOUS', 'ASSCHOUS'], ['HOUSUTIL']],
				    'TOTREMB'    => [['PASTREMB', 'ASSCREMB'], ['REIMBURS']],
				    'TOTCASH'    => [['OTHCASHA', 'OTHCASHb'], ['OTHCASH']],

					# DCNCOMP counts deacons and DIACCOMP counts diaconal ministers; as of 2014, no
					# more diaconal ministers (as per Adrian's email), so we will just combine them
					# for the entire range
				    'DEACOMP'    => [['DIACCOMP', 'DCNCOMP']],

					# Before 2012, NUMBAPT was the only field: we still track NUMBAPT, but
					# from 2012 on, the database will also break down child/adult
				    'NUMBAPT'    => [['BAPTCHILD', 'BAPTADULT']],

					# Apportionments for 2000-2009, as per Adrian's email
					'TOTAPP'     => [['WSA', 'CBA', 'MEFA', 'BCFA', 'AUFA', 'JKMA', 'ICFA', 'ADMGENA', 'ADMJURA', 'AMDCONFA', 'Hins', 'DSFUNDA', 'EPISFUNA'],
					  				 ['WSA', 'CBA', 'MEFA', 'BCFA', 'AUFA', 'ICFA', 'ADMGENA', 'ADMJURA', 'ADMCONFA', 'ADMDISTA', 'ADMOPENA', 'PENTREAA', 'DSFUNDA', 'EPISFUNA', 'EQUCOMPA', 'CLGYOPA']],
					'APPPAID'    => [['WS', 'CB', 'MF', 'BCF', 'AUF', 'JKMAP', 'ICF', 'ADMGEN', 'ADMJUR', 'ADMCONF', 'HINSP', 'DSFUND', 'EPISFUND'],
					  			     ['WS', 'CB', 'MEF', 'BC', 'AUF', 'ICF', 'ADMGEN', 'ADMJURIS', 'ADMCONF', 'ADMDIST', 'ADMOPEN', 'PenTreas', 'DSFUND', 'EPISFUND', 'EQUCOMP', 'CLGYOPEN']],
					'ACSPSUN'	 => [['ACSPSUNa', 'ACSPSUNb', 'ACSPSUNc', 'ACSPSUNd']], 
					'GENCHROF'   => [['GENCHROFa', 'GENCHROFb', 'GENCHROFc', 'GENCHROFd', 'GENCHROFe', 'GENCHROFf']], 
 
# Don't print warning messages about the following column headers
					
					'BAPTCHILD'  => [],			# not tracked before 2012
			        'BAPTADULT'  => [],			# not tracked before 2012

				    'RECCOR'     => [],			# not tracked before 2009
				    'REMCOR'     => [],			# not tracked before 2009
				    'CFYADLT'    => [],			# before 2009, combined with CSADULT/AOADULT
				    'SHORTCLASS' => [],			# not tracked before 2009
				    'VBSPART'    => [],			# not tracked before 2009
				    'CSCLASS'    => [], 		# not tracked before 2009
				    'DAYSRVD'    => [],			# not tracked before 2009
				    'UMDIRECT'   => [],			# not tracked before 2009
				    'RENTAL'     => [],			# not tracked before 2006
				    'MEMBMR'     => [],			# not tracked before 2005
				    'UMVIM'      => [],			# not tracked before 2005
				    'UMVIMPAR'   => [],			# not tracked before 2005
				    'NUMPLEDG'   => [],			# not tracked before 2005
				    'BENOTHAa'   => [],			# not tracked before 2005
				    'BENOTHAb'   => [],			# not tracked before 2005
				    'BENOTHAc'   => [],			# not tracked before 2005
				    'BENOTHAd'   => [],			# not tracked before 2005
				    'BENOTHAe'   => [],			# not tracked before 2005
				    'BENOTHAf'   => [],			# not tracked before 2005
				    'BENOTHAg'   => [],			# not tracked before 2005
					'CAPFUNa'    => [],			# not tracked before 2005
				    'CAPFUNb'    => [],			# not tracked before 2005
				    'CAPFUNc'    => [],			# not tracked before 2005
				    'CAPFUNd'    => [],			# not tracked before 2009
				    'FUNDSCRa'   => [],			# not tracked before 2005
				    'FUNDSCRb'   => [],			# not tracked before 2005
				    'FUNDSCRc'   => [],			# not tracked before 2005
				    'BENOTHA'    => [],			# not tracked before 2002
				    'MEMBFEM'    => [],			# not tracked before 2001
				    'MEMBMALE'   => [],			# not tracked before 2001

				    'CSATTSHT'   => [],			# not tracked after 2008
				    'UMYFMEMB'   => [],			# not tracked after 2008
				    'UMYFPROJ'   => [],			# not tracked after 2008
				    'UMWTREAS'   => [],			# not tracked after 2007

					# PENBILLED/HEALTHBILLED represent a change in practice over the years, as
					# per Adrian's email.  For now we will ignore them until we get the broken-down
					# data from other sources.
		  		    'PENBILLED'  => [],
				    'HLTHBILLED' => [], 		

					# Not relevant, as per Adrian's email
					'DISTAPPOR'  => [],
					'DISTPAID'   => [],

					'year'       => [],
					'ignored'    => ['church_id', 'name', 'district', 'city', 'state'],
					'no_data'    => ['CVNTMEM', 'MISTEAMS', 'DAYCARE', 'OUTRCH'],
					'handled'    => ['CFPTOT', 'CSONGO', 'CFGTOT'],
}

def check_xls_cols(xls_cols, db_cols)
	xls_cols.keys.each do |key|
		unless db_cols.include? key or $db_column_rules.values.flatten.include? key
			print "Spreadsheet column #{key} is not present in database -- values will be ignored.\n"
		end
	end
end

def check_db_cols(xls_cols, db_cols)
	db_cols.each do |col|
		unless xls_cols.keys.include? col or $db_column_rules.keys.include? col
			print "Database column #{col} is not present in spreadsheet -- values will be NULL.\n"
		end
	end
end

def sumnil(*summands)
	summation = nil
	summands.each do |summand|
		next unless summand

		if summation.nil? then summation = summand
		else summation += summand
		end
	end
	return summation
end

def cell_to_int(row, label, xls_cols)
	return row[xls_cols[label]].to_i unless row[xls_cols[label]].nil?
end

def get_column_value(row, column_name, xls_cols)

	value = nil
	if xls_cols.include? column_name
		value = cell_to_int(row, column_name, xls_cols)
	elsif $db_column_rules[column_name]
		$db_column_rules[column_name].each do |match|
			altval = nil
			match.each do |col|
				if xls_cols.include? col then
					altval = sumnil(altval, cell_to_int(row, col, xls_cols))
				end
			end
			if altval then
				value = altval
				break
			end
		end
	end
	return value
end


