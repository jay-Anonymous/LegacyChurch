module WelcomeHelper
	def display(query, name)
		html = '<p>' + query::Template + '</p>'
		query::Params.each do |key, value|
			str = eval "#{value[0]} #{name}, :#{key}, #{value[1..-1].join(',')}"
			html.sub!(':' + key.to_s, str)
		end
		html += hidden_field_tag :query_type, query.to_s
		return html.html_safe
	end
end
