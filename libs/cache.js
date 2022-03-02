/**
* Provide app.cache + app.caches{}
* These are really just initalized mappings to @momsfriendlydevco/cache instances
*/
const _ = require('lodash');
const Cache = require('@momsfriendlydevco/cache');

module.exports = ()=>
	Promise.resolve()
		.then(()=> app.caches = {})
		.then(()=> Promise.all(app.config.cache.modules.map(id => {
			app.caches[id] = new Cache({
				...app.config.cache,
				modules: [id],
				init: false,
			});
			return app.caches[id].init();
		})))
		.then(()=> app.cache = app.caches[app.config.cache.modules[0]]) // Point to main cache object
		.then(()=> app.log.as(
			'@doop/cache',
			'Loaded primary cache driver',
			app.log.colors.cyan(app.cache.activeModule.id),
			_.size(app.caches) > 1
				?  app.log.colors.grey('(suplementory: ' + _.keys(app.caches).filter(c => c != app.cache.activeModule.id).join(', ') + ')')
				: '',
		))
