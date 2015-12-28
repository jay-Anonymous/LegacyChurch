function getNestedData(data) {
    return d3.nest()
        .key(l1sort).sortKeys(function(e1, e2) {
            return +e1 < +e2 ? -1 :
                   +e1 == +e2 ? 0 :
                   1;
        })
        .key(function(el) { return el.id; })
        .sortValues(function(e1, e2) {
            return e1.year < e2.year ? -1 :
                   e1.year == e2.year ? 0 :
                   1;
        })
        .entries(data);
}
