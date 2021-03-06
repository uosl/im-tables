define('formatters/bio/core/chromosome-location', function() {

  let ChrLocFormatter;
  const fetch = (service, id) =>
    service.rows({
      from: 'Location',
      select: ChrLocFormatter.replaces,
      where: {id}})
  ;

  return ChrLocFormatter = (function() {
    ChrLocFormatter = class ChrLocFormatter {
      static initClass() {
  
        this.replaces = ['locatedOn.primaryIdentifier', 'start', 'end'];
      }

      static merge(location, chromosome) {
        if (chromosome.has('primaryIdentifier')) {
          return location.set({chr: chromosome.get('primaryIdentifier')});
        }
      }

      constructor(imobject) {
        const id = imobject.get('id');
        this.$el.addClass('chromosome-location');
        const needs = ['start', 'end', 'chr'];
        if ((imobject.__fetching == null) && !_.all(needs, n => imobject.has(n))) {
          imobject.__fetching = fetch(this.model.get('query').service, id);
          imobject.__fetching.then(function(...args) { let array;
          let chr, start, end; array = args[0], [chr, start, end] = Array.from(array[0]); return imobject.set({chr, start, end}); });
        }
      
        const {start, end, chr} = imobject.toJSON();
        return `${chr}:${start}-${end}`;
      }
    };
    ChrLocFormatter.initClass();
    return ChrLocFormatter;
  })();
});

