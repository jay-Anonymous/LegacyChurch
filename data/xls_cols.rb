
def check_xls_column(column_name)

xls_handled_cols = ['year', 
			   	   'MISPAR',
				   'CSCHILD',
				   'AOCHILD',	
				   'CSYOUTH',
				   'AOYOUTH',
				   'CSADULTS',
				   'AOADULTS',
				   'CSLEAD',	
				   'AOLEAD',
				   'CHOTH',
				   'YOOTH', 
				   'YOADULT',	
				   'TOTSERV',
				   'VALCHUR',
				   'VALPARS',
				   'GASb',	
				   'WSS',
				   'GASWSS',
				   'BENOTHER',
				   'PASTHOUS',
				   'ASSCHOUS',
				   'HOUSUTIL',
				   'PASTREMB',
				   'ASSCREMB',
				   'REIMBURS',
				   'OTHCASHA',
				   'OTHCASHb',
				   'OTHCASH',
				   'DEACOMP',
]

xls_ignored_cols = ['MEMBTOT',			# computed automatically
					'CFTOTAL',			# computed automatically
					'GRANDTOT',			# computed automatically
					'ANNOPP',			# computed automatically
					'CAPFUN',			# computed automatically
					'FUNDSCR',			# computed automatically

					'CSTOTAL',			# now part of CFTOTAL
					'AOTOTAL',			# now part of CFTOTAL
					'CFPTOT',			# now part of CFTOTAL
					'CFGTOT',			# now part of ONGOCLASS

					'CSONGO',			# not enough data
					'PROPART',			# not enough data
					'WEEKMIN',			# not enough data
					'YNGADLTS',			# not enough data
]

	return (xls_handled_cols.include? column_name or
			xls_ignored_cols.include? column_name)
end
