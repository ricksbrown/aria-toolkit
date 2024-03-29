define(function(){
	/**
	 * @param {string} expr The xpath expression
	 * @param {boolean} firstMatch set to true to return a single node only
	 * @param {Element|Document} The XML dom to query
	 * @return {Element|Array} The result of the xpath expression
	 */
	function query(expr, firstMatch, element)
	{
		var next, result, match, nsResolver, i, len, doc;
		if(element)
		{
			if(element.ownerDocument)
			{
				doc = element.ownerDocument;
			}
			else if(element.nodeType === Node.DOCUMENT_NODE)
			{
				doc = element;
			}
			if(doc.evaluate)
			{
				nsResolver = document.createNSResolver(doc.documentElement);
				if(firstMatch)
				{
					result = (doc.evaluate(expr, element, nsResolver, XPathResult.FIRST_ORDERED_NODE_TYPE, null)).singleNodeValue;
				}
				else
				{
					result = [];
					match = doc.evaluate(expr, element, nsResolver, XPathResult.ANY_TYPE, null);
					while((next = match.iterateNext()))
					{
						result[result.length] = next;
					}
				}
			}
			else
			{
				ieNamespaceResolver(doc);
				if(firstMatch)
				{
					result = element.selectSingleNode(expr);
				}
				else
				{
					result = [];
					match = element.selectNodes(expr);
					if(match)
					{
						for(i=0, len=match.length; i<len; i++)
						{
							result[result.length] = match[i];
						}
					}
				}
			}
		}
		return result;
	}

	function ieNamespaceResolver(doc)
	{
		var i, next, namespaces, attributes, namespaceRe;
		if(!doc.getProperty("SelectionNamespaces"))
		{
			namespaces = "";
			attributes = doc.documentElement.attributes;
			namespaceRe = ieNamespaceResolver.nsRe || (ieNamespaceResolver.nsRe = /^xmlns/);
			for(i=attributes.length - 1; i>=0; i--)
			{
				next = attributes[i];
				if(namespaceRe.test(next.name))
				{
					namespaces  += next.name + "='" + next.value + "' ";
				}
			}
			if(namespaces)
			{
				doc.setProperty("SelectionNamespaces", namespaces);
			}
		}
	}

	return query;
});