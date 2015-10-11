
$db_column_rules = {'MISSENGAGE' => [['MISPAR']],
				    'CFCHILD'    => [['CSCHILD', 'AOCHILD']],
				    'CFYOUTH'    => [['CSYOUTH', 'AOYOUTH']],
				    'CFOADLT'    => [['CSADULTS', 'CSLEAD', 'AOADULTS', 'AOLEAD']],
				    'ONGOCLASS'  => [['CHOTH', 'YOOTH', 'YOADULT']],
				    'OUTSRVD'    => [['TOTSERV']],
				    'VALPROP'    => [['VALCHUR', 'VALPARS']],
				    'GENADV'     => [['GASb'], ['GASWSS']],
				    'WSSPEC'     => [['WSS']],
				    'OTHDIRECT'  => [['BENOTHER']],
				    'TOTPAST'    => [['PASTHOUS', 'ASSCHOUS'], ['HOUSUTIL']],
				    'TOTREMB'    => [['PASTREMB', 'ASSCREMB'], ['REIMBURS']],
				    'TOTCASH'    => [['OTHCASHA', 'OTHCASHb'], ['OTHCASH']],
				    'DIACCOMP'   => [['DEACOMP']],
				    'NUMBAPT'    => [['BAPTCHILD', 'BAPTADULT']],

# Don't print warning messages about the following column headers
					'BAPTCHILD'  => [],
			        'BAPTADULT'  => [],
		  		    'PENBILLED'  => [],
				    'RECCOR'     => [],
				    'REMCOR'     => [],
				    'CFYADLT'    => [],
				    'SHORTCLASS' => [],
				    'VBSPART'    => [],			
				    'CSCLASS'    => [], 			
				    'DAYSRVD'    => [],			
				    'UMDIRECT'   => [],			
				    'HLTHBILLED' => [], 		
				    'DCNCOMP'    => [],
				    'RENTAL'     => [],			
				    'MEMBMR'     => [],			
				    'UMVIM'      => [],			
				    'UMVIMPAR'   => [],			
				    'GENCHROFa'  => [],			
				    'GENCHROFb'  => [],			
				    'GENCHROFc'  => [],			
				    'GENCHROFd'  => [],			
				    'GENCHROFe'  => [],			
				    'GENCHROFf'  => [],			
				    'NUMPLEDG'   => [],			
				    'BENOTHAa'   => [],			
				    'BENOTHAb'   => [],			
				    'BENOTHAc'   => [],			
				    'BENOTHAd'   => [],			
				    'BENOTHAe'   => [],			
				    'BENOTHAf'   => [],			
				    'BENOTHAg'   => [],			
				    'CAPFUNa'    => [],			
				    'CAPFUNb'    => [],
				    'CAPFUNc'    => [],
				    'CAPFUNd'    => [],			
				    'FUNDSCRa'   => [],
				    'FUNDSCRb'   => [],
				    'FUNDSCRc'   => [],	
				    'BENOTHA'    => [],		
				    'MEMBFEM'    => [],			
				    'MEMBMALE'   => [],			
 
				    'CSATTSHT'   => [],			
				    'UMYFMEMB'   => [],			
				    'UMYFPROJ'   => [],			
				    'UMWTREAS'   => [],			



					'year'       => [],
					'computed_values' => ['MEMBTOT', 'CFTOTAL', 'GRANDTOT', 'ANNOPP', 'CAPFUN', 'FUNDSCR'],
					'ignored'    => ['church_id', 'name', 'district', 'city', 'state']
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


