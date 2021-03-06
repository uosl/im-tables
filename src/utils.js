// We may still need these...
const modelIsBio = model => !!(model != null ? model.classes['Gene'] : undefined);

const requiresAuthentication = q => _.any(q.constraints, c => ['NOT IN', 'IN'].includes(c.op));

const organisable = path => (path.getEndClass().name === 'Organism') || (path.getType().fields['organism'] != null);

const getOrganisms = (q, cb) => $.when(q).then(function(query) {
  const def = $.Deferred();
  if (cb != null) { def.done(cb); }
  const done = _.compose(def.resolve, uniquelyFlat);

  const mustBe = ((() => {
    const result = [];
    for (let c of Array.from(query.constraints)) {       if ((['=', 'ONE OF', 'LOOKUP'].includes(c.op)) && c.path.match(/(o|O)rganism(\.\w+)?$/)) {
        result.push((c.value || c.values));
      }
    }
    return result;
  })());

  if (mustBe.length) {
    done(mustBe);
  } else {
    const toRun = query.clone();
    const newView = (() => {
      const result1 = [];
      for (let n of Array.from(toRun.getViewNodes())) {
        if (organisable(n)) {
          const opath = n.getEndClass().name === 'Organism' ? n : n.append('organism');
          result1.push(opath.append('shortName'));
        }
      }
      return result1;
    })();

    if (newView.length) {
      toRun.select(_.uniq(newView, String))
            .orderBy([])
            .rows()
            .then(done, () => done([]));
    } else {
      done([]);
    }
  }

  return def.promise();
}) ;
