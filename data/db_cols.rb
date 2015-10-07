
def check_db_column(column_name)

db_handled_cols = ['year', 				# year is read from the filename
			   	   'MISSENGAGE',		# MISPAR in 2008-2012, not tracked before 2009
				   'CFCHILD',			# CSCHILD in 2000-2004, CSCHILD + AOCHILD in 2005-2008
				   'CFYOUTH',			# CSYOUTH in 2000-2004, CSCHILD + AOCHILD in 2005-2008
				   'CFOADLT',			# CSADULTS + CSLEAD in 2000-2004, 
				   						# 		CSADULTS + CSLEAD + AOADULTS + AOLEAD in 2005-2008
				   'ONGOCLASS',			# CHOTH + YOOTH + YOADULT in 2005-2008, not tracked before 2005
				   'OUTSRVD',			# TOTSERV in 2005-2008, not tracked before 2005
				   'VALPROP',			# VALCHUR + VALPARS before 2008
				   'GENADV',			# GASb in 2005-2008, GASWSS before 2004
				   'WSSPEC',			# WSS in 2006-2008, not tracked before 2007
				   'OTHDIRECT', 		# BENOTHER in pre-2008
				   'TOTPAST',			# PASTHOUS + ASSCHOUS in 2005-2008, HOUSUTIL in 2000-2004
				   'TOTREMB',			# PASTREMB + ASSCREMB in 2005-2008, REIMBURS in 2000-2004
				   'TOTCASH',			# OTHCASHA + OTHCASHb in 2005-2008, OTHCASH in 2000-2004
				   'DIACCOMP',			# DEACOMP before 2009
				   'NUMBAPT',			# BAPTCHILD + BAPTADULT after 2012
]

db_ignored_cols = ['BAPTCHILD',			# not tracked before 2012
			       'BAPTADULT',			# not tracked before 2012	
		  		   'PENBILLED',			# not tracked before 2011 
				   'RECCOR',			# not tracked before 2009
				   'REMCOR',			# not tracked before 2009
				   'CFYADLT',			# not tracked before 2009
				   'SHORTCLASS',		# not tracked before 2009
				   'VBSPART',			# not tracked before 2009
				   'CSCLASS', 			# not tracked before 2009
				   'DAYSRVD',			# not tracked before 2009
				   'UMDIRECT',			# not tracked before 2009
				   'HLTHBILLED', 		# not tracked before 2009
				   'CAPFUNd',			# not tracked before 2009
				   'DCNCOMP',			# not tracked before 2009
				   'RENTAL',			# not tracked before 2006
				   'MEMBMR',			# not tracked before 2005
				   'UMVIM',				# not tracked before 2005
				   'UMVIMPAR',			# not tracked before 2005
				   'GENCHROFa',			# not tracked before 2005
				   'GENCHROFb',			# not tracked before 2005
				   'GENCHROFc',			# not tracked before 2005
				   'GENCHROFd',			# not tracked before 2005
				   'GENCHROFe',			# not tracked before 2005
				   'GENCHROFf',			# not tracked before 2005
				   'NUMPLEDG',			# not tracked before 2005
				   'BENOTHAa',			# not tracked before 2005
				   'BENOTHAb',			# not tracked before 2005
				   'BENOTHAc',			# not tracked before 2005
				   'BENOTHAd',			# not tracked before 2005
				   'BENOTHAe',			# not tracked before 2005
				   'BENOTHAf',			# not tracked before 2005
				   'BENOTHAg',			# not tracked before 2005
				   'CAPFUNa',			# not tracked before 2005
				   'CAPFUNb',			# not tracked before 2005
				   'CAPFUNc',			# not tracked before 2005
				   'FUNDSCRa',			# not tracked before 2005
				   'FUNDSCRb',			# not tracked before 2005
				   'FUNDSCRc',			# not tracked before 2005
				   'BENOTHA',			# not tracked before 2002
				   'MEMBFEM',			# not tracked before 2001
				   'MEMBMALE',			# not tracked before 2001

				   'CSATTSHT',			# not tracked after 2008
				   'UMYFMEMB',			# not tracked after 2008
				   'UMYFPROJ',			# not tracked after 2008
				   'UMWTREAS',			# not tracked after 2007
]

	return (db_handled_cols.include? column_name or
			db_ignored_cols.include? column_name)
end
