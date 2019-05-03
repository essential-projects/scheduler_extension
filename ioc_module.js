

const SchedulerExtension = require('./dist/commonjs/index').SchedulerExtension;
const extensionDiscoveryTag = require('@essential-projects/bootstrapper_contracts').extensionDiscoveryTag;

function registerInContainer(container) {

  container.register('SchedulerExtension', SchedulerExtension)
    .dependencies('container')
    .configure('scheduler:scheduler_extension')
    .tags(extensionDiscoveryTag)
    .singleton();
}

module.exports.registerInContainer = registerInContainer;
